import { useState, useEffect } from "react";
import { Stack, Redirect, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useAuthStore } from "@/stores";
import { AnimatedSplash } from "@/components";

const DEV_SKIP_AUTH = process.env.EXPO_PUBLIC_DEV_SKIP_AUTH === "true";

// Keep native splash visible while we load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const { user, isInitialized } = useAuthStore();
  const segments = useSegments();

  useEffect(() => {
    // Hide native splash once our app is ready
    SplashScreen.hideAsync();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Skip auth check in development
  if (DEV_SKIP_AUTH) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0A0A0A" },
            animation: "fade",
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="workout"
            options={{
              gestureEnabled: false,
              animation: "slide_from_bottom"
            }}
          />
        </Stack>
        {showSplash && <AnimatedSplash onComplete={handleSplashComplete} />}
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
        {showSplash && <AnimatedSplash onComplete={handleSplashComplete} />}
      </View>
    );
  }

  const inAuthGroup = segments[0] === "(auth)";

  if (!user && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user && inAuthGroup) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0A0A0A" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="workout"
          options={{
            gestureEnabled: false,
            animation: "slide_from_bottom"
          }}
        />
      </Stack>
      {showSplash && <AnimatedSplash onComplete={handleSplashComplete} />}
    </View>
  );
}
