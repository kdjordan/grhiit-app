import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuthStore } from "@/stores";
import { useUserStore } from "@/stores/userStore";
import tw from "@/lib/tw";

interface SettingsRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function SettingsRow({ icon, label, value, onPress, danger }: SettingsRowProps) {
  return (
    <Pressable
      style={[tw`bg-[#1a1a1a] p-4 flex-row items-center mb-2`, { borderRadius: 12 }]}
      onPress={onPress}
    >
      <View style={tw`w-10 h-10 bg-[#262626] rounded-lg items-center justify-center mr-4`}>
        <Feather name={icon} size={20} color={danger ? "#EF4444" : "#6B7280"} />
      </View>
      <Text style={[tw`flex-1`, { fontFamily: "SpaceGrotesk_500Medium", color: danger ? "#EF4444" : "#FFFFFF" }]}>
        {label}
      </Text>
      {value && (
        <Text style={[tw`text-[#6B7280]`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
          {value}
        </Text>
      )}
      {onPress && !value && (
        <Feather name="chevron-right" size={20} color="#6B7280" />
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { user, signOut, isLoading } = useAuthStore();
  const { resetProgress, resetStats } = useUserStore();
  const isDev = process.env.EXPO_PUBLIC_DEV_SKIP_AUTH === "true";

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch {
      // Error handled by store
    }
  };

  const handleResetProgress = () => {
    resetProgress();
    resetStats();
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`} edges={['top']}>
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={tw`px-5 pt-4 pb-2`}>
          <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
            PREFERENCES
          </Text>
          <Text style={[tw`text-white text-2xl mt-1`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
            Settings
          </Text>
        </View>

        {/* User Profile Card */}
        <View style={tw`px-4 pt-4 pb-2`}>
          <View style={[tw`bg-[#1a1a1a] p-5`, { borderRadius: 16 }]}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-14 h-14 bg-[#262626] rounded-full items-center justify-center mr-4`}>
                <Feather name="user" size={28} color="#6B7280" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={[tw`text-white text-lg`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
                  {user?.email || "Guest"}
                </Text>
                <Text style={[tw`text-[#6B7280] text-sm mt-0.5`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                  {user ? "Signed in" : "Sign in to sync progress"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={tw`px-4 pt-4`}>
          <Text style={[tw`text-[#6B7280] text-xs mb-3 ml-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
            NOTIFICATIONS
          </Text>
          <SettingsRow icon="bell" label="Push Notifications" value="On" />
          <SettingsRow icon="volume-2" label="Sound & Haptics" value="On" />
        </View>

        {/* Health Section */}
        <View style={tw`px-4 pt-4`}>
          <Text style={[tw`text-[#6B7280] text-xs mb-3 ml-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
            HEALTH
          </Text>
          <SettingsRow icon="heart" label="Apple Health" value="Not Connected" />
          <SettingsRow icon="watch" label="Apple Watch" value="Not Connected" />
        </View>

        {/* About Section */}
        <View style={tw`px-4 pt-4`}>
          <Text style={[tw`text-[#6B7280] text-xs mb-3 ml-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
            ABOUT
          </Text>
          <SettingsRow icon="info" label="About GRHIIT" value="v1.0.0" />
          <SettingsRow icon="file-text" label="Terms of Service" onPress={() => {}} />
          <SettingsRow icon="shield" label="Privacy Policy" onPress={() => {}} />
        </View>

        {/* Dev Section */}
        {isDev && (
          <View style={tw`px-4 pt-4`}>
            <Text style={[tw`text-[#6B7280] text-xs mb-3 ml-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
              DEVELOPER
            </Text>
            <SettingsRow icon="refresh-cw" label="Reset All Progress" onPress={handleResetProgress} danger />
          </View>
        )}

        {/* Sign Out */}
        {user && (
          <View style={tw`px-4 pt-6 pb-8`}>
            <Pressable
              style={[
                tw`py-4 items-center`,
                { backgroundColor: "#1a1a1a", borderRadius: 16, opacity: isLoading ? 0.5 : 1 }
              ]}
              onPress={handleSignOut}
              disabled={isLoading}
            >
              <Text style={[tw`text-[#EF4444]`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
                Sign Out
              </Text>
            </Pressable>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={tw`h-8`} />
      </ScrollView>
    </SafeAreaView>
  );
}
