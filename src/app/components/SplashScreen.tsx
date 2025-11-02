import React, { useEffect, useState } from "react";
import { View, Text, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

export default function SplashScreen({
  onFinish,
  duration = 3000,
}: SplashScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      }),
    ]).start();

    // Auto finish after duration
    const timer = setTimeout(onFinish, duration);
    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, progressAnim, onFinish, duration]);

  const progressInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={["#0D0D0D", "#1a1a1a", "#0D0D0D"]}
        locations={[0, 0.5, 1]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: "center",
          }}
        >
          {/* App Icon Container */}
          <View className="w-32 h-32 mb-8">
            <View className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700/50 items-center justify-center shadow-2xl">
              <View className="w-20 h-20 bg-blue-500/15 rounded-2xl items-center justify-center mb-2">
                <Ionicons name="fitness-outline" size={48} color="#3b82f6" />
              </View>
            </View>
          </View>

          {/* App Name */}
          <Text className="text-3xl font-bold text-white mb-2 text-center">
            FitApp
          </Text>

          {/* Tagline */}
          <Text className="text-zinc-400 text-base mb-12 text-center px-8">
            Your Personal Fitness Tracker
          </Text>

          {/* Loading Indicator */}
          <View className="w-64 items-center">
            {/* Progress Bar Background */}
            <View className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
              <Animated.View
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                style={{
                  width: progressInterpolate,
                }}
              />
            </View>

            {/* Loading Text */}
            <Text className="text-zinc-500 text-sm font-medium">
              Loading your fitness journey...
            </Text>
          </View>

          {/* Decorative Elements */}
          <View className="absolute top-16 left-8">
            <View className="w-2 h-2 bg-blue-500/30 rounded-full" />
          </View>
          <View className="absolute top-20 right-12">
            <View className="w-1.5 h-1.5 bg-blue-400/40 rounded-full" />
          </View>
          <View className="absolute bottom-24 left-16">
            <View className="w-1 h-1 bg-blue-300/50 rounded-full" />
          </View>
          <View className="absolute bottom-20 right-8">
            <View className="w-2.5 h-2.5 bg-blue-600/30 rounded-full" />
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
