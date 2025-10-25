import React from "react";
import { View, Text } from "react-native";
import { getWorkoutDuration } from "@/lib/workoutUtils";
import { WorkoutExercise } from "@/store/workout-store";

interface TimerDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  workoutExercises: WorkoutExercise[];
}

export default function TimerDisplay({
  hours,
  minutes,
  seconds,
  workoutExercises,
}: TimerDisplayProps) {
  const completedSets = workoutExercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.isCompleted).length,
    0
  );

  return (
    <View className="mt-4 mb-4">
      <View className="bg-blue-600 rounded-3xl p-6 items-center border border-blue-500/30 shadow-lg">
        <View className="flex-row items-center mb-3">
          <View className="w-3 h-3 bg-white rounded-full mr-2" />
          <Text className="text-white/90 text-sm font-medium">
            Workout Timer
          </Text>
        </View>
        <Text className="text-6xl font-bold text-white mb-2 tracking-wider">
          {getWorkoutDuration(hours, minutes, seconds)}
        </Text>
        <View className="flex-row items-center">
          <View className="bg-white/20 rounded-full px-3 py-1 mr-2">
            <Text className="text-white text-xs font-medium">
              {workoutExercises.length} exercise
              {workoutExercises.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <View className="bg-white/20 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-medium">
              {completedSets} sets done
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
