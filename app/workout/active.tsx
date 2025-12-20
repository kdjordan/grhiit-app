import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect } from "react";
import { useWorkoutStore } from "@/stores/workoutStore";
import tw from "@/lib/tw";

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
  const phaseColor = isWork ? "#E8110F" : "#22C55E";

  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
      {/* Glow effect */}
      <View
        style={[
          tw`absolute top-0 left-0 right-0 h-100 opacity-15`,
          { backgroundColor: phaseColor },
        ]}
      />

      <View style={tw`flex-1`}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center px-5 pt-4`}>
          <Text style={tw`text-white/60 text-sm`}>
            ROUND <Text style={tw`text-white font-bold`}>{currentRound}</Text>
            <Text style={tw`text-white/40`}>/{totalRounds}</Text>
          </Text>
          <Pressable
            style={tw`w-10 h-10 bg-[#141414] rounded-lg items-center justify-center border border-[#262626]`}
            onPress={handleComplete}
          >
            <Text style={tw`text-gray-500 text-lg`}>✕</Text>
          </Pressable>
        </View>

        {/* Main Timer Area */}
        <View style={tw`flex-1 items-center justify-center px-5`}>
          {/* Movement Name */}
          <Text style={tw`text-white text-2xl font-bold tracking-wide mb-8`}>
            {currentMovement || "FLYING SQUATS"}
          </Text>

          {/* Large Timer */}
          <Text
            style={[
              tw`text-9xl font-bold`,
              {
                color: phaseColor,
                textShadowColor: phaseColor,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 40,
              },
            ]}
          >
            {timeRemaining.toString().padStart(2, "0")}
          </Text>

          {/* Phase Indicator */}
          <View
            style={[
              tw`px-8 py-2 rounded mt-4 border`,
              { borderColor: phaseColor, backgroundColor: `${phaseColor}20` },
            ]}
          >
            <Text style={[tw`text-lg font-bold tracking-widest`, { color: phaseColor }]}>
              {isWork ? "WORK" : "REST"}
            </Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={tw`px-5 pb-8`}>
          {/* Up Next */}
          <View style={tw`bg-[#141414] rounded-xl p-4 mb-4 border border-[#262626] flex-row justify-between items-center`}>
            <View>
              <Text style={tw`text-white/40 text-xs`}>UP NEXT</Text>
              <Text style={tw`text-white font-semibold`}>{nextMovement || "BURPEE BOX JUMPS"}</Text>
            </View>
            <Text style={tw`text-white/40`}>→</Text>
          </View>

          {/* Stats Row */}
          <View style={tw`flex-row gap-3 mb-6`}>
            <View style={tw`flex-1 bg-[#141414] rounded-xl p-3 border border-[#262626]`}>
              <Text style={tw`text-white/40 text-xs`}>TIME</Text>
              <Text style={tw`text-white text-xl font-bold`}>{formatElapsedTime(elapsedTime || 0)}</Text>
            </View>
            <View style={tw`flex-1 bg-[#141414] rounded-xl p-3 border border-grhiit-red/30`}>
              <Text style={tw`text-white/40 text-xs`}>HR ZONE</Text>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-grhiit-red mr-1`}>❤️</Text>
                <Text style={tw`text-grhiit-red text-xl font-bold`}>Z5</Text>
              </View>
            </View>
            <View style={tw`flex-1 bg-[#141414] rounded-xl p-3 border border-[#262626]`}>
              <Text style={tw`text-white/40 text-xs`}>CALS</Text>
              <Text style={tw`text-white text-xl font-bold`}>412</Text>
            </View>
          </View>

          {/* Control Buttons */}
          <View style={tw`flex-row gap-4`}>
            <Pressable
              style={tw`flex-1 bg-transparent border-2 border-grhiit-red rounded-xl py-4 items-center justify-center`}
              onPress={isRunning ? pauseWorkout : resumeWorkout}
            >
              <Text style={tw`text-grhiit-red font-bold text-base`}>
                {isRunning ? "❚❚ PAUSE" : "▶ RESUME"}
              </Text>
            </Pressable>
            <Pressable
              style={tw`bg-[#141414] border border-[#262626] rounded-xl px-6 py-4 items-center justify-center`}
              onPress={() => tick()}
            >
              <Text style={tw`text-white/60 font-medium`}>SKIP →</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
