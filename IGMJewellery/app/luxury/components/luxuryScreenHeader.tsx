import { HapticButton } from "@/components/basic components/hapticButton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * The one set of vertical metrics every luxury screen header uses, so they all
 * stand the same height whatever they put inside.
 */
const CONTENT_HEIGHT = 44;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 12;

/** Height below the safe-area inset. Useful for laying out around the header. */
export const LUXURY_HEADER_HEIGHT =
  CONTENT_HEIGHT + PADDING_TOP + PADDING_BOTTOM;

type LuxuryScreenHeaderProps = {
  title: string;
  /** Adds the back chevron to the left of the title. */
  showBack?: boolean;
  /** Overrides the chevron's behaviour — a stepper steps back, say. */
  onBack?: () => void;
  /**
   * "solid" paints the teal band the categories screen uses; "glass" leaves it
   * transparent so the screen's own artwork shows through.
   */
  variant?: "solid" | "glass";
  /** Right-hand actions — icons, a pill, whatever the screen needs. */
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function LuxuryScreenHeader({
  title,
  showBack = false,
  onBack,
  variant = "solid",
  right,
  style,
}: LuxuryScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        variant === "solid" && styles.solid,
        { paddingTop: insets.top + PADDING_TOP },
        style,
      ]}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          {showBack && (
            <HapticButton
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={onBack ?? (() => router.back())}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </HapticButton>
          )}

          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {!!right && <View style={styles.right}>{right}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: PADDING_BOTTOM,
  },
  solid: {
    backgroundColor: "#123B47",
  },
  row: {
    height: CONTENT_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(20, 26, 28, 0.45)",
  },
  title: {
    flexShrink: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
});
