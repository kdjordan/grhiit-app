import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tw";
import { useWorkoutStore } from "@/stores/workoutStore";
import {
  SAMPLE_WORKOUT,
  calculateWorkoutDuration,
  formatDuration,
  getUniqueMovements,
} from "@/constants/sampleWorkout";
import { WorkoutBlock } from "@/types";

export default function WorkoutPreviewScreen() {
  const { setWorkout } = useWorkoutStore();

  // Load sample workout on mount
  useEffect(() => {
    setWorkout(SAMPLE_WORKOUT);
  }, []);

  const totalDuration = calculateWorkoutDuration(SAMPLE_WORKOUT);
  const uniqueMovements = getUniqueMovements(SAMPLE_WORKOUT);
  const totalBlocks = SAMPLE_WORKOUT.blocks.filter((b) => !b.isTransition).length;

  const handleStart = () => {
    router.push("/workout/active");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-32`}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={tw`px-5 pt-4`}>
          <Pressable
            onPress={() => router.back()}
            style={tw`flex-row items-center mb-6`}
          >
            <Feather name="arrow-left" size={20} color="#6B7280" />
            <Text style={tw`text-gray-500 ml-2`}>Back</Text>
          </Pressable>

          {/* Workout Title */}
          <Text style={tw`text-white/50 text-xs tracking-widest mb-1`}>
            WEEK {SAMPLE_WORKOUT.week} • DAY {SAMPLE_WORKOUT.day}
          </Text>
          <Text
            style={[
              tw`text-white text-3xl font-bold mb-2`,
              { fontFamily: "ChakraPetch_700Bold" },
            ]}
          >
            {SAMPLE_WORKOUT.name}
          </Text>

          {/* Stats Row */}
          <View style={tw`flex-row items-center gap-4 mb-8`}>
            <View style={tw`flex-row items-center`}>
              <Feather name="clock" size={14} color="#6B7280" />
              <Text style={tw`text-gray-500 ml-1`}>
                {formatDuration(totalDuration)}
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Feather name="layers" size={14} color="#6B7280" />
              <Text style={tw`text-gray-500 ml-1`}>
                {totalBlocks} exercises
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Feather name="activity" size={14} color="#6B7280" />
              <Text style={tw`text-gray-500 ml-1`}>
                {uniqueMovements.length} movements
              </Text>
            </View>
          </View>
        </View>

        {/* Workout Breakdown */}
        <View style={tw`px-5`}>
          <Text style={tw`text-white/40 text-xs tracking-widest mb-4`}>
            SESSION BREAKDOWN
          </Text>

          {SAMPLE_WORKOUT.blocks.map((block, index) => (
            <BlockRow key={block.id} block={block} index={index} />
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={tw`absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-grhiit-black`}>
        <Pressable
          style={[
            tw`bg-grhiit-red py-4 flex-row items-center justify-center`,
            {
              borderRadius: 16,
              shadowColor: "#EF4444",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
            },
          ]}
          onPress={handleStart}
        >
          <Feather name="play" size={20} color="#FFFFFF" />
          <Text
            style={[
              tw`text-white text-lg font-bold ml-2 tracking-wide`,
              { fontFamily: "SpaceGrotesk_700Bold" },
            ]}
          >
            LET'S GO
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// Block row component
function BlockRow({ block, index }: { block: WorkoutBlock; index: number }) {
  if (block.isTransition) {
    // REST transition - show as divider
    return (
      <View style={tw`flex-row items-center py-3`}>
        <View style={tw`flex-1 h-px bg-[#262626]`} />
        <Text style={tw`text-white/30 text-xs mx-4 tracking-wide`}>
          {block.restDuration}s REST
        </Text>
        <View style={tw`flex-1 h-px bg-[#262626]`} />
      </View>
    );
  }

  // Regular exercise block
  return (
    <View
      style={tw`bg-[#141414] rounded-xl p-4 mb-2 border border-[#262626]`}
    >
      <View style={tw`flex-row items-start justify-between`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-white font-semibold text-base`}>
            {block.displayName}
          </Text>
          <Text style={tw`text-white/50 text-sm mt-1`}>
            {block.intervals} × ({block.workDuration}s work / {block.restDuration}s rest)
          </Text>
        </View>

        {/* Rep target badge */}
        {block.repTarget && (
          <View
            style={tw`bg-grhiit-red/20 px-3 py-1 rounded-full border border-grhiit-red/30`}
          >
            <Text style={tw`text-grhiit-red text-xs font-semibold`}>
              TARGET: {block.repTarget}
            </Text>
          </View>
        )}
      </View>

      {/* Duration */}
      <View style={tw`flex-row items-center mt-3`}>
        <View style={tw`h-1 flex-1 bg-[#262626] rounded-full overflow-hidden`}>
          <View
            style={[
              tw`h-full bg-grhiit-red/50 rounded-full`,
              {
                width: `${Math.min(
                  ((block.workDuration + block.restDuration) * block.intervals) / 5,
                  100
                )}%`,
              },
            ]}
          />
        </View>
        <Text
          style={[
            tw`text-white/40 text-xs ml-3`,
            { fontFamily: "JetBrainsMono_400Regular" },
          ]}
        >
          {formatDuration(
            (block.workDuration + block.restDuration) * block.intervals
          )}
        </Text>
      </View>
    </View>
  );
}
