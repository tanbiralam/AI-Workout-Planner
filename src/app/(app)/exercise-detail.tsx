import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { client, urlFor } from "@/lib/sanity/client";
import { Exercise } from "@/lib/sanity/types";
import { defineQuery } from "groq";
import { getDifficultyColor, getDifficultyText } from "@/lib/utils";
import Markdown from "react-native-markdown-display";

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
        Alert.alert(
          "Error",
          "Failed to load exercise details. Please try again.",
          [
            {
              text: "Retry",
              onPress: () => fetchExercise(),
            },
            {
              text: "Go Back",
              onPress: () => router.back(),
              style: "cancel",
            },
          ]
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  const getAIGuidance = async () => {
    if (!exercise) return;
    setAiLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exerciseName: exercise.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI guidance");
      }

      const data = await response.json();
      setAiGuidance(data.message);
    } catch (error) {
      console.error("Error fetching AI guidance", error);
      setAiGuidance(
        "Sorry, there was an error getting AI guidance. Please try again."
      );
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 bg-blue-500/20 rounded-3xl items-center justify-center mb-6">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
          <Text className="text-white text-lg font-semibold">
            Loading Exercise
          </Text>
          <Text className="text-zinc-500 text-sm mt-2">Please wait...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 bg-zinc-800/70 rounded-3xl items-center justify-center mb-6">
            <Ionicons name="alert-circle-outline" size={40} color="#71717a" />
          </View>
          <Text className="text-white text-xl font-bold mb-2 text-center">
            Exercise Not Found
          </Text>
          <Text className="text-zinc-400 text-center text-sm mb-6">
            The exercise you're looking for doesn't exist or has been removed.
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

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* Header with Close Button */}
      <View className="absolute top-12 left-0 right-0 z-10 px-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-12 h-12 bg-black/30 rounded-full items-center justify-center backdrop-blur-sm"
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="h-80 bg-zinc-900 relative">
          {exercise?.image ? (
            <Image
              source={{ uri: urlFor(exercise.image?.asset?._ref).url() }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center">
              <View className="w-24 h-24 bg-white/20 rounded-3xl items-center justify-center mb-4">
                <Ionicons name="barbell-outline" size={40} color="white" />
              </View>
              <Text className="text-white text-lg font-semibold">
                Exercise Image
              </Text>
            </View>
          )}

          {/* Gradient overlay */}
          <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
        </View>

        {/* Exercise Details */}
        <View className="px-5 py-6">
          {/* Title and difficulty */}
          <View className="flex-row items-start justify-between mb-6">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-bold text-white mb-2 leading-tight">
                {exercise?.name}
              </Text>
            </View>
            <View
              className="px-4 py-2 rounded-full border"
              style={{
                backgroundColor: `${getDifficultyColor(
                  exercise?.difficulty
                )}15`,
                borderColor: `${getDifficultyColor(exercise?.difficulty)}30`,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: getDifficultyColor(exercise?.difficulty) }}
              >
                {exercise?.difficulty?.toUpperCase() || "UNKNOWN"}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-blue-500/20 rounded-xl items-center justify-center mr-3">
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color="#3b82f6"
                />
              </View>
              <Text className="text-xl font-bold text-white">Description</Text>
            </View>
            <View className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/50">
              <Text className="text-zinc-300 leading-6 text-base">
                {exercise?.description ||
                  "No description available for this exercise"}
              </Text>
            </View>
          </View>

          {exercise?.videoUrl && (
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 bg-red-500/20 rounded-xl items-center justify-center mr-3">
                  <Ionicons
                    name="play-circle-outline"
                    size={16}
                    color="#ef4444"
                  />
                </View>
                <Text className="text-xl font-bold text-white">
                  Video Tutorial
                </Text>
              </View>
              <TouchableOpacity
                className="bg-red-600 rounded-2xl p-5 flex-row items-center shadow-lg"
                onPress={() => Linking.openURL(exercise.videoUrl)}
                activeOpacity={0.85}
              >
                <View className="w-14 h-14 bg-white/20 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="play" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg">
                    Watch Tutorial
                  </Text>
                  <Text className="text-red-100 text-sm mt-1">
                    Learn proper form and technique
                  </Text>
                </View>
                <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
                  <Ionicons name="chevron-forward" size={16} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* AI Guidance Section */}
          {(aiGuidance || aiLoading) && (
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 bg-purple-500/20 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="sparkles-outline" size={16} color="#a855f7" />
                </View>
                <Text className="text-xl font-bold text-white">
                  AI Coach Guidance
                </Text>
              </View>

              {aiLoading ? (
                <View className="bg-zinc-900 rounded-2xl p-6 items-center border border-zinc-800/50">
                  <View className="w-12 h-12 bg-blue-500/20 rounded-2xl items-center justify-center mb-4">
                    <ActivityIndicator size="small" color="#3b82f6" />
                  </View>
                  <Text className="text-zinc-300 text-center">
                    Getting personalized guidance...
                  </Text>
                </View>
              ) : (
                <View className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/50">
                  <Markdown
                    style={{
                      body: {
                        paddingBottom: 0,
                      },
                      heading2: {
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#ffffff",
                        marginTop: 12,
                        marginBottom: 6,
                      },
                      heading3: {
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#d1d5db",
                        marginTop: 8,
                        marginBottom: 4,
                      },
                      paragraph: {
                        color: "#d1d5db",
                        fontSize: 14,
                        lineHeight: 20,
                      },
                    }}
                  >
                    {aiGuidance}
                  </Markdown>
                </View>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View className="mt-8 gap-3">
            {/* AI Coach Button */}
            <TouchableOpacity
              className={`rounded-2xl py-5 items-center shadow-lg ${
                aiLoading
                  ? "bg-zinc-700"
                  : aiGuidance
                  ? "bg-green-600"
                  : "bg-blue-600"
              }`}
              onPress={getAIGuidance}
              disabled={aiLoading}
              activeOpacity={0.85}
            >
              {aiLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold text-lg ml-3">
                    Loading...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-white/20 rounded-xl items-center justify-center mr-3">
                    <Ionicons name="sparkles" size={16} color="white" />
                  </View>
                  <Text className="text-white font-bold text-lg">
                    {aiGuidance
                      ? "Refresh AI Guidance"
                      : "Get AI Guidance on Form & Technique"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-zinc-800 rounded-2xl py-5 items-center border border-zinc-700/50"
              onPress={() => router.back()}
              activeOpacity={0.85}
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-zinc-700/50 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="arrow-back" size={16} color="#71717a" />
                </View>
                <Text className="text-zinc-300 font-bold text-lg">Go Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
