import { LUXURY_SPACING } from "@/constants/theme";
import {
  Image,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import LuxuryGlassCard from "./luxuryGlassCard";

/** Runs the artwork full-bleed, tall enough to read as a break in the page. */
const BANNER_HEIGHT = 240;

type LuxurySizeGuideBannerProps = {
  /** Defaults to the product's own artwork. */
  imageUri?: string;
  title?: string;
  ctaLabel?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The size-guide prompt: a frosted card floating over the product artwork,
 * between the details sheet and the delivery section.
 */
export default function LuxurySizeGuideBanner({
  imageUri,
  title = "Can't Find Your Perfect Size?",
  ctaLabel = "View Size Guide",
  onPress,
  style,
}: LuxurySizeGuideBannerProps) {
  return (
    <View style={[styles.container, style]}>
      {!!imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      {/* Holds the artwork back so the white type stays readable. */}
      <View style={styles.scrim} pointerEvents="none" />

      <LuxuryGlassCard
        title={title}
        ctaLabel={ctaLabel}
        onPress={onPress}
        style={styles.card}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    height: BANNER_HEIGHT,
    backgroundColor: "#0A1A1F",
  },
  image: StyleSheet.absoluteFillObject,
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 26, 31, 0.25)",
  },
  card: {
    position: "absolute",
    top: LUXURY_SPACING / 4,
    left: 16,
    right: 16,
  },
});
