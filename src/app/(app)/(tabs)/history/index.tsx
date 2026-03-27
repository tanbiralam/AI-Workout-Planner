import { useWorkouts } from "@/hooks/useWorkout";
import { formatDuration } from "@/lib/utils";
import { getTotalSets, formatWorkoutDate } from "@/lib/workoutUtils";
import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "@/app/components/Loader";

export default function HistoryPage() {
  const { user } = useUser();
  const { refresh } = useLocalSearchParams();
  const router = useRouter();

  const { workouts, loading, refreshing, fetchWorkouts, setRefreshing } =
    useWorkouts(user?.id);

  // Refresh list whenever the History tab comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [user?.id])
  );

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

  const getExerciseNames = (workout: GetWorkoutsQueryResult[number]) => {
    return (
      workout.exercises?.map((ex) => ex.exercise?.name).filter(Boolean) || []
    );
  };

  if (loading) {
    return (
      <Loader
        title="Loading your workouts..."
        subtitle="Hang tight before fetching your logs"
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0D0D0D"
        translucent={false}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className="text-3xl font-bold text-white leading-tight">
            Workout History
          </Text>
          <Text className="text-sm text-zinc-500 mt-1">
            {workouts.length} workout{workouts.length !== 1 ? "s" : ""}{" "}
            completed
          </Text>
          <View className="mt-3 w-12 h-1 bg-blue-500 rounded-full" />
        </View>

        {/* Workout List */}
        <View className="px-5 mb-6">
          {workouts.length === 0 ? (
            <View className="bg-zinc-900 rounded-3xl p-8 items-center border border-zinc-800/50">
              <View className="w-20 h-20 bg-blue-500/15 rounded-3xl items-center justify-center mb-5">
                <Ionicons name="barbell-outline" size={40} color="#3b82f6" />
              </View>
              <Text className="text-2xl font-bold text-white mb-2 text-center">
                No Workouts Yet
              </Text>
              <Text className="text-zinc-400 text-center mb-6 text-sm leading-relaxed px-2">
                Your completed workouts will appear here
              </Text>
            </View>
          ) : (
            <View className="space-y-3 gap-3">
              {workouts.map((workout) => (
                <TouchableOpacity
                  key={workout._id}
                  className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800/50"
                  activeOpacity={0.7}
                  onPress={() => {
                    router.push({
                      pathname: "/history/workout-record",
                      params: {
                        workoutId: workout._id,
                      },
                    });
                  }}
                >
                  {/* Compact Header Row */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <View className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                        <Text className="text-xs text-zinc-500 font-medium">
                          {formatWorkoutDate(workout.date || "")}
                        </Text>
                        <View className="flex-row items-center ml-3">
                          <Ionicons
                            name="time-outline"
                            size={12}
                            color="#3b82f6"
                          />
                          <Text className="text-xs text-zinc-400 ml-1">
                            {workout.duration
                              ? formatDuration(workout.duration)
                              : "Duration not recorded"}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-base font-bold text-white">
                        Workout Session
                      </Text>
                    </View>
                    <View className="w-10 h-10 bg-blue-500/15 rounded-xl items-center justify-center">
                      <Ionicons
                        name="fitness-outline"
                        size={20}
                        color="#3b82f6"
                      />
                    </View>
                  </View>

                  {/* Compact Stats Row */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View className="bg-zinc-800/70 rounded-lg px-2.5 py-1.5 mr-2">
                        <Text className="text-xs font-medium text-zinc-300">
                          {workout.exercises?.length || 0} exercises
                        </Text>
                      </View>
                      <View className="bg-zinc-800/70 rounded-lg px-2.5 py-1.5">
                        <Text className="text-xs font-medium text-zinc-300">
                          {getTotalSets(workout)} sets
                        </Text>
                      </View>
                    </View>
                    <View className="w-6 h-6 bg-zinc-800/70 rounded-full items-center justify-center">
                      <Ionicons
                        name="chevron-forward"
                        size={12}
                        color="#71717a"
                      />
                    </View>
                  </View>

                  {/* Compact Exercise Tags */}
                  {workout.exercises && workout.exercises.length > 0 && (
                    <View className="flex-row flex-wrap">
                      {getExerciseNames(workout)
                        .slice(0, 4)
                        .map((name, index) => (
                          <View
                            key={index}
                            className="bg-blue-500/20 rounded-md px-2 py-1 mr-1.5 mb-1 border border-blue-500/30"
                          >
                            <Text className="text-blue-400 text-xs font-medium">
                              {name}
                            </Text>
                          </View>
                        ))}
                      {getExerciseNames(workout).length > 4 && (
                        <View className="bg-zinc-800/70 rounded-md px-2 py-1 mr-1.5 mb-1">
                          <Text className="text-zinc-400 text-xs font-medium">
                            +{getExerciseNames(workout).length - 4}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
