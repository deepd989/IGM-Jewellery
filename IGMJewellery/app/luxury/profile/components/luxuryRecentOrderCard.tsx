import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import LuxuryProfileCard from "./luxuryProfileCard";

export type LuxuryOrderLine = {
  id: string;
  imageUrl: string;
  /** Where the line has got to, e.g. "Dispatched on Mon, 2 Nov". */
  status: string;
  title: string;
  price: string;
};

type LuxuryRecentOrderCardProps = {
  orderId: string;
  placedOn: string;
  total: string;
  itemCount: string;
  imageUrl: string;
  /** Short progress notes shown as pills under the order's header. */
  statuses?: string[];
  lines?: LuxuryOrderLine[];
  onPressLine?: (line: LuxuryOrderLine) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * One order, summarised: what it cost and when it was placed, then a line per
 * item with where each has got to.
 */
export default function LuxuryRecentOrderCard({
  orderId,
  placedOn,
  total,
  itemCount,
  imageUrl,
  statuses = [],
  lines = [],
  onPressLine,
  style,
}: LuxuryRecentOrderCardProps) {
  return (
    <LuxuryProfileCard style={[styles.card, style]}>
      <View style={styles.header}>
        <Image source={{ uri: imageUrl }} style={styles.thumb} />

        <View style={styles.headerText}>
          <Text style={styles.orderId} numberOfLines={1}>
            {orderId}
          </Text>
          <Text style={styles.placedOn}>{placedOn}</Text>
        </View>

        <View style={styles.headerMeta}>
          <Text style={styles.total}>{total}</Text>
          <Text style={styles.itemCount}>{itemCount}</Text>
        </View>
      </View>

      {statuses.length > 0 && (
        <View style={styles.statusRow}>
          {statuses.map((status) => (
            <View key={status} style={styles.statusPill}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          ))}
        </View>
      )}

      {lines.map((line) => (
        <HapticButton
          key={line.id}
          style={styles.line}
          activeOpacity={0.8}
          onPress={() => onPressLine?.(line)}
        >
          <Image source={{ uri: line.imageUrl }} style={styles.lineThumb} />

          <View style={styles.lineText}>
            <Text style={styles.lineStatus}>{line.status}</Text>
            <Text style={styles.lineTitle} numberOfLines={1}>
              {line.title}
            </Text>
            <Text style={styles.linePrice}>{line.price}</Text>
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
  card: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  headerText: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  placedOn: {
    marginTop: 2,
    fontSize: 11,
    color: LUXURY_COLORS.textMuted,
  },
  headerMeta: {
    alignItems: "flex-end",
  },
  total: {
    fontSize: 14,
    fontWeight: "700",
    color: LUXURY_COLORS.accent,
  },
  itemCount: {
    marginTop: 2,
    fontSize: 11,
    color: LUXURY_COLORS.textMuted,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: LUXURY_COLORS.text,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LUXURY_COLORS.border,
  },
  lineThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  lineText: {
    flex: 1,
  },
  lineStatus: {
    fontSize: 10,
    color: LUXURY_COLORS.textMuted,
  },
  lineTitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "600",
    color: LUXURY_COLORS.text,
  },
  linePrice: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: LUXURY_COLORS.accent,
  },
});
