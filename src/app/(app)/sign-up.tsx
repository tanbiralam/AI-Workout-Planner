import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    console.log(emailAddress, password);

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          {/* Main */}
          <View className="flex-1 justify-center">
            {/* Logo Branding */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
                <Ionicons name="fitness-sharp" size={40} color="white" />
              </View>

              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Join FitTracker
              </Text>
              <Text className="text-lg text-gray-600 text-center">
                Start your fitness journey{"\n"} and achive your goals
              </Text>
            </View>

            {/**Sign Up Form */}

            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Create Your Account
              </Text>

              {/* Email Input */}

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email
                </Text>

                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                  <Ionicons name="mail" size={20} color="#6B7280" />
                  <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor="#9CA3AF"
                    onChangeText={setEmailAddress}
                    className="flex-1 ml-3 text-gray-900"
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Password Input */}

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Password
                </Text>

                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                  <Ionicons name="lock-closed" size={20} color="#6B7280" />
                  <TextInput
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    className="flex-1 ml-3 text-gray-900"
                    editable={!isLoading}
                  />
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters
                </Text>
              </View>

              <TouchableOpacity
                onPress={onSignUpPress}
                disabled={isLoading}
                className={`rounded-xl py-4 shadow-sm mb-4 ${
                  isLoading ? "bg-gray-400" : "bg-blue-600"
                }`}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-center">
                  {isLoading ? (
                    <Ionicons name="refresh" size={20} color="white" />
                  ) : (
                    <Ionicons
                      name="person-add-outline"
                      size={20}
                      color="white"
                    />
                  )}

                  <Text className="text-white font-semibold text-lg ml-2">
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Footer  */}
        </View>

        <TouchableOpacity onPress={onSignUpPress}>
          <Text>Continue</Text>
        </TouchableOpacity>
        <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
          <Text>Already have an account?</Text>
          <Link href="/sign-in">
            <Text>Sign in</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
