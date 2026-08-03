import { LinearGradient } from "expo-linear-gradient";
import { Flower } from "lucide-react-native";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import {
  STOREFRONT,
  STOREFRONT_LABEL,
  type Storefront,
} from "../constants/storefront";
import { COLORS } from "../constants/theme";
import { HapticButton } from "./basic components/hapticButton";

// Re-exported so the existing imports of this type keep working; the
// definition itself now lives with the storefront constants.
export type { Storefront };

/** The track the unselected half sits on. */
const TRACK = "#E4F0EE";

type StoreToggleProps = {
  active: Storefront;
  onSelect: (store: Storefront) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The segmented switch between the two storefronts. The selected half carries
 * the filled pill, so only which side is lit changes between modes.
 */
export default function StoreToggle({
  active,
  onSelect,
  style,
}: StoreToggleProps) {
  const isLuxe = active === STOREFRONT.luxe;

  return (
    <View style={[styles.container, style]}>
      <HapticButton
        style={styles.segment}
        activeOpacity={0.85}
        onPress={() => onSelect(STOREFRONT.massy)}
      >
        {!isLuxe && (
          <LinearGradient
            colors={[COLORS.primary, "#1C6A63"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <Flower
          size={18}
          color={isLuxe ? COLORS.primary : "#FFFFFF"}
          strokeWidth={1.8}
        />
        <Text
          style={[
            styles.label,
            styles.massyLabel,
            { color: isLuxe ? COLORS.primary : "#FFFFFF" },
          ]}
        >
          {STOREFRONT_LABEL[STOREFRONT.massy]}
        </Text>
      </HapticButton>

      <HapticButton
        style={styles.segment}
        activeOpacity={0.85}
        onPress={() => onSelect(STOREFRONT.luxe)}
      >
        {isLuxe && <View style={[StyleSheet.absoluteFill, styles.luxeFill]} />}
        <Text
          style={[
            styles.label,
            styles.luxeLabel,
            { color: isLuxe ? "#FFFFFF" : COLORS.primary },
          ]}
        >
          {STOREFRONT_LABEL[STOREFRONT.luxe]}
        </Text>
      </HapticButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    padding: 4,
    borderRadius: 24,
    backgroundColor: TRACK,
  },
  segment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 19,
    overflow: "hidden",
  },
  luxeFill: {
    backgroundColor: COLORS.primary,
  },
  label: {
    fontSize: 16,
  },
  massyLabel: {
    fontWeight: "700",
  },
  luxeLabel: {
    letterSpacing: 1.5,
  },
});
