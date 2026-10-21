import { HapticButton } from "@/components/basic components/hapticButton";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { MICROSITE_MUTED, MICROSITE_PRIMARY } from "./micrositeTheme";

type MicrositeSectionHeaderProps = {
  title: string;
  /** Sits under the title, centred with it. */
  subtitle?: string;
  /** The brand's colour, which the title is set in. */
  primaryColor?: string;
  /** Left-aligns the title and puts the action beside it, as the rows do. */
  align?: "center" | "left";
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The heading every microsite section is introduced by, so a brand's page
 * keeps one voice whichever sections it turns on.
 */
export default function MicrositeSectionHeader({
  title,
  subtitle,
  primaryColor = MICROSITE_PRIMARY,
  align = "center",
  actionLabel,
  onAction,
  style,
}: MicrositeSectionHeaderProps) {
  const isLeft = align === "left";

  return (
    <View style={[styles.container, isLeft && styles.rowContainer, style]}>
      <View style={isLeft ? styles.leftText : styles.centerText}>
        <Text
          style={[
            styles.title,
            isLeft ? styles.titleLeft : styles.titleCenter,
            { color: primaryColor },
          ]}
        >
          {title}
        </Text>

        {!!subtitle && (
          <Text style={[styles.subtitle, !isLeft && styles.subtitleCenter]}>
            {subtitle}
          </Text>
        )}
      </View>

      {!!actionLabel && (
        <HapticButton
          style={styles.action}
          activeOpacity={0.7}
          onPress={onAction}
        >
          <Text style={[styles.actionLabel, { color: primaryColor }]}>
            {actionLabel}
          </Text>
          <ChevronRight size={16} color={primaryColor} strokeWidth={2.5} />
        </HapticButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  centerText: {
    alignItems: "center",
  },
  leftText: {
    flexShrink: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
  },
  titleCenter: {
    textAlign: "center",
  },
  titleLeft: {
    textAlign: "left",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: MICROSITE_MUTED,
  },
  subtitleCenter: {
    textAlign: "center",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
});
