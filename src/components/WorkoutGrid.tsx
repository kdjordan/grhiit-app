import { View, Text } from "react-native";
import tw from "@/lib/tw";

interface WorkoutGridProps {
  completedWorkouts: number[];
  missedWorkouts?: number[];
  currentWorkout?: number;
}

export function WorkoutGrid({ completedWorkouts, missedWorkouts = [], currentWorkout }: WorkoutGridProps) {
  const weeks = 8;
  const workoutsPerWeek = 3;

  const isCompleted = (num: number) => completedWorkouts.includes(num);
  const isMissed = (num: number) => missedWorkouts.includes(num);
  const isCurrent = (num: number) => currentWorkout === num;

  return (
    <View style={tw`gap-1`}>
      {Array.from({ length: weeks }, (_, weekIndex) => {
        const weekNum = weekIndex + 1;

        return (
          <View
            key={weekNum}
            style={tw`flex-row items-center`}
          >
            {/* Week Label */}
            <View style={tw`w-10`}>
              <Text style={[
                tw`text-xs text-white/20`,
                { fontFamily: "SpaceGrotesk_500Medium" }
              ]}>
                W{weekNum}
              </Text>
            </View>

            {/* Workout cells */}
            <View style={tw`flex-1 flex-row gap-1`}>
              {Array.from({ length: workoutsPerWeek }, (_, dayIndex) => {
                const workoutNum = weekIndex * workoutsPerWeek + dayIndex + 1;
                const completed = isCompleted(workoutNum);
                const missed = isMissed(workoutNum);
                const current = isCurrent(workoutNum);

                return (
                  <View
                    key={workoutNum}
                    style={[
                      tw`flex-1 h-11 items-center justify-center`,
                      completed && tw`bg-grhiit-red`,
                      missed && tw`bg-transparent border border-[#1a1a1a]`,
                      current && tw`bg-grhiit-red/15 border border-grhiit-red`,
                      !completed && !missed && !current && tw`bg-[#111]`,
                      completed && { shadowColor: "#EF4444", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 4 },
                    ]}
                  >
                    <Text style={[
                      tw`text-base`,
                      completed && tw`text-white`,
                      missed && tw`text-white/10`,
                      current && tw`text-grhiit-red`,
                      !completed && !missed && !current && tw`text-white/30`,
                      { fontFamily: "JetBrainsMono_600SemiBold" }
                    ]}>
                      {workoutNum.toString().padStart(2, "0")}
                    </Text>
                    {/* X for missed */}
                    {missed && (
                      <>
                        <View style={[tw`absolute w-full h-[1px] bg-grhiit-red/30`, { transform: [{ rotate: "-45deg" }] }]} />
                        <View style={[tw`absolute w-full h-[1px] bg-grhiit-red/30`, { transform: [{ rotate: "45deg" }] }]} />
                      </>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}
