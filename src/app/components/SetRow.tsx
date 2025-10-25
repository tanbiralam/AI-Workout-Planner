import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutSet } from "@/store/workout-store";

interface SetRowProps {
  set: WorkoutSet;
  setIndex: number;
  weightUnit: string;
  onUpdateReps: (value: string) => void;
  onUpdateWeight: (value: string) => void;
  onToggleCompletion: () => void;
  onDelete: () => void;
}

export default function SetRow({
  set,
  setIndex,
  weightUnit,
  onUpdateReps,
  onUpdateWeight,
  onToggleCompletion,
  onDelete,
}: SetRowProps) {
  return (
    <View
      className={`py-3 px-3 mb-2 rounded-xl border ${
        set.isCompleted
          ? "bg-green-500/10 border-green-500/30"
          : "bg-zinc-800/70 border-zinc-700/30"
      }`}
    >
      {/* First Row: Set Number, Reps, Weight, Complete Button, Delete Button */}
      <View className="flex-row items-center justify-between">
        <View className="w-8 h-8 bg-zinc-700/50 rounded-full items-center justify-center">
          <Text className="text-zinc-300 font-medium text-sm">
            {setIndex + 1}
          </Text>
        </View>

        {/* Reps Input */}
        <View className="flex-1 mx-2">
          <Text className="text-xs text-zinc-400 mb-1">Reps</Text>
          <TextInput
            value={set.reps}
            onChangeText={onUpdateReps}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor="#71717a"
            className={`border rounded-lg px-3 py-2 text-center text-white ${
              set.isCompleted
                ? "bg-zinc-700/50 border-zinc-600 text-zinc-400"
                : "bg-zinc-800 border-zinc-600"
            }`}
            editable={!set.isCompleted}
          />
        </View>

        {/* Weight Input */}
        <View className="flex-1 mx-2">
          <Text className="text-xs text-zinc-400 mb-1">
            Weight ({weightUnit})
          </Text>
          <TextInput
            value={set.weight}
            onChangeText={onUpdateWeight}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor="#71717a"
            className={`border rounded-lg px-3 py-2 text-center text-white ${
              set.isCompleted
                ? "bg-zinc-700/50 border-zinc-600 text-zinc-400"
                : "bg-zinc-800 border-zinc-600"
            }`}
            editable={!set.isCompleted}
          />
        </View>

        {/* Complete Button */}
        <TouchableOpacity
          onPress={onToggleCompletion}
          className={`w-12 h-12 rounded-xl items-center justify-center mx-1 ${
            set.isCompleted ? "bg-green-500" : "bg-zinc-700/50"
          }`}
          activeOpacity={0.7}
        >
          <Ionicons
            name={set.isCompleted ? "checkmark" : "checkmark-outline"}
            size={20}
            color={set.isCompleted ? "white" : "#71717a"}
          />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={onDelete}
          className="w-12 h-12 rounded-xl items-center justify-center bg-red-500/10 border border-red-500/30 ml-1"
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
