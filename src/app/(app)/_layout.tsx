import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import SplashScreen from "@/app/components/SplashScreen";

function Layout() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen while auth is loading
  if (!isLoaded) {
    return (
      <SplashScreen onFinish={() => setShowSplash(false)} duration={2500} />
    );
  }

  // Always call useEffect first - conditionally set up timer
  useEffect(() => {
    if (isLoaded && showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, showSplash]);

  // Show brief brand splash then proceed to app
  if (showSplash && isLoaded) {
    return (
      <SplashScreen onFinish={() => setShowSplash(false)} duration={2000} />
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="exercise-detail"
          options={{
            headerShown: false,
            // presentation: "modal",
            // gestureEnabled: true,
            // animationTypeForReplace: "push",
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default Layout;
