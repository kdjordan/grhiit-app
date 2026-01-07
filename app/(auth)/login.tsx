import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/lib/tw";
import { useAuthStore } from "@/stores";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;

    try {
      await signIn(email.trim(), password);
      router.replace("/(tabs)");
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-background`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1 justify-center px-6`}>
          <Text style={tw`text-primary text-4xl font-bold mb-2`}>
            GRHIIT
          </Text>
          <Text style={tw`text-secondary text-lg mb-10`}>
            The only way out is through
          </Text>

          {error && (
            <View style={tw`bg-accent/20 border border-accent rounded-lg p-3 mb-4`}>
              <Text style={tw`text-accent text-sm`}>{error}</Text>
            </View>
          )}

          <View style={tw`mb-4`}>
            <Text style={tw`text-secondary text-sm mb-2`}>Email</Text>
            <TextInput
              style={tw`bg-surface border border-border rounded-lg px-4 py-3 text-primary text-base`}
              placeholder="you@example.com"
              placeholderTextColor={tw.color("secondary")}
              value={email}
              onChangeText={(text) => {
                clearError();
                setEmail(text);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={tw`mb-6`}>
            <Text style={tw`text-secondary text-sm mb-2`}>Password</Text>
            <TextInput
              style={tw`bg-surface border border-border rounded-lg px-4 py-3 text-primary text-base`}
              placeholder="Enter password"
              placeholderTextColor={tw.color("secondary")}
              value={password}
              onChangeText={setPassword}
              autoCorrect={false}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <Pressable
            style={({ pressed }) =>
              tw.style(
                "bg-primary rounded-lg py-4 items-center",
                pressed && "opacity-80",
                isLoading && "opacity-50"
              )
            }
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={tw.color("background")} />
            ) : (
              <Text style={tw`text-background text-base font-semibold`}>
                Sign In
              </Text>
            )}
          </Pressable>

          <View style={tw`flex-row justify-center mt-6`}>
            <Text style={tw`text-secondary`}>{"Don't have an account? "}</Text>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <Text style={tw`text-primary font-semibold`}>Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
