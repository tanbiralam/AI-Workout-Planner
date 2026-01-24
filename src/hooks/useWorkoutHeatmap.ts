import { defineQuery } from "groq";
import { useEffect, useState, useMemo, useCallback } from "react";
import { client } from "@/lib/sanity/client";
import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import {
  generateLast365Days,
  aggregateWorkoutsByDate,
  organizeIntoWeeks,
} from "@/lib/heatmapUtils";

/**
 * Optimized query that fetches only the date field for heatmap
 * We only need date to count workouts per day
 */
const getWorkoutDatesQuery = defineQuery(`
  *[_type == "workout" && userId == $userId && date >= $startDate] | order(date desc) {
    date
  }
`);

export interface HeatmapData {
  /** Workout counts keyed by YYYY-MM-DD */
  countsByDate: Record<string, number>;
  /** Pre-computed 365-day array as YYYY-MM-DD strings */
  days: string[];
  /** Days organized into weeks for grid rendering */
  weeks: string[][];
  /** Whether data is currently loading */
  loading: boolean;
  /** Whether data has been loaded at least once */
  hasLoaded: boolean;
  /** Total workouts in the last 365 days */
  totalWorkouts: number;
  /** Refetch function to refresh data */
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and processing workout heatmap data
 * Optimized for performance with memoization
 */
export function useWorkoutHeatmap(userId?: string): HeatmapData {
  const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Pre-compute the 365-day array once
  const days = useMemo(() => generateLast365Days(), []);

  // Calculate start date for query (January 1st of current year)
  const startDate = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, 0, 1); // January 1st
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }, []);

  const fetchHeatmapData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const results = await client.fetch(getWorkoutDatesQuery, {
        userId,
        startDate,
      });
      setWorkouts(results);
      setHasLoaded(true);
    } catch (err) {
      console.error("Error fetching heatmap data:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, startDate]);

  // Initial fetch
  useEffect(() => {
    fetchHeatmapData();
  }, [fetchHeatmapData]);

  // Memoize aggregated data to prevent recalculation on every render
  const countsByDate = useMemo(
    () => aggregateWorkoutsByDate(workouts),
    [workouts]
  );

  // Memoize weeks organization
  const weeks = useMemo(() => organizeIntoWeeks(days), [days]);

  // Calculate total workouts
  const totalWorkouts = useMemo(() => workouts.length, [workouts]);

  return {
    countsByDate,
    days,
    weeks,
    loading,
    hasLoaded,
    totalWorkouts,
    refetch: fetchHeatmapData,
  };
}
