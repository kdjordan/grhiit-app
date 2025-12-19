import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle } from "react-native-svg";

function TrendUpIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 6l-9.5 9.5-5-5L1 18"
        stroke="#22C55E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 6h6v6"
        stroke="#22C55E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Simple bar chart component
function WeeklyChart() {
  const data = [65, 80, 45, 90, 70, 85, 60]; // Mock data
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const maxValue = Math.max(...data);

  return (
    <View className="flex-row items-end justify-between h-32 px-2">
      {data.map((value, index) => (
        <View key={index} className="items-center flex-1">
          <View
            className="w-6 bg-accent/80 rounded-t"
            style={{ height: (value / maxValue) * 100 }}
          />
          <Text className="text-white/40 text-xs mt-2">{days[index]}</Text>
        </View>
      ))}
    </View>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down";
}

function StatCard({ label, value, subValue, trend }: StatCardProps) {
  return (
    <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
      <Text className="text-white/40 text-xs mb-2">{label}</Text>
      <View className="flex-row items-end">
        <Text className="text-white text-2xl font-bold">{value}</Text>
        {trend === "up" && (
          <View className="ml-2 mb-1">
            <TrendUpIcon />
          </View>
        )}
      </View>
      {subValue && (
        <Text className="text-white/40 text-xs mt-1">{subValue}</Text>
      )}
    </View>
  );
}

export default function StatsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text className="text-white text-2xl font-bold tracking-wider mb-6">
          STATISTICS
        </Text>

        {/* Weekly Activity */}
        <View className="bg-surface rounded-2xl p-5 border border-border mb-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white font-semibold">WEEKLY ACTIVITY</Text>
            <Text className="text-accent text-sm">This Week</Text>
          </View>
          <WeeklyChart />
        </View>

        {/* Summary Stats */}
        <View className="flex-row gap-4 mb-5">
          <StatCard
            label="TOTAL WORKOUTS"
            value="142"
            subValue="All time"
            trend="up"
          />
          <StatCard
            label="THIS WEEK"
            value="5"
            subValue="+2 from last week"
            trend="up"
          />
        </View>

        <View className="flex-row gap-4 mb-5">
          <StatCard label="AVG DURATION" value="32" subValue="minutes" />
          <StatCard label="TOTAL TIME" value="76" subValue="hours" />
        </View>

        {/* Heart Rate Stats */}
        <Text className="text-white/40 text-xs tracking-wider mb-3">
          HEART RATE DATA
        </Text>
        <View className="bg-surface rounded-2xl p-5 border border-border mb-5">
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-white/40 text-xs">AVG MAX HR</Text>
              <Text className="text-accent text-3xl font-bold">172</Text>
              <Text className="text-white/40 text-xs">BPM</Text>
            </View>
            <View>
              <Text className="text-white/40 text-xs">AVG ZONE</Text>
              <Text className="text-white text-3xl font-bold">Z4</Text>
              <Text className="text-white/40 text-xs">Threshold</Text>
            </View>
            <View>
              <Text className="text-white/40 text-xs">RECOVERY</Text>
              <Text className="text-success text-3xl font-bold">Good</Text>
              <Text className="text-white/40 text-xs">Avg 45 BPM drop</Text>
            </View>
          </View>
        </View>

        {/* Identity Progress */}
        <Text className="text-white/40 text-xs tracking-wider mb-3">
          IDENTITY METRICS
        </Text>
        <View className="bg-surface rounded-2xl p-5 border border-border">
          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white/80">Mental Toughness</Text>
              <Text className="text-white font-bold">88/100</Text>
            </View>
            <View className="h-2 bg-border rounded-full overflow-hidden">
              <View className="h-full bg-accent rounded-full" style={{ width: "88%" }} />
            </View>
          </View>

          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white/80">Discipline</Text>
              <Text className="text-white font-bold">92/100</Text>
            </View>
            <View className="h-2 bg-border rounded-full overflow-hidden">
              <View className="h-full bg-accent rounded-full" style={{ width: "92%" }} />
            </View>
          </View>

          <View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-white/80">Confidence</Text>
              <Text className="text-white font-bold">85/100</Text>
            </View>
            <View className="h-2 bg-border rounded-full overflow-hidden">
              <View className="h-full bg-accent rounded-full" style={{ width: "85%" }} />
            </View>
          </View>
        </View>

        {/* Quote */}
        <Text className="text-white/30 text-center text-sm mt-6 px-4 italic">
          "The more you give, the more you get."
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
