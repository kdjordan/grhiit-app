import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const GRHIIT_RED = "#EF4444";

interface GrhiitLogoProps {
  width?: number;
  height?: number;
  color?: string;
  animate?: boolean;
  onAnimationComplete?: () => void;
}

const pathD = "M262.17 445.931V318.087l31.281-31.281h94.659l30.737 30.737v29.105h-36.993v-15.504l-12.785-12.785h-56.034l-13.872 13.873v99.555l13.872 13.872h56.578l13.329-13.328v-29.649H342.14v-31.553h76.707v74.802l-31.281 31.281h-94.115l-31.281-31.281ZM598.372 414.106v63.106h-36.993v-54.673l-16.32-18.225h-59.298v72.898h-36.993V286.806H568.18l29.104 29.377v57.666l-18.496 18.769 19.584 21.488Zm-112.611-40.257h65.554l9.52-9.52v-36.993l-9.52-9.521h-65.554v56.034ZM632.374 286.806h36.993v79.699h80.514v-79.699h36.993v190.406h-36.993v-79.154h-80.514v79.154h-36.993V286.806ZM823.596 286.806h36.993v190.406h-36.993zM898.67 286.806h36.993v190.406H898.67zM1015.63 318.087h-56.846v-31.281h150.696v31.281h-56.85v159.125h-37V318.087Z";

export function GrhiitLogo({
  width = 280,
  height = 63,
  color = GRHIIT_RED,
  animate = false,
  onAnimationComplete,
}: GrhiitLogoProps) {
  const outlineOpacity = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const fillOpacity = useRef(new Animated.Value(animate ? 0 : 1)).current;

  useEffect(() => {
    if (animate) {
      Animated.sequence([
        // Fade in outline
        Animated.timing(outlineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        // Fade in fill
        Animated.timing(fillOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start(() => {
        onAnimationComplete?.();
      });
    }
  }, [animate]);

  if (!animate) {
    return (
      <Svg width={width} height={height} viewBox="0 0 848 191">
        <Path
          d={pathD}
          fill={color}
          transform="matrix(1 0 -.00047 1 -261.962 -286.806)"
        />
      </Svg>
    );
  }

  return (
    <Svg width={width} height={height} viewBox="0 0 848 191">
      {/* Outline */}
      <AnimatedPath
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeOpacity={outlineOpacity}
        transform="matrix(1 0 -.00047 1 -261.962 -286.806)"
      />
      {/* Fill */}
      <AnimatedPath
        d={pathD}
        fill={color}
        fillOpacity={fillOpacity}
        transform="matrix(1 0 -.00047 1 -261.962 -286.806)"
      />
    </Svg>
  );
}
