import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WorkoutHeaderProps {
  onBack: () => void;
  onEndWorkout: () => void;
  weightUnit: string;
  onWeightUnitChange: (unit: string) => void;
}

export default function WorkoutHeader({
  onBack,
  onEndWorkout,
  weightUnit,
  onWeightUnitChange,
}: WorkoutHeaderProps) {
  return (
    <View className="bg-black px-5 pt-4 pb-6">
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 bg-zinc-800/50 rounded-full items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#71717a" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onEndWorkout}
          className="bg-red-600/10 px-4 py-2 rounded-xl border border-red-600/30 flex-row items-center"
          activeOpacity={0.85}
        >
          <Ionicons name="stop-outline" size={16} color="#ef4444" />
          <Text className="text-red-400 font-medium ml-2">End Workout</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-3xl font-bold text-white leading-tight">
        Active Workout
      </Text>

      <View className="w-12 h-1 bg-blue-500 rounded-full mt-3" />

      {/* Weight Unit Toggle */}
      <View className="mt-4">
        <Text className="text-sm text-zinc-400 mb-2">Weight Unit</Text>
        <View className="flex-row bg-zinc-800/70 rounded-xl p-1 w-32">
          <TouchableOpacity
            onPress={() => onWeightUnitChange("lbs")}
            className={`flex-1 py-2 rounded-lg ${
              weightUnit === "lbs" ? "bg-blue-600" : ""
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-medium text-center ${
                weightUnit === "lbs" ? "text-white" : "text-zinc-400"
              }`}
            >
              lbs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onWeightUnitChange("kg")}
            className={`flex-1 py-2 rounded-lg ${
              weightUnit === "kg" ? "bg-blue-600" : ""
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-medium text-center ${
                weightUnit === "kg" ? "text-white" : "text-zinc-400"
              }`}
            >
              kg
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
