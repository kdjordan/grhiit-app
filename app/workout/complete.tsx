import { View, Text, Pressable, Animated, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState, useEffect, useRef } from "react";
import tw from "@/lib/tw";
import { GrhiitMark } from "@/components/GrhiitMark";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useUserStore, SessionStats } from "@/stores/userStore";
import { playBlockCompleteBeep } from "@/lib/audio";
import { getSessionTagline } from "@/constants/sessionTaglines";

const GRHIIT_RED = "#EF4444";

// Format seconds to MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Generate range array
function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// Rep ranges for each movement
const BRP_RANGE = range(4, 12);   // 4-12 reps
const FLSQ_RANGE = range(8, 25);  // 8-25 reps

interface RepPickerModalProps {
  visible: boolean;
  title: string;
  options: number[];
  selected: number | null;
  onSelect: (value: number) => void;
  onClose: () => void;
}

function RepPickerModal({ visible, title, options, selected, onSelect, onClose }: RepPickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={tw`flex-1 bg-black/80 justify-center items-center px-6`}
        onPress={onClose}
      >
        <Pressable
          style={[tw`w-full bg-[#1a1a1a] p-5 max-w-80`, { borderRadius: 16 }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[tw`text-white text-center text-lg mb-5`, { fontFamily: "ChakraPetch_700Bold" }]}>
            {title}
          </Text>

          <View style={tw`flex-row flex-wrap justify-center gap-3`}>
            {options.map((num) => (
              <Pressable
                key={num}
                style={[
                  tw`w-13 h-13 items-center justify-center`,
                  {
                    borderRadius: 12,
                    backgroundColor: selected === num ? GRHIIT_RED : "#262626",
                  }
                ]}
                onPress={() => onSelect(num)}
              >
                <Text style={[tw`text-white text-lg`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                  {num}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function WorkoutCompleteScreen() {
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [burpeeReps, setBurpeeReps] = useState<number | null>(null);
  const [flyingSquatReps, setFlyingSquatReps] = useState<number | null>(null);
  const [showBrpPicker, setShowBrpPicker] = useState(false);
  const [showFlsqPicker, setShowFlsqPicker] = useState(false);

  // Animation values
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;

  // Get workout data
  const elapsedTime = useWorkoutStore((state) => state.elapsedTime);
  const workout = useWorkoutStore((state) => state.workout);
  const resetWorkout = useWorkoutStore((state) => state.resetWorkout);
  const completeWorkout = useUserStore((state) => state.completeWorkout);

  // Calculate workout summary from blocks
  const workoutSummary = (() => {
    if (!workout) return null;

    const blocks = workout.blocks;
    let brpIntervals = 0;
    let flsqIntervals = 0;
    const otherMovements: { movement: string; displayName: string; intervals: number; work: number; rest: number }[] = [];

    blocks.forEach((block) => {
      if (block.isTransition) return; // Skip REST blocks

      if (block.movement === "BRP") {
        brpIntervals += block.intervals;
      } else if (block.movement === "FLSQ") {
        flsqIntervals += block.intervals;
      } else {
        // Non-summit movements (8CBB, JSQ, etc.)
        const existing = otherMovements.find(m => m.movement === block.movement);
        if (existing) {
          existing.intervals += block.intervals;
        } else {
          otherMovements.push({
            movement: block.movement,
            displayName: block.displayName,
            intervals: block.intervals,
            work: block.workDuration,
            rest: block.restDuration,
          });
        }
      }
    });

    return {
      week: workout.week,
      day: workout.day,
      name: workout.name,
      brpIntervals,
      flsqIntervals,
      totalSummitIntervals: brpIntervals + flsqIntervals,
      otherMovements,
    };
  })();

  // Play completion sound on mount
  useEffect(() => {
    playBlockCompleteBeep();
  }, []);

  // Animate content after logomark animation completes
  const handleLogoAnimationComplete = () => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDone = () => {
    // Build session stats for user store
    const sessionStats: SessionStats = {
      brpReps: burpeeReps || 0,
      flsqReps: flyingSquatReps || 0,
      brpIntervals: workoutSummary?.brpIntervals || 0,
      flsqIntervals: workoutSummary?.flsqIntervals || 0,
      otherMovements: (workoutSummary?.otherMovements || []).map(m => ({
        movement: m.movement,
        intervals: m.intervals,
      })),
      difficulty: difficulty || 3,
      durationSeconds: elapsedTime,
    };

    // Mark workout as complete in user store (persists stats)
    completeWorkout(sessionStats);

    // Reset workout store
    resetWorkout();

    // Navigate to share screen with workout data
    router.push({
      pathname: "/workout/share",
      params: {
        time: formatTime(elapsedTime),
        brp: burpeeReps?.toString() || "0",
        flsq: flyingSquatReps?.toString() || "0",
        difficulty: difficulty?.toString() || "0",
        brpIntervals: workoutSummary?.brpIntervals.toString() || "0",
        flsqIntervals: workoutSummary?.flsqIntervals.toString() || "0",
        totalSummitIntervals: workoutSummary?.totalSummitIntervals.toString() || "0",
        week: workoutSummary?.week.toString() || "1",
        day: workoutSummary?.day.toString() || "1",
        workoutName: workoutSummary?.name || "",
        otherMovements: JSON.stringify(workoutSummary?.otherMovements || []),
      },
    });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-5 pt-12 pb-8`}
        keyboardShouldPersistTaps="handled"
      >
        {/* Animated Logomark */}
        <View style={tw`items-center mb-6`}>
          <GrhiitMark
            size={100}
            animate={true}
            onAnimationComplete={handleLogoAnimationComplete}
          />
        </View>

        {/* Content that fades in after logo animation */}
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          {/* Title - Week X - Day Y COMPLETE */}
          <View style={tw`items-center mb-8`}>
            <Text style={[tw`text-white text-2xl text-center`, { fontFamily: "ChakraPetch_700Bold", letterSpacing: 2 }]}>
              Week {workoutSummary?.week || 1} - Day {workoutSummary?.day || 1}
            </Text>
            <Text style={[tw`text-[#6B7280] text-sm text-center mt-1`, { fontFamily: "ChakraPetch_700Bold", letterSpacing: 2 }]}>
              COMPLETE
            </Text>

            {/* Time */}
            <Text style={[tw`text-[#6B7280] text-base mt-3`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
              {formatTime(elapsedTime)}
            </Text>
          </View>

          {/* SUMMIT REPS */}
          <View style={tw`mb-8`}>
            <Text style={[tw`text-[#6B7280] text-xs mb-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
              SUMMIT REPS
            </Text>
            <Text style={[tw`text-[#6B7280] text-xs mb-4`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
              What rep count did you hold across Summit intervals?
            </Text>

            {/* Side by side picker buttons */}
            <View style={tw`flex-row gap-4`}>
              {/* SUMMIT — BURPEES */}
              <View style={tw`flex-1`}>
                <Text style={[tw`text-[#6B7280] text-xs text-center mb-2`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                  SUMMIT — BURPEES
                </Text>
                <Pressable
                  style={[
                    tw`items-center justify-center h-16`,
                    {
                      backgroundColor: burpeeReps ? "#1a1a1a" : GRHIIT_RED,
                      borderRadius: 12,
                      borderWidth: burpeeReps ? 2 : 0,
                      borderColor: GRHIIT_RED,
                    }
                  ]}
                  onPress={() => setShowBrpPicker(true)}
                >
                  <Text style={[
                    tw`text-white`,
                    {
                      fontFamily: "SpaceGrotesk_700Bold",
                      fontSize: burpeeReps ? 28 : 12,
                      letterSpacing: burpeeReps ? 0 : 2,
                    }
                  ]}>
                    {burpeeReps ?? "TAP"}
                  </Text>
                </Pressable>
              </View>

              {/* SUMMIT — FLSQ */}
              <View style={tw`flex-1`}>
                <Text style={[tw`text-[#6B7280] text-xs text-center mb-2`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                  SUMMIT — FLSQ
                </Text>
                <Pressable
                  style={[
                    tw`items-center justify-center h-16`,
                    {
                      backgroundColor: flyingSquatReps ? "#1a1a1a" : GRHIIT_RED,
                      borderRadius: 12,
                      borderWidth: flyingSquatReps ? 2 : 0,
                      borderColor: GRHIIT_RED,
                    }
                  ]}
                  onPress={() => setShowFlsqPicker(true)}
                >
                  <Text style={[
                    tw`text-white`,
                    {
                      fontFamily: "SpaceGrotesk_700Bold",
                      fontSize: flyingSquatReps ? 28 : 12,
                      letterSpacing: flyingSquatReps ? 0 : 2,
                    }
                  ]}>
                    {flyingSquatReps ?? "TAP"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* RATE THIS SESSION */}
          <View style={tw`mb-8`}>
            <Text style={[tw`text-[#6B7280] text-xs mb-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
              RATE THIS SESSION
            </Text>
            <Text style={[tw`text-white text-base mb-4`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
              How close to the edge was this?
            </Text>

            <View style={tw`flex-row gap-3`}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <Pressable
                  key={rating}
                  style={[
                    tw`flex-1 items-center py-3`,
                    {
                      borderRadius: 8,
                      backgroundColor: difficulty === rating ? GRHIIT_RED : "#1a1a1a",
                      borderWidth: 1,
                      borderColor: difficulty === rating ? GRHIIT_RED : "#262626",
                    }
                  ]}
                  onPress={() => setDifficulty(rating)}
                >
                  <Text style={[
                    tw`text-base`,
                    {
                      fontFamily: "SpaceGrotesk_600SemiBold",
                      color: difficulty === rating ? "#FFFFFF" : "#6B7280",
                    }
                  ]}>
                    {rating}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Scale labels */}
            <View style={tw`flex-row justify-between mt-2 px-1`}>
              <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>Comfortable</Text>
              <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>Very hard</Text>
              <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>Maximal</Text>
            </View>
          </View>

          {/* Done Button - Always enabled */}
          <Pressable
            style={[
              tw`items-center py-4 mb-5`,
              {
                borderRadius: 16,
                backgroundColor: GRHIIT_RED,
                shadowColor: GRHIIT_RED,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.35,
                shadowRadius: 16,
              }
            ]}
            onPress={handleDone}
          >
            <Text style={[tw`text-white text-base`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
              DONE
            </Text>
          </Pressable>

          {/* Session Tagline */}
          <Text style={[tw`text-[#4B5563] text-sm text-center italic`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
            "{getSessionTagline(workoutSummary?.week || 1, workoutSummary?.day || 1)}"
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Rep Picker Modals */}
      <RepPickerModal
        visible={showBrpPicker}
        title="SUMMIT — BURPEES"
        options={BRP_RANGE}
        selected={burpeeReps}
        onSelect={(value) => {
          setBurpeeReps(value);
          setShowBrpPicker(false);
        }}
        onClose={() => setShowBrpPicker(false)}
      />

      <RepPickerModal
        visible={showFlsqPicker}
        title="SUMMIT — FLYING SQUATS"
        options={FLSQ_RANGE}
        selected={flyingSquatReps}
        onSelect={(value) => {
          setFlyingSquatReps(value);
          setShowFlsqPicker(false);
        }}
        onClose={() => setShowFlsqPicker(false)}
      />
    </SafeAreaView>
  );
}
