import { assetUrl } from "@/constants/assets";
import { LUXURY_SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

/** Artwork is placeholder — point this at the final URL when it's hosted. */
const BACKDROP = assetUrl("luxury.elanziaAllRights.backdrop");

const LOGO_GLYPH = require("@/assets/images/elanziaNav.png");
const LOGO_WORDMARK = require("@/assets/images/elanziaSCroppedPng.png");

/**
 * Both logo files are a small mark centred on a large transparent canvas, so
 * the image has to be drawn far bigger than the mark should read and then
 * clipped back to the mark's own box. These are the mark's share of its canvas,
 * measured from the artwork.
 */
const GLYPH_FILL = 0.67;
const WORDMARK_FILL = { width: 0.6, height: 0.7 };

/** How wide the mark itself reads, and the canvas that has to be drawn for it. */
const GLYPH_SIZE = 72;
const GLYPH_CANVAS = Math.round(GLYPH_SIZE / GLYPH_FILL);
const WORDMARK_WIDTH = 200;
const WORDMARK_CANVAS = Math.round(WORDMARK_WIDTH / WORDMARK_FILL.width);
const WORDMARK_HEIGHT = Math.round(WORDMARK_CANVAS * WORDMARK_FILL.height);

export type TrustBadge = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const TRUST_BADGES: TrustBadge[] = [
  { label: "100% Trusted", icon: "shield" },
  { label: "100% Curated", icon: "star" },
  { label: "100% Certified", icon: "checkbox" },
];

type LuxuryElanziaAllRightsProps = {
  badges?: TrustBadge[];
  /** Falls back to the placeholder artwork above. */
  backdrop?: ImageSourcePropType;
  style?: ViewStyle;
};

export default function LuxuryElanziaAllRights({
  badges = TRUST_BADGES,
  backdrop,
  style,
}: LuxuryElanziaAllRightsProps) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={backdrop ?? { uri: BACKDROP }}
        style={styles.backdrop}
        resizeMode="cover"
      />
      {/* Sinks the artwork so the white badges and logo stay legible on it */}
      <View style={styles.scrim} pointerEvents="none" />

      <View style={styles.content}>
        <View style={styles.badgeRow}>
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

        {/* Both marks are centred in their own clip, so the row's own
            centring is what puts them on one line — nothing else may sit in
            here, or it lifts the wordmark off the glyph again. */}
        <View style={styles.logoRow}>
          <View style={styles.glyphClip}>
            <Image
              source={LOGO_GLYPH}
              style={styles.glyph}
              resizeMode="contain"
            />
          </View>

          <View style={styles.wordmarkClip}>
            <Image
              source={LOGO_WORDMARK}
              style={styles.wordmark}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Deliberately no width: stretching to the parent lets a caller widen the
    // section with negative margins. A fixed 100% would only shift it.
    alignSelf: "stretch",
    overflow: "hidden",
    backgroundColor: "#0A0A0A",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 8, 10, 0.32)",
  },
  content: {
    paddingTop: LUXURY_SPACING,
    // The closing section of the page: the artwork carries on well below the
    // logo rather than ending on it.
    paddingBottom: LUXURY_SPACING * 2,
    paddingHorizontal: 16,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
  },
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
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: LUXURY_SPACING * 1.5,
  },
  glyphClip: {
    width: GLYPH_SIZE,
    height: GLYPH_SIZE,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  glyph: {
    width: GLYPH_CANVAS,
    height: GLYPH_CANVAS,
  },
  wordmarkClip: {
    width: WORDMARK_WIDTH,
    height: WORDMARK_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  wordmark: {
    width: WORDMARK_CANVAS-130,
    height: WORDMARK_CANVAS-110,
    // The mark ships black; the footer needs it white.
    tintColor: "#FFFFFF",
  },
});
