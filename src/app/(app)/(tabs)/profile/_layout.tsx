import { Stack } from "expo-router";
import React from "react";

function Layout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default Layout;

{
  /* <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack> */
}
