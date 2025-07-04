import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "react-native";

function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          headerShown: false,
          title: "Exercises",
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          headerShown: false,
          title: "Workout",
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="pluscircle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="active-workout"
        options={{
          title: "Active Workout",
          href: "null",
          tabBarStyle: {
            display: "none",
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          headerShown: false,
          title: "History",
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="clockcircle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          //   tabBarIcon: ({ size, color }) => (
          //     <Image
          //       source={user?.imageUrl ?? user?.externalAccounts[0]?.imageUrl}
          //       className="rounded-full"
          //       style={{ width: 28, height: 28, borderRadius: 100 }}
          //     />
          //   ),
        }}
      />
    </Tabs>
  );
}

export default Layout;
