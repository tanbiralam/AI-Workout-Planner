import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { defineQuery } from "groq";
import { client } from "@/lib/sanity/client";
import { Exercise } from "@/lib/sanity/types";
import ExerciseSelectionCard from "@/app/components/ExerciseSelectionCard";
import Loader from "@/app/components/Loader";

export const exercisesQuery = defineQuery(`*[_type == "exercise"] {
  _id,
  name,
  description,
  difficulty,
  muscleGroup,
  image {
    asset-> {
      _id,
      url
    },
    alt
  },
  videoUrl,
  isActive
}`);

export default function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = async () => {
    try {
      setError(null);
      const exercisesData = await client.fetch(exercisesQuery);
      setExercises(exercisesData);
      setFilteredExercises(exercisesData);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      const errorMessage = "Failed to load exercises. Please try again.";
      setError(errorMessage);
      Alert.alert("Error", errorMessage, [
        {
          text: "Retry",
          onPress: () => fetchExercises(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    const filtered = exercises.filter((exercise: Exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <Loader
        title="Loading Exercises..."
        subtitle="Please wait to load the exercises"
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* Header */}
      <View className="px-5 pt-4 pb-6">
        <View className="flex-row items-center mb-3">
          <View className="w-1 h-8 bg-blue-500 rounded-full mr-3" />
          <Text className="text-3xl font-bold text-white">
            Exercise Library
          </Text>
        </View>
        <Text className="text-base text-zinc-400 ml-4 mb-6">
          Discover and master new exercises
        </Text>

        {/* Search Bar */}
        <View className="bg-zinc-900 rounded-2xl border border-zinc-800/50">
          <View className="flex-row items-center px-4 py-4">
            <View className="w-10 h-10 bg-zinc-800/70 rounded-xl items-center justify-center mr-3">
              <Ionicons name="search" size={18} color="#71717a" />
            </View>
            <TextInput
              className="flex-1 text-white text-base"
              placeholder="Search exercises..."
              placeholderTextColor="#71717a"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                className="w-8 h-8 bg-zinc-800/70 rounded-full items-center justify-center ml-2"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={16} color="#71717a" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View className="mb-3">
            <ExerciseSelectionCard
              item={item}
              onPress={() => {
                router.push({
                  pathname: "/exercises/exercise-detail",
                  params: {
                    id: item._id,
                  },
                });
              }}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
            title="Pull to refresh exercises"
            titleColor="#71717a"
          />
        }
        ListEmptyComponent={
          <View className="bg-zinc-900 rounded-3xl p-8 items-center border border-zinc-800/50 mx-5">
            <View className="w-20 h-20 bg-zinc-800/70 rounded-3xl items-center justify-center mb-6">
              <Ionicons
                name={searchQuery ? "search-outline" : "barbell-outline"}
                size={40}
                color="#71717a"
              />
            </View>
            <Text className="text-xl font-bold text-white mb-2 text-center">
              {searchQuery ? "No exercises found" : "No exercises available"}
            </Text>
            <Text className="text-zinc-400 text-center text-sm leading-relaxed">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Exercises will appear here once they're added"}
            </Text>
            {searchQuery && (
              <TouchableOpacity
                onPress={clearSearch}
                className="bg-blue-600 rounded-2xl px-6 py-3 mt-4"
                activeOpacity={0.85}
              >
                <Text className="text-white font-semibold text-sm">
                  Clear Search
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
