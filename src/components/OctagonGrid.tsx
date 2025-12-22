import { useEffect, useRef } from "react";
import { View, Pressable, Animated, Easing } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";
import tw from "@/lib/tw";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const GRHIIT_RED = "#EF4444";

interface OctagonGridProps {
  completedWorkouts: number[];
  missedWorkouts?: number[];
  currentWorkout?: number;
  onCellPress?: (workoutNum: number) => void;
}

// Generate octagon path for SVG
function createOctagonPath(size: number): string {
  const radius = size / 2;
  const points: [number, number][] = [];

  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 8) + (i * Math.PI / 4);
    const x = radius + radius * Math.sin(angle);
    const y = radius - radius * Math.cos(angle);
    points.push([x, y]);
  }

  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ") + " Z";
}

// Pulsing octagon for current workout
function PulsingOctagon({
  size,
  workoutNum
}: {
  size: number;
  workoutNum: number;
}) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const path = createOctagonPath(size);

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

  const fillOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.25],
  });

  const glowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer glow */}
      <AnimatedPath
        d={path}
        fill="none"
        stroke={GRHIIT_RED}
        strokeWidth={3}
        strokeOpacity={glowOpacity}
      />
      {/* Fill */}
      <AnimatedPath
        d={path}
        fill={GRHIIT_RED}
        fillOpacity={fillOpacity}
      />
      {/* Border */}
      <Path
        d={path}
        fill="none"
        stroke={GRHIIT_RED}
        strokeWidth={2}
      />
      {/* Number */}
      <SvgText
        x={size / 2}
        y={size / 2 + 5}
        textAnchor="middle"
        fill={GRHIIT_RED}
        fontSize={14}
        fontFamily="JetBrainsMono_600SemiBold"
      >
        {workoutNum.toString().padStart(2, "0")}
      </SvgText>
    </Svg>
  );
}

// Static octagon cell
function OctagonCell({
  size,
  workoutNum,
  completed,
  missed,
  onPress,
}: {
  size: number;
  workoutNum: number;
  completed: boolean;
  missed: boolean;
  onPress?: () => void;
}) {
  const path = createOctagonPath(size);

  const content = (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background */}
      <Path
        d={path}
        fill={completed ? GRHIIT_RED : "transparent"}
        stroke={completed ? "none" : missed ? "#2a2a2a" : "#3a3a3a"}
        strokeWidth={2}
        strokeOpacity={missed ? 0.5 : 0.7}
      />
      {/* Glow for completed */}
      {completed && (
        <Path
          d={path}
          fill="none"
          stroke={GRHIIT_RED}
          strokeWidth={3}
          strokeOpacity={0.4}
        />
      )}
      {/* Number */}
      <SvgText
        x={size / 2}
        y={size / 2 + 5}
        textAnchor="middle"
        fill={completed ? "#FFFFFF" : missed ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.4)"}
        fontSize={14}
        fontFamily="JetBrainsMono_600SemiBold"
      >
        {workoutNum.toString().padStart(2, "0")}
      </SvgText>
      {/* X for missed */}
      {missed && (
        <>
          <Path
            d={`M${size * 0.3},${size * 0.3} L${size * 0.7},${size * 0.7}`}
            stroke="rgba(239,68,68,0.35)"
            strokeWidth={1.5}
          />
          <Path
            d={`M${size * 0.7},${size * 0.3} L${size * 0.3},${size * 0.7}`}
            stroke="rgba(239,68,68,0.35)"
            strokeWidth={1.5}
          />
        </>
      )}
    </Svg>
  );

  if (completed && onPress) {
    return (
      <Pressable onPress={onPress} style={tw`items-center justify-center`}>
        {content}
      </Pressable>
    );
  }

  return <View style={tw`items-center justify-center`}>{content}</View>;
}

export function OctagonGrid({
  completedWorkouts,
  missedWorkouts = [],
  currentWorkout,
  onCellPress,
}: OctagonGridProps) {
  const weeks = 8;
  const workoutsPerWeek = 3;
  const cellSize = 44;

  const isCompleted = (num: number) => completedWorkouts.includes(num);
  const isMissed = (num: number) => missedWorkouts.includes(num);
  const isCurrent = (num: number) => currentWorkout === num;

  return (
    <View style={tw`gap-2`}>
      {Array.from({ length: weeks }, (_, weekIndex) => {
        const weekNum = weekIndex + 1;

        return (
          <View key={weekNum} style={tw`flex-row items-center`}>
            {/* Week Label */}
            <View style={tw`w-9`}>
              <Svg width={32} height={20}>
                <SvgText
                  x={0}
                  y={14}
                  fill="#6B7280"
                  fontSize={11}
                  fontFamily="SpaceGrotesk_500Medium"
                >
                  W{weekNum}
                </SvgText>
              </Svg>
            </View>

            {/* Workout cells */}
            <View style={tw`flex-1 flex-row justify-between`}>
              {Array.from({ length: workoutsPerWeek }, (_, dayIndex) => {
                const workoutNum = weekIndex * workoutsPerWeek + dayIndex + 1;
                const completed = isCompleted(workoutNum);
                const missed = isMissed(workoutNum);
                const current = isCurrent(workoutNum);

                if (current) {
                  return (
                    <View key={workoutNum} style={tw`flex-1 items-center`}>
                      <PulsingOctagon size={cellSize} workoutNum={workoutNum} />
                    </View>
                  );
                }

                return (
                  <View key={workoutNum} style={tw`flex-1 items-center`}>
                    <OctagonCell
                      size={cellSize}
                      workoutNum={workoutNum}
                      completed={completed}
                      missed={missed}
                      onPress={completed && onCellPress ? () => onCellPress(workoutNum) : undefined}
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
