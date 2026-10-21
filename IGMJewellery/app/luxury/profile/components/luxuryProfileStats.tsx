import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import LuxuryProfileCard from "./luxuryProfileCard";

export type LuxuryProfileStat = {
  id: string;
  title: string;
  desc: string;
  /** Ionicons glyph name, shared with the classic storefront. */
  icon: string;
  path?: string;
};

type LuxuryProfileStatsProps = {
  items: LuxuryProfileStat[];
  onSelect?: (item: LuxuryProfileStat) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The shopper's four shortcuts — orders, home trials, customisation, vault —
 * as a two-up grid of frosted tiles.
 */
export default function LuxuryProfileStats({
  items,
  onSelect,
  style,
}: LuxuryProfileStatsProps) {
  return (
    <View style={[styles.grid, style]}>
      {items.map((item) => (
        <HapticButton
          key={item.id}
          style={styles.tileWrapper}
          activeOpacity={0.85}
          onPress={() => onSelect?.(item)}
        >
          <LuxuryProfileCard style={styles.tile}>
            <View style={styles.iconBadge}>
              <Ionicons
                name={item.icon as any}
                size={20}
                color={LUXURY_COLORS.accent}
              />
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc} numberOfLines={2}>
              {item.desc}
            </Text>
          </LuxuryProfileCard>
        </HapticButton>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    // The gutter between the columns is what is left over from the two tiles
    // rather than a gap of its own — a column gap plus two halves overflows
    // the row on narrow phones and drops the second tile to its own line.
    justifyContent: "space-between",
    rowGap: 12,
  },
  tileWrapper: {
    width: "48.5%",
  },
  tile: {
    padding: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  title: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  desc: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: LUXURY_COLORS.textMuted,
  },
});
