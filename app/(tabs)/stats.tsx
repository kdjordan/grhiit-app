import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/lib/tw";

function WeeklyChart() {
  const data = [65, 80, 45, 90, 70, 85, 60];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const maxValue = Math.max(...data);

  return (
    <View style={tw`flex-row items-end justify-between h-30 px-2`}>
      {data.map((value, index) => (
        <View key={index} style={tw`items-center flex-1`}>
          <View
            style={[
              tw`w-6 bg-grhiit-red/80 rounded-t`,
              { height: (value / maxValue) * 100 },
            ]}
          />
          <Text style={tw`text-white/40 text-xs mt-2`}>{days[index]}</Text>
        </View>
      ))}
    </View>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
}

function StatCard({ label, value, subValue }: StatCardProps) {
  return (
    <View style={tw`flex-1 bg-[#141414] rounded-xl p-4 border border-[#262626]`}>
      <Text style={tw`text-white/40 text-xs mb-2`}>{label}</Text>
      <Text style={tw`text-white text-2xl font-bold`}>{value}</Text>
      {subValue && <Text style={tw`text-white/40 text-xs mt-1`}>{subValue}</Text>}
    </View>
  );
}

export default function StatsScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-5`} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={tw`text-white text-2xl font-bold tracking-wide mb-6`}>
          STATISTICS
        </Text>

        {/* Weekly Activity */}
        <View style={tw`bg-[#141414] rounded-2xl p-5 border border-[#262626] mb-5`}>
          <View style={tw`flex-row justify-between mb-4`}>
            <Text style={tw`text-white font-semibold`}>WEEKLY ACTIVITY</Text>
            <Text style={tw`text-grhiit-red text-sm`}>This Week</Text>
          </View>
          <WeeklyChart />
        </View>

        {/* Summary Stats */}
        <View style={tw`flex-row gap-4 mb-5`}>
          <StatCard label="TOTAL WORKOUTS" value="142" subValue="All time" />
          <StatCard label="THIS WEEK" value="5" subValue="+2 from last week" />
        </View>

        <View style={tw`flex-row gap-4 mb-5`}>
          <StatCard label="AVG DURATION" value="32" subValue="minutes" />
          <StatCard label="TOTAL TIME" value="76" subValue="hours" />
        </View>

        {/* Heart Rate Stats */}
        <Text style={tw`text-white/40 text-xs tracking-wide mb-3`}>
          HEART RATE DATA
        </Text>
        <View style={tw`bg-[#141414] rounded-2xl p-5 border border-[#262626] mb-5`}>
          <View style={tw`flex-row justify-between`}>
            <View>
              <Text style={tw`text-white/40 text-xs`}>AVG MAX HR</Text>
              <Text style={tw`text-grhiit-red text-3xl font-bold`}>172</Text>
              <Text style={tw`text-white/40 text-xs`}>BPM</Text>
            </View>
            <View>
              <Text style={tw`text-white/40 text-xs`}>AVG ZONE</Text>
              <Text style={tw`text-white text-3xl font-bold`}>Z4</Text>
              <Text style={tw`text-white/40 text-xs`}>Threshold</Text>
            </View>
            <View>
              <Text style={tw`text-white/40 text-xs`}>RECOVERY</Text>
              <Text style={tw`text-success text-3xl font-bold`}>Good</Text>
              <Text style={tw`text-white/40 text-xs`}>Avg 45 BPM drop</Text>
            </View>
          </View>
        </View>

        {/* Identity Progress */}
        <Text style={tw`text-white/40 text-xs tracking-wide mb-3`}>
          IDENTITY METRICS
        </Text>
        <View style={tw`bg-[#141414] rounded-2xl p-5 border border-[#262626]`}>
          {[
            { label: "Mental Toughness", value: 88 },
            { label: "Discipline", value: 92 },
            { label: "Confidence", value: 85 },
          ].map((item, index) => (
            <View key={item.label} style={tw`${index < 2 ? "mb-4" : ""}`}>
              <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-white/80`}>{item.label}</Text>
                <Text style={tw`text-white font-bold`}>{item.value}/100</Text>
              </View>
              <View style={tw`h-2 bg-[#262626] rounded overflow-hidden`}>
                <View style={[tw`h-full bg-grhiit-red rounded`, { width: `${item.value}%` }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Quote */}
        <Text style={tw`text-white/30 text-center text-sm mt-6 italic`}>
          "The more you give, the more you get."
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
