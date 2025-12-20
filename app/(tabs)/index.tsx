import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import tw from "@/lib/tw";
import { GrhiitMark, WorkoutGrid, MomentumIndicator } from "@/components";
import Svg, { Path } from "react-native-svg";

function SettingsIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function HomeScreen() {
  // TODO: Get from user store
  const userName = "Kevin";

  // TODO: Get from workout store
  const startDate = new Date("2024-12-02"); // Example start date
  const completedWorkouts = [1, 3, 4, 5]; // Workouts done (skipped #2)
  const missedWorkouts = [2]; // Missed workout #2
  const currentWorkout = 6; // Next workout is #6
  const momentum = 65; // -50% from missed workout
  const streak = 4; // Days since last miss

  // Next workout details
  const nextWorkoutName = "Oxygen Debt";
  const nextWorkoutDate = "Dec 20, 6:00 AM";
  const nextWorkoutSummary = "4 movements • 13.5 min";

  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`} edges={['top']}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-5 pb-28 flex-grow`}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
      >
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`mr-3`}>
              <GrhiitMark size={32} />
            </View>
            <Text style={[tw`text-white text-sm tracking-wider`, { fontFamily: "ChakraPetch_600SemiBold" }]}>
              Welcome back, {userName}
            </Text>
          </View>
          <Pressable
            style={tw`w-10 h-10 bg-[#141414] rounded-lg items-center justify-center border border-[#262626]`}
            onPress={() => router.push("/settings")}
          >
            <SettingsIcon />
          </Pressable>
        </View>

        {/* Workout Grid - Primary Component */}
        <View style={tw`mb-5`}>
          <WorkoutGrid
            startDate={startDate}
            completedWorkouts={completedWorkouts}
            missedWorkouts={missedWorkouts}
            currentWorkout={currentWorkout}
          />
        </View>

        {/* Momentum & Streak Row */}
        <View style={tw`flex-row gap-3 mb-5`}>
          <View style={tw`flex-1`}>
            <MomentumIndicator percentage={momentum} />
          </View>
          <View style={tw`bg-[#141414] rounded-xl p-4 border border-[#262626] w-24`}>
            <Text style={tw`text-white/40 text-[10px] tracking-wide`}>STREAK</Text>
            <Text style={tw`text-grhiit-red text-2xl font-bold`}>{streak}</Text>
            <Text style={tw`text-white/30 text-[10px]`}>days</Text>
          </View>
        </View>

        {/* Next Workout - Compact */}
        <View style={tw`bg-[#141414] rounded-xl px-4 py-3 mb-4 border border-[#262626] flex-row justify-between items-center`}>
          <View>
            <Text style={tw`text-white text-base font-bold`}>
              #{currentWorkout} {nextWorkoutName}
            </Text>
            <Text style={tw`text-white/40 text-xs`}>{nextWorkoutSummary}</Text>
          </View>
          <Text style={tw`text-white/30 text-xs`}>{nextWorkoutDate}</Text>
        </View>

        {/* Start Workout CTA */}
        <Pressable
          style={tw`bg-grhiit-red rounded-2xl py-4 items-center justify-center`}
          onPress={() => router.push("/workout")}
        >
          <Text style={tw`text-white text-lg font-bold`}>
            START #{currentWorkout} ▶
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
