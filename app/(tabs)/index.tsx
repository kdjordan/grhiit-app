import { View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useUserStore } from "@/stores/userStore";
import Svg, { Path } from "react-native-svg";

function FlameIcon() {
  return (
    <Svg width={48} height={48} viewBox="0 0 24 24" fill="#EF4444" opacity={0.3}>
      <Path d="M12 23c-3.866 0-7-3.134-7-7 0-2.5 1.5-4.5 3-6 .5 2.5 2 3 2 3s-.5-2 1-4c1.5 2 2 3 2 3s1-1.5 1-3c2 2 3 4 3 6 0 3.866-3.134 7-7 7z" />
    </Svg>
  );
}

function BellIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
        stroke="#6B7280"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HeartIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="#EF4444">
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </Svg>
  );
}

function ClipboardIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        stroke="#6B7280"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function HomeScreen() {
  const { completedWorkouts, currentWeek, currentDay } = useUserStore();
  const dayStreak = 17; // TODO: Calculate from store
  const targetDays = 30;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5">
        {/* Header */}
        <View className="flex-row items-center justify-between pt-4 pb-6">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-accent rounded-lg items-center justify-center mr-3">
              <Text className="text-white font-bold">⚡</Text>
            </View>
            <Text className="text-white font-semibold tracking-wider">
              PERFORMANCE LAB
            </Text>
          </View>
          <View className="flex-row items-center gap-4">
            <Pressable>
              <BellIcon />
            </Pressable>
            <View className="w-9 h-9 rounded-full bg-surface border border-border" />
          </View>
        </View>

        {/* Today's Session Label */}
        <View className="flex-row items-center mb-2">
          <View className="w-2 h-2 bg-accent rounded-full mr-2" />
          <Text className="text-accent text-xs tracking-wider font-medium">
            TODAY'S SESSION • HIGH INTENSITY
          </Text>
        </View>

        {/* Workout Title */}
        <Text className="text-white text-4xl font-bold tracking-tight">
          OXYGEN
        </Text>
        <Text className="text-white/60 text-4xl font-bold italic tracking-tight mb-4">
          DEBT 01
        </Text>

        {/* Workout Stats */}
        <View className="flex-row items-center gap-6 mb-6">
          <View className="flex-row items-center">
            <Text className="text-accent mr-1">⏱</Text>
            <Text className="text-white/80 text-sm">45 MIN</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-accent mr-1">🔥</Text>
            <Text className="text-white/80 text-sm">850 KCAL</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-accent mr-1">📈</Text>
            <Text className="text-white/80 text-sm">ADVANCED</Text>
          </View>
        </View>

        {/* Day Streak Card */}
        <View className="bg-surface rounded-2xl p-5 mb-5 border border-border relative overflow-hidden">
          <View className="absolute right-4 top-4 opacity-30">
            <FlameIcon />
          </View>
          <View className="flex-row items-end">
            <Text className="text-accent text-6xl font-bold">{dayStreak}</Text>
            <View className="ml-2 mb-2">
              <Text className="text-white text-lg font-semibold">DAY</Text>
              <Text className="text-white/60 text-lg">STREAK</Text>
            </View>
          </View>
          {/* Progress bar */}
          <View className="mt-4 h-1 bg-border rounded-full overflow-hidden">
            <View
              className="h-full bg-accent rounded-full"
              style={{ width: `${(dayStreak / targetDays) * 100}%` }}
            />
          </View>
          <Text className="text-white/40 text-xs mt-2 text-right">
            TARGET: {targetDays} DAYS
          </Text>
        </View>

        {/* Performance Metrics */}
        <Text className="text-white/60 text-xs tracking-wider mb-3">
          PERFORMANCE METRICS
        </Text>
        <View className="flex-row gap-4 mb-5">
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
            <ClipboardIcon />
            <Text className="text-white text-3xl font-bold mt-2">
              {completedWorkouts || 142}
            </Text>
            <Text className="text-white/40 text-xs">TOTAL SESSIONS</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
            <HeartIcon />
            <Text className="text-accent text-3xl font-bold mt-2">Z4</Text>
            <Text className="text-white/40 text-xs">AVG ZONE</Text>
          </View>
        </View>

        {/* Mental Toughness */}
        <View className="bg-surface rounded-xl p-4 border border-border mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-white/20 mr-2" />
              <Text className="text-white/80 text-sm">MENTAL TOUGHNESS</Text>
            </View>
            <Text className="text-white">
              <Text className="font-bold">88</Text>
              <Text className="text-white/40">/100</Text>
            </Text>
          </View>
          <View className="h-2 bg-border rounded-full overflow-hidden">
            <View className="h-full bg-white/80 rounded-full" style={{ width: "88%" }} />
          </View>
        </View>

        {/* Start Workout Button */}
        <Pressable
          className="bg-accent rounded-2xl py-5 flex-row items-center justify-center active:opacity-80"
          onPress={() => router.push("/workout")}
        >
          <Text className="text-white text-lg font-bold mr-2">
            START WORKOUT
          </Text>
          <Text className="text-white text-lg">▶</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
