import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import GoogleSignIn from "../components/GoogleSignIn";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    if (!emailAddress || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    console.log(emailAddress, password);

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!code) {
      Alert.alert("Error", "Please enter verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 px-6 pt-8 pb-10">
              {/* Header */}
              <View className="mb-12">
                <View className="flex-row items-center mb-6">
                  <TouchableOpacity
                    onPress={() => setPendingVerification(false)}
                    className="mr-4"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                  </TouchableOpacity>
                  <View className="flex-row items-center">
                    <View className="w-9 h-9 bg-blue-500 rounded-full items-center justify-center mr-2.5">
                      <Ionicons name="barbell" size={18} color="#fff" />
                    </View>
                    <Text className="text-white text-lg font-bold">
                      FitTracker
                    </Text>
                  </View>
                </View>

                <View className="mb-6">
                  <View className="w-16 h-16 bg-blue-500/20 rounded-2xl items-center justify-center mb-4 border border-blue-500/30">
                    <Ionicons
                      name="mail-open-outline"
                      size={32}
                      color="#60a5fa"
                    />
                  </View>
                  <Text className="text-white text-3xl font-bold mb-3">
                    Check Your Email
                  </Text>
                  <Text className="text-zinc-400 text-base leading-relaxed">
                    We've sent a 6-digit verification code to{" "}
                    <Text className="text-blue-400 font-medium">
                      {emailAddress}
                    </Text>
                  </Text>
                </View>
              </View>

              {/* Verification Form */}
              <View className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 mb-6">
                <View className="mb-6">
                  <Text className="text-zinc-400 text-sm font-medium mb-3">
                    Verification Code
                  </Text>
                  <View className="bg-black/40 border border-zinc-800 rounded-xl overflow-hidden">
                    <View className="flex-row items-center px-4 py-4">
                      <Ionicons
                        name="keypad-outline"
                        size={20}
                        color="#71717a"
                      />
                      <TextInput
                        value={code}
                        placeholder="000000"
                        placeholderTextColor="#52525b"
                        onChangeText={setCode}
                        className="flex-1 ml-3 text-white text-center text-2xl tracking-widest font-bold"
                        keyboardType="number-pad"
                        maxLength={6}
                        editable={!isLoading}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={onVerifyPress}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      isLoading
                        ? ["#27272a", "#18181b"]
                        : ["#10b981", "#059669"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-xl py-4"
                  >
                    <View className="flex-row items-center justify-center">
                      {isLoading ? (
                        <Ionicons
                          name="hourglass-outline"
                          size={20}
                          color="#fff"
                        />
                      ) : (
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={20}
                          color="#fff"
                        />
                      )}
                      <Text className="text-white font-bold text-base ml-2">
                        {isLoading ? "Verifying..." : "Verify Email"}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity className="mt-5" activeOpacity={0.7}>
                  <Text className="text-blue-400 font-medium text-center text-sm">
                    Didn't receive the code? Resend
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Help Text */}
              <View className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
                <View className="flex-row">
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="#71717a"
                  />
                  <Text className="flex-1 text-zinc-500 text-xs leading-relaxed ml-3">
                    Check your spam folder if you don't see the email. The code
                    expires in 10 minutes.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-8 pb-10">
            {/* Header Section */}
            <View className="mb-10">
              <View className="flex-row items-center mb-8">
                <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                  <Ionicons name="barbell" size={22} color="#fff" />
                </View>
                <Text className="text-white text-xl font-bold tracking-tight">
                  FitTracker
                </Text>
              </View>

              <View>
                <View className="flex-row items-center mb-3">
                  <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                  <Text className="text-blue-400 text-xs font-semibold uppercase tracking-widest">
                    Get Started
                  </Text>
                </View>
                <Text className="text-white text-4xl font-bold leading-tight mb-3">
                  Create Your{"\n"}Account
                </Text>
                <Text className="text-zinc-400 text-base leading-relaxed">
                  Join thousands of athletes tracking their fitness journey
                </Text>
              </View>
            </View>

            {/* Benefits Row */}
            <View className="flex-row mb-8">
              <View className="flex-1 mr-2">
                <View className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-4">
                  <View className="w-10 h-10 bg-blue-500/20 rounded-xl items-center justify-center mb-3">
                    <Ionicons name="fitness" size={20} color="#60a5fa" />
                  </View>
                  <Text className="text-white font-semibold text-sm mb-1">
                    Track Progress
                  </Text>
                  <Text className="text-zinc-500 text-xs">
                    Monitor every workout
                  </Text>
                </View>
              </View>
              <View className="flex-1 ml-2">
                <View className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-4">
                  <View className="w-10 h-10 bg-emerald-500/20 rounded-xl items-center justify-center mb-3">
                    <Ionicons name="trending-up" size={20} color="#34d399" />
                  </View>
                  <Text className="text-white font-semibold text-sm mb-1">
                    See Results
                  </Text>
                  <Text className="text-zinc-500 text-xs">
                    Visualize your gains
                  </Text>
                </View>
              </View>
            </View>

            {/* Form Card */}
            <View className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 mb-6">
              <View className="mb-6">
                <Text className="text-zinc-400 text-sm font-medium mb-2.5">
                  Email Address
                </Text>
                <View className="bg-black/40 border border-zinc-800 rounded-xl overflow-hidden">
                  <View className="flex-row items-center px-4 py-3.5">
                    <Ionicons name="mail-outline" size={20} color="#71717a" />
                    <TextInput
                      autoCapitalize="none"
                      value={emailAddress}
                      placeholder="your@email.com"
                      placeholderTextColor="#52525b"
                      onChangeText={setEmailAddress}
                      className="flex-1 ml-3 text-white text-base"
                      editable={!isLoading}
                      keyboardType="email-address"
                      returnKeyType="next"
                    />
                  </View>
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-zinc-400 text-sm font-medium mb-2.5">
                  Password
                </Text>
                <View className="bg-black/40 border border-zinc-800 rounded-xl overflow-hidden mb-2">
                  <View className="flex-row items-center px-4 py-3.5">
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#71717a"
                    />
                    <TextInput
                      value={password}
                      placeholder="Create a strong password"
                      placeholderTextColor="#52525b"
                      onChangeText={setPassword}
                      className="flex-1 ml-3 text-white text-base"
                      editable={!isLoading}
                      secureTextEntry
                      returnKeyType="done"
                    />
                  </View>
                </View>
                <Text className="text-zinc-600 text-xs">
                  Must be at least 8 characters long
                </Text>
              </View>

              <TouchableOpacity
                onPress={onSignUpPress}
                disabled={isLoading}
                activeOpacity={0.8}
                className="mb-5"
              >
                <LinearGradient
                  colors={
                    isLoading ? ["#27272a", "#18181b"] : ["#3b82f6", "#2563eb"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-xl py-4"
                >
                  <View className="flex-row items-center justify-center">
                    {isLoading ? (
                      <Ionicons
                        name="hourglass-outline"
                        size={20}
                        color="#fff"
                      />
                    ) : (
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                    )}
                    <Text className="text-white font-bold text-base ml-2">
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <View className="flex-row items-center mb-5">
                <View className="flex-1 h-px bg-zinc-800" />
                <Text className="px-4 text-zinc-500 text-xs font-medium">
                  OR
                </Text>
                <View className="flex-1 h-px bg-zinc-800" />
              </View>

              <GoogleSignIn />

              <View className="flex-row justify-center items-center mt-6 pt-5 border-t border-zinc-800">
                <Text className="text-zinc-400 text-sm">
                  Already have an account?
                </Text>
                <Link href="/sign-in" asChild>
                  <TouchableOpacity activeOpacity={0.7} className="ml-1.5">
                    <Text className="text-blue-400 font-semibold text-sm">
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Terms */}
            <View className="items-center px-4">
              <Text className="text-zinc-600 text-xs text-center leading-relaxed">
                By creating an account, you agree to our{" "}
                <Text className="text-zinc-500 underline">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="text-zinc-500 underline">Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
