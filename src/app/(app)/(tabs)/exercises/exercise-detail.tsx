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
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { client, urlFor } from "@/lib/sanity/client";
import { Exercise } from "@/lib/sanity/types";
import { defineQuery } from "groq";
import { getDifficultyColor } from "@/lib/utils";
import Loader from "@/app/components/Loader";

const singleExerciseQuery = defineQuery(
  `*[_type == "exercise" && _id == $id][0]`
);

export default function ExerciseDetails() {
  const router = useRouter();

  const [exercise, setExercise] = useState<Exercise>(null);
  const [loading, setLoading] = useState(true);

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

  const heroImageUri = useMemo(() => {
    if (!exercise) return null;
    if (exercise.gifUrl) return exercise.gifUrl;
    if (exercise.sourceImageUrl) return exercise.sourceImageUrl;

    const assetRef = exercise.image?.asset?._ref;
    if (assetRef) {
      try {
        return urlFor(assetRef).url();
      } catch (error) {
        console.warn("Failed to build image URL", error);
        return null;
      }
    }
    return null;
  }, [exercise]);

  const primaryBodyPart = exercise?.bodyParts?.[0] ?? exercise?.muscleGroup;
  const equipmentList = exercise?.equipments ?? [];
  const targetMuscles = exercise?.targetMuscles ?? [];
  const secondaryMuscles = exercise?.secondaryMuscles ?? [];
  const instructions = exercise?.instructions ?? [];

  if (loading) {
    return (
      <Loader
        title="Loading Exercise Details"
        subtitle="Hold on for a few seconds"
      />
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
        {/* Exercise Details */}
        <View className="px-5 pt-20 pb-6">
          {/* Title and difficulty */}
          <View className="flex-row items-start justify-between mb-6">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-bold capitalize text-white mb-2 leading-tight">
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
                  "No description available. Check back later for detailed guidance."}
              </Text>
            </View>
          </View>

          {(primaryBodyPart ||
            targetMuscles.length > 0 ||
            secondaryMuscles.length > 0 ||
            equipmentList.length > 0) && (
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 bg-green-500/20 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="barbell-outline" size={16} color="#22c55e" />
                </View>
                <Text className="text-xl font-bold text-white">
                  Movement Focus
                </Text>
              </View>

              <View className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/50">
                {primaryBodyPart && (
                  <View className="flex-row items-start mb-4">
                    <View className="w-10 h-10 bg-zinc-800/70 rounded-xl items-center justify-center mr-3">
                      <Ionicons name="body-outline" size={18} color="#38bdf8" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-zinc-400 uppercase font-semibold tracking-wide">
                        Primary Body Part
                      </Text>
                      <Text className="text-base text-white mt-1 capitalize">
                        {primaryBodyPart}
                      </Text>
                    </View>
                  </View>
                )}

                {targetMuscles.length > 0 && (
                  <View className="flex-row items-start mb-4">
                    <View className="w-10 h-10 bg-zinc-800/70 rounded-xl items-center justify-center mr-3">
                      <Ionicons
                        name="flash-outline"
                        size={18}
                        color="#facc15"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-zinc-400 uppercase font-semibold tracking-wide">
                        Target Muscles
                      </Text>
                      <Text className="text-base text-white mt-1">
                        {targetMuscles.join(", ")}
                      </Text>
                    </View>
                  </View>
                )}

                {secondaryMuscles.length > 0 && (
                  <View className="flex-row items-start mb-4">
                    <View className="w-10 h-10 bg-zinc-800/70 rounded-xl items-center justify-center mr-3">
                      <Ionicons
                        name="radio-outline"
                        size={18}
                        color="#a855f7"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-zinc-400 uppercase font-semibold tracking-wide">
                        Secondary Muscles
                      </Text>
                      <Text className="text-base text-white mt-1">
                        {secondaryMuscles.join(", ")}
                      </Text>
                    </View>
                  </View>
                )}

                {equipmentList.length > 0 && (
                  <View className="flex-row items-start">
                    <View className="w-10 h-10 bg-zinc-800/70 rounded-xl items-center justify-center mr-3">
                      <Ionicons
                        name="construct-outline"
                        size={18}
                        color="#3b82f6"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-zinc-400 uppercase font-semibold tracking-wide">
                        Equipment Needed
                      </Text>
                      <Text className="text-base text-white mt-1 capitalize">
                        {equipmentList.join(", ")}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {instructions.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 bg-purple-500/20 rounded-xl items-center justify-center mr-3">
                  <Ionicons
                    name="list-circle-outline"
                    size={16}
                    color="#a855f7"
                  />
                </View>
                <Text className="text-xl font-bold text-white">
                  Step-by-step Instructions
                </Text>
              </View>

              <View className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/50">
                {instructions.map((step, index) => {
                  const stepNumberMatch = step.match(/Step:?(\d+)/i);
                  const parsedNumber =
                    stepNumberMatch?.[1] ?? String(index + 1);
                  const cleanedText = step.replace(/^Step:?\d+\s*/i, "").trim();

                  return (
                    <View
                      key={`${parsedNumber}-${index}`}
                      className={`flex-row items-start ${
                        index !== instructions.length - 1 ? "mb-4" : ""
                      }`}
                    >
                      <View className="w-9 h-9 rounded-xl bg-white/10 items-center justify-center mr-3 border border-white/20">
                        <Text className="text-white font-semibold">
                          {parsedNumber}
                        </Text>
                      </View>
                      <Text className="flex-1 text-zinc-300 leading-6 text-base">
                        {cleanedText.length > 0 ? cleanedText : step}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Animated Preview */}
          <View className="mb-6">
            <View className="rounded-3xl overflow-hidden border border-zinc-800/50">
              <View className="h-80 bg-zinc-900 relative">
                {heroImageUri ? (
                  <Image
                    source={{ uri: heroImageUri }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                ) : (
                  <View className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center">
                    <View className="w-24 h-24 bg-white/20 rounded-3xl items-center justify-center mb-4">
                      <Ionicons
                        name="barbell-outline"
                        size={40}
                        color="white"
                      />
                    </View>
                    <Text className="text-white text-lg font-semibold">
                      Exercise Image
                    </Text>
                  </View>
                )}

                {/* Gradient overlay */}
                <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {/* <View className="mt-8 gap-3">
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
          </View> */}
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
