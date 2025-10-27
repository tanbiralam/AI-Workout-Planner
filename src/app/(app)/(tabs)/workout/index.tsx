import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

function Workout() {
  const router = useRouter();

  const startWorkout = () => {
    router.push("workout/active-workout");
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Hero Image with Gradient Overlay */}
      <ImageBackground
        source={{
          uri: "https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        }}
        style={styles.heroImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0.85)", "#000000"]}
          style={styles.gradient}
        >
          <SafeAreaView className="flex-1" edges={["top"]}>
            {/* Header */}
            <View className="px-5 pt-8 pb-12">
              <View className="flex-row items-center mb-3">
                <View className="w-1 h-8 bg-blue-500 rounded-full mr-3" />
                <Text className="text-4xl font-bold text-white">
                  Ready to Train?
                </Text>
              </View>
              <Text className="text-base text-zinc-400 ml-4">
                Push your limits today
              </Text>
            </View>

            {/* Spacer */}
            <View className="flex-1" />

            {/* Bottom Card */}
            <View className="px-5 pb-8">
              <View className="bg-zinc-900/95 rounded-3xl p-6 border border-zinc-800/50 backdrop-blur">
                {/* Status Badge */}
                <View className="flex-row items-center justify-between mb-5">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-blue-500/20 rounded-2xl items-center justify-center mr-3">
                      <Ionicons name="fitness" size={24} color="#3b82f6" />
                    </View>
                    <View>
                      <Text className="text-xl font-bold text-white">
                        Workout Session
                      </Text>
                      <Text className="text-sm text-zinc-400">
                        Track your progress
                      </Text>
                    </View>
                  </View>
                  <View className="bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/30">
                    <Text className="text-green-400 font-semibold text-xs">
                      READY
                    </Text>
                  </View>
                </View>

                {/* Quick Stats */}
                <View className="flex-row gap-3 mb-5">
                  <View className="flex-1 bg-zinc-800/50 rounded-2xl p-3 border border-zinc-700/30">
                    <Ionicons name="time-outline" size={18} color="#3b82f6" />
                    <Text className="text-white font-bold text-base mt-2">
                      Track Time
                    </Text>
                    <Text className="text-zinc-500 text-xs mt-0.5">
                      Duration
                    </Text>
                  </View>
                  <View className="flex-1 bg-zinc-800/50 rounded-2xl p-3 border border-zinc-700/30">
                    <Ionicons
                      name="barbell-outline"
                      size={18}
                      color="#22c55e"
                    />
                    <Text className="text-white font-bold text-base mt-2">
                      Log Sets
                    </Text>
                    <Text className="text-zinc-500 text-xs mt-0.5">
                      Exercises
                    </Text>
                  </View>
                  <View className="flex-1 bg-zinc-800/50 rounded-2xl p-3 border border-zinc-700/30">
                    <Ionicons name="trending-up" size={18} color="#a855f7" />
                    <Text className="text-white font-bold text-base mt-2">
                      Progress
                    </Text>
                    <Text className="text-zinc-500 text-xs mt-0.5">
                      Analytics
                    </Text>
                  </View>
                </View>

                {/* Start Button */}
                <TouchableOpacity
                  onPress={startWorkout}
                  className="bg-blue-600 rounded-2xl py-5 items-center shadow-lg"
                  activeOpacity={0.85}
                  style={styles.startButton}
                >
                  <View className="flex-row items-center">
                    <View className="w-9 h-9 bg-white/20 rounded-full items-center justify-center mr-3">
                      <Ionicons name="play" size={18} color="white" />
                    </View>
                    <Text className="text-white font-bold text-lg">
                      Start Workout
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    flex: 1,
    width: "100%",
  },
  gradient: {
    flex: 1,
  },
  startButton: {
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default Workout;
