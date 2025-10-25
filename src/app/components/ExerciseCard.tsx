import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutExercise } from "@/store/workout-store";

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  onPress: () => void;
  onDelete: () => void;
}

export default function ExerciseCard({
  exercise,
  onPress,
  onDelete,
}: ExerciseCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800/50"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <Text className="text-xs text-zinc-500 font-medium">Exercise</Text>
          </View>
          <Text className="text-lg font-bold text-white mb-1">
            {exercise.name}
          </Text>
          <Text className="text-sm text-zinc-400">
            {exercise.sets.length} sets •{" "}
            {exercise.sets.filter((set) => set.isCompleted).length} completed
          </Text>
        </View>

        {/* Delete Exercise Button */}
        <TouchableOpacity
          onPress={onDelete}
          className="w-10 h-10 rounded-xl items-center justify-center bg-red-500/10 border border-red-500/30 ml-3"
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
