import { useEffect, useRef, useMemo } from "react";
import { View, Animated, useWindowDimensions, Easing } from "react-native";
import Svg, { Path, G, Text as SvgText } from "react-native-svg";
import tw from "@/lib/tw";
import { GrhiitMark } from "./GrhiitMark";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const GRHIIT_RED = "#EF4444";
const TOTAL_WORKOUTS = 24;

interface SpiralProgressProps {
  completedWorkouts: number[];
  missedWorkouts?: number[];
  currentWorkout?: number;
  onCellPress?: (workoutNum: number) => void;
}

interface CellPosition {
  x: number;
  y: number;
  size: number;
  angle: number;
}

// Generate octagon path for a given center and size
function createOctagonPath(cx: number, cy: number, size: number): string {
  const radius = size / 2;
  const points: [number, number][] = [];

  // 8 vertices, starting from top
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 8) + (i * Math.PI / 4); // Start at 22.5° offset
    const x = cx + radius * Math.sin(angle);
    const y = cy - radius * Math.cos(angle);
    points.push([x, y]);
  }

  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ") + " Z";
}

// Calculate spiral positions for 24 workouts
// Uses discrete rings for cleaner appearance
function calculateSpiralPositions(centerX: number, centerY: number, maxRadius: number): CellPosition[] {
  const positions: CellPosition[] = [];

  // Define rings: [startIndex, count, radius, cellSize]
  // Outer ring (10 cells), Middle ring (8 cells), Inner ring (6 cells)
  const rings = [
    { start: 1, count: 10, radius: maxRadius * 0.92, size: 36 },
    { start: 11, count: 8, radius: maxRadius * 0.62, size: 32 },
    { start: 19, count: 6, radius: maxRadius * 0.32, size: 28 },
  ];

  // Calculate angular offset for spiral continuity
  let prevEndAngle = -Math.PI / 2; // Start from top (12 o'clock)

  rings.forEach((ring, ringIndex) => {
    const angleStep = (2 * Math.PI) / ring.count;
    // Start angle continues from previous ring's end for spiral effect
    const startAngle = ringIndex === 0 ? -Math.PI / 2 : prevEndAngle - (angleStep * 0.3);

    for (let i = 0; i < ring.count; i++) {
      const angle = startAngle + (i * angleStep);

      positions.push({
        x: centerX + ring.radius * Math.cos(angle),
        y: centerY + ring.radius * Math.sin(angle),
        size: ring.size,
        angle,
      });

      if (i === ring.count - 1) {
        prevEndAngle = angle;
      }
    }
  });

  return positions;
}

// Pulsing cell component for current workout
function PulsingCell({
  path,
  workoutNum,
  cx,
  cy,
}: {
  path: string;
  workoutNum: number;
  cx: number;
  cy: number;
}) {
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

  const fillOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.35],
  });

  const glowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <G>
      {/* Glow effect */}
      <AnimatedPath
        d={path}
        fill="none"
        stroke={GRHIIT_RED}
        strokeWidth={4}
        strokeOpacity={glowOpacity}
      />
      {/* Cell background */}
      <AnimatedPath
        d={path}
        fill={GRHIIT_RED}
        fillOpacity={fillOpacity}
      />
      {/* Cell border */}
      <Path
        d={path}
        fill="none"
        stroke={GRHIIT_RED}
        strokeWidth={2}
      />
      {/* Number */}
      <SvgText
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fill={GRHIIT_RED}
        fontSize={12}
        fontFamily="JetBrainsMono_600SemiBold"
      >
        {workoutNum.toString().padStart(2, "0")}
      </SvgText>
    </G>
  );
}

export function SpiralProgress({
  completedWorkouts,
  missedWorkouts = [],
  currentWorkout,
}: SpiralProgressProps) {
  const { width: screenWidth } = useWindowDimensions();

  // Calculate dimensions
  const svgSize = Math.min(screenWidth - 32, 360);
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  const maxRadius = (svgSize / 2) - 24;

  // Calculate positions
  const positions = useMemo(
    () => calculateSpiralPositions(centerX, centerY, maxRadius),
    [centerX, centerY, maxRadius]
  );

  // Check if all workouts complete
  const allComplete = completedWorkouts.length >= TOTAL_WORKOUTS;

  const isCompleted = (num: number) => completedWorkouts.includes(num);
  const isMissed = (num: number) => missedWorkouts.includes(num);
  const isCurrent = (num: number) => currentWorkout === num;

  return (
    <View style={tw`items-center justify-center`}>
      <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        {/* Render cells */}
        {positions.map((pos, index) => {
          const workoutNum = index + 1;
          const completed = isCompleted(workoutNum);
          const missed = isMissed(workoutNum);
          const current = isCurrent(workoutNum);
          const path = createOctagonPath(pos.x, pos.y, pos.size);

          if (current) {
            return (
              <PulsingCell
                key={workoutNum}
                path={path}
                workoutNum={workoutNum}
                cx={pos.x}
                cy={pos.y}
              />
            );
          }

          return (
            <G key={workoutNum}>
              {/* Cell background */}
              <Path
                d={path}
                fill={completed ? GRHIIT_RED : "transparent"}
                fillOpacity={completed ? 1 : 0}
                stroke={completed ? GRHIIT_RED : missed ? "#1a1a1a" : "#333333"}
                strokeWidth={completed ? 0 : 1.5}
                strokeOpacity={missed ? 0.5 : 0.6}
              />
              {/* Completed glow */}
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
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                fill={completed ? "#FFFFFF" : missed ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.35)"}
                fontSize={11}
                fontFamily="JetBrainsMono_600SemiBold"
              >
                {workoutNum.toString().padStart(2, "0")}
              </SvgText>
              {/* X overlay for missed */}
              {missed && (
                <>
                  <Path
                    d={`M${pos.x - pos.size/3},${pos.y - pos.size/3} L${pos.x + pos.size/3},${pos.y + pos.size/3}`}
                    stroke="rgba(239,68,68,0.3)"
                    strokeWidth={1}
                  />
                  <Path
                    d={`M${pos.x + pos.size/3},${pos.y - pos.size/3} L${pos.x - pos.size/3},${pos.y + pos.size/3}`}
                    stroke="rgba(239,68,68,0.3)"
                    strokeWidth={1}
                  />
                </>
              )}
            </G>
          );
        })}

        {/* Center element */}
        {allComplete && (
          <G>
            {/* Subtle center indicator when complete */}
            <Path
              d={createOctagonPath(centerX, centerY, 48)}
              fill={GRHIIT_RED}
              fillOpacity={0.15}
              stroke={GRHIIT_RED}
              strokeWidth={2}
              strokeOpacity={0.8}
            />
          </G>
        )}
      </Svg>

      {/* Center logomark overlay (rendered outside SVG for proper sizing) */}
      {allComplete && (
        <View style={[tw`absolute`, { top: svgSize/2 - 20, left: svgSize/2 - 20 + 16 }]}>
          <GrhiitMark size={40} color={GRHIIT_RED} />
        </View>
      )}
    </View>
  );
}
