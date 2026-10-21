import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_SPACING } from "@/constants/theme";
import { luxuryPrice } from "@/helpers/luxuryPrice";
import { Product } from "@/interfaces/product.interface";
import { useGetProductsQuery } from "@/store/apis/product";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

/** Phone width ÷ height, so the mock keeps a device's proportions. */
const PHONE_ASPECT_RATIO = 0.5;
/** Share of the section's width the phone takes. */
const PHONE_WIDTH_RATIO = 0.72;

/** The filters the real Swipe & Shop screen opens with. */
const CHIPS = ["Latest", "Rings", "Necklace", "Men's gifting", "Earrings"];

const GOLD = "#B5A268";

type LuxurySwipeAndShopProps = {
  title?: string;
  ctaLabel?: string;
  /** The piece shown on the mock screen; defaults to the catalogue's first. */
  product?: Product;
  /** Blurred backdrop; defaults to the product's own artwork. */
  imageUri?: string;
  /** Overrides navigation to the Swipe & Shop screen. */
  onPress?: () => void;
  style?: ViewStyle;
};

/**
 * A phone holding the Swipe & Shop screen, as a way into it. Everything inside
 * the frame is a picture of the feature rather than a working copy of it, so
 * the whole mock is one tap target.
 */
export default function LuxurySwipeAndShop({
  title = "Try Swipe & Shop",
  ctaLabel = "Try Now",
  product,
  imageUri,
  onPress,
  style,
}: LuxurySwipeAndShopProps) {
  const router = useRouter();
  const { data: products = [] } = useGetProductsQuery({});

  const featured = product ?? products[0];
  const artwork = imageUri ?? featured?.thumbnailUrls?.[0];
  const featuredPrice = featured ? luxuryPrice(featured) : undefined;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.navigate("/immersiveProductList");
  };

  return (
    <View style={[styles.container, style]}>
      {!!artwork && (
        <Image
          source={{ uri: artwork }}
          style={styles.backdrop}
          resizeMode="cover"
          blurRadius={20}
        />
      )}
      <View style={styles.backdropScrim} pointerEvents="none" />

      <Text style={styles.title}>{title}</Text>

      <HapticButton
        style={styles.phoneWrapper}
        activeOpacity={0.95}
        onPress={handlePress}
      >
        <View style={styles.phone}>
          <View style={styles.screen}>
            {!!artwork && (
              <Image
                source={{ uri: artwork }}
                style={styles.screenImage}
                resizeMode="cover"
              />
            )}

            {/* A picture of the feature, not a working copy of it. */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <LinearGradient
                colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0)"]}
                style={styles.topScrim}
              />
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.9)"]}
                style={styles.bottomScrim}
              />

              <View style={styles.screenHeader}>
                <View style={styles.closeButton}>
                  <Ionicons name="close" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.screenTitle}>Swipe & Shop</Text>
                <View style={styles.closeButton} />
              </View>

              <View style={styles.chipRow}>
                {CHIPS.map((chip) => (
                  <View key={chip} style={styles.chip}>
                    <Text style={styles.chipText} numberOfLines={1}>
                      {chip}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Swipe hints: up and down through the catalogue… */}
              <View style={styles.arrows}>
                <Ionicons name="arrow-up" size={30} color="#FFFFFF" />
                <Ionicons name="arrow-down" size={30} color="#FFFFFF" />
              </View>

              {/* …and sideways for the next look. */}
              <View style={styles.swipeGlyph}>
                <Ionicons name="hand-left" size={20} color="#FFFFFF" />
              </View>

              <View style={styles.info}>
                <View style={styles.infoTopRow}>
                  <View style={styles.dots}>
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                  <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {featured?.name || featured?.title || "24K Diamond Ring"}
                    </Text>
                    <Text style={styles.brandName} numberOfLines={1}>
                      {featured?.brand || "Kalyan Jewellers"}
                    </Text>
                    <View style={styles.ratingRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name="star"
                          size={9}
                          color={star <= 4 ? "#FFFFFF" : "rgba(255,255,255,0.4)"}
                        />
                      ))}
                      <Text style={styles.ratingCount}>(1k+)</Text>
                    </View>
                  </View>

                  <View style={styles.infoRight}>
                    {/* LUXE lists at full price — no struck price beside it. */}
                    <Text style={styles.price}>
                      ₹{featuredPrice?.toLocaleString() || "20,000"}
                    </Text>
                    <Text style={styles.viewProduct}>View Product</Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <View style={[styles.actionButton, styles.tryNowButton]}>
                    <Ionicons name="sparkles" size={11} color="#FFFFFF" />
                    <Text style={styles.tryNowText}>Try Now</Text>
                  </View>
                  <View style={[styles.actionButton, styles.addToBagButton]}>
                    <Text style={styles.addToBagText}>Add to Bag</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </HapticButton>

      <HapticButton
        style={styles.ctaWrapper}
        activeOpacity={0.85}
        onPress={handlePress}
      >
        <BlurView intensity={26} tint="light" style={styles.cta}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </BlurView>
      </HapticButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    alignItems: "center",
    paddingVertical: LUXURY_SPACING / 2,
    backgroundColor: "#3A2A1E",
  },
  backdrop: StyleSheet.absoluteFillObject,
  backdropScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(40, 26, 16, 0.35)",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: LUXURY_SPACING / 2,
  },

  // ── Device ──
  phoneWrapper: {
    width: `${PHONE_WIDTH_RATIO * 100}%`,
  },
  phone: {
    width: "100%",
    aspectRatio: PHONE_ASPECT_RATIO,
    borderRadius: 30,
    padding: 5,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  screen: {
    flex: 1,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#0A0A0A",
    borderWidth: 1.5,
    borderColor: "#2F6BD8",
  },
  screenImage: StyleSheet.absoluteFillObject,
  topScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "22%",
  },
  bottomScrim: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "42%",
  },

  // ── Mock chrome ──
  screenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  screenTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  chipRow: {
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    // The row runs past the frame just as the real one scrolls off screen.
    overflow: "hidden",
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  chipText: {
    fontSize: 9,
    color: "#1A1A1A",
  },
  arrows: {
    position: "absolute",
    left: 14,
    top: "32%",
    alignItems: "center",
    gap: 60,
  },
  swipeGlyph: {
    position: "absolute",
    right: 10,
    top: "45%",
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },

  // ── Mock product bar ──
  info: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  infoTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 5,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dotActive: {
    width: 16,
    backgroundColor: "#FFFFFF",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  infoLeft: {
    flexShrink: 1,
  },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  brandName: {
    marginTop: 2,
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    marginTop: 4,
  },
  ratingCount: {
    marginLeft: 4,
    fontSize: 9,
    color: "rgba(255,255,255,0.8)",
  },
  infoRight: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  viewProduct: {
    marginTop: 4,
    fontSize: 10,
    color: "#FFFFFF",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 28,
    borderRadius: 7,
  },
  tryNowButton: {
    backgroundColor: GOLD,
  },
  tryNowText: {
    fontSize: 11,
    color: "#FFFFFF",
  },
  addToBagButton: {
    backgroundColor: "#FFFFFF",
  },
  addToBagText: {
    fontSize: 11,
    color: "#1A1A1A",
  },

  // ── Section CTA ──
  ctaWrapper: {
    width: `${PHONE_WIDTH_RATIO * 100}%`,
    marginTop: LUXURY_SPACING / 2,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    // Opaque enough to keep the white label readable over the artwork.
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  ctaText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
});
