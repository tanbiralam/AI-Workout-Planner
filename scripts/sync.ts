// @ts-check
import { adminClient } from "../src/lib/sanity/client";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_EXERCISE_DB_API_URL ??
  "https://exercise-db-rust.vercel.app/api/v1/exercises";
const PAGE_SIZE = Number.parseInt(
  process.env.EXERCISE_DB_PAGE_SIZE ?? "100",
  10
);
const DEFAULT_DESCRIPTION_FALLBACK =
  "Automatically imported from Exercise DB. Review and update this description for a richer in-app experience.";

/**
 * @typedef {Object} ExerciseApiRecord
 * @property {string} exerciseId
 * @property {string} name
 * @property {string=} gifUrl
 * @property {string[]=} targetMuscles
 * @property {string[]=} bodyParts
 * @property {string[]=} equipments
 * @property {string[]=} secondaryMuscles
 * @property {string[]=} instructions
 */

/**
 * @typedef {Object} ExerciseApiResponse
 * @property {boolean} success
 * @property {{
 *   totalPages: number
 *   totalExercises: number
 *   currentPage: number
 *   previousPage: string | null
 *   nextPage: string | null
 * }} metadata
 * @property {ExerciseApiRecord[]} data
 */

/**
 * @typedef {Object} ExistingExerciseDoc
 * @property {string} _id
 * @property {string=} externalId
 * @property {boolean=} manualOverride
 * @property {string=} name
 */

const ensureEnv = () => {
  if (!process.env.EXPO_PUBLIC_SANITY_API_TOKEN) {
    throw new Error(
      "Missing EXPO_PUBLIC_SANITY_API_TOKEN. Please set it before running the sync script."
    );
  }
};

/**
 * @param {number} offset
 * @param {number} limit
 * @returns {Promise<ExerciseApiRecord[]>}
 */
const fetchExercisesPage = async (offset, limit) => {
  const url = new URL(API_BASE_URL);
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("limit", String(limit));

  console.log(`Fetching Exercise DB page: offset=${offset} limit=${limit}`);
  const response = await fetch(url.toString());
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to fetch Exercise DB page (status ${response.status}): ${body}`
    );
  }

  /** @type {ExerciseApiResponse} */
  const payload = await response.json();
  console.log(
    `Fetched offset=${offset}, success=${payload.success}, exercises=${
      payload.data?.length ?? 0
    }`
  );

  if (!payload.success) {
    throw new Error(
      `Exercise DB API responded without success flag for offset ${offset}`
    );
  }

  if (payload.data?.length) {
    console.log("Sample API record:", payload.data[0]);
  }

  return payload.data ?? [];
};

/**
 * @returns {Promise<Map<string, ExistingExerciseDoc>>}
 */
const loadExistingExerciseMap = async () => {
  console.log("Loading existing auto-synced exercises from Sanity...");
  /** @type {ExistingExerciseDoc[]} */
  const existing = await adminClient.fetch(
    `*[_type == "exercise" && (_id match "exercise-*" || defined(externalId))]{_id, externalId, manualOverride, name}`
  );

  console.log(`Found ${existing?.length ?? 0} existing documents`);
  return new Map(
    (existing ?? [])
      .map((doc) => {
        const key = doc.externalId ?? doc._id.replace(/^exercise-/, "");
        return key ? [key, doc] : undefined;
      })
      .filter((entry) => Boolean(entry))
  );
};

const toTitleCase = (value) =>
  value
    ? value
        .toLowerCase()
        .split(/([\s-/]+)/)
        .map((segment) =>
          segment.trim() && /[A-Za-z]/.test(segment)
            ? segment.charAt(0).toUpperCase() + segment.slice(1)
            : segment
        )
        .join("")
        .trim()
    : value;

const formatStringArray = (values) =>
  (values ?? [])
    .map((entry) => toTitleCase(entry?.trim()))
    .filter((entry) => Boolean(entry));

/**
 * @param {ExerciseApiRecord} record
 */
const buildSyncPayload = (record) => {
  const descriptionFromInstructions =
    record.instructions && record.instructions.length > 0
      ? record.instructions.join("\n")
      : undefined;

  const gifOrImageUrl = record.gifUrl ?? record.imageUrl ?? null;
  const formattedName = toTitleCase(record.name?.trim());

  const payload = {
    externalId: record.exerciseId,
    name: formattedName,
    description: descriptionFromInstructions ?? DEFAULT_DESCRIPTION_FALLBACK,
    gifUrl: gifOrImageUrl,
    sourceImageUrl: record.imageUrl ?? null,
    bodyParts: formatStringArray(record.bodyParts),
    targetMuscles: formatStringArray(record.targetMuscles),
    equipments: formatStringArray(record.equipments),
    secondaryMuscles: formatStringArray(record.secondaryMuscles),
    instructions: record.instructions ?? [],
    autoSynced: true,
    manualOverride: false,
    isActive: true,
    lastSyncedAt: new Date().toISOString(),
  };

  console.log(
    `Prepared payload for ${record.exerciseId}: gifUrl=${payload.gifUrl} instructions=${payload.instructions.length}`
  );
  return payload;
};

const syncExercises = async () => {
  ensureEnv();
  const existingMap = await loadExistingExerciseMap();
  const summary = {
    created: 0,
    updated: 0,
    skipped: 0,
  };

  let offset = 0;
  while (true) {
    const records = await fetchExercisesPage(offset, PAGE_SIZE);
    if (!records.length) {
      break;
    }

    for (const record of records) {
      const existing = existingMap.get(record.exerciseId);
      const payload = buildSyncPayload(record);

      if (existing) {
        if (existing.manualOverride) {
          summary.skipped += 1;
          console.log(
            `Skipping ${record.exerciseId} (${existing._id}) — manualOverride=true`
          );
          continue;
        }

        console.log(
          `Updating existing exercise ${existing._id} (gifUrl=${payload.gifUrl})`
        );
        await adminClient
          .patch(existing._id)
          .set(payload)
          .commit({ autoGenerateArrayKeys: true });
        summary.updated += 1;
      } else {
        const _id = `exercise-${record.exerciseId}`;
        console.log(`Creating exercise ${_id} (gifUrl=${payload.gifUrl})`);
        await adminClient.createOrReplace({
          _type: "exercise",
          _id,
          ...payload,
        });
        summary.created += 1;
      }
    }

    offset += records.length;
  }

  console.log(
    `Exercise DB sync complete. Created ${summary.created}, updated ${summary.updated}, skipped ${summary.skipped}.`
  );
};

syncExercises().catch((error) => {
  console.error("Exercise DB sync failed:", error);
  process.exitCode = 1;
});
