import { LUXURY_SPACING } from "@/constants/theme";
import { View } from "react-native";

type LuxurySeparatorProps = {
  /**
   * Multiplier on the standard gap — 0.5 for a tighter pair, 2 for a break
   * between unrelated sections. Keep to simple fractions so the page stays on
   * one rhythm.
   */
  size?: number;
  /** Horizontal spacing instead of vertical, for use inside a row. */
  horizontal?: boolean;
};

/**
 * Blank space between two components placed one after another. Sizing lives
 * here rather than in each caller's margins, so the rhythm is retuned from
 * LUXURY_SPACING alone.
 */
export default function LuxurySeparator({
  size = 1,
  horizontal = false,
}: LuxurySeparatorProps) {
  const length = LUXURY_SPACING * size;

  return (
    <View
      pointerEvents="none"
      style={horizontal ? { width: length } : { height: length }}
    />
  );
}
