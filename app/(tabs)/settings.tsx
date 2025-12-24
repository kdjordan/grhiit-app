import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuthStore } from "@/stores";
import tw from "@/lib/tw";

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
    <SafeAreaView style={tw`flex-1 bg-black`} edges={['top']}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`px-5 pt-4 pb-8`} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={[tw`text-white text-2xl mb-8`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
          Settings
        </Text>

        {/* User Info */}
        <View style={tw`bg-[#111] p-5 mb-6`}>
          <View style={tw`w-14 h-14 bg-[#1a1a1a] items-center justify-center mb-4`}>
            <Text style={tw`text-2xl`}>👤</Text>
          </View>
          <Text style={[tw`text-white text-lg`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
            {user?.email || "Guest"}
          </Text>
          <Text style={[tw`text-[#6B7280] text-sm mt-1`, { fontFamily: "SpaceGrotesk_400Regular" }]}>
            {user ? "Signed in" : "Sign in to sync your progress"}
          </Text>
        </View>

        {/* Settings Options */}
        <Text style={[tw`text-[#6B7280] text-xs mb-4`, { fontFamily: "JetBrainsMono_500Medium", letterSpacing: 1 }]}>
          PREFERENCES
        </Text>

        {[
          { label: "Notifications", value: "On" },
          { label: "Health Integration", value: "Off" },
          { label: "Sound & Haptics", value: "On" },
        ].map((item, index) => (
          <Pressable
            key={item.label}
            style={tw`bg-[#111] p-4 mb-2 flex-row justify-between items-center`}
          >
            <Text style={[tw`text-white`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
              {item.label}
            </Text>
            <Text style={[tw`text-[#6B7280]`, { fontFamily: "JetBrainsMono_400Regular" }]}>
              {item.value}
            </Text>
          </Pressable>
        ))}

        <Text style={[tw`text-[#6B7280] text-xs mt-6 mb-4`, { fontFamily: "JetBrainsMono_500Medium", letterSpacing: 1 }]}>
          ABOUT
        </Text>

        <Pressable style={tw`bg-[#111] p-4 mb-2 flex-row justify-between items-center`}>
          <Text style={[tw`text-white`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
            About GRHIIT
          </Text>
          <Text style={[tw`text-[#6B7280]`, { fontFamily: "JetBrainsMono_400Regular" }]}>
            v1.0.0
          </Text>
        </Pressable>

        {/* Sign Out Button */}
        {user && (
          <Pressable
            style={tw.style(
              "bg-[#111] py-4 items-center mt-8",
              isLoading && "opacity-50"
            )}
            onPress={handleSignOut}
            disabled={isLoading}
          >
            <Text style={[tw`text-grhiit-red`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
              Sign Out
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
