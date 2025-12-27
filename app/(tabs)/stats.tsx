import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tw";
import { useUserStore } from "@/stores/userStore";

// Format minutes to hours:minutes
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}`;
  }
  return `${mins}m`;
}

export default function StatsScreen() {
  // Get stats from user store
  const {
    totalSessions,
    totalMinutes,
    stats,
    totalCalories,
    averageHeartRate,
    maxHeartRate,
    recentSessions,
  } = useUserStore();

  // Calculate derived stats
  const avgDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
  const brpStats = stats.brp || { totalReps: 0, totalIntervals: 0, sessions: 0 };
  const flsqStats = stats.flsq || { totalReps: 0, totalIntervals: 0, sessions: 0 };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`} edges={['top']}>
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={tw`px-5 pt-4 pb-2`}>
          <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
            YOUR PROGRESS
          </Text>
          <Text style={[tw`text-white text-2xl mt-1`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
            Statistics
          </Text>
        </View>

        {/* Main Stats - Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-4 py-4 gap-3`}
        >
          {/* Sessions */}
          <View style={[tw`bg-[#1a1a1a] py-4 px-5 items-center`, { borderRadius: 16, minWidth: 110, height: 150 }]}>
            <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 0.5 }]}>
              SESSIONS
            </Text>
            <View style={tw`flex-1 justify-center`}>
              <Feather name="target" size={40} color="#EF4444" />
            </View>
            <Text style={[tw`text-white text-xl`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
              {totalSessions}
            </Text>
          </View>

          {/* Total Time */}
          <View style={[tw`bg-[#1a1a1a] py-4 px-5 items-center`, { borderRadius: 16, minWidth: 110, height: 150 }]}>
            <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 0.5 }]}>
              TOTAL TIME
            </Text>
            <View style={tw`flex-1 justify-center`}>
              <Feather name="clock" size={40} color="#EF4444" />
            </View>
            <Text style={[tw`text-white text-xl`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
              {formatTime(totalMinutes)}
            </Text>
          </View>

          {/* Avg Duration */}
          <View style={[tw`bg-[#1a1a1a] py-4 px-5 items-center`, { borderRadius: 16, minWidth: 110, height: 150 }]}>
            <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 0.5 }]}>
              AVG TIME
            </Text>
            <View style={tw`flex-1 justify-center`}>
              <Feather name="trending-up" size={40} color="#EF4444" />
            </View>
            <Text style={[tw`text-white text-xl`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
              {avgDuration}m
            </Text>
          </View>

          {/* Calories */}
          <View style={[tw`bg-[#1a1a1a] py-4 px-5 items-center`, { borderRadius: 16, minWidth: 110, height: 150 }]}>
            <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 0.5 }]}>
              CALORIES
            </Text>
            <View style={tw`flex-1 justify-center`}>
              <Feather name="activity" size={40} color="#EF4444" />
            </View>
            <Text style={[tw`text-white text-xl`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
              {totalCalories.toLocaleString()}
            </Text>
          </View>
        </ScrollView>

        {/* Summit Reps Section */}
        <View style={tw`px-4 pb-4`}>
          <Text style={[tw`text-[#6B7280] text-xs mb-3 ml-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
            SUMMIT REPS
          </Text>
          <View style={tw`flex-row gap-3`}>
            {/* Burpees */}
            <View style={[tw`flex-1 bg-[#1a1a1a] p-4`, { borderRadius: 16 }]}>
              <View style={tw`flex-row items-center mb-3`}>
                <View style={tw`w-8 h-8 bg-[#EF4444]/20 rounded-lg items-center justify-center mr-3`}>
                  <Text style={[tw`text-[#EF4444]`, { fontFamily: "SpaceGrotesk_700Bold", fontSize: 12 }]}>B</Text>
                </View>
                <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                  BURPEES
                </Text>
              </View>
              <Text style={[tw`text-white text-3xl`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                {brpStats.totalReps.toLocaleString()}
              </Text>
              <Text style={[tw`text-[#6B7280] text-xs mt-1`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                {brpStats.totalIntervals} intervals
              </Text>
            </View>

            {/* Flying Squats */}
            <View style={[tw`flex-1 bg-[#1a1a1a] p-4`, { borderRadius: 16 }]}>
              <View style={tw`flex-row items-center mb-3`}>
                <View style={tw`w-8 h-8 bg-[#EF4444]/20 rounded-lg items-center justify-center mr-3`}>
                  <Text style={[tw`text-[#EF4444]`, { fontFamily: "SpaceGrotesk_700Bold", fontSize: 12 }]}>F</Text>
                </View>
                <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                  FLYING SQ
                </Text>
              </View>
              <Text style={[tw`text-white text-3xl`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                {flsqStats.totalReps.toLocaleString()}
              </Text>
              <Text style={[tw`text-[#6B7280] text-xs mt-1`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                {flsqStats.totalIntervals} intervals
              </Text>
            </View>
          </View>
        </View>

        {/* Heart Rate Section */}
        <View style={tw`px-4 pb-4`}>
          <Text style={[tw`text-[#6B7280] text-xs mb-3 ml-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
            HEART RATE
          </Text>
          <View style={[tw`bg-[#1a1a1a] p-4`, { borderRadius: 16 }]}>
            <View style={tw`flex-row`}>
              {/* Avg HR */}
              <View style={tw`flex-1 items-center`}>
                <View style={tw`w-12 h-12 bg-[#EF4444]/20 rounded-full items-center justify-center mb-2`}>
                  <Feather name="heart" size={24} color="#EF4444" />
                </View>
                <Text style={[tw`text-white text-2xl`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                  {averageHeartRate || "--"}
                </Text>
                <Text style={[tw`text-[#6B7280] text-xs mt-1`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                  AVG BPM
                </Text>
              </View>

              {/* Max HR */}
              <View style={tw`flex-1 items-center`}>
                <View style={tw`w-12 h-12 bg-[#EF4444]/20 rounded-full items-center justify-center mb-2`}>
                  <Feather name="trending-up" size={24} color="#EF4444" />
                </View>
                <Text style={[tw`text-white text-2xl`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                  {maxHeartRate || "--"}
                </Text>
                <Text style={[tw`text-[#6B7280] text-xs mt-1`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                  MAX BPM
                </Text>
              </View>

              {/* Zone */}
              <View style={tw`flex-1 items-center`}>
                <View style={tw`w-12 h-12 bg-[#EF4444]/20 rounded-full items-center justify-center mb-2`}>
                  <Text style={[tw`text-[#EF4444]`, { fontFamily: "SpaceGrotesk_700Bold", fontSize: 14 }]}>Z4</Text>
                </View>
                <Text style={[tw`text-white text-2xl`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                  {averageHeartRate > 160 ? "High" : averageHeartRate > 0 ? "Mid" : "--"}
                </Text>
                <Text style={[tw`text-[#6B7280] text-xs mt-1`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                  INTENSITY
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <View style={tw`px-4 pb-8`}>
            <Text style={[tw`text-[#6B7280] text-xs mb-3 ml-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
              RECENT SESSIONS
            </Text>
            <View style={[tw`bg-[#1a1a1a]`, { borderRadius: 16 }]}>
              {recentSessions.slice(0, 5).map((session, index) => {
                const date = new Date(session.date);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const isLast = index === Math.min(recentSessions.length - 1, 4);

                return (
                  <View
                    key={session.date}
                    style={[
                      tw`flex-row items-center justify-between p-4`,
                      !isLast && tw`border-b border-[#262626]`
                    ]}
                  >
                    <View style={tw`flex-row items-center`}>
                      <View style={tw`w-10 h-10 bg-[#262626] rounded-lg items-center justify-center mr-3`}>
                        <Feather name="check" size={20} color="#22C55E" />
                      </View>
                      <View>
                        <Text style={[tw`text-white`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
                          {session.workoutId.replace('week', 'W').replace('-day', ':D')}
                        </Text>
                        <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                          {dateStr}
                        </Text>
                      </View>
                    </View>
                    <View style={tw`items-end`}>
                      <Text style={[tw`text-white`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
                        {session.totalReps} reps
                      </Text>
                      <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                        {Math.round(session.durationSeconds / 60)}m
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Empty State */}
        {totalSessions === 0 && (
          <View style={tw`px-4 pb-8`}>
            <View style={[tw`bg-[#1a1a1a] p-8 items-center`, { borderRadius: 16 }]}>
              <Feather name="bar-chart-2" size={48} color="#6B7280" />
              <Text style={[tw`text-white text-lg mt-4`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
                No sessions yet
              </Text>
              <Text style={[tw`text-[#6B7280] text-sm mt-2 text-center`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                Complete your first workout to start tracking your progress
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
