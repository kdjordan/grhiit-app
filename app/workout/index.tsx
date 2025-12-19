import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const MOVEMENTS = [
  { name: "8-Count Bodybuilders", description: "Full-body explosive movement" },
  { name: "Jump Squats", description: "Lower body power" },
  { name: "Burpees", description: "Metabolic conditioning" },
  { name: "Flutter Squats", description: "Leg endurance" },
];

export default function WorkoutPreviewScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="px-6 py-8">
        {/* Header with back button */}
        <Pressable
          onPress={() => router.back()}
          className="mb-6"
        >
          <Text className="text-secondary">← Back</Text>
        </Pressable>

        {/* Workout Title */}
        <View className="mb-8">
          <Text className="text-secondary text-sm mb-1">WEEK 1 • DAY 1</Text>
          <Text className="text-primary text-3xl font-bold">Foundation</Text>
          <Text className="text-secondary mt-2">16 minutes • 220+ reps</Text>
        </View>

        {/* Session Structure */}
        <View className="mb-8">
          <Text className="text-secondary text-sm mb-4">SESSION STRUCTURE</Text>

          <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
            <Text className="text-primary font-medium">Warm-up</Text>
            <Text className="text-secondary text-sm">2 min • Prepare your body</Text>
          </View>

          <View className="bg-surface rounded-xl p-4 mb-3 border border-accent/50">
            <Text className="text-accent font-medium">Tabata Summit</Text>
            <Text className="text-secondary text-sm">8 rounds • 20s work / 10s rest</Text>
          </View>

          <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
            <Text className="text-primary font-medium">After-Burn & Core</Text>
            <Text className="text-secondary text-sm">4 min • Sustained effort</Text>
          </View>

          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-primary font-medium">Cool-down</Text>
            <Text className="text-secondary text-sm">2 min • Recovery</Text>
          </View>
        </View>

        {/* Movements */}
        <View className="mb-8">
          <Text className="text-secondary text-sm mb-4">TODAY'S MOVEMENTS</Text>
          {MOVEMENTS.map((movement, index) => (
            <View
              key={movement.name}
              className="flex-row items-center py-3 border-b border-border"
            >
              <Text className="text-secondary w-8">{index + 1}</Text>
              <View className="flex-1">
                <Text className="text-primary font-medium">{movement.name}</Text>
                <Text className="text-secondary text-sm">{movement.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Start Button */}
        <Pressable
          className="bg-accent rounded-2xl py-5 items-center active:opacity-80"
          onPress={() => router.push("/workout/active")}
        >
          <Text className="text-primary text-lg font-bold">BEGIN SESSION</Text>
        </Pressable>

        {/* Philosophy reminder */}
        <Text className="text-secondary text-center text-sm mt-6 px-4">
          "Most people have never actually hit their limits."
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
