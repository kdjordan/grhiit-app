import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const MOVEMENTS = [
  { name: "8-Count Bodybuilders", description: "Full-body explosive movement" },
  { name: "Jump Squats", description: "Lower body power" },
  { name: "Burpees", description: "Metabolic conditioning" },
  { name: "Flying Squats", description: "Leg endurance" },
];

export default function WorkoutPreviewScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Header with back button */}
        <Pressable onPress={() => router.back()} style={{ marginBottom: 24 }}>
          <Text style={{ color: "rgba(255,255,255,0.6)" }}>← Back</Text>
        </Pressable>

        {/* Workout Title */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, letterSpacing: 1, marginBottom: 4 }}>
            WEEK 1 • DAY 1
          </Text>
          <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>Foundation</Text>
          <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 8 }}>16 minutes • 220+ reps</Text>
        </View>

        {/* Session Structure */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 1, marginBottom: 16 }}>
            SESSION STRUCTURE
          </Text>

          <View style={{ backgroundColor: "#141414", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#262626" }}>
            <Text style={{ color: "white", fontWeight: "500" }}>Ramp-up</Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 }}>2 min • Prepare your body</Text>
          </View>

          <View style={{ backgroundColor: "#141414", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "rgba(239, 68, 68, 0.5)" }}>
            <Text style={{ color: "#EF4444", fontWeight: "500" }}>Tabata Summit</Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 }}>8 rounds • 20s work / 10s rest</Text>
          </View>

          <View style={{ backgroundColor: "#141414", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#262626" }}>
            <Text style={{ color: "white", fontWeight: "500" }}>After-Burn</Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 }}>4 min • Sustained effort</Text>
          </View>

          <View style={{ backgroundColor: "#141414", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#262626" }}>
            <Text style={{ color: "white", fontWeight: "500" }}>Cool-down</Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 }}>2 min • Recovery</Text>
          </View>
        </View>

        {/* Movements */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 1, marginBottom: 16 }}>
            TODAY'S MOVEMENTS
          </Text>
          {MOVEMENTS.map((movement, index) => (
            <View
              key={movement.name}
              style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#262626" }}
            >
              <Text style={{ color: "rgba(255,255,255,0.4)", width: 32 }}>{index + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "white", fontWeight: "500" }}>{movement.name}</Text>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>{movement.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Start Button */}
        <Pressable
          style={{ backgroundColor: "#EF4444", borderRadius: 16, paddingVertical: 20, alignItems: "center" }}
          onPress={() => router.push("/workout/active")}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>BEGIN SESSION</Text>
        </Pressable>

        {/* Philosophy reminder */}
        <Text style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", fontSize: 14, marginTop: 24, paddingHorizontal: 16, fontStyle: "italic" }}>
          "Most people have never actually hit their limits."
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
