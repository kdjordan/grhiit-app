import { Stack } from "expo-router";

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0A0A0A" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="active" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
