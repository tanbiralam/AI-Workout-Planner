# FitTracker — Product Requirements Document (As-Built)

> This PRD is reverse-engineered directly from the current codebase (branch `main`, commit `17f2207`). It documents what is actually implemented today — not aspirational features. Every feature below is cited with its file path(s) so it can be verified in the code. A "Known Gaps / Non-Functional UI" section at the end lists things that render but don't work.

## 1. Overview

FitTracker is a cross-platform (iOS/Android/Web) workout tracking app built on a single Expo codebase.

- **Framework:** Expo SDK 54, React Native 0.83, React 19, TypeScript
- **Routing:** Expo Router (file-based, tab + stack navigation)
- **Styling:** NativeWind (Tailwind for RN), dark theme throughout
- **State:** Zustand with partial AsyncStorage persistence
- **Auth:** Clerk (email/password + Google OAuth)
- **Backend/CMS:** Sanity (GROQ queries, TypeGen-generated types)
- **Path alias:** `@/*` → `./src/*`

Two Sanity document types back the entire app: `exercise` and `workout`. There is no other backend/database.

## 2. Auth

**Files:** `src/app/_layout.tsx`, `src/app/(app)/_layout.tsx`, `src/app/(app)/sign-in.tsx`, `src/app/(app)/sign-up.tsx`, `src/app/components/GoogleSignIn.tsx`

- Root layout wraps the app in Clerk's `ClerkProvider` with token-cache-backed session persistence.
- `(app)/_layout.tsx` gates the whole app on `useAuth().isSignedIn` via Expo Router's `Stack.Protected`:
  - Signed in → tab navigator + exercise detail screen
  - Signed out → sign-in / sign-up screens
- Shows a branded splash (see §9) while Clerk loads, plus a fixed 2s post-load delay splash.
- **Sign in:** email + password via `useSignIn()`; Google OAuth button; "Forgot?" link present but **not wired to any handler**.
- **Sign up:** two-step — (1) email/password → `signUp.create()` + email code sent, (2) 6-digit code verification with resend support. Google OAuth button also present here.
- **Google Sign-In:** Clerk `useSSO()` with `startSSOFlow({strategy: "oauth_google"})`; includes Android browser warm-up handling.
- **Sign out:** confirmation alert → `useAuth().signOut()`, available from Profile.
- No password-reset flow is implemented.
- No explicit middleware — gating is entirely declarative via `Stack.Protected` guards.

## 3. Navigation / Tab Structure

**File:** `src/app/(app)/(tabs)/_layout.tsx`

5 tabs (all headers hidden, dark tab bar):

| Tab | Icon | Notes |
|---|---|---|
| Home | house | dashboard |
| Exercises | barbell | library |
| Workout | + (floating, no label) | entry to active workout |
| History | clock | past sessions |
| Profile | user avatar (Clerk image) | blue ring when focused |

Each tab folder has its own nested `Stack` layout enabling list → detail navigation within a tab.

## 4. Home / Dashboard

**File:** `src/app/(app)/(tabs)/index.tsx`

- Fetches all of the current user's workouts (`useWorkouts(userId)`), computes aggregate stats client-side: total workouts, total duration, average duration.
- "Your Progress" summary card; "Start Workout" CTA → `/workout`; Quick Actions → History / Exercises.
- "Recent Activity" card showing the most recent workout, tap-through to its record detail.
- Empty state when the user has zero workouts.
- Pull-to-refresh.

## 5. Exercise Library

**Files:** `src/app/(app)/(tabs)/exercises/index.tsx`, `exercises/exercise-detail.tsx`

- Lists all `exercise` documents from Sanity (public/read client) — name, difficulty, muscle group, body parts, target muscles, equipment, thumbnail (GIF or static image).
- **Client-side-only** search filter by exercise name. No server-side filter by body part/equipment/difficulty is implemented despite this being advertised in the README.
- Detail screen: hero image (GIF → source image → Sanity asset, in that priority order), difficulty badge, description, "Movement Focus" card (primary/secondary muscles, equipment), step-by-step instructions parsed out of raw instruction strings.
- Content is entirely populated by the sync script (§11) plus manual edits in Sanity Studio — there is no in-app way to create or edit an exercise.

## 6. Active Workout

**Files:** `src/app/(app)/(tabs)/workout/index.tsx`, `workout/active-workout.tsx`, `store/workout-store.ts`, components `WorkoutHeader`, `TimerDisplay`, `ExerciseCard`, `SetRow`, `ExerciseSelectionModal`

This is the core logging flow:

- **Start:** static hero screen → "Start Workout" → active-workout screen.
- **Timer:** live stopwatch (`react-timer-hook`'s `useStopwatch`), auto-starts, resets only when starting a genuinely new (empty) workout.
- **Add exercise:** full-screen modal listing the exercise library (reusing the library's query), tap to add — creates a `WorkoutExercise` in the Zustand store with no sets yet.
- **Add/edit sets:** each set has `reps`, `weight` (both free-text while editing), and a `weightUnit` fixed to whatever the global lbs/kg toggle was set to at creation time.
- **Complete a set:** locks its inputs and highlights it green; only completed sets with non-empty reps/weight are eligible to be saved.
- **Delete set / delete exercise.**
- **Weight unit toggle:** global lbs/kg segmented control in the header; new sets inherit the current global unit at creation time (changing the toggle later does not retroactively change already-added sets).
- **Cancel workout:** confirms, then clears the in-progress Zustand state and navigates back.
- **Complete workout:**
  1. Filters to only completed sets with valid reps/weight; drops any exercise left with zero valid sets.
  2. Looks up each exercise's Sanity `_id` by name.
  3. Blocks the save entirely ("No Completed Sets") if nothing qualifies.
  4. Writes a `workout` document directly via the Sanity **admin** client (see §12 — Known Gaps for why this is flagged), including `userId`, `date`, `duration` (stopwatch seconds), and the nested exercise/set structure.
  5. On success, clears in-progress state and routes to History with a `refresh=true` param.
- Tapping an in-progress exercise card opens its library detail page.

**In-progress workout persistence:** only the `weightUnit` preference survives an app restart — the actual in-progress `workoutExercises` array is **not** persisted, so a workout is lost if the app is killed mid-session.

## 7. Workout History

**Files:** `src/app/(app)/(tabs)/history/index.tsx`, `history/workout-record.tsx`

- **List:** all of the user's workouts, newest first, each row showing relative date (Today/Yesterday/weekday), duration, exercise count, total sets, and up to 4 exercise-name tags. Refetches on tab focus and when routed to with `?refresh=true`.
- **Record detail:** full breakdown of one workout — duration, exercise count, total sets, total volume (Σ weight×reps across all sets, computed client-side), per-exercise set-by-set listing and per-exercise volume subtotal.
- **Delete workout:** confirmation alert → direct Sanity admin-client delete → back to History with a refresh.

## 8. Profile

**Files:** `src/app/(app)/(tabs)/profile/index.tsx`, `profile/editProfile.tsx`

- Displays Clerk user info (avatar, name, email, member-since date) plus workout stats (total workouts, total time, "days active" since joining, average duration).
- Embeds the workout heatmap (§9).
- Account Settings list: **only "Edit Profile" is functional**; "Notifications", "Preferences", "Help & Support" render but have no handler.
- Sign out with confirmation.
- **Edit Profile:** update first/last name via Clerk; email shown read-only; profile photo upload via camera or library (`expo-image-picker`) — attempts `user.setProfileImage()`, and if that Clerk API call throws, **silently falls back to a local-only fake update** that doesn't actually persist the new photo. "Change Password" and "Delete Account" rows are present but unwired.

## 9. Workout Heatmap

**Files:** `src/lib/heatmapUtils.ts`, `src/app/components/WorkoutHeatmap.tsx`, `src/hooks/useWorkoutHeatmap.ts`

- GitHub-contributions-style calendar, calendar-year-to-date (despite one internal helper being named `generateLast365Days`, it is **not** a rolling 365-day window — it's Jan 1 → Dec 31 of the current year).
- Counts workouts per day (capped visually at 5+), color-scaled, tap a cell for an exact date/count tooltip.
- Shown only on the Profile screen.

## 10. Data Layer

### Sanity schemas (`sanity/schemaTypes/`)

**`exercise`** — `externalId`, `name`, `description`, `muscleGroup` (enum), `difficulty` (enum, default beginner), `image` (Sanity image + alt), `videoUrl`, `gifUrl`, `sourceImageUrl`, `bodyParts[]`, `targetMuscles[]`, `equipments[]`, `secondaryMuscles[]`, `instructions[]`, `isActive` (default true), `autoSynced` (default false), `manualOverride` (default false — protects hand-edited docs from the sync script), `lastSyncedAt`.

**`workout`** — `userId` (Clerk ID, scopes all queries), `date`, `duration` (seconds), `exercises[]` (inline `exerciseSet` objects: reference to an `exercise` doc + `sets[]` of `{reps, weight, weightUnit}`).

These are the **only two document types** in the entire CMS.

### Zustand store (`store/workout-store.ts`)

- State: `workoutExercises`, `weightUnit`.
- Actions: `addExerciseToWorkout`, `setWorkoutExercises`, `setWeightUnit`, `resetWorkout`.
- Persisted (AsyncStorage): only `weightUnit`. IDs are generated with `Math.random().toString()`, not UUIDs.

### Hooks (`src/hooks/`)

- `useWorkouts(userId)` — full workout list + loading/refreshing state. Independently called (no shared cache) from Home, History, and Profile.
- `useWorkoutHeatmap(userId)` — lightweight, dates-only query scoped to the current calendar year.

## 11. Backend / Sync

- **`src/app/api/save-workout+api.ts`**, **`src/app/api/delete-workout+api.ts`** — Expo Router server routes that wrap `adminClient.create`/`adminClient.delete`. **Not called by any current client code** — the client performs these same writes inline instead (see §12).
- **`scripts/sync.ts`** — standalone Node/tsx script (`npm run sync:exercises`) that pages through an external Exercise DB API and upserts into the `exercise` collection, respecting `manualOverride` to avoid clobbering hand-edited docs. This is the sole source of the 1,300+ exercise library.

## 12. Known Gaps / Non-Functional UI / Tech Debt

Flagging these explicitly since a PRD should reflect reality, not just intent:

- **Security:** The Sanity **write-capable admin token** is read from `EXPO_PUBLIC_SANITY_API_TOKEN` (client-bundle-exposed by the `EXPO_PUBLIC_` prefix) and is imported directly into client screens (`active-workout.tsx`, `workout-record.tsx`), not routed through the server-side `+api.ts` endpoints that already exist for this purpose. The same token is also hardcoded in plaintext in `eas.json`. This should be fixed before any public release — see chat history for the remediation plan (drop `EXPO_PUBLIC_` prefix, route writes through `+api.ts`, move the `eas.json` value to an EAS secret, rotate the token).
- **Routing inconsistency:** `active-workout.tsx` navigates to `/exercise-detail`, but the actual screen lives at `/exercises/exercise-detail`. Worth verifying this path in the live app.
- **Dead API routes:** `save-workout+api.ts` / `delete-workout+api.ts` duplicate logic that's actually performed client-side; either wire the client to use them (recommended, so the admin token can move server-side) or remove them.
- **In-progress workout is not persisted** — killing the app mid-workout loses all logged sets.
- **Non-functional UI rows:** Profile's "Notifications" / "Preferences" / "Help & Support"; Edit Profile's "Change Password" / "Delete Account"; Sign-in's "Forgot?" link. All render but have no handler.
- **Profile photo upload has a silent fallback** — if Clerk's `setProfileImage` call fails, the UI fakes success locally without persisting anything.
- **No password-reset flow.**
- **Exercise library has no server-side filtering** (by body part/equipment/difficulty) despite being implied by the README — only client-side name search.

## 13. Build & Deployment

- **Targets:** iOS, Android, Web (single Expo codebase; web export is SPA/`single` output).
- **`app.json`:** scheme `acme`, package/bundle ID `com.tanvirrrr.fitapp`, plugins `expo-router`/`expo-web-browser`/`expo-splash-screen`.
- **`eas.json`:** `development` (internal, dev client), `preview` (internal APK, env vars — see security note above), `production` (autoIncrement, APK build type, no submit config populated).
- **Deploy script:** `expo export -p web && eas-cli deploy`.
