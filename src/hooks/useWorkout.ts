import { defineQuery } from "groq";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity/client";
import { GetWorkoutsQueryResult } from "@/lib/sanity/types";

const getWorkoutsQuery = defineQuery(`
  *[_type == "workout" && userId == $userId] | order(date desc) {
    _id,
    date,
    duration,
    exercises[] {
      exercise-> {
        _id,
        name
      },
      sets[] {
        reps,
        weight,
        weightUnit,
        _type,
        _key
      },
      _type,
      _key
    }
  }
`);

export function useWorkouts(userId?: string) {
  const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = async () => {
    if (!userId) return;
    try {
      const results = await client.fetch(getWorkoutsQuery, { userId });
      setWorkouts(results);
    } catch (err) {
      console.error("Error fetching workouts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [userId]);

  return { workouts, loading, refreshing, fetchWorkouts, setRefreshing };
}
