import { View, Text, Pressable, ScrollView } from "react-native";
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
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 48 }}>
        {/* Completion Header */}
        <View style={{ alignItems: "center", marginBottom: 48 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#22C55E", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 40, color: "white" }}>✓</Text>
          </View>
          <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>Session Complete</Text>
          <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 8 }}>16:32 • 224 reps</Text>
        </View>

        {/* Heart Rate Summary */}
        <View style={{ backgroundColor: "#141414", borderRadius: 16, padding: 20, marginBottom: 32, borderWidth: 1, borderColor: "#262626" }}>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 1, marginBottom: 16 }}>HEART RATE SUMMARY</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>AVG</Text>
              <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>-- BPM</Text>
            </View>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>MAX</Text>
              <Text style={{ color: "#E8110F", fontSize: 24, fontWeight: "bold" }}>-- BPM</Text>
            </View>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>RECOVERY</Text>
              <Text style={{ color: "#22C55E", fontSize: 24, fontWeight: "bold" }}>--</Text>
            </View>
          </View>
        </View>

        {/* Identity Check-in */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 1, marginBottom: 16 }}>
            HOW DO YOU FEEL? (Identity Check-in)
          </Text>

          {IDENTITY_QUESTIONS.map((question) => (
            <View key={question.id} style={{ marginBottom: 16 }}>
              <Text style={{ color: "white", marginBottom: 8 }}>{question.label}</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Pressable
                    key={rating}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: "center",
                      backgroundColor: ratings[question.id] === rating ? "white" : "#141414",
                      borderWidth: 1,
                      borderColor: ratings[question.id] === rating ? "white" : "#262626",
                    }}
                    onPress={() => handleRating(question.id, rating)}
                  >
                    <Text
                      style={{
                        color: ratings[question.id] === rating ? "#0A0A0A" : "rgba(255,255,255,0.6)",
                        fontWeight: ratings[question.id] === rating ? "bold" : "normal",
                      }}
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
          style={{ backgroundColor: "white", borderRadius: 16, paddingVertical: 20, alignItems: "center" }}
          onPress={handleSave}
        >
          <Text style={{ color: "#0A0A0A", fontSize: 18, fontWeight: "bold" }}>SAVE & CONTINUE</Text>
        </Pressable>

        {/* Quote */}
        <Text style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", fontSize: 14, marginTop: 24, fontStyle: "italic" }}>
          "Learn what hard actually is."
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
