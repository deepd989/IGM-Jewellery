import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

type LuxuryActionButtonProps = {
  label: string;
  onPress?: () => void;
  /**
   * "primary" is the gradient pill a screen commits with; "outline" is the
   * quieter one beside it, for adding a row or backing out.
   */
  variant?: "primary" | "outline";
  /** Drawn to the left of the label — an icon, usually. */
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * The one button shape the luxury profile screens act through, so a primary
 * action looks the same whichever screen it is on.
 */
export default function LuxuryActionButton({
  label,
  onPress,
  variant = "primary",
  icon,
  disabled = false,
  style,
}: LuxuryActionButtonProps) {
  const content = (
    <>
      {icon}
      <Text style={[styles.label, variant === "outline" && styles.outlineLabel]}>
        {label}
      </Text>
    </>
  );

  return (
    <HapticButton
      style={[styles.wrapper, disabled && styles.disabled, style]}
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={LUXURY_COLORS.gradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.body}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.body, styles.outlineBody]}>{content}</View>
      )}
    </HapticButton>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 27,
    overflow: "hidden",
  },
  disabled: {
    opacity: 0.5,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    paddingHorizontal: 24,
  },
  outlineBody: {
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.surface,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  outlineLabel: {
    fontWeight: "600",
    color: LUXURY_COLORS.text,
  },
});
