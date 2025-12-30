import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tw";
import { GrhiitMark, ProgressGrid } from "@/components";
import { useUserStore } from "@/stores/userStore";
import { useDevStore, isDevWorkoutSelectEnabled } from "@/stores/devStore";
import { getWorkoutByNumber } from "@/lib/workoutLoader";
import { sizing, scale, verticalScale } from "@/lib/responsive";

export default function HomeScreen() {
  // Get from user store
  const {
    completedWorkoutIds,
    missedWorkoutIds,
    getCurrentWorkoutNumber,
    resetProgress,
    totalSeconds,
    setDevProgress,
    completeWorkout,
  } = useUserStore();

  // DEV: Quick complete current workout with mock data
  const handleDevComplete = () => {
    completeWorkout({
      brpReps: 6,
      flsqReps: 12,
      brpIntervals: 4,
      flsqIntervals: 4,
      otherMovements: [],
      difficulty: 3,
      durationSeconds: 900, // 15 min
    });
  };

  // DEV: Workout selection mode
  const { selectedWorkoutId, selectWorkout, clearSelection } = useDevStore();
  const isDevMode = isDevWorkoutSelectEnabled();
  const isDev = process.env.EXPO_PUBLIC_DEV_SKIP_AUTH === "true";

  const completedWorkouts = completedWorkoutIds;
  const missedWorkouts = missedWorkoutIds;
  const currentWorkout = getCurrentWorkoutNumber();

  // Handle workout selection in dev mode
  const handleSelectWorkout = (workoutNum: number) => {
    const workout = getWorkoutByNumber(workoutNum);
    if (workout) {
      selectWorkout(workout.id);
      router.push("/workout");
    }
  };

  // Calculate stats
  const totalSessionsInProgram = 24;
  const completedCount = completedWorkouts.length;

  // Format total time (seconds to M:SS or H:MM:SS)
  const formatTotalTime = (secs: number): string => {
    if (secs === 0) return "0:00";
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate week and session within week
  const currentWeek = Math.ceil(currentWorkout / 3);
  const sessionInWeek = ((currentWorkout - 1) % 3) + 1;

  // Calculate sessions completed in current week
  const getSessionsThisWeek = (): number => {
    const weekStart = (currentWeek - 1) * 3 + 1;
    const weekEnd = currentWeek * 3;
    return completedWorkouts.filter(w => w >= weekStart && w <= weekEnd).length;
  };
  const sessionsThisWeek = getSessionsThisWeek();

  return (
    <SafeAreaView style={tw`flex-1 bg-black`} edges={['top']}>
      <View style={tw`flex-1`}>
        {/* Header */}
        <View style={tw`px-5 pt-4`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center`}>
              <GrhiitMark size={32} />
              <View style={tw`ml-3`}>
                <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1.5 }]}>
                  GRHIIT · CYCLE 1
                </Text>
                <Text style={[tw`text-white text-lg mt-0.5`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
                  Week {currentWeek} · Session {sessionInWeek}
                </Text>
              </View>
            </View>
            {isDev && (
              <View style={tw`flex-row gap-2`}>
                <Pressable
                  onPress={handleDevComplete}
                  style={tw`px-3 py-1.5 bg-[#22C55E]/20 rounded-lg`}
                >
                  <Text style={[tw`text-[#22C55E] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                    +1
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setDevProgress(2, 1)}
                  style={tw`px-3 py-1.5 bg-[#262626] rounded-lg`}
                >
                  <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                    W2
                  </Text>
                </Pressable>
                <Pressable
                  onPress={resetProgress}
                  style={tw`px-3 py-1.5 bg-[#262626] rounded-lg`}
                >
                  <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                    RESET
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* Progress Bento */}
        <View style={tw`px-4 pt-6`}>
          <View style={tw`flex-row items-center justify-between mb-2 ml-1`}>
            <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
              PROGRESS
            </Text>
            {isDevMode && (
              <Text style={[tw`text-[#22C55E] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                TAP TO SELECT
              </Text>
            )}
          </View>
          <View style={[tw`bg-[#1a1a1a] p-4`, { borderRadius: 16 }]}>
            <ProgressGrid
              completedWorkouts={completedWorkouts}
              missedWorkouts={missedWorkouts}
              currentWorkout={currentWorkout}
              devMode={isDevMode}
              onSelectWorkout={handleSelectWorkout}
            />
          </View>
        </View>

        {/* Stats Bentos - 3 cards in a row */}
        <View style={tw`px-4 py-4 flex-row gap-3`}>
          {/* Sessions */}
          <View style={[tw`flex-1 bg-[#1a1a1a] py-4 px-3 items-center`, { borderRadius: scale(16), height: verticalScale(140) }]}>
            <Text style={[tw`text-[#6B7280]`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 0.5, fontSize: sizing.caption }]}>
              SESSIONS
            </Text>
            <View style={tw`flex-1 justify-center`}>
              <Feather name="target" size={scale(36)} color="#EF4444" />
            </View>
            <Text style={[tw`text-white`, { fontFamily: "SpaceGrotesk_600SemiBold", fontSize: sizing.bodyLarge }]}>
              {completedCount}/{totalSessionsInProgram}
            </Text>
          </View>

          {/* Time Under Load */}
          <View style={[tw`flex-1 bg-[#1a1a1a] py-4 px-3 items-center`, { borderRadius: scale(16), height: verticalScale(140) }]}>
            <Text style={[tw`text-[#6B7280] text-center`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 0.5, fontSize: sizing.caption }]}>
              TIME UNDER{'\n'}LOAD
            </Text>
            <View style={tw`flex-1 justify-center`}>
              <Feather name="clock" size={scale(36)} color="#EF4444" />
            </View>
            <Text style={[tw`text-white`, { fontFamily: "SpaceGrotesk_600SemiBold", fontSize: sizing.bodyLarge }]}>
              {formatTotalTime(totalSeconds)}
            </Text>
          </View>

          {/* This Week */}
          <View style={[tw`flex-1 bg-[#1a1a1a] py-4 px-3 items-center`, { borderRadius: scale(16), height: verticalScale(140) }]}>
            <Text style={[tw`text-[#6B7280]`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 0.5, fontSize: sizing.caption }]}>
              THIS WEEK
            </Text>
            <View style={tw`flex-1 justify-center`}>
              <Feather name="check-circle" size={scale(36)} color="#EF4444" />
            </View>
            <Text style={[tw`text-white`, { fontFamily: "SpaceGrotesk_600SemiBold", fontSize: sizing.bodyLarge }]}>
              {sessionsThisWeek}/3
            </Text>
          </View>
        </View>

        {/* Spacer to push button to bottom */}
        <View style={tw`flex-1`} />

        {/* Begin Button - Anchored at bottom */}
        <View style={tw`px-4 pb-4`}>
          <Pressable
            style={[
              tw`bg-grhiit-red py-4 px-6 flex-row items-center justify-center`,
              {
                borderRadius: 16,
                shadowColor: "#EF4444",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.35,
                shadowRadius: 16
              }
            ]}
            onPress={() => router.push("/workout")}
          >
            <Text style={[tw`text-white text-base`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
              START NEXT SESSION
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
