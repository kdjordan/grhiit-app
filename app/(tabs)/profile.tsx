import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-3xl font-bold text-primary mb-6">Profile</Text>

        {/* User Info Placeholder */}
        <View className="bg-surface rounded-2xl p-6 mb-6 border border-border">
          <View className="w-16 h-16 rounded-full bg-border items-center justify-center mb-4">
            <Text className="text-3xl">👤</Text>
          </View>
          <Text className="text-primary text-xl font-bold">Guest</Text>
          <Text className="text-secondary">Sign in to sync your progress</Text>
        </View>

        {/* Sign In Button */}
        <Pressable className="bg-surface rounded-xl py-4 items-center border border-border active:opacity-80">
          <Text className="text-primary font-medium">Sign In</Text>
        </Pressable>

        {/* Settings */}
        <View className="mt-8">
          <Text className="text-secondary text-sm mb-4">SETTINGS</Text>

          <Pressable className="bg-surface rounded-xl p-4 mb-3 border border-border flex-row justify-between items-center">
            <Text className="text-primary">Notifications</Text>
            <Text className="text-secondary">→</Text>
          </Pressable>

          <Pressable className="bg-surface rounded-xl p-4 mb-3 border border-border flex-row justify-between items-center">
            <Text className="text-primary">Health Integration</Text>
            <Text className="text-secondary">→</Text>
          </Pressable>

          <Pressable className="bg-surface rounded-xl p-4 border border-border flex-row justify-between items-center">
            <Text className="text-primary">About GRHIIT</Text>
            <Text className="text-secondary">→</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
