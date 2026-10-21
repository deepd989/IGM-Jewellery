import { LUXURY_COLORS } from "@/constants/theme";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type LuxuryProfileCardProps = {
  children: React.ReactNode;
  /**
   * "frosted" lets the storefront's ground show through the panel; "solid"
   * paints the raised surface, for rows that need to read as a list.
   */
  variant?: "frosted" | "solid";
  style?: StyleProp<ViewStyle>;
};

/**
 * The one panel every luxury profile screen is built from. Holding the frosted
 * stack here keeps the blur, the tint behind it and the hairline edge identical
 * across the section, however the screens arrange them.
 */
export default function LuxuryProfileCard({
  children,
  variant = "frosted",
  style,
}: LuxuryProfileCardProps) {
  return (
    <View style={[styles.card, variant === "solid" && styles.solid, style]}>
      {variant === "frosted" && (
        <>
          <BlurView
            intensity={22}
            tint="dark"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          {/* Keeps the white type readable wherever the card is dropped. */}
          <View style={styles.fill} pointerEvents="none" />
        </>
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
  },
  solid: {
    backgroundColor: LUXURY_COLORS.surface,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 60, 58, 0.55)",
  },
});
