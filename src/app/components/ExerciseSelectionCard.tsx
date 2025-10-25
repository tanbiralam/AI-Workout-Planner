import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Exercise } from "@/lib/sanity/types";

interface ExerciseSelectionCardProps {
  item: Exercise;
  onPress: () => void;
  showChevron?: boolean;
}

export default function ExerciseSelectionCard({
  item,
  onPress,
  showChevron = true,
}: ExerciseSelectionCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <Text className="text-xs text-gray-500 font-medium">Exercise</Text>
          </View>
          <Text className="text-lg font-bold text-gray-900 mb-1">
            {item.name}
          </Text>
          <Text className="text-sm text-gray-600">
            {item.muscleGroup} • {item.difficulty}
          </Text>
        </View>

        {showChevron && (
          <View className="w-10 h-10 rounded-xl items-center justify-center bg-gray-50 ml-3">
            <Ionicons name="chevron-forward" size={16} color="#6B7280" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
