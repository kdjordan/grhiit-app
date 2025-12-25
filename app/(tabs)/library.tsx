import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tw";

// Movement codes and their full names
const MOVEMENTS = [
  { code: "8CBB", name: "8-Count Bodybuilders", description: "Full-body compound movement combining squat thrust, push-up, and jump" },
  { code: "JSQ", name: "Jump Squats", description: "Explosive squat with vertical jump at the top" },
  { code: "BRP", name: "Burpees", description: "Full-body exercise from standing to floor and back" },
  { code: "FLSQ", name: "Flying Squats", description: "Dynamic squat with lateral movement" },
  { code: "PU", name: "Push-ups", description: "Upper body press from plank position" },
  { code: "MC", name: "Mountain Climbers", description: "Core-focused running motion in plank position" },
  { code: "LNG", name: "Lunges", description: "Single-leg lower body movement" },
  { code: "JLNG", name: "Jump Lunges", description: "Explosive alternating lunge with jump switch" },
];

export default function LibraryScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-5 pt-4 pb-8`}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text
          style={[
            tw`text-white text-2xl mb-2`,
            { fontFamily: "ChakraPetch_700Bold" },
          ]}
        >
          Movement Library
        </Text>
        <Text
          style={[
            tw`text-white/50 text-sm mb-6`,
            { fontFamily: "SpaceGrotesk_400Regular" },
          ]}
        >
          Learn the proper form for each exercise
        </Text>

        {/* Movement List */}
        {MOVEMENTS.map((movement) => (
          <View
            key={movement.code}
            style={tw`bg-[#141414] rounded-xl p-4 mb-3 border border-[#262626]`}
          >
            <View style={tw`flex-row items-center justify-between mb-2`}>
              <Text
                style={[
                  tw`text-white text-base`,
                  { fontFamily: "SpaceGrotesk_600SemiBold" },
                ]}
              >
                {movement.name}
              </Text>
              <View style={tw`bg-[#262626] px-2 py-1 rounded`}>
                <Text
                  style={[
                    tw`text-white/50 text-xs`,
                    { fontFamily: "SpaceGrotesk_500Medium" },
                  ]}
                >
                  {movement.code}
                </Text>
              </View>
            </View>
            <Text
              style={[
                tw`text-white/40 text-sm`,
                { fontFamily: "SpaceGrotesk_400Regular" },
              ]}
            >
              {movement.description}
            </Text>
            {/* Placeholder for video/instructions */}
            <View style={tw`flex-row items-center mt-3 pt-3 border-t border-[#262626]`}>
              <Feather name="play-circle" size={16} color="#6B7280" />
              <Text
                style={[
                  tw`text-white/30 text-xs ml-2`,
                  { fontFamily: "SpaceGrotesk_400Regular" },
                ]}
              >
                Video coming soon
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
