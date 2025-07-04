import "../global.css";
import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";

export default function Layout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <Slot />
    </ClerkProvider>
  );
}
