import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import tw from "@/lib/tw";

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
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-5 pt-12`}>
        {/* Completion Header */}
        <View style={tw`items-center mb-12`}>
          <View style={tw`w-20 h-20 rounded-full bg-success items-center justify-center mb-4`}>
            <Text style={tw`text-4xl text-white`}>✓</Text>
          </View>
          <Text style={tw`text-white text-3xl font-bold`}>Session Complete</Text>
          <Text style={tw`text-white/60 mt-2`}>16:32 • 224 reps</Text>
        </View>

        {/* Heart Rate Summary */}
        <View style={tw`bg-[#141414] rounded-2xl p-5 mb-8 border border-[#262626]`}>
          <Text style={tw`text-white/40 text-xs tracking-wide mb-4`}>HEART RATE SUMMARY</Text>
          <View style={tw`flex-row justify-between`}>
            <View>
              <Text style={tw`text-white/40 text-xs`}>AVG</Text>
              <Text style={tw`text-white text-2xl font-bold`}>-- BPM</Text>
            </View>
            <View>
              <Text style={tw`text-white/40 text-xs`}>MAX</Text>
              <Text style={tw`text-grhiit-red text-2xl font-bold`}>-- BPM</Text>
            </View>
            <View>
              <Text style={tw`text-white/40 text-xs`}>RECOVERY</Text>
              <Text style={tw`text-success text-2xl font-bold`}>--</Text>
            </View>
          </View>
        </View>

        {/* Identity Check-in */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-white/40 text-xs tracking-wide mb-4`}>
            HOW DO YOU FEEL? (Identity Check-in)
          </Text>

          {IDENTITY_QUESTIONS.map((question) => (
            <View key={question.id} style={tw`mb-4`}>
              <Text style={tw`text-white mb-2`}>{question.label}</Text>
              <View style={tw`flex-row gap-2`}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Pressable
                    key={rating}
                    style={tw`flex-1 py-3 rounded-lg items-center border ${
                      ratings[question.id] === rating
                        ? "bg-white border-white"
                        : "bg-[#141414] border-[#262626]"
                    }`}
                    onPress={() => handleRating(question.id, rating)}
                  >
                    <Text
                      style={tw`${
                        ratings[question.id] === rating
                          ? "text-grhiit-black font-bold"
                          : "text-white/60"
                      }`}
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
          style={tw`bg-white rounded-2xl py-5 items-center`}
          onPress={handleSave}
        >
          <Text style={tw`text-grhiit-black text-lg font-bold`}>SAVE & CONTINUE</Text>
        </Pressable>

        {/* Quote */}
        <Text style={tw`text-white/40 text-center text-sm mt-6 italic`}>
          "Learn what hard actually is."
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
