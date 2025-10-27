import Loader from "@/app/components/Loader";
import { useWorkouts } from "@/hooks/useWorkout";
import { formatDuration } from "@/lib/utils";
import { calculateStats } from "@/lib/workoutUtils";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const { workouts, loading, refreshing, fetchWorkouts, setRefreshing } =
    useWorkouts(user?.id);

  const { totalWorkouts, totalDuration, averageDuration } =
    calculateStats(workouts);
  const lastWorkout = workouts[0];

  // Calculate days since joining (using createdAt from Clerk)
  const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date();
  const daysSinceJoining = Math.floor(
    (new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  if (loading) {
    return (
      <Loader
        title="Loading Profile..."
        subtitle="Please wait till we fetched your profile info"
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0D0D0D"
        translucent={false}
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className="text-3xl font-bold text-white leading-tight">
            Profile
          </Text>
          <Text className="text-sm text-zinc-500 mt-1">
            Manage your account and stats
          </Text>
        </View>

        {/* User Info Card */}
        <View className="px-5 mb-5">
          <View className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800/50">
            <View className="flex-row items-center">
              <View className="relative mr-4">
                <Image
                  source={{
                    uri: user.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                  }}
                  style={{ width: 72, height: 72, borderRadius: 36 }}
                />
                <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-zinc-900" />
              </View>

              <View className="flex-1">
                <Text className="text-xl font-bold text-white mb-1">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName || "User"}
                </Text>

                <Text className="text-sm text-zinc-400 mb-2">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </Text>

                <View className="flex-row items-center">
                  <View className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                  <Text className="text-xs text-zinc-500">
                    Member since {formatJoinDate(joinDate)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Fitness Stats */}
        <View className="px-5 mb-5">
          <View className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800/50">
            <Text className="text-base font-bold text-white mb-5">
              Fitness Stats
            </Text>

            {/* Primary Stats Grid */}
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1 bg-zinc-800/70 rounded-2xl p-4">
                <View className="w-9 h-9 bg-blue-500/15 rounded-xl items-center justify-center mb-3">
                  <Ionicons name="fitness" size={18} color="#3b82f6" />
                </View>
                <Text className="text-2xl font-bold text-white mb-1">
                  {totalWorkouts}
                </Text>
                <Text className="text-xs text-zinc-500">Workouts</Text>
              </View>

              <View className="flex-1 bg-zinc-800/70 rounded-2xl p-4">
                <View className="w-9 h-9 bg-green-500/15 rounded-xl items-center justify-center mb-3">
                  <Ionicons name="timer-outline" size={18} color="#22c55e" />
                </View>
                <Text className="text-2xl font-bold text-white mb-1">
                  {formatDuration(totalDuration)}
                </Text>
                <Text className="text-xs text-zinc-500">Total Time</Text>
              </View>

              <View className="flex-1 bg-zinc-800/70 rounded-2xl p-4">
                <View className="w-9 h-9 bg-purple-500/15 rounded-xl items-center justify-center mb-3">
                  <Ionicons name="calendar-outline" size={18} color="#a855f7" />
                </View>
                <Text className="text-2xl font-bold text-white mb-1">
                  {daysSinceJoining}
                </Text>
                <Text className="text-xs text-zinc-500">Days Active</Text>
              </View>
            </View>

            {/* Average Duration */}
            {totalWorkouts > 0 && (
              <View className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700/30">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-orange-500/15 rounded-lg items-center justify-center mr-3">
                      <Ionicons name="trending-up" size={16} color="#f97316" />
                    </View>
                    <Text className="text-sm text-zinc-400">
                      Average Duration
                    </Text>
                  </View>
                  <Text className="text-lg font-bold text-white">
                    {formatDuration(averageDuration)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Account Settings */}
        <View className="px-5 mb-5">
          <Text className="text-base font-bold text-white mb-3">
            Account Settings
          </Text>

          <View className="bg-zinc-900 rounded-2xl border border-zinc-800/50 overflow-hidden">
            {/* Edit Profile */}
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 border-b border-zinc-800/50"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-blue-500/15 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="person-outline" size={20} color="#3b82f6" />
                </View>
                <Text className="text-white font-medium">Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717a" />
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 border-b border-zinc-800/50"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-green-500/15 rounded-xl items-center justify-center mr-3">
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#22c55e"
                  />
                </View>
                <Text className="text-white font-medium">Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717a" />
            </TouchableOpacity>

            {/* Preferences */}
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 border-b border-zinc-800/50"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-purple-500/15 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="settings-outline" size={20} color="#a855f7" />
                </View>
                <Text className="text-white font-medium">Preferences</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717a" />
            </TouchableOpacity>

            {/* Help & Support */}
            <TouchableOpacity
              className="flex-row items-center justify-between p-4"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-orange-500/15 rounded-xl items-center justify-center mr-3">
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color="#f97316"
                  />
                </View>
                <Text className="text-white font-medium">Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717a" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View className="px-5 mb-6">
          <Text className="text-base font-bold text-white mb-3">
            Danger Zone
          </Text>

          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-600/10 rounded-2xl p-4 border border-red-600/30"
            activeOpacity={0.85}
          >
            <View className="flex-row items-center justify-center">
              <View className="w-9 h-9 bg-red-600/20 rounded-xl items-center justify-center mr-3">
                <Ionicons name="log-out-outline" size={20} color="#dc2626" />
              </View>
              <Text className="text-red-500 font-bold text-base">Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
