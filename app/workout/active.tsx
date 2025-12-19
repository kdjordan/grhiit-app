import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect } from "react";
import { useWorkoutStore } from "@/stores/workoutStore";
import Svg, { Path } from "react-native-svg";

function CloseIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke="#6B7280"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HeartIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="#EF4444">
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </Svg>
  );
}

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

  const handleSkip = () => {
    // Skip to next interval
    tick();
  };

  // Check if workout is complete
  useEffect(() => {
    if (currentPhase === "complete") {
      handleComplete();
    }
  }, [currentPhase]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Red glow effect at top */}
      <View
        className="absolute top-0 left-0 right-0 h-96 opacity-20"
        style={{
          backgroundColor: currentPhase === "work" ? "#EF4444" : "#22C55E",
        }}
      />

      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4">
          <Text className="text-white/60 text-sm">
            ROUND{" "}
            <Text className="text-white font-bold">{currentRound}</Text>
            <Text className="text-white/40">/{totalRounds}</Text>
          </Text>
          <Pressable
            className="w-10 h-10 bg-surface rounded-lg items-center justify-center border border-border"
            onPress={handleComplete}
          >
            <CloseIcon />
          </Pressable>
        </View>

        {/* Main Timer Area */}
        <View className="flex-1 items-center justify-center px-5">
          {/* Movement Name */}
          <Text className="text-white text-2xl font-bold tracking-wider mb-8">
            {currentMovement || "FLYING SQUATS"}
          </Text>

          {/* Large Timer */}
          <Text
            className={`text-9xl font-bold ${
              currentPhase === "work" ? "text-accent" : "text-success"
            }`}
            style={{
              textShadowColor: currentPhase === "work" ? "#EF4444" : "#22C55E",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 40,
            }}
          >
            {timeRemaining.toString().padStart(2, "0")}
          </Text>

          {/* Phase Indicator */}
          <View
            className={`px-8 py-2 rounded mt-4 border ${
              currentPhase === "work"
                ? "border-accent bg-accent/10"
                : "border-success bg-success/10"
            }`}
          >
            <Text
              className={`text-lg font-bold tracking-widest ${
                currentPhase === "work" ? "text-accent" : "text-success"
              }`}
            >
              {currentPhase === "work" ? "WORK" : "REST"}
            </Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View className="px-5 pb-8">
          {/* Up Next */}
          <View className="bg-surface rounded-xl p-4 mb-4 border border-border flex-row items-center justify-between">
            <View>
              <Text className="text-white/40 text-xs">UP NEXT</Text>
              <Text className="text-white font-semibold">
                {nextMovement || "BURPEE BOX JUMPS"}
              </Text>
            </View>
            <Text className="text-white/40">→</Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-surface rounded-xl p-3 border border-border">
              <Text className="text-white/40 text-xs">TIME</Text>
              <Text className="text-white text-xl font-bold">
                {formatElapsedTime(elapsedTime || 0)}
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-3 border border-accent/30">
              <Text className="text-white/40 text-xs">HR ZONE</Text>
              <View className="flex-row items-center">
                <HeartIcon />
                <Text className="text-accent text-xl font-bold ml-1">Z5</Text>
              </View>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-3 border border-border">
              <Text className="text-white/40 text-xs">CALS</Text>
              <Text className="text-white text-xl font-bold">412</Text>
            </View>
          </View>

          {/* Control Buttons */}
          <View className="flex-row gap-4">
            <Pressable
              className="flex-1 bg-transparent border-2 border-accent rounded-xl py-4 flex-row items-center justify-center active:opacity-80"
              onPress={isRunning ? pauseWorkout : resumeWorkout}
            >
              <Text className="text-accent font-bold text-lg">
                {isRunning ? "❚❚ PAUSE" : "▶ RESUME"}
              </Text>
            </Pressable>
            <Pressable
              className="bg-surface border border-border rounded-xl px-6 py-4 flex-row items-center justify-center active:opacity-80"
              onPress={handleSkip}
            >
              <Text className="text-white/60 font-medium">SKIP</Text>
              <Text className="text-white/40 ml-1">→</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
