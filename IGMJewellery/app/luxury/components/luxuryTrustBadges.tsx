import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

/** Matches the section's own horizontal inset — see luxuryBestSellers. */
const SIDE_PADDING = 16;

export type TrustBadge = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export const TRUST_BADGES: TrustBadge[] = [
  { label: "100% Trusted", icon: "shield" },
  { label: "100% Curated", icon: "star" },
  { label: "100% Certified", icon: "checkbox" },
];

type LuxuryTrustBadgesProps = {
  badges?: TrustBadge[];
  style?: ViewStyle;
};

/**
 * The storefront's three assurances, as a row of glass chips.
 *
 * Held apart from the footer it used to sit inside so it can be placed above
 * that section's backdrop rather than over it: on the page's own ground the
 * chips have nothing competing with them, and the footer is left to close the
 * page on its artwork and the mark alone.
 */
export default function LuxuryTrustBadges({
  badges = TRUST_BADGES,
  style,
}: LuxuryTrustBadgesProps) {
  return (
    <View style={[styles.row, style]}>
      {badges.map((badge, index) => (
        <View key={`${badge.label}-${index}`} style={styles.badgeWrapper}>
          <BlurView intensity={25} tint="light" style={styles.badge}>
            <View style={styles.badgeIcon}>
              <Ionicons name={badge.icon} size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.badgeLabel} numberOfLines={1}>
              {badge.label}
            </Text>
          </BlurView>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    // Deliberately no width: stretching to the parent lets a caller widen the
    // section with negative margins. A fixed 100% would only shift it.
    alignSelf: "stretch",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: SIDE_PADDING,
  },
  // The radius and the clip live out here: a BlurView does not round its own
  // blur.
  badgeWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  badge: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  badgeIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  badgeLabel: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
