import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import tw from "@/lib/tw";

const MOVEMENTS = [
  { name: "8-Count Bodybuilders", description: "Full-body explosive movement" },
  { name: "Jump Squats", description: "Lower body power" },
  { name: "Burpees", description: "Metabolic conditioning" },
  { name: "Flying Squats", description: "Leg endurance" },
];

export default function WorkoutPreviewScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-5`}>
        {/* Header with back button */}
        <Pressable onPress={() => router.back()} style={tw`mb-6`}>
          <Text style={tw`text-white/60`}>← Back</Text>
        </Pressable>

        {/* Workout Title */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-white/60 text-xs tracking-wide mb-1`}>
            WEEK 1 • DAY 1
          </Text>
          <Text style={tw`text-white text-3xl font-bold`}>Foundation</Text>
          <Text style={tw`text-white/60 mt-2`}>16 minutes • 220+ reps</Text>
        </View>

        {/* Session Structure */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-white/40 text-xs tracking-wide mb-4`}>
            SESSION STRUCTURE
          </Text>

          <View style={tw`bg-[#141414] rounded-xl p-4 mb-3 border border-[#262626]`}>
            <Text style={tw`text-white font-medium`}>Ramp-up</Text>
            <Text style={tw`text-white/60 text-sm mt-1`}>2 min • Prepare your body</Text>
          </View>

          <View style={tw`bg-[#141414] rounded-xl p-4 mb-3 border border-grhiit-red/50`}>
            <Text style={tw`text-grhiit-red font-medium`}>Tabata Summit</Text>
            <Text style={tw`text-white/60 text-sm mt-1`}>8 rounds • 20s work / 10s rest</Text>
          </View>

          <View style={tw`bg-[#141414] rounded-xl p-4 mb-3 border border-[#262626]`}>
            <Text style={tw`text-white font-medium`}>After-Burn</Text>
            <Text style={tw`text-white/60 text-sm mt-1`}>4 min • Sustained effort</Text>
          </View>

          <View style={tw`bg-[#141414] rounded-xl p-4 border border-[#262626]`}>
            <Text style={tw`text-white font-medium`}>Cool-down</Text>
            <Text style={tw`text-white/60 text-sm mt-1`}>2 min • Recovery</Text>
          </View>
        </View>

        {/* Movements */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-white/40 text-xs tracking-wide mb-4`}>
            TODAY'S MOVEMENTS
          </Text>
          {MOVEMENTS.map((movement, index) => (
            <View
              key={movement.name}
              style={tw`flex-row items-center py-3 border-b border-[#262626]`}
            >
              <Text style={tw`text-white/40 w-8`}>{index + 1}</Text>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white font-medium`}>{movement.name}</Text>
                <Text style={tw`text-white/60 text-sm`}>{movement.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Start Button */}
        <Pressable
          style={tw`bg-grhiit-red rounded-2xl py-5 items-center`}
          onPress={() => router.push("/workout/active")}
        >
          <Text style={tw`text-white text-lg font-bold`}>BEGIN SESSION</Text>
        </Pressable>

        {/* Philosophy reminder */}
        <Text style={tw`text-white/40 text-center text-sm mt-6 px-4 italic`}>
          "Most people have never actually hit their limits."
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
