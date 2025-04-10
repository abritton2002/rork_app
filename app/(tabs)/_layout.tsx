import React from "react";
import { Tabs } from "expo-router";
import { LayoutAnimation, Platform } from "react-native";
import { colors } from "@/constants/colors";
import { Home, Settings } from "lucide-react-native";

export default function TabLayout() {
  // Configure layout animations (except on web where they're not supported)
  if (Platform.OS !== "web") {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.cardBackground,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: "600",
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}