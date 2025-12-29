import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tw";
import { useDevStore, isDevWorkoutSelectEnabled } from "@/stores/devStore";
import { useUserStore } from "@/stores/userStore";
import {
  getAllWorkouts,
  getUniqueMovements,
} from "@/lib/workoutLoader";
import { WorkoutProgram } from "@/types";
import { sizing, scale } from "@/lib/responsive";

interface WorkoutCardProps {
  workout: WorkoutProgram;
  workoutNumber: number;
  currentWorkoutNumber: number;
  isDevMode: boolean;
  onPress: () => void;
}

function WorkoutCard({ workout, workoutNumber, currentWorkoutNumber, isDevMode, onPress }: WorkoutCardProps) {
  const movements = getUniqueMovements(workout);
  const durationMinutes = Math.round(workout.totalDuration / 60);

  // Workout is unlocked if it's <= current workout number, or if in dev mode
  const isUnlocked = isDevMode || workoutNumber <= currentWorkoutNumber;
  const isCompleted = workoutNumber < currentWorkoutNumber;
  const isCurrent = workoutNumber === currentWorkoutNumber;

  return (
    <View
      style={[
        tw`bg-[#141414] mb-4 border`,
        isCurrent ? tw`border-grhiit-red/40` : tw`border-[#262626]`,
        !isUnlocked && tw`opacity-60`,
        { borderRadius: scale(16), padding: scale(20) },
      ]}
    >
      {/* Header */}
      <View style={tw`flex-row justify-between items-start mb-3`}>
        <View style={tw`flex-row items-center`}>
          {/* Status indicator */}
          {isCompleted && (
            <View style={[tw`bg-[#22C55E]/20 rounded-full mr-3`, { padding: scale(6) }]}>
              <Feather name="check" size={scale(14)} color="#22C55E" />
            </View>
          )}
          {isCurrent && (
            <View style={[tw`bg-grhiit-red/20 rounded-full mr-3`, { padding: scale(6) }]}>
              <Feather name="play" size={scale(14)} color="#EF4444" />
            </View>
          )}
          {!isUnlocked && (
            <View style={[tw`bg-[#262626] rounded-full mr-3`, { padding: scale(6) }]}>
              <Feather name="lock" size={scale(14)} color="#6B7280" />
            </View>
          )}
          <View>
            <Text
              style={[
                tw`text-white/50 mb-1`,
                { fontFamily: "SpaceGrotesk_500Medium", fontSize: sizing.caption, letterSpacing: 1.5 },
              ]}
            >
              WEEK {workout.week} • DAY {workout.day}
            </Text>
            <Text
              style={[
                tw`text-white`,
                { fontFamily: "ChakraPetch_700Bold", fontSize: sizing.headerSmall },
              ]}
            >
              {workout.name}
            </Text>
          </View>
        </View>
        <View style={tw`flex-row items-center`}>
          <Feather name="clock" size={scale(14)} color="#6B7280" />
          <Text
            style={[
              tw`text-white/50 ml-1`,
              { fontFamily: "SpaceGrotesk_500Medium", fontSize: sizing.bodySmall },
            ]}
          >
            {durationMinutes} min
          </Text>
        </View>
      </View>

      {/* Movements */}
      <View style={tw`flex-row flex-wrap gap-2 mb-4`}>
        {movements.map((movement) => (
          <View
            key={movement}
            style={tw`bg-[#262626] px-2.5 py-1 rounded-lg`}
          >
            <Text
              style={[
                tw`text-white/60 text-xs`,
                { fontFamily: "SpaceGrotesk_500Medium" },
              ]}
            >
              {movement}
            </Text>
          </View>
        ))}
      </View>

      {/* Action Button */}
      {isUnlocked ? (
        <Pressable
          style={[tw`bg-grhiit-red items-center justify-center`, { borderRadius: scale(12), paddingVertical: scale(12) }]}
          onPress={onPress}
        >
          <Text
            style={[
              tw`text-white`,
              { fontFamily: "SpaceGrotesk_700Bold", fontSize: sizing.bodyMedium },
            ]}
          >
            {isCompleted ? "REPEAT" : "START"}
          </Text>
        </Pressable>
      ) : (
        <View style={[tw`bg-[#262626] items-center justify-center`, { borderRadius: scale(12), paddingVertical: scale(12) }]}>
          <Text
            style={[
              tw`text-white/30`,
              { fontFamily: "SpaceGrotesk_700Bold", fontSize: sizing.bodyMedium },
            ]}
          >
            LOCKED
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TrainScreen() {
  const { setSelectedWorkoutId } = useDevStore();
  const { getCurrentWorkoutNumber } = useUserStore();
  const workouts = getAllWorkouts();
  const isDevMode = isDevWorkoutSelectEnabled();
  const currentWorkoutNumber = getCurrentWorkoutNumber();

  const handleSelectWorkout = (workout: WorkoutProgram) => {
    // Set the selected workout and navigate to preview
    setSelectedWorkoutId(workout.id);
    router.push("/workout");
  };

  // Calculate workout number from week/day (week 1 day 1 = 1, week 1 day 2 = 2, etc.)
  const getWorkoutNumber = (workout: WorkoutProgram): number => {
    return (workout.week - 1) * 3 + workout.day;
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
      {/* Header */}
      <View style={[tw`pt-4 pb-4`, { paddingHorizontal: sizing.paddingHorizontal }]}>
        <Text
          style={[
            tw`text-white`,
            { fontFamily: "ChakraPetch_700Bold", fontSize: sizing.headerMedium },
          ]}
        >
          Sessions
        </Text>
        <Text
          style={[
            tw`text-white/40 mt-1`,
            { fontFamily: "SpaceGrotesk_400Regular", fontSize: sizing.bodySmall },
          ]}
        >
          {workouts.length} workouts available
        </Text>
      </View>

      {/* Workout List */}
      <ScrollView
        style={tw`flex-1 px-5`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-8`}
      >
        {workouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            workoutNumber={getWorkoutNumber(workout)}
            currentWorkoutNumber={currentWorkoutNumber}
            isDevMode={isDevMode}
            onPress={() => handleSelectWorkout(workout)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
