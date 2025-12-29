import { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, Pressable } from "react-native";
import Svg, { Text as SvgText } from "react-native-svg";
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

// Pulsing bar for current workout
function PulsingBar({ isLarge, dayNum }: { isLarge: boolean; dayNum: number }) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const backgroundColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 0.4)"],
  });

  const height = isLarge ? 32 : 20;

  return (
    <View style={tw`flex-1 mx-1`}>
      <Animated.View
        style={[
          { height, borderRadius: 4, borderWidth: 2, borderColor: GRHIIT_RED },
          { backgroundColor },
          tw`items-center justify-center`
        ]}
      >
        <Text style={[
          tw`text-white`,
          { fontSize: isLarge ? 12 : 9, fontFamily: "SpaceGrotesk_500Medium" }
        ]}>
          {dayNum}
        </Text>
      </Animated.View>
    </View>
  );
}

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

        const barHeight = isActiveWeek ? 32 : 20;
        const rowHeight = isActiveWeek ? 40 : 28;

        return (
          <View
            key={weekNum}
            style={[
              tw`flex-row items-center`,
              { height: rowHeight }
            ]}
          >
            {/* Week Label */}
            <View style={tw`w-16`}>
              <Svg width={60} height={16}>
                <SvgText
                  x={0}
                  y={12}
                  fill={isActiveWeek ? "#FFFFFF" : "#4B5563"}
                  fontSize={isActiveWeek ? 11 : 9}
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

                const dayNum = dayIndex + 1; // 1, 2, or 3 within week

                if (current && !devMode) {
                  return <PulsingBar key={workoutNum} isLarge={isActiveWeek} dayNum={dayNum} />;
                }

                // Text color: white on completed (red), gray on incomplete
                // In dev mode: green border if data available
                const textColor = completed ? "#FFFFFF" : "#6B7280";

                const bar = (
                  <View
                    style={[
                      {
                        height: barHeight,
                        borderRadius: 4,
                        backgroundColor: completed
                          ? GRHIIT_RED
                          : current
                            ? "rgba(239, 68, 68, 0.3)"
                            : missed
                              ? "transparent"
                              : "#2a2a2a",
                        borderWidth: devMode && available ? 2 : missed ? 1 : current ? 2 : 0,
                        borderColor: devMode && available
                          ? "#22C55E"
                          : current
                            ? GRHIIT_RED
                            : missed
                              ? "#3a3a3a"
                              : "transparent",
                      },
                      tw`items-center justify-center`
                    ]}
                  >
                    <Text style={{
                      fontSize: isActiveWeek ? 12 : 9,
                      color: current ? "#FFFFFF" : textColor,
                      fontFamily: "SpaceGrotesk_500Medium"
                    }}>
                      {dayNum}
                    </Text>
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
