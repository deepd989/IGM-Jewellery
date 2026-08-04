import { assetUrl } from "@/constants/assets";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

/** Artwork is placeholder — point this at the final URL when it's hosted. */
const BACKDROP = assetUrl("luxury.elanziaAllRights.backdrop");

const LOGO_GLYPH = require("@/assets/images/elanziaNav.png");

/**
 * The logo file is a small mark centred on a large transparent canvas, so the
 * image has to be drawn far bigger than the mark should read and then clipped
 * back to the mark's own box. This is the mark's share of its canvas, measured
 * from the artwork.
 */
const GLYPH_FILL = 0.67;

/** How wide the mark itself reads, and the canvas that has to be drawn for it. */
const GLYPH_SIZE = 72;
const GLYPH_CANVAS = Math.round(GLYPH_SIZE / GLYPH_FILL);

type LuxuryElanziaAllRightsProps = {
  /** Falls back to the placeholder artwork above. */
  backdrop?: ImageSourcePropType;
  style?: ViewStyle;
};

/**
 * The page's closing panel: the mark alone on its artwork. The trust badges
 * that used to sit over this backdrop are their own section above it now — see
 * luxuryTrustBadges.
 */
export default function LuxuryElanziaAllRights({
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
      {/* Sinks the artwork so the white mark stays legible on it */}
      <View style={styles.scrim} pointerEvents="none" />

      <View style={styles.content}>
        {/* The mark is centred inside its own clip, so the content column's
            centring is what puts the clip on the middle of the page. */}
        <View style={styles.glyphClip}>
          <Image source={LOGO_GLYPH} style={styles.glyph} resizeMode="contain" />
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
    // A square panel. Taking the height from the width rather than a fixed
    // number keeps it square on any screen, and keeps it square whatever the
    // caller does to the width — the storefront hands this section the whole
    // device width, so the panel is one screen wide and just as tall.
    aspectRatio: 1,
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
    // The backdrop and scrim are absolute, so this is the only child in flow —
    // flexing it fills the square and lets the mark centre on both axes.
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
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
});
