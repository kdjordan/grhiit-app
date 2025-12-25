import { View, Text, Pressable, Animated, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState, useEffect, useRef } from "react";
import tw from "@/lib/tw";
import { GrhiitMark } from "@/components/GrhiitMark";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useUserStore } from "@/stores/userStore";
import { playBlockCompleteBeep } from "@/lib/audio";

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
          style={[
            tw`w-full bg-[#1a1a1a] p-5`,
            { borderRadius: 16, maxWidth: 320 }
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[
            tw`text-white text-center mb-5`,
            { fontFamily: "ChakraPetch_700Bold", fontSize: 18 }
          ]}>
            {title}
          </Text>

          <View style={tw`flex-row flex-wrap justify-center gap-3`}>
            {options.map((num) => (
              <Pressable
                key={num}
                style={[
                  tw`items-center justify-center`,
                  {
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    backgroundColor: selected === num ? "#EF4444" : "#262626",
                  }
                ]}
                onPress={() => onSelect(num)}
              >
                <Text style={[
                  tw`text-white`,
                  {
                    fontFamily: "SpaceGrotesk_700Bold",
                    fontSize: 20,
                  }
                ]}>
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
  const resetWorkout = useWorkoutStore((state) => state.resetWorkout);
  const completeWorkout = useUserStore((state) => state.completeWorkout);

  // Play completion sound and animate on mount
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
    // Mark workout as complete in user store
    // Convert elapsed seconds to minutes
    const minutes = Math.round(elapsedTime / 60);
    completeWorkout(minutes);

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
      },
    });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
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
          style={[
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            }
          ]}
        >
          {/* Title */}
          <View style={tw`items-center mb-8`}>
            <Text style={[
              tw`text-white text-center`,
              { fontFamily: "ChakraPetch_700Bold", fontSize: 28, letterSpacing: 2 }
            ]}>
              WORKOUT COMPLETE
            </Text>

            {/* Time */}
            <View style={tw`flex-row items-center mt-3`}>
              <Text style={[
                tw`text-white/60`,
                { fontFamily: "SpaceGrotesk_500Medium", fontSize: 18 }
              ]}>
                {formatTime(elapsedTime)}
              </Text>
            </View>
          </View>

          {/* SUMMIT REPS - Tap to select */}
          <View style={tw`mb-8`}>
            <Text style={[
              tw`text-white mb-1`,
              { fontSize: 13, letterSpacing: 1, fontFamily: "SpaceGrotesk_600SemiBold" }
            ]}>
              SUMMIT REPS
            </Text>
            <Text style={tw`text-white/50 text-xs mb-4`}>
              How many reps per Tabata interval?
            </Text>

            {/* Side by side picker buttons */}
            <View style={tw`flex-row gap-4`}>
              {/* BRP */}
              <View style={tw`flex-1`}>
                <Text style={[
                  tw`text-white/60 text-center mb-2`,
                  { fontFamily: "SpaceGrotesk_500Medium", fontSize: 12 }
                ]}>
                  BRP
                </Text>
                <Pressable
                  style={[
                    tw`items-center justify-center`,
                    {
                      backgroundColor: burpeeReps ? "#1a1a1a" : "#EF4444",
                      borderRadius: 12,
                      height: 72,
                      borderWidth: burpeeReps ? 2 : 0,
                      borderColor: "#EF4444",
                    }
                  ]}
                  onPress={() => setShowBrpPicker(true)}
                >
                  <Text style={[
                    {
                      fontFamily: "SpaceGrotesk_700Bold",
                      fontSize: burpeeReps ? 32 : 14,
                      color: "#FFFFFF",
                      letterSpacing: burpeeReps ? 0 : 2,
                    }
                  ]}>
                    {burpeeReps ?? "TAP"}
                  </Text>
                </Pressable>
              </View>

              {/* FLSQ */}
              <View style={tw`flex-1`}>
                <Text style={[
                  tw`text-white/60 text-center mb-2`,
                  { fontFamily: "SpaceGrotesk_500Medium", fontSize: 12 }
                ]}>
                  FLSQ
                </Text>
                <Pressable
                  style={[
                    tw`items-center justify-center`,
                    {
                      backgroundColor: flyingSquatReps ? "#1a1a1a" : "#EF4444",
                      borderRadius: 12,
                      height: 72,
                      borderWidth: flyingSquatReps ? 2 : 0,
                      borderColor: "#EF4444",
                    }
                  ]}
                  onPress={() => setShowFlsqPicker(true)}
                >
                  <Text style={[
                    {
                      fontFamily: "SpaceGrotesk_700Bold",
                      fontSize: flyingSquatReps ? 32 : 14,
                      color: "#FFFFFF",
                      letterSpacing: flyingSquatReps ? 0 : 2,
                    }
                  ]}>
                    {flyingSquatReps ?? "TAP"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* RATE THIS SESSION (Secondary) */}
          <View style={tw`mb-8`}>
            <Text style={[
              tw`text-white/40 mb-1`,
              { fontSize: 11, letterSpacing: 2, fontFamily: "SpaceGrotesk_500Medium" }
            ]}>
              RATE THIS SESSION
            </Text>
            <Text style={tw`text-white/70 text-base mb-4`}>
              How hard was this?
            </Text>

            <View style={tw`flex-row gap-3`}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <Pressable
                  key={rating}
                  style={[
                    tw`flex-1 py-3 items-center`,
                    {
                      borderRadius: 8,
                      backgroundColor: difficulty === rating ? "#EF4444" : "#1a1a1a",
                      borderWidth: 1,
                      borderColor: difficulty === rating ? "#EF4444" : "#262626",
                    }
                  ]}
                  onPress={() => setDifficulty(rating)}
                >
                  <Text
                    style={[
                      {
                        fontSize: 16,
                        fontFamily: "SpaceGrotesk_600SemiBold",
                        color: difficulty === rating ? "#FFFFFF" : "#6B7280",
                      }
                    ]}
                  >
                    {rating}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Scale labels */}
            <View style={tw`flex-row justify-between mt-2 px-1`}>
              <Text style={tw`text-white/30 text-xs`}>Easy</Text>
              <Text style={tw`text-white/30 text-xs`}>Brutal</Text>
            </View>
          </View>

          {/* Done Button - disabled until reps + difficulty entered */}
          {(() => {
            const isComplete = burpeeReps !== null && flyingSquatReps !== null && difficulty !== null;
            return (
              <Pressable
                style={[
                  tw`py-5 items-center mb-5`,
                  {
                    borderRadius: 16,
                    backgroundColor: isComplete ? "#EF4444" : "#262626",
                    shadowColor: "#EF4444",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: isComplete ? 0.35 : 0,
                    shadowRadius: 16,
                  }
                ]}
                onPress={isComplete ? handleDone : undefined}
                disabled={!isComplete}
              >
                <Text style={[
                  tw`text-lg`,
                  {
                    fontFamily: "SpaceGrotesk_700Bold",
                    color: isComplete ? "#FFFFFF" : "#4B5563",
                  }
                ]}>
                  DONE
                </Text>
              </Pressable>
            );
          })()}

          {/* Quote */}
          <Text style={tw`text-white/30 text-center text-sm italic`}>
            "You just proved something to yourself."
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Rep Picker Modals */}
      <RepPickerModal
        visible={showBrpPicker}
        title="BURPEES"
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
        title="FLYING SQUATS"
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
