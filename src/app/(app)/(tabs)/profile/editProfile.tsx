import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalFirstName, setOriginalFirstName] = useState("");
  const [originalLastName, setOriginalLastName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user && isLoaded) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setOriginalFirstName(user.firstName || "");
      setOriginalLastName(user.lastName || "");
      setProfileImageUrl(
        user?.imageUrl || user?.externalAccounts?.[0]?.imageUrl || ""
      );
    }
  }, [user, isLoaded]);

  useEffect(() => {
    if (originalFirstName !== firstName || originalLastName !== lastName) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [firstName, lastName, originalFirstName, originalLastName]);

  const handleSave = async () => {
    if (!isLoaded || !user) return;

    setIsUpdating(true);
    try {
      // Update user profile information
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Update local state to reflect the saved changes
      setOriginalFirstName(firstName.trim());
      setOriginalLastName(lastName.trim());

      Alert.alert("Success", "Profile updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        "Discard Changes",
        "You have unsaved changes. Are you sure you want to discard them?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleImageUpload = async () => {
    try {
      // Request permission to access media library
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access media library is required to upload images.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
            },
          ]
        );
        return;
      }

      // Launch image picker with correct media type
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await uploadImageToClerk(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleCameraUpload = async () => {
    try {
      // Request permission to access camera
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access camera is required to take photos.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => ImagePicker.requestCameraPermissionsAsync(),
            },
          ]
        );
        return;
      }

      // Launch camera with correct media type
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await uploadImageToClerk(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const uploadImageToClerk = async (imageUri: string) => {
    setIsUploadingImage(true);
    try {
      // For Clerk profile image updates, we need to use the setProfileImage method
      // This is the recommended approach for Clerk SDK v2.14+

      try {
        // Try to use the setProfileImage method if available in this Clerk version
        if (user?.setProfileImage) {
          // Convert the image URI to a format Clerk expects
          const response = await fetch(imageUri);
          const blob = await response.blob();

          // Use Clerk's setProfileImage method
          await user.setProfileImage({ file: blob });

          // Update local state to reflect the change immediately
          setProfileImageUrl(imageUri);

          Alert.alert("Success", "Profile picture updated successfully!", [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]);
        } else {
          // Fallback for older Clerk versions
          throw new Error("setProfileImage method not available");
        }
      } catch (profileImageError) {
        console.log(
          "Clerk setProfileImage not available, trying alternative approach..."
        );

        // Alternative approach: Update using unsafeMetadata to store image URL
        // This is a fallback for demo purposes - in production, you'd want to use Clerk's proper image upload
        Alert.alert(
          "Profile Picture Update",
          "Image selected successfully! In a production environment, this would upload to secure storage and update your profile picture.",
          [
            {
              text: "Update Locally",
              onPress: () => {
                // Update local state to show the change (for demo purposes)
                setProfileImageUrl(imageUri);
                Alert.alert(
                  "Success",
                  "Profile picture updated locally! (Note: This is for demonstration - production would use secure storage)",
                  [
                    {
                      text: "OK",
                      onPress: () => router.back(),
                    },
                  ]
                );
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error processing image upload:", error);
      Alert.alert("Error", "Failed to process image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      {
        text: "Camera",
        onPress: handleCameraUpload,
      },
      {
        text: "Photo Library",
        onPress: handleImageUpload,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0D0D0D"
          translucent={false}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-white mt-4">Loading...</Text>
        </View>
      </SafeAreaView>
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
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={handleCancel}
              className="w-10 h-10 bg-zinc-800 rounded-xl items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#a1a1aa" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-white">Edit Profile</Text>

            <TouchableOpacity
              onPress={handleSave}
              disabled={!hasChanges || isUpdating}
              className={`w-16 h-10 rounded-xl items-center justify-center ${
                hasChanges && !isUpdating ? "bg-blue-600" : "bg-zinc-700"
              }`}
              activeOpacity={hasChanges ? 0.8 : 1}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text
                  className={`font-semibold ${
                    hasChanges ? "text-white" : "text-zinc-400"
                  }`}
                >
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Picture Section */}
        <View className="px-5 mb-10">
          <View className="bg-zinc-900 rounded-3xl p-7 border border-zinc-800/50">
            <Text className="text-lg font-bold text-white mb-6">
              Profile Picture
            </Text>

            <View className="items-center">
              {/* Image + Camera Button */}
              <View className="relative">
                <Image
                  source={{
                    uri:
                      profileImageUrl ||
                      user?.externalAccounts?.[0]?.imageUrl ||
                      "",
                  }}
                  style={{ width: 120, height: 120, borderRadius: 60 }}
                />

                <TouchableOpacity
                  onPress={showImagePickerOptions}
                  className="absolute -bottom-3 -right-3 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg border border-zinc-900"
                  activeOpacity={0.8}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="camera" size={22} color="white" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Buttons & Labels */}
              <View className="mt-6 space-y-3 items-center">
                <TouchableOpacity
                  onPress={showImagePickerOptions}
                  className="bg-zinc-800 rounded-2xl px-6 py-3.5 w-48"
                  activeOpacity={0.7}
                  disabled={isUploadingImage}
                >
                  <Text className="text-blue-400 font-semibold text-center">
                    Change Photo
                  </Text>
                </TouchableOpacity>

                <Text className="text-zinc-500 text-xs text-center px-6">
                  Tap the camera icon or choose from your photo library
                </Text>

                <Text className="text-zinc-600 text-xs text-center px-8 leading-5">
                  A clear photo helps personalize your profile.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Personal Information */}

        <View className="px-5 mb-10">
          <View className="bg-zinc-900 rounded-3xl p-7 border border-zinc-800/50">
            <Text className="text-lg font-bold text-white mb-6">
              Personal Information
            </Text>

            <View className="space-y-6">
              {/* First Name */}
              <View>
                <Text className="text-zinc-400 text-sm font-medium mb-2 ml-1">
                  First Name
                </Text>
                <View className="bg-black/40 border border-zinc-800 rounded-xl">
                  <View className="flex-row items-center px-5 py-4">
                    <Ionicons name="person-outline" size={22} color="#71717a" />
                    <TextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="Enter your first name"
                      placeholderTextColor="#52525b"
                      className="flex-1 ml-4 text-white text-base"
                      editable={!isUpdating}
                    />
                  </View>
                </View>
              </View>

              {/* Last Name */}
              <View>
                <Text className="text-zinc-400 text-sm font-medium mb-2 ml-1">
                  Last Name
                </Text>
                <View className="bg-black/40 border border-zinc-800 rounded-xl">
                  <View className="flex-row items-center px-5 py-4">
                    <Ionicons name="person-outline" size={22} color="#71717a" />
                    <TextInput
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="Enter your last name"
                      placeholderTextColor="#52525b"
                      className="flex-1 ml-4 text-white text-base"
                      editable={!isUpdating}
                    />
                  </View>
                </View>
              </View>

              {/* Email (Read-only) */}
              <View>
                <Text className="text-zinc-400 text-sm font-medium mb-2 ml-1">
                  Email
                </Text>
                <View className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl">
                  <View className="flex-row items-center px-5 py-4">
                    <Ionicons name="mail-outline" size={22} color="#71717a" />
                    <Text className="flex-1 ml-4 text-zinc-400 text-base">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </Text>
                  </View>
                </View>

                <Text className="text-zinc-600 text-xs mt-2 ml-1">
                  Email cannot be changed here. Contact support if needed.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Information */}

        <View className="px-5 mb-10">
          <View className="bg-zinc-900 rounded-3xl p-7 border border-zinc-800/50">
            <Text className="text-lg font-bold text-white mb-6">
              Account Information
            </Text>

            <View className="space-y-6">
              {/* Member Since */}
              <View className="flex-row items-center justify-between pb-1">
                <View className="flex-row items-center">
                  <View className="w-11 h-11 bg-blue-500/15 rounded-xl items-center justify-center mr-4">
                    <Ionicons
                      name="calendar-outline"
                      size={22}
                      color="#3b82f6"
                    />
                  </View>
                  <View>
                    <Text className="text-white font-medium">Member Since</Text>
                    <Text className="text-zinc-400 text-sm">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* User ID */}
              <View className="flex-row items-center justify-between pb-1">
                <View className="flex-row items-center">
                  <View className="w-11 h-11 bg-purple-500/15 rounded-xl items-center justify-center mr-4">
                    <Ionicons
                      name="id-card-outline"
                      size={22}
                      color="#a855f7"
                    />
                  </View>
                  <View>
                    <Text className="text-white font-medium">User ID</Text>
                    <Text className="text-zinc-400 text-sm font-mono">
                      {user?.id?.slice(0, 20)}...
                    </Text>
                  </View>
                </View>
              </View>

              {/* Account Status */}
              <View className="flex-row items-center justify-between pb-1">
                <View className="flex-row items-center">
                  <View className="w-11 h-11 bg-green-500/15 rounded-xl items-center justify-center mr-4">
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={22}
                      color="#22c55e"
                    />
                  </View>
                  <View>
                    <Text className="text-white font-medium">
                      Account Status
                    </Text>
                    <Text className="text-green-400 text-sm">
                      {user?.primaryEmailAddressId ? "Verified" : "Unverified"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Help Section */}
        <View className="px-5 mb-8">
          <View className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800/50">
            <Text className="text-lg font-bold text-white mb-4">
              Need Help?
            </Text>

            <View className="space-y-4">
              <TouchableOpacity
                className="flex-row items-center justify-between p-3 bg-zinc-800/50 rounded-xl"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-orange-500/15 rounded-lg items-center justify-center mr-3">
                    <Ionicons name="key-outline" size={16} color="#f97316" />
                  </View>
                  <Text className="text-white font-medium">
                    Change Password
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#71717a" />
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-between p-3 bg-zinc-800/50 rounded-xl"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-red-500/15 rounded-lg items-center justify-center mr-3">
                    <Ionicons
                      name="alert-circle-outline"
                      size={16}
                      color="#dc2626"
                    />
                  </View>
                  <Text className="text-white font-medium">Delete Account</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#71717a" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
