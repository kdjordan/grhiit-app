import { useEffect, useState, useRef } from "react";
import { Text, View, Animated } from "react-native";
import tw from "@/lib/tw";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

interface ScrambleTextProps {
  text: string;
  onComplete?: () => void;
  staggerDelay?: number;
}

export function ScrambleText({
  text,
  onComplete,
  staggerDelay = 80,
}: ScrambleTextProps) {
  const [displayChars, setDisplayChars] = useState<string[]>(
    text.split("").map(() => getRandomChar())
  );
  const [lockedIndices, setLockedIndices] = useState<Set<number>>(new Set());
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  function getRandomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  useEffect(() => {
    // Fade in
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const letters = text.split("");
    let currentIndex = 0;

    // Scramble effect
    const scrambler = setInterval(() => {
      setDisplayChars((prev) =>
        prev.map((char, i) =>
          i < currentIndex ? letters[i] : getRandomChar()
        )
      );
    }, 50);

    // Lock letters one by one
    const lockTimers = letters.map((_, index) => {
      return setTimeout(() => {
        currentIndex = index + 1;
        setLockedIndices((prev) => new Set([...prev, index]));
        setDisplayChars((prev) =>
          prev.map((char, i) => (i <= index ? letters[i] : char))
        );

        // All letters locked
        if (index === letters.length - 1) {
          clearInterval(scrambler);
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }
      }, staggerDelay * (index + 1) + 300);
    });

    return () => {
      clearInterval(scrambler);
      lockTimers.forEach(clearTimeout);
    };
  }, [text]);

  return (
    <Animated.View
      style={[
        tw`flex-row`,
        { opacity, transform: [{ scale }] },
      ]}
    >
      {displayChars.map((char, index) => (
        <CharacterCell
          key={index}
          char={char}
          isLocked={lockedIndices.has(index)}
        />
      ))}
    </Animated.View>
  );
}

interface CharacterCellProps {
  char: string;
  isLocked: boolean;
}

function CharacterCell({ char, isLocked }: CharacterCellProps) {
  const flashOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLocked) {
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isLocked]);

  const color = flashOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [isLocked ? "#FAFAFA" : "#A3A3A3", "#E8110F"],
  });

  return (
    <Animated.Text
      style={[
        tw`text-5xl font-bold`,
        { fontFamily: "monospace", letterSpacing: 4, color },
      ]}
    >
      {char}
    </Animated.Text>
  );
}
