import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Height of the glass pill, excluding the safe-area gap below it. */
export const LUXURY_ACTION_BAR_HEIGHT = 54;

type LuxuryStickyActionBarProps = {
  onTryNow?: () => void;
  onAddToBag?: () => void;
  isAddingToBag?: boolean;
  /** Swaps the label for a tick right after the item lands in the bag. */
  showSuccess?: boolean;
  /** Turns the bag action into the jump to the cart. */
  isInBag?: boolean;
};

/**
 * The glass pill pinned to the bottom of the product screen: try-on on the
 * left, the primary bag action on the right.
 */
export default function LuxuryStickyActionBar({
  onTryNow,
  onAddToBag,
  isAddingToBag = false,
  showSuccess = false,
  isInBag = false,
}: LuxuryStickyActionBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        // Sits above the home indicator without leaving a gap on devices
        // that have none.
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      <View style={styles.bar}>
        {/* Glossy stack: frosted base, silver body, then a top sheen */}
        <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={["rgba(255,255,255,0.97)", "rgba(226,235,239,0.9)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.sheen}
          pointerEvents="none"
        />

        <HapticButton style={styles.tryNow} onPress={onTryNow}>
          <Ionicons name="sparkles" size={16} color={COLORS.primary} />
          <Text style={styles.tryNowText}>TRY NOW</Text>
        </HapticButton>

        <HapticButton
          style={styles.addToBagWrapper}
          onPress={onAddToBag}
          disabled={isAddingToBag}
        >
          <LinearGradient
            colors={["#04333E", "#1C7A72"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.addToBag}
          >
            {isAddingToBag ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : showSuccess ? (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                <Text style={styles.addToBagText}>ADDED</Text>
              </>
            ) : isInBag ? (
              <>
                <Ionicons name="bag-handle" size={18} color="#FFFFFF" />
                <Text style={styles.addToBagText}>GO TO BAG</Text>
              </>
            ) : (
              <Text style={styles.addToBagText}>ADD TO BAG</Text>
            )}
          </LinearGradient>
        </HapticButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    height: LUXURY_ACTION_BAR_HEIGHT,
    paddingHorizontal: 8,
    borderRadius: LUXURY_ACTION_BAR_HEIGHT / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    // Lifts the pill off the sheet behind it
    shadowColor: "#052A33",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  sheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "55%",
  },
  tryNow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: "100%",
  },
  tryNowText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
    letterSpacing: 0.4,
  },
  addToBagWrapper: {
    flex: 1.15,
    borderRadius: 20,
    overflow: "hidden",
  },
  addToBag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 40,
  },
  addToBagText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },
});
