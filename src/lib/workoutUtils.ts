import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import { formatDuration } from "@/lib/utils";

/**
 * Calculates total workouts, total duration, and average duration
 * exactly as used in the HomePage component.
 */
export function calculateStats(workouts: GetWorkoutsQueryResult) {
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce(
    (sum, workout) => sum + (workout.duration || 0),
    0
  );
  const averageDuration =
    totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

  return {
    totalWorkouts,
    totalDuration,
    averageDuration,
  };
}

/**
 * Returns the total number of sets in a given workout.
 */
export function getTotalSets(workout: GetWorkoutsQueryResult[number]) {
  return (
    workout.exercises?.reduce((total, exercise) => {
      return total + (exercise.sets?.length || 0);
    }, 0) || 0
  );
}

/**
 * Formats a workout date to "Today", "Yesterday", or "Wed, Mar 5" style.
 */
export function formatWorkoutDate(dateString?: string): string {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
}

/**
 * Returns a full long-form date string: "Wednesday, March 5, 2025"
 * Used in workout detail screens where more context is needed.
 */
export function formatWorkoutLongDate(dateString?: string): string {
  if (!dateString) return "Unknown Date";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Returns a time string: "9:30 AM"
 * Used alongside formatWorkoutLongDate in workout detail screens.
 */
export function formatWorkoutTime(dateString?: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}


/**
 * Formats workout duration from stopwatch values (hours, minutes, seconds)
 * Shows HH:MM:SS format for workouts over 1 hour, MM:SS otherwise
 */
export function getWorkoutDuration(
  hours: number,
  minutes: number,
  seconds: number
): string {
  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Combines all workout summary info for debugging or future expansion.
 */
export function getWorkoutSummary(workouts: GetWorkoutsQueryResult) {
  const { totalWorkouts, totalDuration, averageDuration } =
    calculateStats(workouts);

  const lastWorkout = workouts[0];
  const totalSets = lastWorkout ? getTotalSets(lastWorkout) : 0;
  const lastWorkoutDate = lastWorkout
    ? formatWorkoutDate(lastWorkout.date)
    : null;

  return {
    totalWorkouts,
    totalDuration: formatDuration(totalDuration),
    averageDuration: formatDuration(averageDuration),
    lastWorkoutDate,
    totalSets,
  };
}
