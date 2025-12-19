import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/stores";
import tw from "@/lib/tw";

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // Error handled by store
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold", letterSpacing: 1, marginBottom: 24 }}>
          PROFILE
        </Text>

        {/* User Info */}
        <View style={{ backgroundColor: "#141414", borderRadius: 16, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: "#262626" }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#262626", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 32 }}>👤</Text>
          </View>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            {user?.email || "Guest"}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
            {user ? "Signed in" : "Sign in to sync your progress"}
          </Text>
        </View>

        {/* Sign Out Button */}
        {user && (
          <Pressable
            style={tw.style(
              "bg-surface border border-border rounded-xl py-4 items-center mb-8",
              isLoading && "opacity-50"
            )}
            onPress={handleSignOut}
            disabled={isLoading}
          >
            <Text style={tw`text-accent font-medium`}>Sign Out</Text>
          </Pressable>
        )}

        {/* Settings */}
        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 1, marginBottom: 16 }}>
          SETTINGS
        </Text>

        {[
          { label: "Notifications", icon: "🔔" },
          { label: "Health Integration", icon: "❤️" },
          { label: "Sound & Haptics", icon: "🔊" },
          { label: "About GRHIIT", icon: "ℹ️" },
        ].map((item, index) => (
          <Pressable
            key={item.label}
            style={{
              backgroundColor: "#141414",
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "#262626",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginRight: 12 }}>{item.icon}</Text>
              <Text style={{ color: "white" }}>{item.label}</Text>
            </View>
            <Text style={{ color: "rgba(255,255,255,0.4)" }}>→</Text>
          </Pressable>
        ))}

        {/* App Version */}
        <Text style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", fontSize: 12, marginTop: 24 }}>
          GRHIIT v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
