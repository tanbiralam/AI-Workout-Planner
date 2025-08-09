import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { client, urlFor } from "@/lib/sanity/client";
import { Exercise } from "@/lib/sanity/types";
import { defineQuery } from "groq";
import { getDifficultyColor, getDifficultyText } from "@/lib/utils";

const singleExerciseQuery = defineQuery(
  `*[_type == "exercise" && _id == $id][0]`
);

export default function ExerciseDetails() {
  const router = useRouter();

  const [exercise, setExercise] = useState<Exercise>(null);
  const [loading, setLoading] = useState(true);
  const [aiGuidance, setAiGuidance] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  useEffect(() => {
    const fetchExercise = async () => {
      if (!id) return;

      try {
        const exerciseData = await client.fetch(singleExerciseQuery, { id });
        setExercise(exerciseData);
      } catch (error) {
        console.error("Error fetching exercise:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  const getAIGuidance = async () => {};

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="text-gray-500">Loading exercise...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Exercise not found: {id}</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header with Close Button */}
      {/* <View className="absolute top-12 left-0 right-0 z-10 px-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-black/20 rounded-full items-center justify-center backdrop-blur-sm"
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View> */}

      {/* <ScrollView className="flex-1" showsVerticalScrollIndicator={false}> */}
      {/* Hero Image */}
      <View className="h-80 bg-white relative">
        {exercise?.image ? (
          <Image
            source={{ uri: urlFor(exercise.image?.asset?._ref).url() }}
            className="w-full h-full"
            resizeMode="contain"
          />
        ) : (
          <View className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
            <Ionicons name="fitness" size={80} color="white" />
          </View>
        )}

        {/* Gradient overlay */}
        <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
      </View>

      {/* Exercise Details */}
      <View className="px-6 py-6">
        {/* Title and difficulty */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1 mr-4">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              {exercise?.name}
            </Text>
          </View>
          <View
            className={`self-start px-4 py-2 rounded-full ${getDifficultyColor(
              exercise?.difficulty
            )}`}
          >
            <Text className="text-sm font-semibold text-white">
              {getDifficultyText(exercise?.difficulty)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-3">
            Description
          </Text>
          <Text className="text-gray-600 leading-6 text-base">
            {exercise?.description ||
              "No Description available for this exercise"}
          </Text>
        </View>

        {exercise?.videoUrl && (
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-3">
              Video Tutorial
            </Text>
            <TouchableOpacity
              className="bg-red-500 rounded-xl p-4 flex-row items-center"
              onPress={() => Linking.openURL(exercise.videoUrl)}
            >
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4">
                <Ionicons name="play" size={20} color="#EF4444" />
              </View>
              <View>
                <Text className="text-white font-semibold text-lg">
                  Watch Tutorial
                </Text>
                <Text className="text-red-100 text-sm">Learn proper form</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* TODO:AI Guidance */}

        {/* ---- */}

        {/* Action Buttons */}
        <View className="mt-8 gap-2">
          {/* AI Coach Button */}
          <TouchableOpacity
            className={` rounded-xl py-4 items-center ${
              aiLoading
                ? "bg-gray-400"
                : aiGuidance
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
            onPress={getAIGuidance}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-bold text-lg ml-2">
                  Loading...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg">
                {aiGuidance
                  ? "Refresh AI Guidance"
                  : "Get AI Guidance on Form & Technique"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-200 rounded-xl py-4 items-center"
            onPress={() => router.back()}
          >
            <Text className="text-gray-800 font-bold text-lg">Close</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/*TODO: </ScrollView> */}
    </SafeAreaView>
  );
}
