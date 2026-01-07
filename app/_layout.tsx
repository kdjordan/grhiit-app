import { useState, useEffect } from "react";
import { Stack, Redirect, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, ChakraPetch_400Regular, ChakraPetch_500Medium, ChakraPetch_600SemiBold, ChakraPetch_700Bold } from "@expo-google-fonts/chakra-petch";
import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import { useAuthStore } from "@/stores";
import { AnimatedSplash } from "@/components";

const DEV_SKIP_AUTH = process.env.EXPO_PUBLIC_DEV_SKIP_AUTH === "true";
const DEV_SKIP_SPLASH = process.env.EXPO_PUBLIC_DEV_SKIP_SPLASH === "true";

// Font loading timeout - proceed with system fonts if custom fonts fail
const FONT_LOAD_TIMEOUT_MS = 5000;

// Keep native splash visible while we load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(!DEV_SKIP_SPLASH);
  const [fontLoadTimedOut, setFontLoadTimedOut] = useState(false);
  const { user, isInitialized } = useAuthStore();
  const segments = useSegments();

  const [fontsLoaded] = useFonts({
    ChakraPetch_400Regular,
    ChakraPetch_500Medium,
    ChakraPetch_600SemiBold,
    ChakraPetch_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  // Font loading timeout - proceed with system fonts if loading takes too long
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!fontsLoaded) {
        console.warn("Font loading timed out, proceeding with system fonts");
        setFontLoadTimedOut(true);
      }
    }, FONT_LOAD_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [fontsLoaded]);

  // Hide native splash once fonts are loaded (or timed out)
  const fontsReady = fontsLoaded || fontLoadTimedOut;

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Wait for fonts to load (or timeout)
  if (!fontsReady) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
        {showSplash && <AnimatedSplash onComplete={handleSplashComplete} />}
      </View>
    );
  }

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
