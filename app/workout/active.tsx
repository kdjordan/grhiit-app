import { View, Text, Pressable, Alert, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useUserStore } from "@/stores/userStore";
import { initializeAudio, playWorkBeep, playRestBeep, playBlockCompleteBeep, cleanupAudio } from "@/lib/audio";
import { sizing } from "@/lib/responsive";
import { TIMER_COLORS, TIMER_BG_COLORS, GRHIIT_RED, MUTED } from "@/constants/colors";
import tw from "@/lib/tw";

// Circular timer dimensions - responsive to screen size
const TIMER_SIZE = sizing.timerSize;
const STROKE_WIDTH = sizing.timerStroke;
const RADIUS = (TIMER_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Create animated circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Circular Progress Timer Component
function CircularTimer({
  seconds,
  totalDuration,
  color,
  phase,
}: {
  seconds: number;
  totalDuration: number; // Total seconds for this interval
  color: string;
  phase: string; // Current phase for unique key generation
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastPhaseKey = useRef<string>("");

  // Create a unique key for this phase/interval - include phase to differentiate work/rest with same duration
  const phaseKey = `${phase}-${totalDuration}-${seconds === totalDuration}`;

  useEffect(() => {
    // When a new interval starts (seconds equals totalDuration), restart animation
    if (seconds === totalDuration && phaseKey !== lastPhaseKey.current) {
      lastPhaseKey.current = phaseKey;
      animatedValue.setValue(0);

      Animated.timing(animatedValue, {
        toValue: 1,
        duration: totalDuration * 1000,
        useNativeDriver: false, // strokeDashoffset doesn't support native driver
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animatedValue is a ref, not a reactive dependency
  }, [seconds, totalDuration, phaseKey]);

  // Map animated value to stroke offset
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View style={{ width: TIMER_SIZE, height: TIMER_SIZE, alignItems: "center", justifyContent: "center" }}>
      <Svg width={TIMER_SIZE} height={TIMER_SIZE} style={{ position: "absolute" }}>
        {/* Background circle */}
        <Circle
          cx={TIMER_SIZE / 2}
          cy={TIMER_SIZE / 2}
          r={RADIUS}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={STROKE_WIDTH}
          fill="transparent"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={TIMER_SIZE / 2}
          cy={TIMER_SIZE / 2}
          r={RADIUS}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          fill="transparent"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${TIMER_SIZE / 2} ${TIMER_SIZE / 2})`}
        />
      </Svg>
      {/* Center seconds display */}
      <Text
        style={[
          tw`text-white font-bold`,
          {
            fontSize: sizing.timerFontSize,
            fontFamily: "SpaceGrotesk_700Bold",
            includeFontPadding: false,
          },
        ]}
      >
        {seconds}
      </Text>
    </View>
  );
}

// Phase colors imported from @/constants/colors:
// TIMER_COLORS: { work, rest, countdown } - ring/stroke colors
// TIMER_BG_COLORS: { work, rest, transition, countdown } - background colors

export default function ActiveWorkoutScreen() {
  const {
    workout,
    currentPhase,
    timeRemaining,
    currentBlockIndex,
    currentIntervalInBlock,
    isRunning,
    startWorkout,
    resetWorkout,
    tick,
    getCurrentBlock,
    getProgressPercent,
  } = useWorkoutStore();

  const currentBlock = getCurrentBlock();
  const progressPercent = getProgressPercent();

  // Get total duration for current phase (used for smooth animation)
  const getIntervalDuration = () => {
    if (currentPhase === "countdown") {
      return 15; // COUNTDOWN_DURATION
    }
    if (!currentBlock) return 0;
    if (currentPhase === "work") {
      return currentBlock.workDuration;
    }
    if (currentPhase === "rest" || currentPhase === "transition") {
      return currentBlock.restDuration;
    }
    return 0;
  };

  const intervalDuration = getIntervalDuration();

  // Track previous phase and block for audio triggers
  const prevPhaseRef = useRef(currentPhase);
  const prevBlockIndexRef = useRef(currentBlockIndex);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally run once on mount
  }, []);

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

  // Play 5 beeps when a block/combo completes
  // For combo blocks: only beep when leaving the combo entirely (different comboGroup)
  useEffect(() => {
    if (prevBlockIndexRef.current !== currentBlockIndex && currentBlockIndex > 0) {
      const prevBlock = workout?.blocks[prevBlockIndexRef.current];
      const currBlock = workout?.blocks[currentBlockIndex];

      // Skip beep if we're still in the same combo
      const sameCombo = prevBlock?.comboGroup && currBlock?.comboGroup &&
                        prevBlock.comboGroup === currBlock.comboGroup;

      if (!sameCombo) {
        playBlockCompleteBeep();
      }
    }
    prevBlockIndexRef.current = currentBlockIndex;
  }, [currentBlockIndex, workout]);

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

  // Handle cancel - mark as quit (X in progress grid)
  const quitWorkout = useUserStore((state) => state.quitWorkout);

  const handleCancel = () => {
    Alert.alert(
      "Quit Workout?",
      "Quitting will mark this workout as missed. Are you sure?",
      [
        { text: "Keep Going", style: "cancel" },
        {
          text: "Quit",
          style: "destructive",
          onPress: () => {
            quitWorkout(); // Mark as missed in progress grid
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
  const isRest = currentPhase === "rest" || currentPhase === "transition";
  const isSmoker = currentBlock?.isSmoker || currentBlock?.type === "SM";

  // Get background color - RED for work (intensity), BLACK for rest (recovery)
  // SMOKER: Always red (no true rest - hold position is active work)
  const bentoBgColor = isCountdown
    ? TIMER_BG_COLORS.countdown
    : isWork
    ? TIMER_BG_COLORS.work
    : isSmoker
    ? TIMER_BG_COLORS.work // Smoker stays red during "rest" (hold phase)
    : TIMER_BG_COLORS.rest;

  // Get display values
  // SMOKER: During rest phase, show the hold movement name (e.g., "PLANK")
  const getMovementName = () => {
    if (isCountdown) return "GET READY";
    if (!currentBlock) return "GET READY";

    if (isSmoker && isRest && currentBlock.holdMovement) {
      return currentBlock.holdMovement.displayName;
    }
    if (isSmoker && isWork && currentBlock.workMovement) {
      return currentBlock.workMovement.displayName;
    }
    return currentBlock.displayName;
  };

  const movementName = getMovementName();
  const showIntervalCounter = currentBlock && !currentBlock.isTransition && !isCountdown;

  // Calculate combo interval position if this block is part of a combo
  const getComboIntervalInfo = () => {
    if (!workout || !currentBlock?.comboGroup) {
      return { current: currentIntervalInBlock, total: currentBlock?.intervals || 1 };
    }

    // Find all blocks in this combo
    const comboBlocks = workout.blocks.filter(b => b.comboGroup === currentBlock.comboGroup);
    const totalComboIntervals = comboBlocks.length;

    // Find current position within combo (1-indexed)
    const currentComboPosition = workout.blocks
      .slice(0, currentBlockIndex + 1)
      .filter(b => b.comboGroup === currentBlock.comboGroup)
      .length;

    return { current: currentComboPosition, total: totalComboIntervals };
  };

  const intervalInfo = getComboIntervalInfo();

  // Show rep target during work phase (or smoker work phase)
  const getRepTarget = () => {
    if (!currentBlock || !isWork) return null;
    if (isSmoker && currentBlock.workMovement?.repTarget) {
      return currentBlock.workMovement.repTarget;
    }
    return currentBlock.repTarget;
  };
  const repTarget = getRepTarget();
  const showRepTarget = !!repTarget;

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
      {/* Progress Bar - RED (brand color) */}
      <View style={tw`w-full h-1 bg-border`}>
        <View
          style={[
            tw`h-full`,
            { width: `${progressPercent}%`, backgroundColor: GRHIIT_RED },
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
                  {intervalInfo.current}
                </Text>
                <Text style={tw`text-white/50`}>/{intervalInfo.total}</Text>
              </Text>
            ) : (
              // Empty during rest/transition - the color and movement name communicate state
              <View />
            )}
            <View style={tw`w-10 h-10`} />
          </View>

          {/* Main Timer Content */}
          <View style={tw`flex-1 items-center pt-4 px-5`}>
            {/* Movement Name */}
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[
                tw`text-white font-bold mb-2 text-center`,
                { fontFamily: "ChakraPetch_700Bold", fontSize: sizing.headerSmall, letterSpacing: 1 },
              ]}
            >
              {movementName}
            </Text>

            {/* Rep Target - fixed height container to prevent layout shift */}
            <View style={{ height: 28, marginBottom: 16, width: '100%', alignItems: "center", justifyContent: "center" }}>
              {showRepTarget ? (
                <View style={[tw`bg-white/20 px-3 py-0.5`, { borderRadius: 6 }]}>
                  <Text style={[tw`text-white text-xs`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
                    TARGET: {repTarget}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Circular Timer - color communicates state, no label needed */}
            {/* SMOKER: Ring stays red during hold phase */}
            <CircularTimer
              seconds={timeRemaining}
              totalDuration={intervalDuration}
              color={isWork ? TIMER_COLORS.work : isSmoker ? TIMER_COLORS.work : TIMER_COLORS.rest}
              phase={currentPhase}
            />

            {/* Show first exercise during countdown */}
            {isCountdown && workout && (() => {
              const firstBlock = workout.blocks[0];
              const isFirstSmoker = firstBlock?.isSmoker || firstBlock?.type === "SM";
              const displayName = isFirstSmoker && firstBlock.workMovement
                ? firstBlock.workMovement.displayName
                : firstBlock?.displayName;

              return (
                <View style={tw`mt-8 items-center`}>
                  <Text style={tw`text-white/50 text-xs tracking-wide mb-1`}>
                    FIRST UP
                  </Text>
                  {isFirstSmoker && (
                    <View style={tw`flex-row items-center mb-1`}>
                      <View style={tw`bg-warning/20 px-2 py-0.5 rounded mr-2`}>
                        <Text style={[tw`text-warning text-xs`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                          SMOKER
                        </Text>
                      </View>
                      {firstBlock.holdMovement && (
                        <Text style={[tw`text-warning/70 text-xs`, { fontFamily: "SpaceGrotesk_400Regular" }]}>
                          {firstBlock.holdMovement.displayName} hold
                        </Text>
                      )}
                    </View>
                  )}
                  <Text style={tw`text-white font-semibold`}>
                    {displayName}
                  </Text>
                </View>
              );
            })()}
          </View>
        </View>

        {/* Bottom Section */}
        <View style={tw`pb-6`}>
          {/* Up Next */}
          {upNextBlock && !isCountdown && (
            <View
              style={tw`bg-surface rounded-xl p-4 mb-4 border border-border flex-row justify-between items-center`}
            >
              <View>
                <Text style={tw`text-white/40 text-xs tracking-wide`}>
                  UP NEXT
                </Text>
                <Text style={tw`text-white font-semibold`}>
                  {upNextBlock.displayName}
                </Text>
              </View>
              <Feather name="arrow-right" size={16} color={MUTED} />
            </View>
          )}

          {/* Control Buttons */}
          <View style={tw`flex-row gap-4`}>
            <Pressable
              style={tw`flex-1 bg-surface border border-border rounded-xl py-4 items-center justify-center`}
              onPress={handleRestart}
            >
              <View style={tw`flex-row items-center`}>
                <Feather name="rotate-ccw" size={18} color={MUTED} />
                <Text style={tw`text-white/60 font-bold text-base ml-2`}>
                  RESTART
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={tw`flex-1 bg-transparent border border-border rounded-xl py-4 items-center justify-center`}
              onPress={handleCancel}
            >
              <View style={tw`flex-row items-center`}>
                <Feather name="x" size={18} color={MUTED} />
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
