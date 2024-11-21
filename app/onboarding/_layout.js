import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack>
      {["screen1", "screen2", "screen3"].map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen}
          options={{ headerShown: false }}
        />
      ))}
    </Stack>
  );
}
