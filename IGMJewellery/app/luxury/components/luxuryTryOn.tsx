import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";

/**
 * Artwork for this section — placeholders until the real assets are hosted.
 * Point these at the final URLs and nothing else needs to change.
 */
const ASSETS = {
  /** Dark backdrop the whole card sits on. */
  background:
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
  /** Left tile: the campaign model wearing the jewellery. */
  modelPhoto:
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop",
  /** Right tile: the same shot with the shopper's face. */
  userPhoto:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
};

type LuxuryTryOnProps = {
  badgeLabel?: string;
  title?: string;
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
  badgeLabel = "Elanzia Ai",
  title = "Replace Model's face\nwith yours using Ai",
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
      <Image
        source={{ uri: ASSETS.background }}
        style={styles.background}
        resizeMode="cover"
      />
      <View style={styles.backgroundScrim} pointerEvents="none" />

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>

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
    backgroundColor: "#0B1A2E",
  },
  // No width/height here: the absolute insets already stretch the artwork to
  // the container's box, and a percentage size would fight them.
  background: StyleSheet.absoluteFillObject,
  /** Holds the artwork back so the white type stays readable. */
  backgroundScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 18, 38, 0.35)",
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
