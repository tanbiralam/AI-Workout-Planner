import React from "react";
import { useWorkouts } from "@/hooks/useWorkout";
import { formatDuration } from "@/lib/utils";
import {
  calculateStats,
  formatWorkoutDate,
  getTotalSets,
} from "@/lib/workoutUtils";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  const { workouts, loading, refreshing, fetchWorkouts, setRefreshing } =
    useWorkouts(user?.id);

  const { totalWorkouts, totalDuration, averageDuration } =
    calculateStats(workouts);
  const lastWorkout = workouts[0];

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

  if (loading) {
    return <Loader />;
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
          <Text className="text-sm text-zinc-500 mb-1">Welcome back,</Text>
          <Text className="text-3xl font-bold text-white leading-tight">
            {user?.firstName || "Athlete"}
          </Text>
          <View className="mt-3 w-12 h-1 bg-blue-500 rounded-full" />
        </View>

        {/* Stats Overview Card */}
        <View className="px-5 mb-5">
          <View className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800/50">
            <Text className="text-base font-bold text-white mb-5">
              Your Progress
            </Text>

            {/* Primary Stat */}
            <View className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-1">
                    Total Workouts
                  </Text>
                  <Text className="text-5xl font-bold text-white">
                    {totalWorkouts}
                  </Text>
                </View>
                <View className="w-16 h-16 bg-white/10 rounded-2xl items-center justify-center">
                  <Ionicons name="fitness" size={32} color="white" />
                </View>
              </View>
            </View>

            {/* Secondary Stats Grid */}
            <View className="flex-row gap-3">
              <View className="flex-1 bg-zinc-800/70 rounded-2xl p-4">
                <View className="w-9 h-9 bg-green-500/15 rounded-xl items-center justify-center mb-3">
                  <Ionicons name="timer-outline" size={18} color="#22c55e" />
                </View>
                <Text className="text-zinc-500 text-xs mb-1">Total Time</Text>
                <Text className="text-xl font-bold text-white">
                  {formatDuration(totalDuration)}
                </Text>
              </View>

              <View className="flex-1 bg-zinc-800/70 rounded-2xl p-4">
                <View className="w-9 h-9 bg-purple-500/15 rounded-xl items-center justify-center mb-3">
                  <Ionicons name="trending-up" size={18} color="#a855f7" />
                </View>
                <Text className="text-zinc-500 text-xs mb-1">Average</Text>
                <Text className="text-xl font-bold text-white">
                  {averageDuration > 0 ? formatDuration(averageDuration) : "0m"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Start Workout Button */}
        <View className="px-5 mb-5">
          <TouchableOpacity
            onPress={() => router.push("/workout")}
            className="bg-blue-600 rounded-3xl shadow-lg shadow-blue-500/25"
            activeOpacity={0.85}
            style={{ elevation: 8 }}
          >
            <View className="px-6 py-5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mr-4">
                    <Ionicons name="play" size={22} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-xl font-bold">
                      Start Workout
                    </Text>
                    <Text className="text-blue-100 text-sm mt-0.5">
                      Begin training session
                    </Text>
                  </View>
                </View>
                <View className="w-9 h-9 bg-white/20 rounded-full items-center justify-center">
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-5">
          <Text className="text-base font-bold text-white mb-3">
            Quick Actions
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push("/history")}
              className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800/50"
              activeOpacity={0.7}
            >
              <View className="p-5 items-center">
                <View className="w-14 h-14 bg-zinc-800/80 rounded-2xl items-center justify-center mb-3">
                  <Ionicons name="time-outline" size={26} color="#71717a" />
                </View>
                <Text className="text-white font-semibold text-sm">
                  History
                </Text>
                <Text className="text-zinc-500 text-xs mt-1">
                  Past workouts
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/exercises")}
              className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800/50"
              activeOpacity={0.7}
            >
              <View className="p-5 items-center">
                <View className="w-14 h-14 bg-zinc-800/80 rounded-2xl items-center justify-center mb-3">
                  <Ionicons name="barbell-outline" size={26} color="#71717a" />
                </View>
                <Text className="text-white font-semibold text-sm">
                  Exercises
                </Text>
                <Text className="text-zinc-500 text-xs mt-1">
                  Browse library
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Last Workout */}
        {lastWorkout && (
          <View className="px-5 mb-6">
            <Text className="text-base font-bold text-white mb-3">
              Recent Activity
            </Text>

            <TouchableOpacity
              className="bg-zinc-900 rounded-2xl border border-zinc-800/50"
              onPress={() => {
                router.push({
                  pathname: "/history/workout-record",
                  params: { workoutId: lastWorkout._id },
                });
              }}
              activeOpacity={0.7}
            >
              <View className="p-5">
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      <Text className="text-xs text-zinc-500 font-medium">
                        {formatWorkoutDate(lastWorkout.date || "")}
                      </Text>
                    </View>
                    <Text className="text-lg font-bold text-white mb-1">
                      Last Workout
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={13} color="#3b82f6" />
                      <Text className="text-sm text-zinc-400 ml-1.5">
                        {lastWorkout.duration
                          ? formatDuration(lastWorkout.duration)
                          : "Duration not recorded"}
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

                <View className="flex-row items-center justify-between pt-4 border-t border-zinc-800/70">
                  <Text className="text-zinc-400 text-xs">
                    {lastWorkout.exercises?.length || 0} exercises •{" "}
                    {getTotalSets(lastWorkout)} sets
                  </Text>
                  <View className="w-7 h-7 bg-zinc-800/70 rounded-full items-center justify-center">
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color="#71717a"
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {totalWorkouts === 0 && (
          <View className="px-5 mb-6">
            <View className="bg-zinc-900 rounded-3xl p-8 items-center border border-zinc-800/50">
              <View className="w-20 h-20 bg-blue-500/15 rounded-3xl items-center justify-center mb-5">
                <Ionicons name="barbell-outline" size={40} color="#3b82f6" />
              </View>

              <Text className="text-2xl font-bold text-white mb-2 text-center">
                Ready to Begin?
              </Text>
              <Text className="text-zinc-400 text-center mb-6 text-sm leading-relaxed px-2">
                Start tracking your workouts and watch your progress grow over
                time
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/workout")}
                className="bg-blue-600 rounded-2xl px-8 py-4"
                activeOpacity={0.85}
              >
                <Text className="text-white font-bold text-base">
                  Start First Workout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
