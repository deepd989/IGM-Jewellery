import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { luxuryPrice } from "@/helpers/luxuryPrice";
import { Product } from "@/interfaces/product.interface";
import { useGetProductsQuery } from "@/store/apis/product";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * The clip that plays inside the mock, shot portrait to fill the screen.
 *
 * A bundled file rather than a manifest key: the hosted clip is encoded at
 * H.264 Level 6.0, past what iOS will decode, so it never played here.
 */
const SCREEN_VIDEO = require("../../../assets/GER-012023.mp4");

/** Phone width ÷ height, so the mock keeps a device's proportions. */
const PHONE_ASPECT_RATIO = 0.5;
/** Share of the section's width the phone takes. */
const PHONE_WIDTH_RATIO = 0.72;
/** The white rim around the mock's screen. */
const PHONE_BEZEL = 5;

/** The filters the real Swipe & Shop screen opens with. */
const CHIPS = ["Latest", "Rings", "Necklace", "Men's gifting", "Earrings"];

const GOLD = "#B5A268";

type LuxurySwipeAndShopProps = {
  title?: string;
  ctaLabel?: string;
  /** The piece shown on the mock screen; defaults to the catalogue's first. */
  product?: Product;
  /**
   * The clip playing inside the mock: a remote URL, or a require()d file from
   * assets/. Defaults to the section's own.
   */
  videoUri?: string | number;
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
  videoUri = SCREEN_VIDEO,
  onPress,
  style,
}: LuxurySwipeAndShopProps) {
  const router = useRouter();
  const { data: products = [] } = useGetProductsQuery({});
  // The clip keeps decoding while the shopper is off on another screen unless
  // the section stops it — the storefront's video rows want the decoders.
  const isFocused = useIsFocused();
  /** False until the clip has something to show; the screen spins until then. */
  const [isClipReady, setIsClipReady] = useState(false);
  // The section gives its player up when it loses focus, so on the way back
  // there is no picture again. Without this reset the mock would clear its
  // spinner on the old player's readiness and show black until the new one has
  // a frame.
  useEffect(() => {
    if (!isFocused) setIsClipReady(false);
  }, [isFocused]);
  // Measured so the mock can be given a size in points rather than in shares of
  // its parent. The player needs a frame it can measure against: a chain of
  // percentages, an aspect ratio and a flex resolves for every other view here,
  // but leaves the video laying out at nothing. Every video row that does
  // render on this storefront hands its player a parent sized this way.
  const [sectionWidth, setSectionWidth] = useState(SCREEN_WIDTH);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== sectionWidth) {
      setSectionWidth(width);
    }
  };

  /**
   * A require()d file arrives as a module id, not a URL, and the player takes
   * it as it is — wrapping that in { uri } leaves it nothing to resolve. Same
   * shape components/immersiveProductCard.tsx passes its bundled clips in.
   */
  const clipSource =
    typeof videoUri === "string" ? { uri: videoUri } : videoUri;

  const phoneWidth = Math.round(sectionWidth * PHONE_WIDTH_RATIO);
  const phoneHeight = Math.round(phoneWidth / PHONE_ASPECT_RATIO);
  const screenWidth = phoneWidth - PHONE_BEZEL * 2;
  const screenHeight = phoneHeight - PHONE_BEZEL * 2;

  const featured = product ?? products[0];
  const featuredPrice = featured ? luxuryPrice(featured) : undefined;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.navigate("/immersiveProductList");
  };

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>

      <HapticButton
        style={{ width: phoneWidth }}
        activeOpacity={0.95}
        onPress={handlePress}
      >
        <View style={[styles.phone, { width: phoneWidth, height: phoneHeight }]}>
          <View
            style={[
              styles.screen,
              { width: screenWidth, height: screenHeight },
            ]}
          >
            {/* The frame is portrait, so the clip fills it on its own crop.
                Mounted only while the section is focused: pausing an expo-av
                player does not release its decoder, and the device's few are
                shared with every other clip on the storefront and with the
                try-on camera. */}
            {isFocused && (
            <Video
              source={clipSource}
              style={styles.screenMedia}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted
              // Both, rather than the first frame alone: onReadyForDisplay is
              // the one that means "there is a picture", but it has not been
              // dependable on Android, and a spinner that never clears is worse
              // than one that clears a beat early.
              onReadyForDisplay={() => setIsClipReady(true)}
              onLoad={() => setIsClipReady(true)}
              onError={(error) =>
                console.warn("Swipe & Shop clip failed to load:", error)
              }
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

            {/* Last, so it reads over the mock's chrome rather than under it. */}
            {!isClipReady && (
              <View style={styles.screenLoader} pointerEvents="none">
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            )}
          </View>
        </View>
      </HapticButton>

      <HapticButton
        style={[styles.ctaWrapper, { width: phoneWidth }]}
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
  // The page's own ground: the section used to sink the product's artwork
  // behind the mock, and now carries none of its own.
  // No vertical padding: the section grounds on the page's own colour now, so
  // an inset of its own only stacks onto the band's gap. The storefront's
  // rhythm lives in app/luxury/index.tsx's sectionBand.
  container: {
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: LUXURY_COLORS.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: LUXURY_SPACING / 2,
  },

  // ── Device ──
  // Sized in points at render, from the measured section width.
  phone: {
    borderRadius: 30,
    padding: PHONE_BEZEL,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  screen: {
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#0A0A0A",
    borderWidth: 1.5,
    borderColor: "#2F6BD8",
  },
  // The insets alone leave the player without a box to measure against inside
  // the flexed screen, so it lays out at nothing. Same pairing the community
  // clips in luxurySeenOnYou.tsx are given.
  screenMedia: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  // Covers the screen's own black while the clip loads, so the spinner sits on
  // a ground of its own rather than over half-drawn chrome.
  screenLoader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0A0A",
  },
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
  // Width is given at render, so the button lines up with the mock above it.
  ctaWrapper: {
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
