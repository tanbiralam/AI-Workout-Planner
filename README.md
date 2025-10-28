AI Workout Tracker
==================

Overview
--------
- Expo Router based React Native application that helps users build, run, and review strength workouts.
- Integrates Clerk for authentication, Sanity as the content backend, and OpenAI for contextual exercise coaching.
- Tailwind (via NativeWind) driven design system with reusable components for cards, lists, timers, and workout controls.

Core Business Logic
-------------------
- **Authentication & Session:** `@clerk/clerk-expo` supplies the authenticated user id; every data query or mutation scopes by this id so each user only sees their own workouts (`src/hooks/useWorkout.ts:6`).
- **Workout Assembly:** While training, selected exercises live in a persisted Zustand store (`store/workout-store.ts:6`). Each entry records the Sanity exercise `_id`, user-entered sets, completion flags, and global weight-unit preference.
- **Timing & Validation:** The active workout screen (`src/app/(app)/active-workout.tsx:1`) runs a live stopwatch, enforces that all sets are marked complete before saving, and filters out incomplete sets so only deliberate work reaches the backend.
- **Persistence Pipeline:** A POST to `/api/save-workout` bundles the stopwatch duration, completed sets, and references back to the canonical Sanity exercise documents. The API route creates the workout through an admin-scoped Sanity client so mutations stay server-side (`src/app/api/save-workout+api.ts:1`). Deletions follow the same pattern via `/api/delete-workout`.
- **History & Insights:** Completed sessions are fetched with GROQ (`useWorkouts`) and rendered in the Home and History tabs. Helper utilities compute workout counts, cumulative duration, set totals, and formatted summaries (`src/lib/workoutUtils.ts:1`), while the detailed history screen derives volume metrics on the fly.
- **AI Coaching:** The exercise detail screen can request technique guidance from `/api/ai`, which wraps the OpenAI SDK to produce markdown tips tailored to the chosen movement (`src/app/(app)/exercise-detail.tsx:70`).

Tech Stack
----------
- React Native + Expo Router, NativeWind, and Reanimated for the mobile UI.
- Zustand with AsyncStorage persistence for workout-in-progress state.
- Sanity (client + studio) as the content backend for exercises and workout records.
- Clerk for authentication, OpenAI API for contextual coaching content.
- TypeScript across app and Sanity schemas, with Sanity TypeGen for strongly typed GROQ results.

Project Structure Highlights
----------------------------
- `src/app/(app)/(tabs)`: Home, Workout, History, and Exercises tab screens plus nested history detail routes.
- `src/app/(app)/active-workout.tsx`: End-to-end workout capture flow (timer, set logging, save pipeline).
- `src/app/components`: Reusable UI (cards, headers, loader, timer).
- `src/hooks/useWorkout.ts`: Encapsulated GROQ fetch logic for user workouts.
- `src/lib`: Shared utilities, Sanity client, and generated types.
- `store`: Zustand store definitions for workout state.
- `sanity`: Standalone Sanity Studio (schemas, config, typegen settings).

Environment Variables
---------------------
Create a `.env.local` file in the project root and supply:
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key for Expo.
- `OPEN_AI_API_KEY` - OpenAI API key used by `/api/ai`.
- `SANITY_API_TOKEN` - Sanity token with write access for API routes.
- _(Optional)_ `EXERCISE_DB_API_URL` - Override the Exercise DB base url. Defaults to `https://v2.exercisedb.dev/api/v1/exercises`.
- _(Optional)_ `EXERCISE_DB_PAGE_SIZE` - Page size for sync pagination (defaults to `100`).

Getting Started
---------------
- Install dependencies: `npm install`.
- Run the mobile app: `npm run start` (choose platform from Expo CLI).
- Optional: launch the Sanity Studio by `cd sanity && npm install && npm run dev`.
- Regenerate Sanity TypeScript types after schema changes: from `sanity/`, run `npm run typegen`.

Additional Notes
----------------
- **Exercise Library Sync:** With the new `npm run sync:exercises` command (Node 18+), you can import or update exercises from Exercise DB into Sanity. The script paginates through the API, upserts documents by `externalId`, and skips any Sanity records where `manualOverride` is enabled. Ensure `SANITY_API_TOKEN` is present before running.
- NativeWind utility classes drive theming; ensure Metro is configured (already handled in `metro.config.js`).
- API route handlers assume Expo Router's file-based routing in the `/app/api` directory, keeping secrets off-device.
- Workout saves require at least one completed set; the UI disables submission until the data is valid, preventing empty records in Sanity.
