import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function WeeklyChart() {
  const data = [65, 80, 45, 90, 70, 85, 60];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const maxValue = Math.max(...data);

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 120, paddingHorizontal: 8 }}>
      {data.map((value, index) => (
        <View key={index} style={{ alignItems: "center", flex: 1 }}>
          <View
            style={{
              width: 24,
              backgroundColor: "rgba(232, 17, 15, 0.8)",
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              height: (value / maxValue) * 100,
            }}
          />
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 8 }}>{days[index]}</Text>
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
    <View style={{ flex: 1, backgroundColor: "#141414", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#262626" }}>
      <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 8 }}>{label}</Text>
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>{value}</Text>
      {subValue && <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 4 }}>{subValue}</Text>}
    </View>
  );
}

export default function StatsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold", letterSpacing: 1, marginBottom: 24 }}>
          STATISTICS
        </Text>

        {/* Weekly Activity */}
        <View style={{ backgroundColor: "#141414", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#262626", marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
            <Text style={{ color: "white", fontWeight: "600" }}>WEEKLY ACTIVITY</Text>
            <Text style={{ color: "#E8110F", fontSize: 14 }}>This Week</Text>
          </View>
          <WeeklyChart />
        </View>

        {/* Summary Stats */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
          <StatCard label="TOTAL WORKOUTS" value="142" subValue="All time" />
          <StatCard label="THIS WEEK" value="5" subValue="+2 from last week" />
        </View>

        <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
          <StatCard label="AVG DURATION" value="32" subValue="minutes" />
          <StatCard label="TOTAL TIME" value="76" subValue="hours" />
        </View>

        {/* Heart Rate Stats */}
        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 1, marginBottom: 12 }}>
          HEART RATE DATA
        </Text>
        <View style={{ backgroundColor: "#141414", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#262626", marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>AVG MAX HR</Text>
              <Text style={{ color: "#E8110F", fontSize: 28, fontWeight: "bold" }}>172</Text>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>BPM</Text>
            </View>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>AVG ZONE</Text>
              <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>Z4</Text>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Threshold</Text>
            </View>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>RECOVERY</Text>
              <Text style={{ color: "#22C55E", fontSize: 28, fontWeight: "bold" }}>Good</Text>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Avg 45 BPM drop</Text>
            </View>
          </View>
        </View>

        {/* Identity Progress */}
        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 1, marginBottom: 12 }}>
          IDENTITY METRICS
        </Text>
        <View style={{ backgroundColor: "#141414", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#262626" }}>
          {[
            { label: "Mental Toughness", value: 88 },
            { label: "Discipline", value: 92 },
            { label: "Confidence", value: 85 },
          ].map((item, index) => (
            <View key={item.label} style={{ marginBottom: index < 2 ? 16 : 0 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>{item.label}</Text>
                <Text style={{ color: "white", fontWeight: "bold" }}>{item.value}/100</Text>
              </View>
              <View style={{ height: 8, backgroundColor: "#262626", borderRadius: 4, overflow: "hidden" }}>
                <View style={{ height: "100%", width: `${item.value}%`, backgroundColor: "#E8110F", borderRadius: 4 }} />
              </View>
            </View>
          ))}
        </View>

        {/* Quote */}
        <Text style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", fontSize: 14, marginTop: 24, fontStyle: "italic" }}>
          "The more you give, the more you get."
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
