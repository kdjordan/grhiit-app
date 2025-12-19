import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import Svg, { Path } from "react-native-svg";

type FilterType = "ALL" | "TABATA" | "AMRAP" | "CUSTOM";

interface WorkoutItem {
  id: string;
  name: string;
  intervalFormat: string;
  rounds: number;
  duration: number;
  difficulty: number; // 1-5
  movements: string[];
  isLocked: boolean;
  type: FilterType;
}

const WORKOUTS: WorkoutItem[] = [
  {
    id: "burpee-gauntlet",
    name: "BURPEE GAUNTLET",
    intervalFormat: "20:10",
    rounds: 8,
    duration: 28,
    difficulty: 5,
    movements: ["Burpees", "Mountain Climbers", "Jump Squats"],
    isLocked: false,
    type: "TABATA",
  },
  {
    id: "tabata-core-burn",
    name: "TABATA CORE BURN",
    intervalFormat: "20:10",
    rounds: 12,
    duration: 36,
    difficulty: 4,
    movements: ["Plank Holds", "Russian Twists", "Bicycle Crunches"],
    isLocked: true,
    type: "TABATA",
  },
  {
    id: "sprint-intervals",
    name: "SPRINT INTERVALS",
    intervalFormat: "30:30",
    rounds: 10,
    duration: 20,
    difficulty: 4,
    movements: ["High Knees", "Jump Lunges", "Flying Squats"],
    isLocked: false,
    type: "TABATA",
  },
  {
    id: "oxygen-debt",
    name: "OXYGEN DEBT 01",
    intervalFormat: "20:10",
    rounds: 8,
    duration: 45,
    difficulty: 5,
    movements: ["8-Count Bodybuilders", "Burpees", "Jump Squats", "Flying Squats"],
    isLocked: false,
    type: "TABATA",
  },
];

function LockIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="#6B7280">
      <Path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4" />
    </Svg>
  );
}

function DifficultyBar({ level }: { level: number }) {
  return (
    <View className="flex-row gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          className={`w-5 h-1.5 rounded-sm ${
            i <= level ? "bg-accent" : "bg-border"
          }`}
        />
      ))}
    </View>
  );
}

function WorkoutCard({ workout, onPress }: { workout: WorkoutItem; onPress: () => void }) {
  return (
    <View
      className={`bg-surface rounded-2xl p-5 mb-4 border ${
        workout.isLocked ? "border-border" : "border-accent/30"
      }`}
    >
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-white text-xl font-bold tracking-wide">
          {workout.name}
        </Text>
        {workout.isLocked && <LockIcon />}
      </View>

      <View className="flex-row items-center mb-3">
        <Text className="text-accent font-mono">
          {workout.intervalFormat}
        </Text>
        <Text className="text-white/40 mx-2">x</Text>
        <Text className="text-accent font-mono">{workout.rounds}</Text>
        <Text className="text-white/40 ml-3">|</Text>
        <Text className="text-white/60 ml-3">{workout.duration} MIN</Text>
      </View>

      <View className="flex-row items-center mb-4">
        <Text className="text-white/40 text-xs mr-2">DIFFICULTY</Text>
        <DifficultyBar level={workout.difficulty} />
      </View>

      <View className="mb-4">
        {workout.movements.map((movement) => (
          <View key={movement} className="flex-row items-center mb-1">
            <View className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
            <Text className="text-white/70 text-sm">{movement}</Text>
          </View>
        ))}
      </View>

      {workout.isLocked ? (
        <Pressable className="bg-surface border border-border rounded-xl py-3 items-center">
          <View className="flex-row items-center">
            <Text className="text-white/40 mr-2">UNLOCK</Text>
            <LockIcon />
          </View>
        </Pressable>
      ) : (
        <Pressable
          className="bg-accent rounded-xl py-3 flex-row items-center justify-center active:opacity-80"
          onPress={onPress}
        >
          <Text className="text-white font-bold mr-2">START</Text>
          <Text className="text-white">▶</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function TrainScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const filters: FilterType[] = ["ALL", "TABATA", "AMRAP", "CUSTOM"];

  const filteredWorkouts =
    activeFilter === "ALL"
      ? WORKOUTS
      : WORKOUTS.filter((w) => w.type === activeFilter);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-5 pt-4 pb-2">
        <Text className="text-white text-2xl font-bold tracking-wider text-center">
          WORKOUTS
        </Text>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row px-5 mb-4">
        {filters.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setActiveFilter(filter)}
            className="mr-6"
          >
            <Text
              className={`text-sm font-medium ${
                activeFilter === filter ? "text-accent" : "text-white/40"
              }`}
            >
              {filter}
            </Text>
            {activeFilter === filter && (
              <View className="h-0.5 bg-accent mt-1 rounded-full" />
            )}
          </Pressable>
        ))}
      </View>

      {/* Workout List */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredWorkouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onPress={() => router.push(`/workout?id=${workout.id}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
