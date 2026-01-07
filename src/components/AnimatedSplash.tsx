import { useRef, useState } from "react";
import { View, Animated, StyleSheet, Dimensions, Easing } from "react-native";
import tw from "@/lib/tw";
import { GrhiitLogo } from "./GrhiitLogo";
import { GrhiitMark } from "./GrhiitMark";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AnimatedSplashProps {
  onComplete: () => void;
}

export function AnimatedSplash({ onComplete }: AnimatedSplashProps) {
  const [markComplete, setMarkComplete] = useState(false);

  const slideY = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  const handleMarkComplete = () => {
    setMarkComplete(true);
    // Fade in the text logo
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const handleLogoComplete = () => {
    // Show tagline, then slide up
    Animated.sequence([
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
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
        {/* Logomark - octagon + G */}
        <GrhiitMark
          size={120}
          animate
          onAnimationComplete={handleMarkComplete}
        />

        {/* Text logo - fades in after mark */}
        <Animated.View style={[tw`mt-8`, { opacity: logoOpacity }]}>
          <GrhiitLogo
            width={220}
            height={50}
            animate={markComplete}
            onAnimationComplete={handleLogoComplete}
          />
        </Animated.View>

        {/* Tagline - fades in after logo */}
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
