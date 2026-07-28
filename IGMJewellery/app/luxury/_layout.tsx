import { Stack } from "expo-router";

export default function LuxuryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This renders index.tsx at the route /luxury */}
      <Stack.Screen name="index" />
      <Stack.Screen name="homePageLuxury" />
      <Stack.Screen name="product/[id]" />

      {/* Add other screens here as you create them */}
      {/* <Stack.Screen name="details" /> */}
    </Stack>
  );
}