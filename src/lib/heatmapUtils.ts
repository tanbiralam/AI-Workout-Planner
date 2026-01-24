import { GetWorkoutsQueryResult } from "@/lib/sanity/types";

/**
 * Maximum workouts per day for intensity scaling
 */
export const MAX_WORKOUTS_PER_DAY = 5;

/**
 * Generates an array of all days in the current calendar year as YYYY-MM-DD strings
 * Shows Jan 1 → Dec 31 of the current year
 */
export function generateCurrentYearDays(): string[] {
  const days: string[] = [];
  const currentYear = new Date().getFullYear();

  // Start from January 1st of current year
  const startDate = new Date(currentYear, 0, 1); // Month is 0-indexed
  // End at December 31st of current year
  const endDate = new Date(currentYear, 11, 31);

  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(formatDateKey(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

/**
 * @deprecated Use generateCurrentYearDays instead
 * Generates an array of the last 365 days as YYYY-MM-DD strings
 */
export function generateLast365Days(): string[] {
  return generateCurrentYearDays();
}

/**
 * Formats a Date object to YYYY-MM-DD string
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Aggregates workouts by date and returns count per day
 * Counts are clamped to MAX_WORKOUTS_PER_DAY
 */
export function aggregateWorkoutsByDate(
  workouts: GetWorkoutsQueryResult
): Record<string, number> {
  const countMap: Record<string, number> = {};

  for (const workout of workouts) {
    if (!workout.date) continue;

    // Extract YYYY-MM-DD from the date string
    const dateKey = workout.date.split("T")[0];

    if (!countMap[dateKey]) {
      countMap[dateKey] = 0;
    }
    countMap[dateKey] = Math.min(countMap[dateKey] + 1, MAX_WORKOUTS_PER_DAY);
  }

  return countMap;
}

/**
 * Returns NativeWind background color class based on workout count
 * Dark theme blue scale
 */
export function getHeatmapColor(count: number): string {
  switch (count) {
    case 0:
      return "bg-zinc-800/50";
    case 1:
      return "bg-blue-900";
    case 2:
      return "bg-blue-700";
    case 3:
      return "bg-blue-600";
    case 4:
      return "bg-blue-500";
    default:
      return "bg-blue-400"; // 5+
  }
}

/**
 * Returns hex color for heatmap cells (for inline styles if needed)
 */
export function getHeatmapHexColor(count: number): string {
  switch (count) {
    case 0:
      return "#27272a80"; // zinc-800/50
    case 1:
      return "#1e3a8a"; // blue-900
    case 2:
      return "#1d4ed8"; // blue-700
    case 3:
      return "#2563eb"; // blue-600
    case 4:
      return "#3b82f6"; // blue-500
    default:
      return "#60a5fa"; // blue-400 (5+)
  }
}

/**
 * Formats a date string for tooltip display
 * Returns format like "Jan 18, 2026"
 */
export function formatDateForTooltip(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Gets the day of week starting from Sunday (0) to Saturday (6)
 */
export function getDayOfWeek(dateString: string): number {
  return new Date(dateString).getDay();
}

/**
 * Gets the month abbreviation for a date
 */
export function getMonthLabel(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short" });
}

/**
 * Organizes 365 days into weeks (columns) for grid rendering
 * Returns array of weeks, each containing 7 days
 */
export function organizeIntoWeeks(days: string[]): string[][] {
  const weeks: string[][] = [];
  let currentWeek: string[] = [];

  // Pad the first week with empty strings if it doesn't start on Sunday
  const firstDayOfWeek = getDayOfWeek(days[0]);
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push("");
  }

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Push any remaining days in the last week
  if (currentWeek.length > 0) {
    // Pad with empty strings to complete the week
    while (currentWeek.length < 7) {
      currentWeek.push("");
    }
    weeks.push(currentWeek);
  }

  return weeks;
}
