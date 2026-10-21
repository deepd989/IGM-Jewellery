import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import LuxuryProfileCard from "./luxuryProfileCard";

export type LuxuryProfileMenuItem = {
  id: string;
  title: string;
  desc?: string;
  /** Ionicons glyph name, shared with the classic storefront. */
  icon: string;
  path?: string;
};

type LuxuryProfileMenuListProps = {
  items: LuxuryProfileMenuItem[];
  onSelect?: (item: LuxuryProfileMenuItem) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The settings rows, drawn as one frosted panel with hairlines between them so
 * the list reads as a single object rather than a stack of cards.
 */
export default function LuxuryProfileMenuList({
  items,
  onSelect,
  style,
}: LuxuryProfileMenuListProps) {
  return (
    <LuxuryProfileCard style={style}>
      {items.map((item, index) => (
        <HapticButton
          key={item.id}
          style={[styles.row, index > 0 && styles.divided]}
          activeOpacity={0.8}
          onPress={() => onSelect?.(item)}
        >
          <View style={styles.iconBadge}>
            <Ionicons
              name={item.icon as any}
              size={18}
              color={LUXURY_COLORS.accent}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            {!!item.desc && <Text style={styles.desc}>{item.desc}</Text>}
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={LUXURY_COLORS.textMuted}
          />
        </HapticButton>
      ))}
    </LuxuryProfileCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  divided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LUXURY_COLORS.border,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: LUXURY_COLORS.text,
  },
  desc: {
    marginTop: 2,
    fontSize: 11,
    color: LUXURY_COLORS.textMuted,
  },
});
