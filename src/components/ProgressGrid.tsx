import { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import Svg, { Text as SvgText } from "react-native-svg";
import tw from "@/lib/tw";

const GRHIIT_RED = "#EF4444";

interface ProgressGridProps {
  completedWorkouts: number[];
  missedWorkouts?: number[];
  currentWorkout?: number;
}

// Pulsing bar for current workout
function PulsingBar({ isLarge }: { isLarge: boolean }) {
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
          { backgroundColor }
        ]}
      />
    </View>
  );
}

export function ProgressGrid({
  completedWorkouts,
  missedWorkouts = [],
  currentWorkout,
}: ProgressGridProps) {
  const weeks = 8;
  const workoutsPerWeek = 3;

  // Determine active week
  const activeWeek = currentWorkout ? Math.ceil(currentWorkout / 3) : 1;

  const isCompleted = (num: number) => completedWorkouts.includes(num);
  const isMissed = (num: number) => missedWorkouts.includes(num);
  const isCurrent = (num: number) => currentWorkout === num;

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

                if (current) {
                  return <PulsingBar key={workoutNum} isLarge={isActiveWeek} />;
                }

                return (
                  <View key={workoutNum} style={tw`flex-1 mx-1`}>
                    <View
                      style={[
                        {
                          height: barHeight,
                          borderRadius: 4,
                          backgroundColor: completed
                            ? GRHIIT_RED
                            : missed
                              ? "transparent"
                              : "#2a2a2a",
                          borderWidth: missed ? 1 : 0,
                          borderColor: missed ? "#3a3a3a" : "transparent",
                        }
                      ]}
                    />
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
