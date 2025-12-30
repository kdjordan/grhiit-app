import { View, Text, Pressable } from "react-native";
import Svg, { Text as SvgText } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tw";
import { getWorkoutByNumber } from "@/lib/workoutLoader";

const GRHIIT_RED = "#EF4444";

interface ProgressGridProps {
  completedWorkouts: number[];
  missedWorkouts?: number[];
  currentWorkout?: number;
  devMode?: boolean;
  onSelectWorkout?: (workoutNum: number) => void;
}

const BAR_HEIGHT = 28;
const ROW_HEIGHT = 36;
const FONT_SIZE = 11;

export function ProgressGrid({
  completedWorkouts,
  missedWorkouts = [],
  currentWorkout,
  devMode = false,
  onSelectWorkout,
}: ProgressGridProps) {
  const weeks = 8;
  const workoutsPerWeek = 3;

  // Determine active week
  const activeWeek = currentWorkout ? Math.ceil(currentWorkout / 3) : 1;

  const isCompleted = (num: number) => completedWorkouts.includes(num);
  const isMissed = (num: number) => missedWorkouts.includes(num);
  const isCurrent = (num: number) => currentWorkout === num;
  // Check if workout has JSON data available
  const hasData = (num: number) => getWorkoutByNumber(num) !== null;

  return (
    <View style={tw`gap-1`}>
      {Array.from({ length: weeks }, (_, weekIndex) => {
        const weekNum = weekIndex + 1;
        const isActiveWeek = weekNum === activeWeek;

        return (
          <View
            key={weekNum}
            style={[
              tw`flex-row items-center`,
              { height: ROW_HEIGHT }
            ]}
          >
            {/* Week Label */}
            <View style={tw`w-16`}>
              <Svg width={60} height={16}>
                <SvgText
                  x={0}
                  y={12}
                  fill={isActiveWeek ? "#FFFFFF" : "#4B5563"}
                  fontSize={10}
                  fontFamily="SpaceGrotesk_500Medium"
                >
                  WEEK {weekNum}
                </SvgText>
              </Svg>
            </View>

            {/* Workout bars */}
            <View style={tw`flex-1 flex-row items-center`}>
              {Array.from({ length: workoutsPerWeek }, (_, dayIndex) => {
                const workoutNum = weekIndex * workoutsPerWeek + dayIndex + 1;
                const completed = isCompleted(workoutNum);
                const missed = isMissed(workoutNum);
                const current = isCurrent(workoutNum);
                const available = hasData(workoutNum);
                const isLocked = !completed && !current && currentWorkout !== undefined && workoutNum > currentWorkout;

                const dayNum = dayIndex + 1;

                // Determine cell styling based on state
                // 🔒 Locked: dark gray fill, lock icon, no outline
                // ▶ Current: dark fill, red outline, white number
                // ✅ Completed: red fill, white number, no outline
                // ❌ Missed: transparent with gray border

                let backgroundColor = "#2a2a2a"; // Default dark gray
                let borderWidth = 0;
                let borderColor = "transparent";

                if (completed) {
                  backgroundColor = GRHIIT_RED;
                } else if (current) {
                  backgroundColor = "#2a2a2a";
                  borderWidth = 2;
                  borderColor = GRHIIT_RED;
                } else if (missed) {
                  backgroundColor = "transparent";
                  borderWidth = 1;
                  borderColor = "#3a3a3a";
                }

                // Show lock if locked AND (not in dev mode OR no data available)
                const showLock = isLocked && (!devMode || !available);

                const bar = (
                  <View
                    style={[
                      {
                        height: BAR_HEIGHT,
                        borderRadius: 4,
                        backgroundColor,
                        borderWidth,
                        borderColor,
                      },
                      tw`items-center justify-center`
                    ]}
                  >
                    {showLock ? (
                      <Feather name="lock" size={FONT_SIZE} color="#4B5563" />
                    ) : (
                      <Text style={{
                        fontSize: FONT_SIZE,
                        color: completed || current ? "#FFFFFF" : "#6B7280",
                        fontFamily: "SpaceGrotesk_500Medium"
                      }}>
                        {dayNum}
                      </Text>
                    )}
                  </View>
                );

                // In dev mode, make available workouts tappable
                if (devMode && available && onSelectWorkout) {
                  return (
                    <Pressable
                      key={workoutNum}
                      style={tw`flex-1 mx-1`}
                      onPress={() => onSelectWorkout(workoutNum)}
                    >
                      {bar}
                    </Pressable>
                  );
                }

                return (
                  <View key={workoutNum} style={tw`flex-1 mx-1`}>
                    {bar}
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
