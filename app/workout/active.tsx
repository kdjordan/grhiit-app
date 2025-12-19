import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect } from "react";
import { useWorkoutStore } from "@/stores/workoutStore";

export default function ActiveWorkoutScreen() {
  const {
    currentPhase,
    timeRemaining,
    currentRound,
    totalRounds,
    isRunning,
    currentMovement,
    nextMovement,
    elapsedTime,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    tick,
  } = useWorkoutStore();

  useEffect(() => {
    startWorkout();
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleComplete = () => {
    router.replace("/workout/complete");
  };

  useEffect(() => {
    if (currentPhase === "complete") {
      handleComplete();
    }
  }, [currentPhase]);

  const isWork = currentPhase === "work";
  const phaseColor = isWork ? "#EF4444" : "#22C55E";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      {/* Glow effect */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 400,
          backgroundColor: phaseColor,
          opacity: 0.15,
        }}
      />

      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 16 }}>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
            ROUND <Text style={{ color: "white", fontWeight: "bold" }}>{currentRound}</Text>
            <Text style={{ color: "rgba(255,255,255,0.4)" }}>/{totalRounds}</Text>
          </Text>
          <Pressable
            style={{ width: 40, height: 40, backgroundColor: "#141414", borderRadius: 8, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#262626" }}
            onPress={handleComplete}
          >
            <Text style={{ color: "#6B7280", fontSize: 18 }}>✕</Text>
          </Pressable>
        </View>

        {/* Main Timer Area */}
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>
          {/* Movement Name */}
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold", letterSpacing: 1, marginBottom: 32 }}>
            {currentMovement || "FLYING SQUATS"}
          </Text>

          {/* Large Timer */}
          <Text
            style={{
              color: phaseColor,
              fontSize: 120,
              fontWeight: "bold",
              textShadowColor: phaseColor,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 40,
            }}
          >
            {timeRemaining.toString().padStart(2, "0")}
          </Text>

          {/* Phase Indicator */}
          <View
            style={{
              paddingHorizontal: 32,
              paddingVertical: 8,
              borderRadius: 4,
              marginTop: 16,
              borderWidth: 1,
              borderColor: phaseColor,
              backgroundColor: `${phaseColor}20`,
            }}
          >
            <Text style={{ color: phaseColor, fontSize: 18, fontWeight: "bold", letterSpacing: 2 }}>
              {isWork ? "WORK" : "REST"}
            </Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
          {/* Up Next */}
          <View style={{ backgroundColor: "#141414", borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#262626", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>UP NEXT</Text>
              <Text style={{ color: "white", fontWeight: "600" }}>{nextMovement || "BURPEE BOX JUMPS"}</Text>
            </View>
            <Text style={{ color: "rgba(255,255,255,0.4)" }}>→</Text>
          </View>

          {/* Stats Row */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
            <View style={{ flex: 1, backgroundColor: "#141414", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#262626" }}>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>TIME</Text>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>{formatElapsedTime(elapsedTime || 0)}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "#141414", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(239, 68, 68, 0.3)" }}>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>HR ZONE</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: "#EF4444", marginRight: 4 }}>❤️</Text>
                <Text style={{ color: "#EF4444", fontSize: 20, fontWeight: "bold" }}>Z5</Text>
              </View>
            </View>
            <View style={{ flex: 1, backgroundColor: "#141414", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#262626" }}>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>CALS</Text>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>412</Text>
            </View>
          </View>

          {/* Control Buttons */}
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Pressable
              style={{ flex: 1, backgroundColor: "transparent", borderWidth: 2, borderColor: "#EF4444", borderRadius: 12, paddingVertical: 16, alignItems: "center", justifyContent: "center" }}
              onPress={isRunning ? pauseWorkout : resumeWorkout}
            >
              <Text style={{ color: "#EF4444", fontWeight: "bold", fontSize: 16 }}>
                {isRunning ? "❚❚ PAUSE" : "▶ RESUME"}
              </Text>
            </Pressable>
            <Pressable
              style={{ backgroundColor: "#141414", borderWidth: 1, borderColor: "#262626", borderRadius: 12, paddingHorizontal: 24, paddingVertical: 16, alignItems: "center", justifyContent: "center" }}
              onPress={() => tick()}
            >
              <Text style={{ color: "rgba(255,255,255,0.6)", fontWeight: "500" }}>SKIP →</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
