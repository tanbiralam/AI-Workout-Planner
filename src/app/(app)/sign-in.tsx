import React from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import GoogleSignIn from "../components/GoogleSignIn";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const heroImage = React.useMemo(
    () => ({
      uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    }),
    []
  );

  const onSignInPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

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
          <View className="flex-1">
            {/* Hero Section with Image Background */}
            <View className="relative h-80">
              <Image
                source={heroImage}
                className="w-full h-full"
                resizeMode="cover"
              />
              <LinearGradient
                colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.95)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />

              {/* Header Content */}
              <View className="absolute inset-x-0 top-8 px-6">
                <View className="flex-row items-center mb-3">
                  <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                    <Ionicons name="barbell" size={22} color="#fff" />
                  </View>
                  <Text className="text-white text-xl font-bold tracking-tight">
                    FitTracker
                  </Text>
                </View>
                <Text className="text-white text-3xl font-bold leading-tight mt-6">
                  Welcome{"\n"}Back
                </Text>
                <Text className="text-zinc-300 text-base mt-3 leading-relaxed">
                  Continue your fitness journey
                </Text>
              </View>
            </View>

            {/* Form Section */}
            <View className="flex-1 px-6 -mt-6">
              <View className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
                <Text className="text-white text-2xl font-bold mb-1">
                  Sign In
                </Text>
                <Text className="text-zinc-400 text-sm mb-6">
                  Enter your credentials to access your account
                </Text>

                <View>
                  <View className="mb-4">
                    <Text className="text-zinc-400 text-sm font-medium mb-2.5">
                      Email Address
                    </Text>
                    <View className="bg-black/40 border border-zinc-800 rounded-xl overflow-hidden">
                      <View className="flex-row items-center px-4 py-3.5">
                        <Ionicons
                          name="mail-outline"
                          size={20}
                          color="#71717a"
                        />
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
                    <View className="flex-row justify-between items-center mb-2.5">
                      <Text className="text-zinc-400 text-sm font-medium">
                        Password
                      </Text>
                      <TouchableOpacity activeOpacity={0.7}>
                        <Text className="text-blue-400 text-sm font-medium">
                          Forgot?
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="bg-black/40 border border-zinc-800 rounded-xl overflow-hidden">
                      <View className="flex-row items-center px-4 py-3.5">
                        <Ionicons
                          name="lock-closed-outline"
                          size={20}
                          color="#71717a"
                        />
                        <TextInput
                          value={password}
                          placeholder="Enter your password"
                          placeholderTextColor="#52525b"
                          onChangeText={setPassword}
                          className="flex-1 ml-3 text-white text-base"
                          editable={!isLoading}
                          secureTextEntry
                          returnKeyType="done"
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={onSignInPress}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  className="mb-5"
                >
                  <LinearGradient
                    colors={
                      isLoading
                        ? ["#27272a", "#18181b"]
                        : ["#3b82f6", "#2563eb"]
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
                        {isLoading ? "Signing in..." : "Sign In"}
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
                    Don't have an account?
                  </Text>
                  <Link href="/sign-up" asChild>
                    <TouchableOpacity activeOpacity={0.7} className="ml-1.5">
                      <Text className="text-blue-400 font-semibold text-sm">
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>

              {/* Footer */}
              <View className="items-center mt-8 mb-6">
                <View className="flex-row items-center mb-3">
                  <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                  <Text className="text-zinc-500 text-xs font-medium">
                    Secure authentication
                  </Text>
                </View>
                <Text className="text-zinc-600 text-xs text-center px-8">
                  Your data is encrypted and protected with industry-standard
                  security
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
