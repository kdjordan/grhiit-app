import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tw";
import { useUserStore } from "@/stores/userStore";

// Format seconds to M:SS or H:MM:SS
function formatTime(secs: number): string {
  if (secs === 0) return "0:00";
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function StatsScreen() {
  const [healthExpanded, setHealthExpanded] = useState(false);

  // Get stats from user store
  const {
    totalSessions,
    totalSeconds,
    stats,
    averageHeartRate,
    maxHeartRate,
    recentSessions,
  } = useUserStore();

  // Calculate derived stats
  const avgSeconds = totalSessions > 0 ? Math.round(totalSeconds / totalSessions) : 0;
  const brpStats = stats.brp || { totalReps: 0, totalIntervals: 0, sessions: 0 };
  const flsqStats = stats.flsq || { totalReps: 0, totalIntervals: 0, sessions: 0 };

  // Derive intensity score from heart rate
  const getIntensityScore = () => {
    if (!averageHeartRate) return null;
    if (averageHeartRate >= 170) return { score: 5, label: "MAX" };
    if (averageHeartRate >= 160) return { score: 4, label: "HIGH" };
    if (averageHeartRate >= 145) return { score: 3, label: "MID" };
    if (averageHeartRate >= 130) return { score: 2, label: "LOW" };
    return { score: 1, label: "EASY" };
  };
  const intensity = getIntensityScore();

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

        {/* Top Section - 3 Stats Row */}
        <View style={tw`px-4 py-4`}>
          <View style={tw`flex-row gap-3`}>
            {/* Sessions */}
            <View style={[tw`flex-1 bg-[#1a1a1a] py-4 items-center`, { borderRadius: 16 }]}>
              <Feather name="target" size={28} color="#EF4444" />
              <Text style={[tw`text-white text-2xl mt-2`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                {totalSessions}
              </Text>
              <Text style={[tw`text-[#6B7280] text-xs mt-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 0.5 }]}>
                SESSIONS
              </Text>
            </View>

            {/* Time Under Load */}
            <View style={[tw`flex-1 bg-[#1a1a1a] py-4 items-center`, { borderRadius: 16 }]}>
              <Feather name="clock" size={28} color="#EF4444" />
              <Text style={[tw`text-white text-2xl mt-2`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                {formatTime(totalSeconds)}
              </Text>
              <Text style={[tw`text-[#6B7280] text-xs mt-1 text-center`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 0.5 }]}>
                TIME UNDER{'\n'}LOAD
              </Text>
            </View>

            {/* Avg Time */}
            <View style={[tw`flex-1 bg-[#1a1a1a] py-4 items-center`, { borderRadius: 16 }]}>
              <Feather name="trending-up" size={28} color="#EF4444" />
              <Text style={[tw`text-white text-2xl mt-2`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                {formatTime(avgSeconds)}
              </Text>
              <Text style={[tw`text-[#6B7280] text-xs mt-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 0.5 }]}>
                AVG TIME
              </Text>
            </View>
          </View>
        </View>

        {/* Middle - Summit Reps */}
        <View style={tw`px-4 pb-4`}>
          <Text style={[tw`text-[#6B7280] text-xs mb-3 ml-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
            SUMMIT REPS
          </Text>
          <View style={tw`flex-row gap-3`}>
            {/* Burpees */}
            <View style={[tw`flex-1 bg-[#1a1a1a] p-4`, { borderRadius: 16 }]}>
              <View style={tw`flex-row items-center mb-2`}>
                <View style={tw`w-7 h-7 bg-[#EF4444]/20 rounded-lg items-center justify-center mr-2`}>
                  <Text style={[tw`text-[#EF4444]`, { fontFamily: "SpaceGrotesk_700Bold", fontSize: 11 }]}>B</Text>
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
              <View style={tw`flex-row items-center mb-2`}>
                <View style={tw`w-7 h-7 bg-[#EF4444]/20 rounded-lg items-center justify-center mr-2`}>
                  <Text style={[tw`text-[#EF4444]`, { fontFamily: "SpaceGrotesk_700Bold", fontSize: 11 }]}>F</Text>
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

        {/* Health Section - Collapsible */}
        <View style={tw`px-4 pb-4`}>
          <Pressable
            onPress={() => setHealthExpanded(!healthExpanded)}
            style={tw`flex-row items-center justify-between mb-3 ml-1`}
          >
            <Text style={[tw`text-[#6B7280] text-xs`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
              HEALTH
            </Text>
            <Feather
              name={healthExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color="#6B7280"
            />
          </Pressable>

          {healthExpanded && (
            <View style={[tw`bg-[#1a1a1a] p-4`, { borderRadius: 16 }]}>
              <View style={tw`flex-row`}>
                {/* Avg HR */}
                <View style={tw`flex-1 items-center`}>
                  <View style={tw`w-10 h-10 bg-[#EF4444]/20 rounded-full items-center justify-center mb-2`}>
                    <Feather name="heart" size={20} color="#EF4444" />
                  </View>
                  <Text style={[tw`text-white text-xl`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                    {averageHeartRate || "--"}
                  </Text>
                  <Text style={[tw`text-[#6B7280] text-xs mt-1`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                    AVG BPM
                  </Text>
                </View>

                {/* Max HR */}
                <View style={tw`flex-1 items-center`}>
                  <View style={tw`w-10 h-10 bg-[#EF4444]/20 rounded-full items-center justify-center mb-2`}>
                    <Feather name="trending-up" size={20} color="#EF4444" />
                  </View>
                  <Text style={[tw`text-white text-xl`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                    {maxHeartRate || "--"}
                  </Text>
                  <Text style={[tw`text-[#6B7280] text-xs mt-1`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                    MAX BPM
                  </Text>
                </View>

                {/* Intensity */}
                <View style={tw`flex-1 items-center`}>
                  <View style={tw`w-10 h-10 bg-[#EF4444]/20 rounded-full items-center justify-center mb-2`}>
                    <Feather name="zap" size={20} color="#EF4444" />
                  </View>
                  <Text style={[tw`text-white text-xl`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                    {intensity?.label || "--"}
                  </Text>
                  <Text style={[tw`text-[#6B7280] text-xs mt-1`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                    INTENSITY
                  </Text>
                </View>
              </View>
            </View>
          )}
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

                // Format as W3:D1
                const match = session.workoutId.match(/week(\d+)-day(\d+)/i);
                const sessionCode = match ? `W${match[1]}:D${match[2]}` : session.workoutId;

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
                        <Feather name="check" size={18} color="#22C55E" />
                      </View>
                      <View>
                        <Text style={[tw`text-white`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
                          {sessionCode}
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
                        {formatTime(session.durationSeconds)}
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
