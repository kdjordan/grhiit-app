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

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const handleSignup = async () => {
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      await signUp(email.trim(), password);
      router.replace("/(tabs)");
    } catch {
      // Error is handled by the store
    }
  };

  const displayError = localError || error;

  return (
    <SafeAreaView style={tw`flex-1 bg-background`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1 justify-center px-6`}>
          <Text style={tw`text-primary text-4xl font-bold mb-2`}>
            Join GRHIIT
          </Text>
          <Text style={tw`text-secondary text-lg mb-10`}>
            Start your transformation
          </Text>

          {displayError && (
            <View style={tw`bg-accent/20 border border-accent rounded-lg p-3 mb-4`}>
              <Text style={tw`text-accent text-sm`}>{displayError}</Text>
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
                setLocalError(null);
                setEmail(text);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={tw`mb-4`}>
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

          <View style={tw`mb-6`}>
            <Text style={tw`text-secondary text-sm mb-2`}>Confirm Password</Text>
            <TextInput
              style={tw`bg-surface border border-border rounded-lg px-4 py-3 text-primary text-base`}
              placeholder="Confirm password"
              placeholderTextColor={tw.color("secondary")}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={tw.color("background")} />
            ) : (
              <Text style={tw`text-background text-base font-semibold`}>
                Create Account
              </Text>
            )}
          </Pressable>

          <View style={tw`flex-row justify-center mt-6`}>
            <Text style={tw`text-secondary`}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={tw`text-primary font-semibold`}>Sign In</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
