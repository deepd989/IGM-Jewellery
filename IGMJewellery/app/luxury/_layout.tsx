import { Stack } from "expo-router";

/**
 * The nav bar's own destinations cross-fade; anything opened on top of them —
 * a product, say — keeps the default push so it still reads as going deeper.
 */
const NAV_BAR_SCREEN = { animation: "fade" as const };

export default function LuxuryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This renders index.tsx at the route /luxury */}
      <Stack.Screen name="index" options={NAV_BAR_SCREEN} />
      <Stack.Screen name="homePageLuxury" />
      <Stack.Screen name="product/[id]" />
      <Stack.Screen name="categories/index" options={NAV_BAR_SCREEN} />

      {/* Add other screens here as you create them */}
      {/* <Stack.Screen name="details" /> */}
    </Stack>
  );
}
