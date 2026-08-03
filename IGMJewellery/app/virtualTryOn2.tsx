import {
  COLORS,
  LUXURY_COLORS,
  LUXURY_SECTION_BACKGROUNDS,
  SPACING,
} from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../components/basic components/hapticButton";
import { useLuxury } from "../context/luxuryContext";

/**
 * The two storefronts ground differently, so the notice is dressed to match
 * whichever one the shopper arrived from — this route is reached from product
 * cards on both, and picking one palette would jar against the other.
 */
const PALETTES = {
  luxury: {
    background: LUXURY_SECTION_BACKGROUNDS.green,
    text: LUXURY_COLORS.text,
    textMuted: LUXURY_COLORS.textMuted,
    accent: LUXURY_COLORS.accent,
    badge: ["#0F5566", "#1C7A72"] as const,
    badgeIcon: LUXURY_COLORS.accent,
    chipBorder: "rgba(255,255,255,0.22)",
    actionBackground: LUXURY_COLORS.accent,
    actionText: COLORS.primary,
  },
  classic: {
    background: COLORS.background,
    text: COLORS.text,
    textMuted: COLORS.textSecondary,
    accent: COLORS.primary,
    badge: ["#053844", "#0C4552"] as const,
    // The badge is dark in both modes, so the classic accent would sink into it.
    badgeIcon: "#FFFFFF",
    chipBorder: COLORS.border,
    actionBackground: COLORS.primary,
    actionText: "#FFFFFF",
  },
};

/** What the feature will do, kept to the promises the try-on actually makes. */
const HIGHLIGHTS = ["Face Scan AI", "Real-Time Fit", "True to Scale"];

/**
 * Stands in for the VR try-on that used to load in a WebView here. The feature
 * is not ready, so rather than open a page that cannot deliver, the route says
 * so plainly and hands the shopper back to what they were looking at.
 */
export default function VirtualTryOn() {
  const router = useRouter();
  const { productTitle } = useLocalSearchParams<{ productTitle?: string }>();
  const { isLuxury } = useLuxury();

  const palette = isLuxury ? PALETTES.luxury : PALETTES.classic;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <StatusBar style={isLuxury ? "light" : "dark"} />

      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={palette.text} />
        </HapticButton>
      </View>

      <View style={styles.content}>
        <LinearGradient
          colors={palette.badge}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.badge}
        >
          <Ionicons name="glasses-outline" size={40} color={palette.badgeIcon} />
        </LinearGradient>

        <Text style={[styles.eyebrow, { color: palette.accent }]}>
          VIRTUAL TRY-ON
        </Text>
        <Text style={[styles.title, { color: palette.text }]}>Coming Soon</Text>

        <Text style={[styles.body, { color: palette.textMuted }]}>
          {/* Named when we know it, so the notice answers the tap that got
              here rather than talking about the feature in the abstract. */}
          {productTitle
            ? `We're putting the finishing touches on trying ${productTitle} on for size.`
            : "We're putting the finishing touches on our virtual try-on."}
          {" "}
          You'll be able to see any piece on yourself, live, before you decide.
        </Text>

        <View style={styles.highlights}>
          {HIGHLIGHTS.map((highlight) => (
            <View
              key={highlight}
              style={[styles.highlight, { borderColor: palette.chipBorder }]}
            >
              <Text style={[styles.highlightLabel, { color: palette.textMuted }]}>
                {highlight}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <HapticButton
          style={[styles.action, { backgroundColor: palette.actionBackground }]}
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Text style={[styles.actionLabel, { color: palette.actionText }]}>
            Back to the piece
          </Text>
        </HapticButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.s,
  },
  backButton: {
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.l,
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    marginTop: SPACING.l,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2.5,
  },
  title: {
    marginTop: SPACING.s,
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
  },
  body: {
    marginTop: SPACING.m,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  highlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: SPACING.s,
    marginTop: SPACING.xl,
  },
  highlight: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.l,
  },
  action: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
});
