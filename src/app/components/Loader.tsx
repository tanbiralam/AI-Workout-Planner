import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ActivityIndicator } from "react-native";

const Loader = () => {
  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Icon Container */}
        <View className="w-20 h-20 bg-blue-500/20 rounded-3xl items-center justify-center mb-6">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>

        {/* Loading Text */}
        <Text className="text-white text-lg font-semibold">
          Loading Profile
        </Text>
        <Text className="text-zinc-500 text-sm mt-2">Please wait...</Text>
      </View>
    </SafeAreaView>
  );
};

export default Loader;
