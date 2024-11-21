import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneNumber" />
      <Stack.Screen name="OtpVerify" />
    </Stack>
  );
}
