import { View, Text } from "react-native";
import tw from "@/lib/tw";

interface WorkoutGridProps {
  startDate: Date;
  completedWorkouts: number[]; // Array of workout numbers [1, 2, 3, etc.]
  missedWorkouts?: number[]; // Array of missed workout numbers
  currentWorkout?: number; // e.g., 6
}

function formatDate(date: Date): string {
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
}


export function WorkoutGrid({ startDate, completedWorkouts, missedWorkouts = [], currentWorkout }: WorkoutGridProps) {
  const weeks = 8;
  const workoutsPerWeek = 3;

  const isCompleted = (num: number) => completedWorkouts.includes(num);
  const isMissed = (num: number) => missedWorkouts.includes(num);
  const isCurrent = (num: number) => currentWorkout === num;

  // Determine current week based on current workout
  const currentWeek = currentWorkout ? Math.ceil(currentWorkout / 3) : 1;

  const getCellStyle = (num: number) => {
    if (isCompleted(num)) return "bg-grhiit-red";
    if (isMissed(num)) return "border border-[#333]";
    if (isCurrent(num)) return "bg-grhiit-red/20 border-2 border-grhiit-red";
    return "border border-[#333]";
  };

  const getLabelStyle = (num: number) => {
    if (isCompleted(num)) return "text-white";
    if (isMissed(num)) return "text-white/20";
    if (isCurrent(num)) return "text-grhiit-red";
    return "text-white/40";
  };

  return (
    <View style={tw`bg-[#141414] rounded-2xl p-4 border border-[#262626]`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={[tw`text-white text-xs`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
          8-WEEK PROGRAM
        </Text>
        <Text style={tw`text-white/40 text-xs`}>
          Started {formatDate(startDate)}
        </Text>
      </View>

      {/* Week Rows */}
      {Array.from({ length: weeks }, (_, weekIndex) => {
        const weekNum = weekIndex + 1;
        const isCurrentWeek = weekNum === currentWeek;

        return (
          <View
            key={weekNum}
            style={tw`flex-row items-center mb-1 ${isCurrentWeek ? "bg-grhiit-red/10 -mx-2 px-2 py-0.5 rounded border-l-2 border-grhiit-red" : ""}`}
          >
            {/* Week Label */}
            <View style={tw`w-8 flex-row items-center`}>
              <Text style={tw`text-[9px] ${isCurrentWeek ? "text-grhiit-red font-bold" : "text-white/30"}`}>
                W{weekNum}
              </Text>
              {isCurrentWeek && (
                <View style={tw`ml-0.5 w-1 h-1 rounded-full bg-grhiit-red`} />
              )}
            </View>

            {/* Workout cells for this week */}
            <View style={tw`flex-1 flex-row gap-1`}>
              {Array.from({ length: workoutsPerWeek }, (_, dayIndex) => {
                const workoutNum = weekIndex * workoutsPerWeek + dayIndex + 1;

                return (
                  <View
                    key={workoutNum}
                    style={tw`flex-1 h-6 rounded items-center justify-center overflow-hidden ${getCellStyle(workoutNum)}`}
                  >
                    <Text style={tw`text-[10px] font-bold ${getLabelStyle(workoutNum)}`}>
                      {workoutNum}
                    </Text>
                    {/* Red X for missed workouts */}
                    {isMissed(workoutNum) && (
                      <>
                        <View
                          style={[
                            tw`absolute w-[140%] h-[1px] bg-grhiit-red/70`,
                            { transform: [{ rotate: "-45deg" }] }
                          ]}
                        />
                        <View
                          style={[
                            tw`absolute w-[140%] h-[1px] bg-grhiit-red/70`,
                            { transform: [{ rotate: "45deg" }] }
                          ]}
                        />
                      </>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}

      {/* Progress Footer */}
      <View style={tw`flex-row justify-between items-center mt-2 pt-3 border-t border-[#262626]`}>
        <Text style={tw`text-white/40 text-xs`}>
          {completedWorkouts.length}/24 complete
        </Text>
        {missedWorkouts.length > 0 && (
          <Text style={tw`text-grhiit-red/60 text-xs`}>
            {missedWorkouts.length} missed
          </Text>
        )}
      </View>
    </View>
  );
}
