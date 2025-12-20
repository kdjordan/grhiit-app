import { useRef } from "react";
import { View, Animated, StyleSheet, Dimensions, Easing } from "react-native";
import tw from "@/lib/tw";
import { GrhiitLogo } from "./GrhiitLogo";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AnimatedSplashProps {
  onComplete: () => void;
}

export function AnimatedSplash({ onComplete }: AnimatedSplashProps) {
  const slideY = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  const handleLogoComplete = () => {
    // Show tagline, then slide up
    Animated.sequence([
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(800),
      Animated.timing(slideY, {
        toValue: -SCREEN_HEIGHT,
        duration: 600,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideY }] },
      ]}
    >
      <View style={tw`items-center`}>
        <GrhiitLogo
          width={260}
          height={58}
          animate
          onAnimationComplete={handleLogoComplete}
        />
        <Animated.Text
          style={[
            tw`text-secondary text-sm mt-6`,
            { opacity: taglineOpacity, letterSpacing: 2 },
          ]}
        >
          THE ONLY WAY OUT IS THROUGH
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
});
