import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import tw from "@/lib/tw";

export default function HomeScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-[#0A0A0A]`}>
      <View style={tw`flex-1 p-5`}>
        {/* Header */}
        <View style={tw`flex-row items-center mb-6`}>
          <View style={tw`w-8 h-8 bg-[#EF4444] rounded-lg items-center justify-center mr-3`}>
            <Text style={tw`text-white font-bold`}>⚡</Text>
          </View>
          <Text style={tw`text-white font-semibold tracking-wider`}>
            PERFORMANCE LAB
          </Text>
        </View>

        {/* Today's Session Label */}
        <View style={tw`flex-row items-center mb-2`}>
          <View style={tw`w-2 h-2 bg-[#EF4444] rounded-full mr-2`} />
          <Text style={tw`text-[#EF4444] text-xs tracking-wider font-medium`}>
            TODAY'S SESSION • HIGH INTENSITY
          </Text>
        </View>

        {/* Workout Title */}
        <Text style={tw`text-white text-4xl font-bold`}>OXYGEN</Text>
        <Text style={tw`text-white/60 text-4xl font-bold italic mb-4`}>DEBT 01</Text>

        {/* Workout Stats */}
        <View style={tw`flex-row gap-6 mb-6`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-[#EF4444] mr-1`}>⏱</Text>
            <Text style={tw`text-white/80 text-sm`}>45 MIN</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-[#EF4444] mr-1`}>🔥</Text>
            <Text style={tw`text-white/80 text-sm`}>850 KCAL</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-[#EF4444] mr-1`}>📈</Text>
            <Text style={tw`text-white/80 text-sm`}>ADVANCED</Text>
          </View>
        </View>

        {/* Day Streak Card */}
        <View style={tw`bg-[#141414] rounded-2xl p-5 mb-5 border border-[#262626]`}>
          <View style={tw`flex-row items-end`}>
            <Text style={tw`text-[#EF4444] text-6xl font-bold`}>17</Text>
            <View style={tw`ml-2 mb-2`}>
              <Text style={tw`text-white text-lg font-semibold`}>DAY</Text>
              <Text style={tw`text-white/60 text-lg`}>STREAK</Text>
            </View>
          </View>
          <View style={tw`mt-4 h-1 bg-[#262626] rounded-full overflow-hidden`}>
            <View style={tw`h-full w-[57%] bg-[#EF4444] rounded-full`} />
          </View>
          <Text style={tw`text-white/40 text-xs mt-2 text-right`}>TARGET: 30 DAYS</Text>
        </View>

        {/* Performance Metrics */}
        <Text style={tw`text-white/60 text-xs tracking-wider mb-3`}>PERFORMANCE METRICS</Text>
        <View style={tw`flex-row gap-4 mb-5`}>
          <View style={tw`flex-1 bg-[#141414] rounded-xl p-4 border border-[#262626]`}>
            <Text style={tw`text-white text-3xl font-bold mt-2`}>142</Text>
            <Text style={tw`text-white/40 text-xs`}>TOTAL SESSIONS</Text>
          </View>
          <View style={tw`flex-1 bg-[#141414] rounded-xl p-4 border border-[#262626]`}>
            <Text style={tw`text-[#EF4444] text-3xl font-bold mt-2`}>Z4</Text>
            <Text style={tw`text-white/40 text-xs`}>AVG ZONE</Text>
          </View>
        </View>

        {/* Mental Toughness */}
        <View style={tw`bg-[#141414] rounded-xl p-4 border border-[#262626] mb-6`}>
          <View style={tw`flex-row justify-between mb-2`}>
            <Text style={tw`text-white/80 text-sm`}>MENTAL TOUGHNESS</Text>
            <Text style={tw`text-white`}>
              <Text style={tw`font-bold`}>88</Text>
              <Text style={tw`text-white/40`}>/100</Text>
            </Text>
          </View>
          <View style={tw`h-2 bg-[#262626] rounded-full overflow-hidden`}>
            <View style={tw`h-full w-[88%] bg-white/80 rounded-full`} />
          </View>
        </View>

        {/* Start Workout Button */}
        <Pressable
          style={tw`bg-[#EF4444] rounded-2xl py-5 flex-row items-center justify-center`}
          onPress={() => router.push("/workout")}
        >
          <Text style={tw`text-white text-lg font-bold mr-2`}>START WORKOUT</Text>
          <Text style={tw`text-white text-lg`}>▶</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
