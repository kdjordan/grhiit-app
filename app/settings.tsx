import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuthStore } from "@/stores";
import tw from "@/lib/tw";
import Svg, { Path } from "react-native-svg";

function CloseIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function SettingsScreen() {
  const { user, signOut, isLoading } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch {
      // Error handled by store
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-5`} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <Text style={[tw`text-white text-2xl tracking-wide`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
            SETTINGS
          </Text>
          <Pressable
            style={tw`w-10 h-10 bg-[#141414] rounded-lg items-center justify-center border border-[#262626]`}
            onPress={() => router.back()}
          >
            <CloseIcon />
          </Pressable>
        </View>

        {/* User Info */}
        <View style={tw`bg-[#141414] rounded-2xl p-6 mb-6 border border-[#262626]`}>
          <View style={tw`w-16 h-16 rounded-full bg-[#262626] items-center justify-center mb-4`}>
            <Text style={tw`text-3xl`}>👤</Text>
          </View>
          <Text style={tw`text-white text-xl font-bold`}>
            {user?.email || "Guest"}
          </Text>
          <Text style={tw`text-white/60 mt-1`}>
            {user ? "Signed in" : "Sign in to sync your progress"}
          </Text>
        </View>

        {/* Sign Out Button */}
        {user && (
          <Pressable
            style={tw.style(
              "bg-[#141414] border border-[#262626] rounded-xl py-4 items-center mb-8",
              isLoading && "opacity-50"
            )}
            onPress={handleSignOut}
            disabled={isLoading}
          >
            <Text style={tw`text-grhiit-red font-medium`}>Sign Out</Text>
          </Pressable>
        )}

        {/* Settings */}
        <Text style={tw`text-white/40 text-xs tracking-wide mb-4`}>
          PREFERENCES
        </Text>

        {[
          { label: "Notifications", icon: "🔔" },
          { label: "Health Integration", icon: "❤️" },
          { label: "Sound & Haptics", icon: "🔊" },
          { label: "About GRHIIT", icon: "ℹ️" },
        ].map((item) => (
          <Pressable
            key={item.label}
            style={tw`bg-[#141414] rounded-xl p-4 mb-3 border border-[#262626] flex-row justify-between items-center`}
          >
            <View style={tw`flex-row items-center`}>
              <Text style={tw`mr-3`}>{item.icon}</Text>
              <Text style={tw`text-white`}>{item.label}</Text>
            </View>
            <Text style={tw`text-white/40`}>→</Text>
          </Pressable>
        ))}

        {/* App Version */}
        <Text style={tw`text-white/30 text-center text-xs mt-6`}>
          GRHIIT v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
