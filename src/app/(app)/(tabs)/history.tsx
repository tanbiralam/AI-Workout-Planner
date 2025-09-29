import { client } from "@/lib/sanity/client";
import { GetWorkoutsQueryResult, Workout } from "@/lib/sanity/types";
import { formatDuration } from "@/lib/utils";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const getWorkoutsQuery =
  defineQuery(`*[_type == "workout" && userId == $userId] | order(date desc) {
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
}`);

export default function HistoryPage() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refresh } = useLocalSearchParams();
  const router = useRouter();

  //https://youtu.be/bk89LxdS0TE?t=10388
  const fetchWorkouts = async () => {
    if (!user?.id) return;

    try {
      const results = await client.fetch(getWorkoutsQuery, { userID: user.id });
      console.log(user.id);
      console.log(results);
      setWorkouts(results);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  // Handle refresh parameter from deleted workout
  useEffect(() => {
    if (refresh === "true") {
      fetchWorkouts();
      // Clear the refresh parameter from the URL
      router.replace("/(app)/(tabs)/history");
    }
  }, [refresh]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

  const formatDate = (dateString: string) => {
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
  };

  const formatWorkoutDuration = (seconds: number) => {
    if (!seconds) return "Duration not recorded";
    return formatDuration(seconds);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="px-6 py-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">
            Workout History
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Loading your workouts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* /* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Workout History
        </Text>
        <Text className="text-gray-600 mt-1">
          {workouts.length} workout{workouts.length !== 1 ? "s" : ""} completed
        </Text>
      </View>

      {/* WorkOut List */}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {workouts.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Ionicons name="barbell-outline" size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-900 mt-4">
              No workouts yet
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Your completed workouts will appear here
            </Text>
          </View>
        ) : (
          <View></View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
