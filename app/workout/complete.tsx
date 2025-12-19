import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";

const IDENTITY_QUESTIONS = [
  { id: "toughness", label: "Mental Toughness" },
  { id: "discipline", label: "Discipline" },
  { id: "confidence", label: "Confidence" },
];

export default function WorkoutCompleteScreen() {
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleRating = (questionId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [questionId]: rating }));
  };

  const handleSave = () => {
    // TODO: Save to Zustand store and Firebase
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-12">
        {/* Completion Header */}
        <View className="items-center mb-12">
          <Text className="text-6xl mb-4">✓</Text>
          <Text className="text-primary text-3xl font-bold">Session Complete</Text>
          <Text className="text-secondary mt-2">16:32 • 224 reps</Text>
        </View>

        {/* Heart Rate Summary */}
        <View className="bg-surface rounded-2xl p-6 mb-8 border border-border">
          <Text className="text-secondary text-sm mb-4">HEART RATE SUMMARY</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-secondary text-xs">AVG</Text>
              <Text className="text-primary text-2xl font-bold">-- BPM</Text>
            </View>
            <View>
              <Text className="text-secondary text-xs">MAX</Text>
              <Text className="text-accent text-2xl font-bold">-- BPM</Text>
            </View>
            <View>
              <Text className="text-secondary text-xs">RECOVERY</Text>
              <Text className="text-success text-2xl font-bold">--</Text>
            </View>
          </View>
        </View>

        {/* Identity Check-in */}
        <View className="mb-8">
          <Text className="text-secondary text-sm mb-4">
            HOW DO YOU FEEL? (Identity Check-in)
          </Text>

          {IDENTITY_QUESTIONS.map((question) => (
            <View key={question.id} className="mb-4">
              <Text className="text-primary mb-2">{question.label}</Text>
              <View className="flex-row gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Pressable
                    key={rating}
                    className={`flex-1 py-3 rounded-lg items-center ${
                      ratings[question.id] === rating
                        ? "bg-primary"
                        : "bg-surface border border-border"
                    }`}
                    onPress={() => handleRating(question.id, rating)}
                  >
                    <Text
                      className={
                        ratings[question.id] === rating
                          ? "text-background font-bold"
                          : "text-secondary"
                      }
                    >
                      {rating}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Save Button */}
        <Pressable
          className="bg-primary rounded-2xl py-5 items-center active:opacity-80"
          onPress={handleSave}
        >
          <Text className="text-background text-lg font-bold">SAVE & CONTINUE</Text>
        </Pressable>

        {/* Motivational quote */}
        <Text className="text-secondary text-center text-sm mt-6 px-4">
          "Learn what hard actually is."
        </Text>
      </View>
    </SafeAreaView>
  );
}
