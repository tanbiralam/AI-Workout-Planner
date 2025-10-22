import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, View, Platform } from "react-native";
import { useUser } from "@clerk/clerk-expo";

function Layout() {
  const { user } = useUser();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#71717a",
        tabBarStyle: {
          backgroundColor: "#09090b",
          borderTopColor: "#27272a",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          paddingTop: 12,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused
                  ? "rgba(59, 130, 246, 0.12)"
                  : "transparent",
              }}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: "Exercises",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused
                  ? "rgba(59, 130, 246, 0.12)"
                  : "transparent",
              }}
            >
              <Ionicons
                name={focused ? "barbell" : "barbell-outline"}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#3b82f6",
                marginTop: -20,
                shadowColor: "#3b82f6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons name="add" size={32} color="white" />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused
                  ? "rgba(59, 130, 246, 0.12)"
                  : "transparent",
              }}
            >
              <Ionicons
                name={focused ? "time" : "time-outline"}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused
                  ? "rgba(59, 130, 246, 0.12)"
                  : "transparent",
              }}
            >
              {user?.imageUrl || user?.externalAccounts[0]?.imageUrl ? (
                <View
                  style={{
                    borderRadius: 100,
                    borderWidth: focused ? 2 : 0,
                    borderColor: "#3b82f6",
                    padding: focused ? 2 : 0,
                  }}
                >
                  <Image
                    source={{
                      uri:
                        user?.imageUrl ?? user?.externalAccounts[0]?.imageUrl,
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 100,
                    }}
                  />
                </View>
              ) : (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={size}
                  color={color}
                />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

export default Layout;
