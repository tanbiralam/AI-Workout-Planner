import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import { client, adminClient } from "@/lib/sanity/client";
import { GetWorkoutRecordQueryResult } from "@/lib/sanity/types";
import { formatDuration } from "@/lib/utils";
import { getTotalSets } from "@/lib/workoutUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Loader from "@/app/components/Loader";

const getWorkoutRecordQuery =
  defineQuery(`*[_type == "workout" && _id == $workoutId][0] {
  _id,
  _type,
  _createdAt,
  date,
  duration,
  exercises[] {
    exercise-> {
      _id,
      name,
      description
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

export default function WorkoutRecord() {
  const router = useRouter();
  const { workoutId } = useLocalSearchParams();
  const [workout, setWorkout] = useState<GetWorkoutRecordQueryResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!workoutId) return;

      try {
        const result = await client.fetch(getWorkoutRecordQuery, {
          workoutId,
        });
        setWorkout(result);
      } catch (error) {
        console.error("Error fetching workout:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatWorkoutDuration = (seconds?: number) => {
    if (!seconds) return "Duration not recorded";
    return formatDuration(seconds);
  };

  const getTotalSetsCount = () => {
    if (!workout) return 0;
    return getTotalSets(workout);
  };

  const getTotalVolume = () => {
    let totalVolume = 0;
    let unit = "lbs";

    workout?.exercises?.forEach((exercise) => {
      exercise.sets?.forEach((set) => {
        if (set.weight && set.reps) {
          totalVolume += set.weight * set.reps;
          unit = set.weightUnit || "lbs";
        }
      });
    });

    return { volume: totalVolume, unit };
  };

  if (loading) {
    return (
      <Loader title="Loading Your Workouts" subtitle="Please wait for a bit" />
    );
  }

  if (!workout) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0D0D0D"
          translucent={false}
        />
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 bg-red-500/20 rounded-3xl items-center justify-center mb-6">
            <Ionicons name="alert-circle-outline" size={40} color="#ef4444" />
          </View>
          <Text className="text-2xl font-bold text-white mb-2 text-center">
            Workout Not Found
          </Text>
          <Text className="text-zinc-400 text-center mb-6 text-sm leading-relaxed">
            This workout record could not be found or may have been deleted.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-blue-600 rounded-2xl px-8 py-4"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { volume, unit } = getTotalVolume();

  const handleDeleteWorkout = () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteWorkout,
        },
      ]
    );
  };

  const deleteWorkout = async () => {
    if (!workoutId) return;

    setDeleting(true);

    try {
      // Delete directly using admin client
      await adminClient.delete(workoutId as string);

      router.replace("/(app)/(tabs)/history?refresh=true");
    } catch (error) {
      console.error("Error deleting workout:", error);
      Alert.alert("Error", "Failed to delete workout. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0D0D0D"
        translucent={false}
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-zinc-800/50 rounded-full items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#71717a" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteWorkout}
              disabled={deleting}
              className="bg-red-600/10 px-4 py-2 rounded-xl border border-red-600/30 flex-row items-center"
              activeOpacity={0.85}
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  <Text className="text-red-400 font-medium ml-2">Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-3xl font-bold text-white leading-tight">
            Workout Details
          </Text>
          <Text className="text-sm text-zinc-500 mt-1">
            {formatDate(workout.date)} at {formatTime(workout.date)}
          </Text>
          <View className="mt-3 w-12 h-1 bg-blue-500 rounded-full" />
        </View>

        {/* Workout Summary */}
        <View className="px-5 mb-5">
          <View className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800/50">
            <Text className="text-base font-bold text-white mb-5">
              Workout Summary
            </Text>

            {/* Primary Stats Grid */}
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1 bg-zinc-800/70 rounded-2xl p-4">
                <View className="w-9 h-9 bg-blue-500/15 rounded-xl items-center justify-center mb-3">
                  <Ionicons name="timer-outline" size={18} color="#3b82f6" />
                </View>
                <Text className="text-2xl font-bold text-white mb-1">
                  {formatWorkoutDuration(workout.duration)}
                </Text>
                <Text className="text-xs text-zinc-500">Duration</Text>
              </View>

              <View className="flex-1 bg-zinc-800/70 rounded-2xl p-4">
                <View className="w-9 h-9 bg-green-500/15 rounded-xl items-center justify-center mb-3">
                  <Ionicons name="fitness" size={18} color="#22c55e" />
                </View>
                <Text className="text-2xl font-bold text-white mb-1">
                  {workout.exercises?.length || 0}
                </Text>
                <Text className="text-xs text-zinc-500">Exercises</Text>
              </View>

              <View className="flex-1 bg-zinc-800/70 rounded-2xl p-4">
                <View className="w-9 h-9 bg-purple-500/15 rounded-xl items-center justify-center mb-3">
                  <Ionicons
                    name="bar-chart-outline"
                    size={18}
                    color="#a855f7"
                  />
                </View>
                <Text className="text-2xl font-bold text-white mb-1">
                  {getTotalSetsCount()}
                </Text>
                <Text className="text-xs text-zinc-500">Total Sets</Text>
              </View>
            </View>

            {/* Volume Summary */}
            {volume > 0 && (
              <View className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700/30">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-orange-500/15 rounded-lg items-center justify-center mr-3">
                      <Ionicons
                        name="barbell-outline"
                        size={16}
                        color="#f97316"
                      />
                    </View>
                    <Text className="text-sm text-zinc-400">Total Volume</Text>
                  </View>
                  <Text className="text-lg font-bold text-white">
                    {volume.toLocaleString()} {unit}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Exercise List */}
        <View className="px-5 mb-6">
          <Text className="text-base font-bold text-white mb-3">
            Exercise Details
          </Text>
          <View className="space-y-4 gap-4">
            {workout.exercises?.map((exerciseData, index) => (
              <View
                key={exerciseData._key}
                className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/50"
              >
                {/* Exercise Header */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      <Text className="text-xs text-zinc-500 font-medium">
                        Exercise {index + 1}
                      </Text>
                    </View>
                    <Text className="text-lg font-bold text-white mb-1">
                      {exerciseData.exercise?.name || "Unknown Exercise"}
                    </Text>
                    <Text className="text-sm text-zinc-400">
                      {exerciseData.sets?.length || 0} sets completed
                    </Text>
                  </View>
                  <View className="w-12 h-12 bg-blue-500/15 rounded-2xl items-center justify-center">
                    <Text className="text-blue-400 font-bold text-lg">
                      {index + 1}
                    </Text>
                  </View>
                </View>

                {/* Sets */}
                <View className="space-y-2">
                  <Text className="text-sm font-medium text-zinc-400 mb-3">
                    Sets:
                  </Text>
                  {exerciseData.sets?.map((set, setIndex) => (
                    <View
                      key={set._key}
                      className="bg-zinc-800/70 rounded-xl p-3 flex-row items-center justify-between border border-zinc-700/30"
                    >
                      <View className="flex-row items-center">
                        <View className="bg-zinc-700/50 rounded-full w-7 h-7 items-center justify-center mr-3">
                          <Text className="text-zinc-300 text-xs font-medium">
                            {setIndex + 1}
                          </Text>
                        </View>
                        <Text className="text-white font-medium">
                          {set.reps} reps
                        </Text>
                      </View>

                      {set.weight && (
                        <View className="flex-row items-center">
                          <Ionicons
                            name="barbell-outline"
                            size={16}
                            color="#3b82f6"
                          />
                          <Text className="text-zinc-300 ml-2 font-medium">
                            {set.weight} {set.weightUnit || "lbs"}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                {/* Exercise Volume Summary */}
                {exerciseData.sets && exerciseData.sets.length > 0 && (
                  <View className="mt-4 pt-4 border-t border-zinc-800/70">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View className="w-6 h-6 bg-orange-500/15 rounded-lg items-center justify-center mr-2">
                          <Ionicons
                            name="barbell-outline"
                            size={12}
                            color="#f97316"
                          />
                        </View>
                        <Text className="text-sm text-zinc-400">
                          Exercise Volume:
                        </Text>
                      </View>
                      <Text className="text-sm font-bold text-white">
                        {exerciseData.sets
                          .reduce((total, set) => {
                            return total + (set.weight || 0) * (set.reps || 0);
                          }, 0)
                          .toLocaleString()}{" "}
                        {exerciseData.sets[0]?.weightUnit || "lbs"}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
