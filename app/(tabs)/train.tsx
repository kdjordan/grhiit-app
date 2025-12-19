import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";

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
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={{
            width: 20,
            height: 6,
            borderRadius: 2,
            backgroundColor: i <= level ? "#EF4444" : "#262626",
          }}
        />
      ))}
    </View>
  );
}

function WorkoutCard({ workout, onPress }: { workout: WorkoutItem; onPress: () => void }) {
  return (
    <View
      style={{
        backgroundColor: "#141414",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: workout.isLocked ? "#262626" : "rgba(239, 68, 68, 0.3)",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", letterSpacing: 0.5 }}>
          {workout.name}
        </Text>
        {workout.isLocked && <Text style={{ color: "#6B7280" }}>🔒</Text>}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Text style={{ color: "#EF4444", fontFamily: "monospace" }}>{workout.intervalFormat}</Text>
        <Text style={{ color: "rgba(255,255,255,0.4)", marginHorizontal: 8 }}>x</Text>
        <Text style={{ color: "#EF4444", fontFamily: "monospace" }}>{workout.rounds}</Text>
        <Text style={{ color: "rgba(255,255,255,0.4)", marginLeft: 12 }}>|</Text>
        <Text style={{ color: "rgba(255,255,255,0.6)", marginLeft: 12 }}>{workout.duration} MIN</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginRight: 8 }}>DIFFICULTY</Text>
        <DifficultyBar level={workout.difficulty} />
      </View>

      <View style={{ marginBottom: 16 }}>
        {workout.movements.map((movement) => (
          <View key={movement} style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <View style={{ width: 6, height: 6, backgroundColor: "#EF4444", borderRadius: 3, marginRight: 8 }} />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{movement}</Text>
          </View>
        ))}
      </View>

      {workout.isLocked ? (
        <Pressable style={{ backgroundColor: "#141414", borderWidth: 1, borderColor: "#262626", borderRadius: 12, paddingVertical: 12, alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "rgba(255,255,255,0.4)", marginRight: 8 }}>UNLOCK</Text>
            <Text style={{ color: "#6B7280" }}>🔒</Text>
          </View>
        </Pressable>
      ) : (
        <Pressable
          style={{ backgroundColor: "#EF4444", borderRadius: 12, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
          onPress={onPress}
        >
          <Text style={{ color: "white", fontWeight: "bold", marginRight: 8 }}>START</Text>
          <Text style={{ color: "white" }}>▶</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function TrainScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const filters: FilterType[] = ["ALL", "TABATA", "AMRAP", "CUSTOM"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold", letterSpacing: 1, textAlign: "center" }}>
          WORKOUTS
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={{ flexDirection: "row", paddingHorizontal: 20, marginBottom: 16 }}>
        {filters.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={{ marginRight: 24 }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: activeFilter === filter ? "#EF4444" : "rgba(255,255,255,0.4)",
              }}
            >
              {filter}
            </Text>
            {activeFilter === filter && (
              <View style={{ height: 2, backgroundColor: "#EF4444", marginTop: 4, borderRadius: 1 }} />
            )}
          </Pressable>
        ))}
      </View>

      {/* Workout List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
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
