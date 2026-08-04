import { HapticButton } from "@/components/basic components/hapticButton";
import { assetUrl } from "@/constants/assets";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";

/**
 * Artwork for this section — placeholders until the real assets are hosted.
 * Point these at the final URLs and nothing else needs to change.
 */
const ASSETS = {
  /** Left tile: the campaign model wearing the jewellery. */
  modelPhoto: assetUrl("luxury.tryOn.modelPhoto"),
  /** Right tile: the same shot with the shopper's face. */
  userPhoto: assetUrl("luxury.tryOn.userPhoto"),
};

type LuxuryTryOnProps = {
  badgeLabel?: string;
  title?: string;
  /** The line under the title. Pass "" to run the title on its own. */
  subtitle?: string;
  modelLabel?: string;
  userLabel?: string;
  ctaLabel?: string;
  /** Passed through to the try-on screen so it can preload a product. */
  productId?: string;
  /** Overrides navigation to the try-on screen. */
  onPress?: () => void;
  style?: ViewStyle;
};

export default function LuxuryTryOn({
  badgeLabel = "Ai Try On",
  title = "Become the model of Elanzia",
  subtitle = "See everything on you",
  modelLabel = "Model",
  userLabel = "You",
  ctaLabel = "Try Now",
  productId,
  onPress,
  style,
}: LuxuryTryOnProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.navigate({
      pathname: "/tryOn",
      params: productId ? { productId } : {},
    });
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>

        <Text style={[styles.title, !subtitle && styles.titleAlone]}>
          {title}
        </Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        <View style={styles.comparison}>
          <View style={styles.photoTile}>
            <Image
              source={{ uri: ASSETS.modelPhoto }}
              style={styles.photo}
              resizeMode="cover"
            />
            <View style={styles.captionWrapper}>
              <BlurView intensity={35} tint="dark" style={styles.caption}>
                <Text style={styles.captionText}>{modelLabel}</Text>
              </BlurView>
            </View>
          </View>

          <View style={styles.photoTile}>
            <Image
              source={{ uri: ASSETS.userPhoto }}
              style={styles.photo}
              resizeMode="cover"
            />
            <View style={styles.captionWrapper}>
              <BlurView intensity={35} tint="light" style={styles.caption}>
                <Text style={[styles.captionText, styles.captionTextLight]}>
                  {userLabel}
                </Text>
              </BlurView>
            </View>
          </View>

          {/* Straddles the seam between the two tiles */}
          <View style={styles.swapBadgeRow} pointerEvents="none">
            <View style={styles.swapBadge}>
              <Ionicons name="sync" size={26} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <HapticButton
          style={styles.ctaWrapper}
          activeOpacity={0.85}
          onPress={handlePress}
        >
          <BlurView intensity={30} tint="light" style={styles.cta}>
            <Text style={styles.ctaText}>{ctaLabel}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </BlurView>
        </HapticButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Deliberately no width: stretching to the parent lets a caller widen the
    // section with negative margins. A fixed 100% would only shift it.
    alignSelf: "stretch",
    borderRadius: 24,
    overflow: "hidden",
    // The page's own ground: the section used to sink a photograph behind its
    // content, and now carries none of its own.
    backgroundColor: LUXURY_COLORS.primary,
  },
  content: {
    paddingVertical: LUXURY_SPACING,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    marginBottom: LUXURY_SPACING / 2,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
    textAlign: "center",
    // Tight to the subtitle, so the two read as one block. The subtitle then
    // carries the block's gap down to the tiles.
    marginBottom: 8,
  },
  /** Gives the title the block's trailing gap when it runs without a subtitle. */
  titleAlone: {
    marginBottom: LUXURY_SPACING,
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: LUXURY_SPACING,
  },
  comparison: {
    flexDirection: "row",
    alignSelf: "stretch",
    gap: 10,
  },
  photoTile: {
    flex: 1,
    aspectRatio: 0.48,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  captionWrapper: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 12,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  caption: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  captionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  captionTextLight: {
    color: "#10243A",
  },
  /** Spans both tiles so the badge lands on the seam between them. */
  swapBadgeRow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "13%",
    alignItems: "center",
  },
  swapBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  ctaWrapper: {
    alignSelf: "stretch",
    marginTop: LUXURY_SPACING,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 56,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
