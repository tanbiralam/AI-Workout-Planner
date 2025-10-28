import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
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
  const formatLabel = (value: string) =>
    value ? value.replace(/\b\w/g, (char) => char.toUpperCase()) : value;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "#22c55e"; // green
      case "intermediate":
        return "#f59e0b"; // amber
      case "advanced":
        return "#ef4444"; // red
      default:
        return "#71717a"; // zinc
    }
  };

  const getMuscleGroupIcon = (muscleGroup: string) => {
    switch (muscleGroup?.toLowerCase()) {
      case "chest":
        return "body-outline";
      case "back":
        return "body-outline";
      case "shoulders":
        return "body-outline";
      case "arms":
        return "body-outline";
      case "legs":
        return "body-outline";
      case "core":
        return "body-outline";
      default:
        return "barbell-outline";
    }
  };

  const primaryFocus =
    item.muscleGroup || item.bodyParts?.[0] || item.targetMuscles?.[0];
  const assetWithUrl = item.image?.asset as { url?: string } | undefined;
  const thumbnailUri =
    assetWithUrl?.url || item.gifUrl || item.sourceImageUrl || null;
  const equipmentLabel = item.equipments?.[0];

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-zinc-900 rounded-2xl border border-zinc-800/50"
      activeOpacity={0.7}
    >
      <View className="p-5">
        <View className="flex-row items-start">
          {/* Exercise Image */}
          <View className="w-20 h-20 bg-zinc-800/70 rounded-2xl mr-4 overflow-hidden">
            {thumbnailUri ? (
              <Image
                source={{ uri: thumbnailUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Ionicons
                  name={getMuscleGroupIcon(primaryFocus)}
                  size={24}
                  color="#71717a"
                />
              </View>
            )}
          </View>

          {/* Exercise Details */}
          <View className="flex-1">
            {/* Exercise Type Badge */}
            <View className="flex-row items-center mb-2">
              <View className="w-6 h-6 bg-blue-500/20 rounded-lg items-center justify-center mr-2">
                <Ionicons
                  name={getMuscleGroupIcon(primaryFocus)}
                  size={12}
                  color="#3b82f6"
                />
              </View>
              <Text className="text-xs text-zinc-500 font-medium uppercase tracking-wide">
                {formatLabel(primaryFocus) || "Exercise"}
              </Text>
            </View>

            {/* Exercise Name */}
            <Text className="text-lg font-bold text-white mb-2 capitalize leading-tight">
              {item.name}
            </Text>

            {/* Difficulty Badge */}
            {(item.difficulty || equipmentLabel) && (
              <View>
                {item.difficulty && (
                  <View className="flex-row items-center">
                    <View
                      className="px-3 py-1.5 rounded-full border"
                      style={{
                        backgroundColor: `${getDifficultyColor(
                          item.difficulty
                        )}15`,
                        borderColor: `${getDifficultyColor(item.difficulty)}30`,
                      }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: getDifficultyColor(item.difficulty) }}
                      >
                        {item.difficulty}
                      </Text>
                    </View>
                  </View>
                )}

                {equipmentLabel && (
                  <Text className="text-xs text-zinc-500 mt-2">
                    {`Equipment: ${formatLabel(equipmentLabel)}`}
                  </Text>
                )}
              </View>
            )}
          </View>

          {showChevron && (
            <View className="w-10 h-10 bg-zinc-800/70 rounded-xl items-center justify-center ml-3">
              <Ionicons name="chevron-forward" size={16} color="#71717a" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
