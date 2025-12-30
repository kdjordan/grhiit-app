import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const GRHIIT_RED = "#EF4444";

// Path data
const OCTAGON_PATH = "M677.599 344.673l294.845 122.129 122.126 294.845-122.126 294.843-294.845 122.13-294.845-122.13-122.129-294.843 122.129-294.845 294.845-122.129Zm0 64.944L428.676 512.724 325.569 761.647l103.107 248.923 248.923 103.11 248.923-103.11 103.108-248.923-103.108-248.923-248.923-103.107Z";
const G_LETTER_PATH = "M417.011 812.513V533.198l68.343-68.344h206.813l67.154 67.155v63.589h-80.823v-33.875l-27.931-27.931H528.143l-30.309 30.309V781.61l30.309 30.309h123.612l29.12-29.12v-64.778h-89.143v-68.937h167.589v163.429l-68.343 68.343H485.354l-68.343-68.343Z";

interface GrhiitMarkProps {
  size?: number;
  color?: string;
  animate?: boolean;
  onAnimationComplete?: () => void;
}

export function GrhiitMark({
  size = 100,
  color = GRHIIT_RED,
  animate = false,
  onAnimationComplete,
}: GrhiitMarkProps) {
  const outlineOpacity = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const fillOpacity = useRef(new Animated.Value(animate ? 0 : 1)).current;

  useEffect(() => {
    if (animate) {
      Animated.sequence([
        // Fade in outline
        Animated.timing(outlineOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        // Fade in fill
        Animated.timing(fillOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start(() => {
        onAnimationComplete?.();
      });
    }
  }, [animate]);

  if (!animate) {
    return (
      <Svg width={size} height={size} viewBox="0 0 834 834">
        <Path
          d={OCTAGON_PATH}
          fill={color}
          transform="translate(-260.625 -344.673)"
        />
        <Path
          d={G_LETTER_PATH}
          fill={color}
          fillRule="nonzero"
          transform="translate(-200 -290) scale(1.05)"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 834 834">
      {/* Octagon outline */}
      <AnimatedPath
        d={OCTAGON_PATH}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeOpacity={outlineOpacity}
        transform="translate(-260.625 -344.673)"
      />
      {/* Octagon fill */}
      <AnimatedPath
        d={OCTAGON_PATH}
        fill={color}
        fillOpacity={fillOpacity}
        transform="translate(-260.625 -344.673)"
      />
      {/* G letter outline */}
      <AnimatedPath
        d={G_LETTER_PATH}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeOpacity={outlineOpacity}
        fillRule="nonzero"
        transform="translate(-200 -290) scale(1.05)"
      />
      {/* G letter fill */}
      <AnimatedPath
        d={G_LETTER_PATH}
        fill={color}
        fillRule="nonzero"
        fillOpacity={fillOpacity}
        transform="translate(-200 -290) scale(1.05)"
      />
    </Svg>
  );
}
