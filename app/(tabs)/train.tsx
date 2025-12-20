import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import tw from "@/lib/tw";

type FilterType = "ALL" | "TABATA" | "AMRAP" | "CUSTOM";

interface WorkoutItem {
  id: string;
  name: string;
  intervalFormat: string;
  rounds: number;
  duration: number;
  difficulty: number;
  movements: string[];
  isLocked: boolean;
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
  },
];

function DifficultyBar({ level }: { level: number }) {
  return (
    <View style={tw`flex-row gap-1`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={tw`w-5 h-1.5 rounded-sm ${i <= level ? "bg-grhiit-red" : "bg-[#262626]"}`}
        />
      ))}
    </View>
  );
}

function WorkoutCard({ workout, onPress }: { workout: WorkoutItem; onPress: () => void }) {
  return (
    <View
      style={tw`bg-[#141414] rounded-2xl p-5 mb-4 border ${workout.isLocked ? "border-[#262626]" : "border-grhiit-red/30"}`}
    >
      <View style={tw`flex-row justify-between mb-2`}>
        <Text style={tw`text-white text-xl font-bold tracking-tight`}>
          {workout.name}
        </Text>
        {workout.isLocked && <Text style={tw`text-gray-500`}>🔒</Text>}
      </View>

      <View style={tw`flex-row items-center mb-3`}>
        <Text style={tw`text-grhiit-red font-mono`}>{workout.intervalFormat}</Text>
        <Text style={tw`text-white/40 mx-2`}>x</Text>
        <Text style={tw`text-grhiit-red font-mono`}>{workout.rounds}</Text>
        <Text style={tw`text-white/40 ml-3`}>|</Text>
        <Text style={tw`text-white/60 ml-3`}>{workout.duration} MIN</Text>
      </View>

      <View style={tw`flex-row items-center mb-4`}>
        <Text style={tw`text-white/40 text-xs mr-2`}>DIFFICULTY</Text>
        <DifficultyBar level={workout.difficulty} />
      </View>

      <View style={tw`mb-4`}>
        {workout.movements.map((movement) => (
          <View key={movement} style={tw`flex-row items-center mb-1`}>
            <View style={tw`w-1.5 h-1.5 bg-grhiit-red rounded-full mr-2`} />
            <Text style={tw`text-white/70 text-sm`}>{movement}</Text>
          </View>
        ))}
      </View>

      {workout.isLocked ? (
        <Pressable style={tw`bg-[#141414] border border-[#262626] rounded-xl py-3 items-center`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-white/40 mr-2`}>UNLOCK</Text>
            <Text style={tw`text-gray-500`}>🔒</Text>
          </View>
        </Pressable>
      ) : (
        <Pressable
          style={tw`bg-grhiit-red rounded-xl py-3 flex-row items-center justify-center`}
          onPress={onPress}
        >
          <Text style={tw`text-white font-bold mr-2`}>START</Text>
          <Text style={tw`text-white`}>▶</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function TrainScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const filters: FilterType[] = ["ALL", "TABATA", "AMRAP", "CUSTOM"];

  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
      {/* Header */}
      <View style={tw`px-5 pt-4 pb-2`}>
        <Text style={tw`text-white text-2xl font-bold tracking-wide text-center`}>
          WORKOUTS
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={tw`flex-row px-5 mb-4`}>
        {filters.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={tw`mr-6`}
          >
            <Text
              style={tw`text-sm font-medium ${activeFilter === filter ? "text-grhiit-red" : "text-white/40"}`}
            >
              {filter}
            </Text>
            {activeFilter === filter && (
              <View style={tw`h-0.5 bg-grhiit-red mt-1 rounded-full`} />
            )}
          </Pressable>
        ))}
      </View>

      {/* Workout List */}
      <ScrollView
        style={tw`flex-1 px-5`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-5`}
      >
        {WORKOUTS.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onPress={() => router.push("/workout")}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
