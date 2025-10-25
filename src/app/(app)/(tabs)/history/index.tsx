import { useWorkouts } from "@/hooks/useWorkout";
import { formatDuration } from "@/lib/utils";
import { getTotalSets, formatWorkoutDate } from "@/lib/workoutUtils";
import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
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

export default function HistoryPage() {
  const { user } = useUser();
  const { refresh } = useLocalSearchParams();
  const router = useRouter();

  const { workouts, loading, refreshing, fetchWorkouts, setRefreshing } =
    useWorkouts(user?.id);

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

  const formatWorkoutDuration = (seconds: number) => {
    if (!seconds) return "Duration not recorded";
    return formatDuration(seconds);
  };

  const getExerciseNames = (workout: GetWorkoutsQueryResult[number]) => {
    return (
      workout.exercises?.map((ex) => ex.exercise?.name).filter(Boolean) || []
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0D0D0D"
          translucent={false}
        />
        <View className="px-5 pt-4 pb-6">
          <Text className="text-3xl font-bold text-white leading-tight">
            Workout History
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-zinc-400 mt-4">Loading your workouts...</Text>
        </View>
      </SafeAreaView>
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
            <View className="space-y-4 gap-4">
              {workouts.map((workout) => (
                <TouchableOpacity
                  key={workout._id}
                  className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/50"
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
                  {/* Workout Header */}
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        <Text className="text-xs text-zinc-500 font-medium">
                          {formatWorkoutDate(workout.date || "")}
                        </Text>
                      </View>
                      <Text className="text-lg font-bold text-white mb-1">
                        Workout Session
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons
                          name="time-outline"
                          size={13}
                          color="#3b82f6"
                        />
                        <Text className="text-sm text-zinc-400 ml-1.5">
                          {formatWorkoutDuration(workout.duration)}
                        </Text>
                      </View>
                    </View>

                    <View className="w-14 h-14 bg-blue-500/15 rounded-2xl items-center justify-center">
                      <Ionicons
                        name="fitness-outline"
                        size={26}
                        color="#3b82f6"
                      />
                    </View>
                  </View>

                  {/* Workout Stats */}
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                      <View className="bg-zinc-800/70 rounded-lg px-3 py-2 mr-3">
                        <Text className="text-sm font-medium text-zinc-300">
                          {workout.exercises?.length || 0} exercises
                        </Text>
                      </View>
                      <View className="bg-zinc-800/70 rounded-lg px-3 py-2">
                        <Text className="text-sm font-medium text-zinc-300">
                          {getTotalSets(workout)} sets
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Exercise List */}
                  {workout.exercises && workout.exercises.length > 0 && (
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-zinc-400 mb-2">
                        Exercises:
                      </Text>
                      <View className="flex-row flex-wrap">
                        {getExerciseNames(workout)
                          .slice(0, 3)
                          .map((name, index) => (
                            <View
                              key={index}
                              className="bg-blue-500/20 rounded-lg px-3 py-1 mr-2 mb-2 border border-blue-500/30"
                            >
                              <Text className="text-blue-400 text-sm font-medium">
                                {name}
                              </Text>
                            </View>
                          ))}
                        {getExerciseNames(workout).length > 3 && (
                          <View className="bg-zinc-800/70 rounded-lg px-3 py-1 mr-2 mb-2">
                            <Text className="text-zinc-400 text-sm font-medium">
                              +{getExerciseNames(workout).length - 3} more
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  {/* Bottom Action */}
                  <View className="flex-row items-center justify-between pt-4 border-t border-zinc-800/70">
                    <Text className="text-zinc-400 text-xs">
                      Tap to view details
                    </Text>
                    <View className="w-7 h-7 bg-zinc-800/70 rounded-full items-center justify-center">
                      <Ionicons
                        name="chevron-forward"
                        size={14}
                        color="#71717a"
                      />
                    </View>
                  </View>
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
