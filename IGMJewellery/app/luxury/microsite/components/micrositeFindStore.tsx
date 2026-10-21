import { HapticButton } from "@/components/basic components/hapticButton";
import { MapPin, Navigation } from "lucide-react-native";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  MICROSITE_MUTED,
  MICROSITE_PRIMARY,
  MICROSITE_SECONDARY,
  withAlpha,
} from "./micrositeTheme";

type MicrositeFindStoreProps = {
  /** Count shown in the copy, when the brand reports one. */
  storeCount?: number;
  primaryColor?: string;
  secondaryColor?: string;
  onLocate?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The way off the phone and into a shop. Hidden by the page when the brand
 * gives no map link, so the action is never a dead end.
 */
export default function MicrositeFindStore({
  storeCount,
  primaryColor = MICROSITE_PRIMARY,
  secondaryColor = MICROSITE_SECONDARY,
  onLocate,
  style,
}: MicrositeFindStoreProps) {
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.panel,
          { backgroundColor: withAlpha(secondaryColor, 0.3) },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: primaryColor }]}>
          <MapPin size={20} color="#FFFFFF" strokeWidth={2.2} />
        </View>

        <View style={styles.copy}>
          <Text style={[styles.title, { color: primaryColor }]}>
            Find a Store Near You
          </Text>
          <Text style={styles.subtitle}>
            {storeCount
              ? `Visit any of our ${storeCount.toLocaleString("en-IN")} stores.`
              : "Visit us and see the pieces in person."}
          </Text>
        </View>

        <HapticButton
          style={[styles.action, { backgroundColor: primaryColor }]}
          activeOpacity={0.85}
          onPress={onLocate}
        >
          <Navigation size={14} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.actionLabel}>Locate</Text>
        </HapticButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  panel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 3,
    fontSize: 12,
    color: MICROSITE_MUTED,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
