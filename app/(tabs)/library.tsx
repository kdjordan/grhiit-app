import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tw";

// Movement codes and their full names
const MOVEMENTS = [
  // Bodybuilders
  { code: "8CBB", name: "8-Count Bodybuilders", description: "Full-body compound movement combining squat thrust, push-up, and jump" },
  { code: "6CBB", name: "6-Count Bodybuilders", description: "Streamlined bodybuilder without the push-up - squat thrust and jump" },
  // Squats
  { code: "JSQ", name: "Jump Squats", description: "Explosive squat with vertical jump at the top" },
  { code: "FLSQ", name: "Flying Squats", description: "Dynamic squat with lateral movement" },
  { code: "STPSQ", name: "Stop Squats", description: "Controlled squat with pause at the bottom - builds strength and stability" },
  // Burpees
  { code: "OGBRP", name: "Burpees", description: "Continuous flow burpee without push-up. Down, out, in, up - keep the rhythm" },
  { code: "PUBRP", name: "Push-up Burpees", description: "Isolated single-rep burpee with full push-up. Form-critical - one perfect rep at a time" },
  // Upper body
  { code: "PU", name: "Push-ups", description: "Upper body press from plank position" },
  { code: "TH", name: "Thrusters", description: "Explosive full-body movement combining squat and overhead press" },
  { code: "ZPR", name: "Zippers", description: "Dynamic core movement alternating knee drives" },
  // Core / Cardio
  { code: "MC", name: "Mountain Climbers", description: "Core-focused running motion in plank position" },
  { code: "PL", name: "Plank", description: "Isometric core hold - foundation position for smoker sets" },
  { code: "JJ", name: "Jumping Jacks", description: "Full-body cardio movement with arm and leg coordination" },
  { code: "JK", name: "Jacks", description: "Lower body explosive jack movement" },
  { code: "HK", name: "High Knees", description: "Running in place with exaggerated knee lift" },
  // Lunges
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
