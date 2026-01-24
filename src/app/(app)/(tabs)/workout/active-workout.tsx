import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { useWorkoutStore, WorkoutSet } from "store/workout-store";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ExerciseSelectionModal from "@/app/components/ExerciseSelectionModal";
import ExerciseCard from "@/app/components/ExerciseCard";
import SetRow from "@/app/components/SetRow";
import WorkoutHeader from "@/app/components/WorkoutHeader";
import TimerDisplay from "@/app/components/TimerDisplay";
import { defineQuery } from "groq";
import { client, adminClient } from "@/lib/sanity/client";
import { useUser } from "@clerk/clerk-expo";
import { WorkoutData } from "@/app/api/save-workout+api";
import { getWorkoutDuration } from "@/lib/workoutUtils";

// Query to find exercise by name
const findExerciseQuery = defineQuery(`
  *[_type == "exercise" && name == $name][0] {
    _id,
    name
  }
`);

export default function ActiveWorkout() {
  const router = useRouter();
  const { user } = useUser();
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    workoutExercises,
    setWorkoutExercises,
    resetWorkout,
    weightUnit,
    setWeightUnit,
  } = useWorkoutStore();

  // Use the stopwatch hook for timing with offset based on workout start time
  const { seconds, minutes, hours, totalSeconds, reset } = useStopwatch({
    autoStart: true,
  });

  // Reset timer when screen is focused and no active workout (fresh start)
  useFocusEffect(
    React.useCallback(() => {
      // Only reset if we have no exercises (indicates a fresh start after ending workout)
      if (workoutExercises.length === 0) {
        reset();
      }
    }, [workoutExercises.length, reset])
  );

  const cancelWorkout = () => {
    Alert.alert(
      "Cancel Workout",
      "Are you sure you want to cancel the workout?",
      [
        { text: "No", style: "cancel" },
        {
          text: "End Workout",
          onPress: () => {
            resetWorkout();
            router.back();
          },
        },
      ]
    );
  };

  const addExercise = () => {
    setShowExerciseSelection(true);
  };

  const deleteExercise = (exerciseId: string) => {
    setWorkoutExercises((exercises) =>
      exercises.filter((exercise) => exercise.id !== exerciseId)
    );
  };

  const addNewSet = (exerciseId: string) => {
    const newSet: WorkoutSet = {
      id: Math.random().toString(),
      reps: "",
      weight: "",
      weightUnit: weightUnit,
      isCompleted: false,
    };
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise
      )
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: "reps" | "weight",
    value: string
  ) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      )
    );
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            }
          : exercise
      )
    );
  };

  const toggleSetCompletion = (exerciseId: string, setId: string) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId
                  ? { ...set, isCompleted: !set.isCompleted }
                  : set
              ),
            }
          : exercise
      )
    );
  };

  const saveWorkout = () => {
    // Ask the user to confirm workout completion
    Alert.alert(
      "Complete Workout",
      "Are you sure you want to complete the workout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Complete", onPress: async () => await endWorkout() },
      ]
    );
  };

  const endWorkout = async () => {
    const saved = await saveWorkoutToDatabase();

    if (saved) {
      Alert.alert("Workout Saved", "Your workout has been saved successfully!");

      // Reset the workout
      resetWorkout();

      router.replace("/(app)/(tabs)/history?refresh=true");
    }
  };

  const saveWorkoutToDatabase = async () => {
    //Check if already saving to prevent multiple attempts
    if (isSaving) return false;

    setIsSaving(true);

    try {
      //implement saving
      // Use stopwatch total seconds for duration
      const durationInSeconds = totalSeconds;

      // Transform exercises data to match Sanity schema
      const exercisesForSanity = await Promise.all(
        workoutExercises.map(async (exercise) => {
          // Find the exercise document in Sanity by name
          const exerciseDoc = await client.fetch(findExerciseQuery, {
            name: exercise.name,
          });

          if (!exerciseDoc) {
            throw new Error(
              `Exercise "${exercise.name}" not found in database`
            );
          }

          // Transform sets to match schema (only completed sets, convert to numbers)
          const setsForSanity = exercise.sets
            .filter((set) => set.isCompleted && set.reps && set.weight)
            .map((set) => ({
              _type: "set",
              _key: Math.random().toString(36).substr(2, 9),
              reps: parseInt(set.reps, 10) || 0,
              weight: parseFloat(set.weight) || 0,
              weightUnit: set.weightUnit,
            }));

          return {
            _type: "exerciseSet", // TODO:workoutExercise, exerciseSet
            _key: Math.random().toString(36).substr(2, 9),
            exercise: {
              _type: "reference",
              _ref: exerciseDoc._id,
            },
            sets: setsForSanity,
          };
        })
      );

      //Filter out exercises with no completed sets
      const validExercises = exercisesForSanity.filter(
        (exercise) => exercise.sets.length > 0
      );

      if (validExercises.length === 0) {
        Alert.alert(
          "No Completed Sets",
          "Please complete at least one set before saving the workout."
        );
        return false;
      }

      // Create the workout document
      const workoutData: WorkoutData = {
        _type: "workout",
        userId: user.id,
        date: new Date().toISOString(),
        duration: durationInSeconds,
        exercises: validExercises,
      };

      // Save to Sanity directly using admin client
      const result = await adminClient.create(workoutData);

      console.log("Workout saved successfully:", result);

      return true;
    } catch (error) {
      console.error("Error saving workout:", error);
      Alert.alert("Save Failed", "Failed to save workout. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-black"
      style={{
        paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* Header */}
      <WorkoutHeader
        onBack={() => router.back()}
        onEndWorkout={cancelWorkout}
        weightUnit={weightUnit}
        onWeightUnitChange={setWeightUnit}
      />

      {/* Enhanced Timer Display */}
      <TimerDisplay
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        workoutExercises={workoutExercises}
      />
      {/* Content Area */}
      <View className="flex-1 bg-black">
        {/* If no exercises, show a message */}
        {workoutExercises.length === 0 && (
          <View className="bg-zinc-900 rounded-3xl p-8 items-center mx-5 border border-zinc-800/50">
            <View className="w-20 h-20 bg-blue-500/15 rounded-3xl items-center justify-center mb-5">
              <Ionicons name="barbell-outline" size={40} color="#3b82f6" />
            </View>
            <Text className="text-2xl font-bold text-white mb-2 text-center">
              No Exercises Yet
            </Text>
            <Text className="text-zinc-400 text-center mb-6 text-sm leading-relaxed px-2">
              Get started by adding your first exercise below
            </Text>
          </View>
        )}

        {/* All Exercises - Vertical List */}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 px-5 mt-4"
            showsVerticalScrollIndicator={false}
          >
            {workoutExercises.map((exercise) => (
              <View key={exercise.id} className="mb-6">
                {/* Exercise Header */}
                <ExerciseCard
                  exercise={exercise}
                  onPress={() =>
                    router.push({
                      pathname: "/exercise-detail",
                      params: {
                        id: exercise.sanityId,
                      },
                    })
                  }
                  onDelete={() => deleteExercise(exercise.id)}
                />

                {/* Exercise Sets */}
                <View className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800/50 mb-3">
                  <Text className="text-base font-bold text-white mb-3">
                    Sets
                  </Text>
                  {exercise.sets.length === 0 ? (
                    <Text className="text-zinc-400 text-center py-4 text-sm">
                      No sets yet. Add your first set below.
                    </Text>
                  ) : (
                    exercise.sets.map((set, setIndex) => (
                      <SetRow
                        key={set.id}
                        set={set}
                        setIndex={setIndex}
                        weightUnit={weightUnit}
                        onUpdateReps={(value) =>
                          updateSet(exercise.id, set.id, "reps", value)
                        }
                        onUpdateWeight={(value) =>
                          updateSet(exercise.id, set.id, "weight", value)
                        }
                        onToggleCompletion={() =>
                          toggleSetCompletion(exercise.id, set.id)
                        }
                        onDelete={() => deleteSet(exercise.id, set.id)}
                      />
                    ))
                  )}

                  {/* Add New Set Button */}
                  <TouchableOpacity
                    onPress={() => addNewSet(exercise.id)}
                    className="bg-blue-500/10 border-2 border-dashed border-blue-500/30 rounded-xl py-3 items-center mt-2"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center">
                      <Ionicons
                        name="add"
                        size={16}
                        color="#3b82f6"
                        style={{ marginRight: 6 }}
                      />
                      <Text className="text-blue-400 font-medium">Add Set</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Add Exercise Button */}
            <TouchableOpacity
              onPress={addExercise}
              className="bg-blue-600 rounded-2xl py-4 items-center mb-6"
              activeOpacity={0.85}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="add"
                  size={20}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white font-bold text-lg">
                  Add Exercise
                </Text>
              </View>
            </TouchableOpacity>

            {/* Complete Workout Button */}
            <TouchableOpacity
              onPress={saveWorkout}
              className={`rounded-2xl py-4 items-center mb-8 ${
                isSaving ||
                workoutExercises.length === 0 ||
                workoutExercises.some((exercise) =>
                  exercise.sets.some((set) => !set.isCompleted)
                )
                  ? "bg-zinc-700"
                  : "bg-green-600"
              }`}
              disabled={
                isSaving ||
                workoutExercises.length === 0 ||
                workoutExercises.some((exercise) =>
                  exercise.sets.some((set) => !set.isCompleted)
                )
              }
              activeOpacity={0.85}
            >
              {isSaving ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Saving...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-white font-bold text-lg">
                    Complete Workout
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Bottom Spacing */}
            <View className="h-6" />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* Exercise Selection Modal */}
      <ExerciseSelectionModal
        visible={showExerciseSelection}
        onClose={() => setShowExerciseSelection(false)}
      />
    </SafeAreaView>
  );
}
