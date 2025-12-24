import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tw";
import { GrhiitMark, OctagonGrid } from "@/components";

// Format date like "TODAY, 23 DECEMBER"
function getFormattedDate(): string {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  return `TODAY, ${day} ${month}`;
}

export default function HomeScreen() {
  const formattedDate = getFormattedDate();

  // TODO: Get from user store
  const userName = "KEVIN";

  // TODO: Get from workout store
  const completedWorkouts = [1, 3, 4, 5];
  const missedWorkouts = [2];
  const currentWorkout = 6;

  // Calculate stats
  const totalSessions = 24;
  const completedCount = completedWorkouts.length;

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
          <View style={tw`flex-row items-center`}>
            <GrhiitMark size={32} />
            <View style={tw`ml-3`}>
              <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "JetBrainsMono_500Medium", letterSpacing: 1 }]}>
                {formattedDate}
              </Text>
              <Text style={[tw`text-white text-lg mt-0.5`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
                Welcome Back, {userName}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Bento */}
        <View style={tw`px-4 pt-6`}>
          <Text style={[tw`text-[#6B7280] text-xs mb-2 ml-1`, { fontFamily: "JetBrainsMono_500Medium", letterSpacing: 1 }]}>
            PROGRESS
          </Text>
          <View style={[tw`bg-[#1a1a1a] p-4`, { borderRadius: 16 }]}>
            <OctagonGrid
              completedWorkouts={completedWorkouts}
              missedWorkouts={missedWorkouts}
              currentWorkout={currentWorkout}
              onCellPress={handleCellPress}
            />
          </View>
        </View>

        {/* Stats Bentos - Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-4 py-4 gap-3`}
        >
          {/* Sessions */}
          <View style={[tw`bg-[#1a1a1a] py-4 px-5 items-center justify-between`, { borderRadius: 16, minWidth: 110, height: 120 }]}>
            <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "JetBrainsMono_500Medium", letterSpacing: 0.5 }]}>
              SESSIONS
            </Text>
            <Feather name="target" size={36} color="#EF4444" />
            <Text style={[tw`text-white text-xl`, { fontFamily: "JetBrainsMono_600SemiBold" }]}>
              {completedCount}/{totalSessions}
            </Text>
          </View>

          {/* Time Training */}
          <View style={[tw`bg-[#1a1a1a] py-4 px-5 items-center justify-between`, { borderRadius: 16, minWidth: 110, height: 120 }]}>
            <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "JetBrainsMono_500Medium", letterSpacing: 0.5 }]}>
              TIME
            </Text>
            <Feather name="clock" size={36} color="#EF4444" />
            <Text style={[tw`text-white text-xl`, { fontFamily: "JetBrainsMono_600SemiBold" }]}>
              1:03:00
            </Text>
          </View>

          {/* Streak */}
          <View style={[tw`bg-[#1a1a1a] py-4 px-5 items-center justify-between`, { borderRadius: 16, minWidth: 110, height: 120 }]}>
            <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "JetBrainsMono_500Medium", letterSpacing: 0.5 }]}>
              STREAK
            </Text>
            <Feather name="zap" size={36} color="#EF4444" />
            <Text style={[tw`text-white text-xl`, { fontFamily: "JetBrainsMono_600SemiBold" }]}>
              2 days
            </Text>
          </View>

          {/* kCal Burned */}
          <View style={[tw`bg-[#1a1a1a] py-4 px-5 items-center justify-between`, { borderRadius: 16, minWidth: 110, height: 120 }]}>
            <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "JetBrainsMono_500Medium", letterSpacing: 0.5 }]}>
              KCAL
            </Text>
            <Feather name="activity" size={36} color="#EF4444" />
            <Text style={[tw`text-white text-xl`, { fontFamily: "JetBrainsMono_600SemiBold" }]}>
              1,280
            </Text>
          </View>

          {/* Best Time */}
          <View style={[tw`bg-[#1a1a1a] py-4 px-5 items-center justify-between`, { borderRadius: 16, minWidth: 110, height: 120 }]}>
            <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "JetBrainsMono_500Medium", letterSpacing: 0.5 }]}>
              BEST
            </Text>
            <Feather name="award" size={36} color="#EF4444" />
            <Text style={[tw`text-white text-xl`, { fontFamily: "JetBrainsMono_600SemiBold" }]}>
              12:45
            </Text>
          </View>
        </ScrollView>

        {/* Begin Button - Fixed at bottom */}
        <View style={tw`px-4 pb-6`}>
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
            <Feather name="play" size={20} color="#FFFFFF" style={tw`mr-2`} />
            <Text style={[tw`text-white text-base`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
              START NEXT SESSION
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
