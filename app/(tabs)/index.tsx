import { useState, useEffect, useMemo } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import tw from "@/lib/tw";
import { GrhiitMark, OctagonGrid } from "@/components";
import Svg, { Path } from "react-native-svg";

const MOTIVATIONAL_QUOTES = [
  "Keep throwing punches",
  "The only way out is through",
  "Use it or lose it",
  "Hard choices, easy life",
  "Discipline equals freedom",
  "Embrace the suck",
  "Pain is temporary",
  "No shortcuts",
];

function SettingsIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="#6B7280"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="#6B7280"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function HomeScreen() {
  // Rotating quote
  const [quoteIndex] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  const quote = MOTIVATIONAL_QUOTES[quoteIndex];

  // TODO: Get from user store
  const userName = "KEVIN";

  // TODO: Get from workout store
  const completedWorkouts = [1, 3, 4, 5];
  const missedWorkouts = [2];
  const currentWorkout = 6;

  // Calculate stats
  const totalSessions = 24;
  const completedCount = completedWorkouts.length;
  const totalMinutesTrained = completedCount * 13.5; // ~13.5 min per session

  // Calculate session label
  const currentWeek = Math.ceil(currentWorkout / 3);
  const sessionLabel = `W${currentWeek}:${currentWorkout.toString().padStart(2, "0")}`;

  // Next workout details
  const nextWorkoutMovements = 4;
  const nextWorkoutTime = "13:30";
  const nextWorkoutTargetReps = 190;

  const handleCellPress = (workoutNum: number) => {
    // TODO: Open workout detail modal
    console.log("Pressed workout:", workoutNum);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`} edges={['top']}>
      <View style={tw`flex-1`}>
        {/* Header */}
        <View style={tw`px-5 pt-4`}>
          <View style={tw`flex-row justify-between items-start`}>
            <GrhiitMark size={28} />
            <Pressable
              style={tw`w-10 h-10 items-center justify-center -mr-2`}
              onPress={() => router.push("/settings")}
            >
              <SettingsIcon />
            </Pressable>
          </View>

          {/* Welcome + Quote */}
          <View style={tw`mt-4`}>
            <Text style={[tw`text-white text-lg`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
              Welcome back, {userName}
            </Text>
            <Text style={[tw`text-[#6B7280] text-xs mt-1`, { fontFamily: "SpaceGrotesk_400Regular" }]}>
              {quote}
            </Text>
          </View>
        </View>

        {/* Grid - Primary Element */}
        <View style={tw`flex-1 px-5 pt-8 pb-4`}>
          <OctagonGrid
            completedWorkouts={completedWorkouts}
            missedWorkouts={missedWorkouts}
            currentWorkout={currentWorkout}
            onCellPress={handleCellPress}
          />
        </View>

        {/* Stats Section */}
        <View style={tw`px-5 pb-6`}>
          <View style={tw`flex-row justify-between`}>
            <View style={tw`flex-row items-baseline`}>
              <Text style={[tw`text-white text-lg`, { fontFamily: "JetBrainsMono_600SemiBold" }]}>
                {completedCount}/{totalSessions}
              </Text>
              <Text style={[tw`text-[#6B7280] text-xs ml-2`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                SESSIONS
              </Text>
            </View>
            <View style={tw`flex-row items-baseline`}>
              <Text style={[tw`text-white text-lg`, { fontFamily: "JetBrainsMono_600SemiBold" }]}>
                {Math.round(totalMinutesTrained)}
              </Text>
              <Text style={[tw`text-[#6B7280] text-xs ml-2`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                MIN TRAINED
              </Text>
            </View>
          </View>
        </View>

        {/* Begin Button - Fixed at bottom */}
        <View style={tw`px-5 pb-6`}>
          <Pressable
            style={[
              tw`bg-grhiit-red py-4 px-6`,
              {
                shadowColor: "#EF4444",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.35,
                shadowRadius: 16
              }
            ]}
            onPress={() => router.push("/workout")}
          >
            <Text style={[tw`text-white text-lg text-center`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
              BEGIN {sessionLabel}
            </Text>
            <Text style={[tw`text-white/70 text-xs text-center mt-1`, { fontFamily: "JetBrainsMono_500Medium" }]}>
              {nextWorkoutMovements} MOVES  •  {nextWorkoutTime}  •  {nextWorkoutTargetReps} REPS
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
