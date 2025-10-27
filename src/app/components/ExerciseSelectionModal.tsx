import {
  View,
  Text,
  Modal,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useWorkoutStore } from "store/workout-store";
import { Exercise } from "@/lib/sanity/types";
import { client } from "@/lib/sanity/client";
import { exercisesQuery } from "../(app)/(tabs)/exercises";
import ExerciseSelectionCard from "./ExerciseSelectionCard";

interface ExerciseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ExerciseSelectionModal({
  visible,
  onClose,
}: ExerciseSelectionModalProps) {
  const { addExerciseToWorkout } = useWorkoutStore();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchExercises();
    }
  }, [visible]);

  useEffect(() => {
    const filtered = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);

  const fetchExercises = async () => {
    try {
      const data = await client.fetch(exercisesQuery);
      setExercises(data);
      setFilteredExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const handleExercisePress = (exercise: Exercise) => {
    addExerciseToWorkout({ name: exercise.name, sanityId: exercise._id });
    onClose();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black">
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        {/* Header */}
        <View className="px-5 pt-4 pb-5 border-b border-zinc-800/70 bg-zinc-950">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-white">Add Exercise</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-9 h-9 rounded-2xl bg-zinc-900 items-center justify-center border border-zinc-800/50"
            >
              <Ionicons name="close" size={22} color="#a1a1aa" />
            </TouchableOpacity>
          </View>

          <Text className="text-zinc-400 text-sm mt-3">
            Tap any exercise to add it to your workout
          </Text>
        </View>

        {/* Search Bar */}
        <View className="mx-5 mt-4 mb-2 flex-row items-center bg-zinc-900 rounded-2xl border border-zinc-800/50 px-4 py-3">
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-3 text-white"
            placeholder="Search exercises..."
            placeholderTextColor="#71717a"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#71717a" />
            </TouchableOpacity>
          )}
        </View>

        {/* Exercise List */}
        <FlatList
          data={filteredExercises}
          renderItem={({ item }) => (
            <View className="mb-3">
              <ExerciseSelectionCard
                item={item}
                onPress={() => handleExercisePress(item)}
                showChevron={false}
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: 40,
            paddingHorizontal: 16,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <View className="w-20 h-20 bg-blue-500/10 rounded-3xl items-center justify-center mb-5">
                <Ionicons name="barbell-outline" size={40} color="#3b82f6" />
              </View>
              <Text className="text-lg font-semibold text-white">
                {searchQuery ? "No exercises found" : "Loading exercises..."}
              </Text>
              <Text className="text-sm text-zinc-500 mt-2 text-center">
                {searchQuery
                  ? "Try a different name or category"
                  : "Please wait a moment"}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}
