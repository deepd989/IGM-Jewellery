import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_SPACING } from "@/constants/theme";
import { BlurView } from "expo-blur";
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type LuxuryGlassCardProps = {
  title: string;
  ctaLabel: string;
  onPress?: () => void;
  /** Positioning is the caller's business; this card only draws itself. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A frosted card with a headline and one white pill action — the product
 * screen's prompt surface, shared by the size-guide banner and the dialog so
 * the two can never drift apart.
 */
export default function LuxuryGlassCard({
  title,
  ctaLabel,
  onPress,
  style,
}: LuxuryGlassCardProps) {
  return (
    <View style={[styles.card, style]}>
      <BlurView
        intensity={24}
        tint="dark"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {/* Keeps the white type readable wherever the card is dropped. */}
      <View style={styles.fill} pointerEvents="none" />

      <Text style={styles.title}>{title}</Text>

      <HapticButton style={styles.cta} activeOpacity={0.85} onPress={onPress}>
        <Text style={styles.ctaText}>{ctaLabel}</Text>
      </HapticButton>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    paddingVertical: LUXURY_SPACING / 2,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 32, 36, 0.3)",
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  cta: {
    marginTop: LUXURY_SPACING / 3,
    height: 42,
    paddingHorizontal: 22,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
