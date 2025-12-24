import { View, Text, Pressable, Alert, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { useWorkoutStore } from "@/stores/workoutStore";
import { formatDuration } from "@/constants/sampleWorkout";
import { initializeAudio, playWorkBeep, playRestBeep, cleanupAudio } from "@/lib/audio";
import tw from "@/lib/tw";

// Phase colors - WORK is green, REST is red, TRANSITION is yellow
const COLORS = {
  work: "#22C55E",      // Green for work
  rest: "#EF4444",      // Red for rest
  transition: "#F59E0B", // Yellow/amber for transitions
  countdown: "#374151",  // Gray for countdown
};

// Solid background colors for bento
const BG_COLORS = {
  work: "#166534",      // Dark green
  rest: "#991B1B",      // Dark red
  transition: "#92400E", // Dark amber
  countdown: "#1F2937",  // Dark gray
};

export default function ActiveWorkoutScreen() {
  const {
    workout,
    currentPhase,
    timeRemaining,
    currentBlockIndex,
    currentIntervalInBlock,
    isRunning,
    elapsedTime,
    totalDuration,
    startWorkout,
    resetWorkout,
    tick,
    getCurrentBlock,
    getProgressPercent,
  } = useWorkoutStore();

  const currentBlock = getCurrentBlock();
  const progressPercent = getProgressPercent();

  // Split time into tens and ones digits
  const timeStr = timeRemaining.toString().padStart(2, "0");
  const tensDigit = timeStr[0];
  const onesDigit = timeStr[1];

  // Animation for ones digit only
  const onesTranslateY = useRef(new Animated.Value(0)).current;
  const prevOnesRef = useRef(onesDigit);

  // Track previous phase for audio triggers
  const prevPhaseRef = useRef(currentPhase);

  // Initialize audio on mount
  useEffect(() => {
    initializeAudio();
    return () => {
      cleanupAudio();
    };
  }, []);

  // Start workout on mount
  useEffect(() => {
    startWorkout();
  }, []);

  // Animate only the ones digit rolling
  useEffect(() => {
    if (prevOnesRef.current !== onesDigit) {
      // Reset position instantly, then animate up
      onesTranslateY.setValue(60); // Start from below
      Animated.spring(onesTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 12,
      }).start();

      prevOnesRef.current = onesDigit;
    }
  }, [onesDigit]);

  // Play audio on phase changes
  useEffect(() => {
    if (prevPhaseRef.current !== currentPhase) {
      if (currentPhase === "work") {
        playWorkBeep();
      } else if (currentPhase === "rest" || currentPhase === "transition") {
        playRestBeep();
      }
      prevPhaseRef.current = currentPhase;
    }
  }, [currentPhase]);

  // Countdown beeps at 3, 2, 1
  useEffect(() => {
    if (currentPhase === "countdown" && timeRemaining <= 3 && timeRemaining > 0) {
      playRestBeep();
    }
  }, [currentPhase, timeRemaining]);

  // Timer tick - always running, no pause
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  // Navigate to complete screen when done
  useEffect(() => {
    if (currentPhase === "complete") {
      router.replace("/workout/complete");
    }
  }, [currentPhase]);

  // Handle restart
  const handleRestart = () => {
    Alert.alert(
      "Restart Workout?",
      "This will reset your progress and start from the beginning.",
      [
        { text: "Keep Going", style: "cancel" },
        {
          text: "Restart",
          style: "destructive",
          onPress: () => {
            resetWorkout();
            startWorkout();
          },
        },
      ]
    );
  };

  // Handle cancel
  const handleCancel = () => {
    Alert.alert(
      "Cancel Workout?",
      "Are you sure you want to quit? This session won't be saved.",
      [
        { text: "Keep Going", style: "cancel" },
        {
          text: "Quit",
          style: "destructive",
          onPress: () => {
            resetWorkout();
            router.replace("/(tabs)");
          },
        },
      ]
    );
  };

  // Determine phase states
  const isCountdown = currentPhase === "countdown";
  const isWork = currentPhase === "work";
  const isTransition = currentPhase === "transition";
  const isRest = currentPhase === "rest";

  // Get phase color for text
  const phaseColor = isCountdown
    ? "#FFFFFF"
    : isWork
    ? COLORS.work
    : isTransition
    ? COLORS.transition
    : COLORS.rest;

  // Get solid background color for bento
  const bentoBgColor = isCountdown
    ? BG_COLORS.countdown
    : isWork
    ? BG_COLORS.work
    : isTransition
    ? BG_COLORS.transition
    : BG_COLORS.rest;

  // Get display values
  const movementName = isCountdown
    ? "GET READY"
    : currentBlock?.displayName || "GET READY";
  const showIntervalCounter = currentBlock && !currentBlock.isTransition && !isCountdown;
  const showRepTarget = currentBlock?.repTarget && isWork;

  // Find next non-transition block for "UP NEXT"
  const getUpNextBlock = () => {
    if (!workout) return null;
    for (let i = currentBlockIndex + 1; i < workout.blocks.length; i++) {
      if (!workout.blocks[i].isTransition) {
        return workout.blocks[i];
      }
    }
    return null;
  };
  const upNextBlock = getUpNextBlock();

  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
      {/* Progress Bar */}
      <View style={tw`w-full h-1 bg-[#262626]`}>
        <View
          style={[
            tw`h-full`,
            { width: `${progressPercent}%`, backgroundColor: COLORS.work },
          ]}
        />
      </View>

      <View style={tw`flex-1 px-4 pt-4`}>
        {/* Timer Bento - solid phase color background */}
        <View
          style={[
            tw`flex-1 rounded-3xl mb-4 overflow-hidden`,
            { backgroundColor: bentoBgColor },
          ]}
        >
          {/* Header inside bento */}
          <View style={tw`flex-row justify-between items-center px-5 pt-5`}>
            {isCountdown ? (
              <Text style={tw`text-white/70 text-sm tracking-wide`}>
                STARTING IN...
              </Text>
            ) : showIntervalCounter ? (
              <Text style={tw`text-white/70 text-sm`}>
                INTERVAL{" "}
                <Text style={tw`text-white font-bold`}>
                  {currentIntervalInBlock}
                </Text>
                <Text style={tw`text-white/50`}>/{currentBlock?.intervals}</Text>
              </Text>
            ) : (
              <Text style={tw`text-white/50 text-sm tracking-wide`}>
                {isTransition ? "TRANSITION" : ""}
              </Text>
            )}
            <View style={tw`w-10 h-10`} />
          </View>

          {/* Main Timer Content */}
          <View style={tw`flex-1 items-center justify-center px-5`}>
            {/* Movement Name */}
            <Text
              style={[
                tw`text-white text-2xl font-bold tracking-wide mb-2`,
                { fontFamily: "ChakraPetch_700Bold" },
              ]}
            >
              {movementName}
            </Text>

            {/* Rep Target */}
            {showRepTarget && (
              <View
                style={tw`bg-white/20 px-4 py-1 rounded-full mb-6`}
              >
                <Text style={tw`text-white text-sm font-semibold`}>
                  TARGET: {currentBlock.repTarget}
                </Text>
              </View>
            )}

            {!showRepTarget && <View style={tw`mb-6`} />}

            {/* Large Timer - tens digit static, ones digit rolls */}
            <View style={tw`flex-row items-center justify-center`}>
              {/* Tens digit - static */}
              <Text
                style={[
                  tw`font-bold text-white`,
                  {
                    fontSize: 120,
                    lineHeight: 140,
                    fontFamily: "JetBrainsMono_700Bold",
                  },
                ]}
              >
                {tensDigit}
              </Text>

              {/* Ones digit - animated roll */}
              <View style={[tw`overflow-hidden`, { height: 140, width: 72 }]}>
                <Animated.Text
                  style={[
                    tw`font-bold text-white`,
                    {
                      fontSize: 120,
                      lineHeight: 140,
                      fontFamily: "JetBrainsMono_700Bold",
                      transform: [{ translateY: onesTranslateY }],
                    },
                  ]}
                >
                  {onesDigit}
                </Animated.Text>
              </View>
            </View>

            {/* Phase Indicator */}
            <View
              style={tw`bg-white/20 px-8 py-2 rounded-lg mt-4`}
            >
              <Text
                style={tw`text-white text-lg font-bold tracking-widest`}
              >
                {isCountdown ? "GET READY" : isWork ? "WORK" : "REST"}
              </Text>
            </View>

            {/* Show first exercise during countdown */}
            {isCountdown && workout && (
              <View style={tw`mt-6 items-center`}>
                <Text style={tw`text-white/50 text-xs tracking-wide mb-1`}>
                  FIRST UP
                </Text>
                <Text style={tw`text-white font-semibold`}>
                  {workout.blocks[0]?.displayName}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom Section */}
        <View style={tw`pb-6`}>
          {/* Up Next */}
          {upNextBlock && !isCountdown && (
            <View
              style={tw`bg-[#141414] rounded-xl p-4 mb-4 border border-[#262626] flex-row justify-between items-center`}
            >
              <View>
                <Text style={tw`text-white/40 text-xs tracking-wide`}>
                  UP NEXT
                </Text>
                <Text style={tw`text-white font-semibold`}>
                  {upNextBlock.displayName}
                </Text>
              </View>
              <Feather name="arrow-right" size={16} color="#6B7280" />
            </View>
          )}

          {/* Stats Row */}
          <View style={tw`flex-row gap-3 mb-4`}>
            <View
              style={tw`flex-1 bg-[#141414] rounded-xl p-3 border border-[#262626]`}
            >
              <Text style={tw`text-white/40 text-xs`}>ELAPSED</Text>
              <Text
                style={[
                  tw`text-white text-xl font-bold`,
                  { fontFamily: "JetBrainsMono_600SemiBold" },
                ]}
              >
                {formatDuration(elapsedTime)}
              </Text>
            </View>
            <View
              style={tw`flex-1 bg-[#141414] rounded-xl p-3 border border-[#262626]`}
            >
              <Text style={tw`text-white/40 text-xs`}>REMAINING</Text>
              <Text
                style={[
                  tw`text-white text-xl font-bold`,
                  { fontFamily: "JetBrainsMono_600SemiBold" },
                ]}
              >
                {formatDuration(Math.max(0, totalDuration - elapsedTime))}
              </Text>
            </View>
            <View
              style={[
                tw`flex-1 bg-[#141414] rounded-xl p-3 border`,
                { borderColor: `${COLORS.work}50` },
              ]}
            >
              <Text style={tw`text-white/40 text-xs`}>PROGRESS</Text>
              <Text
                style={[
                  tw`text-xl font-bold`,
                  { fontFamily: "JetBrainsMono_600SemiBold", color: COLORS.work },
                ]}
              >
                {Math.round(progressPercent)}%
              </Text>
            </View>
          </View>

          {/* Control Buttons */}
          <View style={tw`flex-row gap-4`}>
            <Pressable
              style={tw`flex-1 bg-[#141414] border border-[#262626] rounded-xl py-4 items-center justify-center`}
              onPress={handleRestart}
            >
              <View style={tw`flex-row items-center`}>
                <Feather name="rotate-ccw" size={18} color="#6B7280" />
                <Text style={tw`text-white/60 font-bold text-base ml-2`}>
                  RESTART
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={tw`flex-1 bg-transparent border border-[#262626] rounded-xl py-4 items-center justify-center`}
              onPress={handleCancel}
            >
              <View style={tw`flex-row items-center`}>
                <Feather name="x" size={18} color="#6B7280" />
                <Text style={tw`text-white/40 font-bold text-base ml-2`}>
                  CANCEL
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
