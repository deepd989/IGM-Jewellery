import { HapticButton } from "@/components/basic components/hapticButton";
import { CartBadge } from "@/components/cart/CardBadge";
import { COLORS, LUXURY_COLORS } from "@/constants/theme";
import { luxuryPrice } from "@/helpers/luxuryPrice";
import { Product } from "@/interfaces/product.interface";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/apis/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LuxuryWishlistButton from "../../components/luxuryWishlistButton";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * How tall the gallery is allowed to get: enough to lead the screen, short
 * enough that the details sheet below it is visible without scrolling. A shot
 * shorter than this sizes the frame to itself instead — see galleryHeight.
 */
export const LUXURY_HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.66);

const THUMBNAIL_SIZE = 40;
/** Gap the meta card keeps from the artwork above and the title below it. */
const CARD_MARGIN = 10;
/** Thumbnails the meta card shows before it stops adding them. */
const MAX_THUMBNAILS = 4;
/** Stands in until the catalogue returns a review count. */
const FALLBACK_REVIEW_COUNT = 110;

/** Magnifier with a sparkle — the app's mark for AI-assisted search. */
const SearchGlyph = () => (
  <View>
    <Ionicons name="search" size={22} color={COLORS.primary} />
    <Ionicons
      name="sparkles"
      size={9}
      color={COLORS.primary}
      style={styles.searchSparkle}
    />
  </View>
);

type LuxuryProductHeroProps = {
  product: Product;
  /** Gallery images, already ordered by the screen (try-on shot included). */
  images: string[];
};

/**
 * The luxury product screen's opening frame: a full-bleed gallery with the
 * navigation and a frosted meta card floating over the artwork.
 */
export default function LuxuryProductHero({
  product,
  images,
}: LuxuryProductHeroProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<string>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  /**
   * The frame is sized to the artwork rather than the other way round, so a
   * contained shot leaves no band under it and everything anchored to the
   * frame's floor — the dots — sits against the image itself.
   *
   * Taken from the leading shot alone: the gallery pages horizontally, so its
   * height has to hold while the shopper swipes. A sibling with a different
   * ratio letterboxes within the frame the first one set.
   */
  const [galleryHeight, setGalleryHeight] = useState(LUXURY_HERO_HEIGHT);

  const { data: wishlistData } = useGetWishlistQuery();
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] =
    useRemoveFromWishlistMutation();

  const isInWishlist = wishlistData?.items.some(
    (item) => item.product.id === product.id
  );
  const isWishlistBusy = isAddingToWishlist || isRemovingFromWishlist;

  const reviewCount = product.reviews?.length || FALLBACK_REVIEW_COUNT;
  const thumbnails = images.slice(0, MAX_THUMBNAILS);
  const leadImage = images[0];

  useEffect(() => {
    if (!leadImage) return;

    // The shot can land after the screen has moved on; ignore it if it does.
    let isCurrent = true;

    Image.getSize(
      leadImage,
      (width, height) => {
        if (!isCurrent || !width || !height) return;
        setGalleryHeight(
          Math.min(
            Math.round((SCREEN_WIDTH * height) / width),
            LUXURY_HERO_HEIGHT
          )
        );
      },
      // Nothing to measure — the full frame stands, and the shot letterboxes
      // inside it as it did before.
      () => {}
    );

    return () => {
      isCurrent = false;
    };
  }, [leadImage]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < images.length) {
      setActiveIndex(index);
    }
  };

  const handleSelectThumbnail = (index: number) => {
    setActiveIndex(index);
    listRef.current?.scrollToOffset({
      offset: index * SCREEN_WIDTH,
      animated: true,
    });
  };

  const handleToggleWishlist = async () => {
    // Guards re-entrancy here rather than disabling the button: a mutation that
    // never settles would otherwise leave the heart permanently dead.
    if (isWishlistBusy) return;

    if (isInWishlist) {
      try {
        await removeFromWishlist(product.id).unwrap();
      } catch {
        Alert.alert("Error", "Failed to remove from wishlist");
      }
      return;
    }

    try {
      await addToWishlist(product).unwrap();
    } catch (error: any) {
      if (error?.data === "Item already in wishlist") {
        Alert.alert("Already in Wishlist", "This item is already wishlisted.");
      } else {
        Alert.alert("Error", "Failed to add to wishlist");
      }
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: product.title,
        message: `${product.name || product.title} by ${
          product.brand
        } — ₹${luxuryPrice(product)?.toLocaleString()}`,
      });
    } catch {
      // The sheet was dismissed; there is nothing to recover from.
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.gallery, { height: galleryHeight }]}>
        <FlatList
          ref={listRef}
          data={images}
          keyExtractor={(uri, index) => `${uri}-${index}`}
          renderItem={({ item }) => (
            // "contain", not the default "cover": covering a frame the shot
            // does not fill scales it up and crops the piece. The leading shot
            // fills this frame exactly; the ground shows through wherever a
            // sibling of another ratio falls short.
            <Image
              source={{ uri: item }}
              style={[styles.image, { height: galleryHeight }]}
              resizeMode="contain"
            />
          )}
          extraData={galleryHeight}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />

        {/* Keeps the white action pill and the status bar legible over pale shots */}
        <LinearGradient
          colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0)"]}
          style={styles.topScrim}
          pointerEvents="none"
        />

        <View style={[styles.header, { top: insets.top + 8 }]}>
          <HapticButton style={styles.backButton} onPress={() => router.back()}>
            <BlurView
              intensity={30}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </HapticButton>

          <View style={styles.actionPill}>
            <HapticButton
              style={styles.actionIcon}
              onPress={() => router.navigate("/searchPage")}
            >
              <SearchGlyph />
            </HapticButton>

            <LuxuryWishlistButton size={24} style={styles.actionIcon} />

            <View style={styles.actionIcon}>
              <CartBadge iconSize={24} iconColor={COLORS.primary} />
            </View>
          </View>
        </View>

        {images.length > 1 && (
          <View style={styles.pagination} pointerEvents="none">
            {images.map((uri, index) => (
              <View
                key={`${uri}-${index}`}
                style={[
                  styles.dot,
                  index === activeIndex ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.metaCard}>
        {/* Both backdrops stay out of the way of the buttons above them. */}
        <BlurView
          intensity={26}
          tint="dark"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.metaFill} pointerEvents="none" />

        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>
            {(product.rating || 5).toFixed(1)}
          </Text>
          <Ionicons name="star" size={13} color="#FFFFFF" />
          <Text style={styles.ratingCount}>(+{reviewCount})</Text>
        </View>

        <View style={styles.metaBottomRow}>
          <View style={styles.thumbnails}>
            {thumbnails.map((uri, index) => (
              <HapticButton
                key={`${uri}-${index}`}
                style={[
                  styles.thumbnail,
                  index === activeIndex && styles.thumbnailActive,
                ]}
                onPress={() => handleSelectThumbnail(index)}
              >
                <Image
                  source={{ uri }}
                  style={styles.thumbnailImage}
                  resizeMode="contain"
                />
              </HapticButton>
            ))}
          </View>

          <View style={styles.metaIcons}>
            <HapticButton
              style={styles.metaIcon}
              activeOpacity={0.6}
              onPress={handleShare}
            >
              <Ionicons name="share-social-outline" size={24} color="#FFFFFF" />
            </HapticButton>

            <HapticButton
              style={styles.metaIcon}
              activeOpacity={0.6}
              onPress={handleToggleWishlist}
            >
              {isWishlistBusy ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons
                  name={isInWishlist ? "heart" : "heart-outline"}
                  size={24}
                  color="#FFFFFF"
                />
              )}
            </HapticButton>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // The screen's own ground, so the bands the contained shot leaves above and
  // below it carry on from the page rather than reading as a frame around it.
  // Height is left to the content: the gallery is fixed, the meta card below it
  // is not.
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: LUXURY_COLORS.primary,
  },
  // Both are given their height at render: it is measured from the artwork, so
  // the frame ends where the image does. See galleryHeight.
  /** The artwork's own frame — everything floating over it anchors to this. */
  gallery: {
    width: SCREEN_WIDTH,
  },
  image: {
    width: SCREEN_WIDTH,
  },
  topScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  header: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(20, 26, 28, 0.45)",
  },
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#052A33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  // Fixed box so the count badge anchors inside it — a badge hanging outside
  // its parent's bounds is dropped on Android.
  actionIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  searchSparkle: {
    position: "absolute",
    top: -2,
    right: -4,
  },
  // Stays over the artwork: it reads the gallery, not the card below it.
  pagination: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 26,
    backgroundColor: "#FFFFFF",
  },
  inactiveDot: {
    width: 6,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  // In flow under the gallery rather than floating over it, with CARD_MARGIN
  // clear of the artwork above and of the product title below.
  metaCard: {
    marginHorizontal: 16,
    marginTop: CARD_MARGIN,
    marginBottom: CARD_MARGIN,
    borderRadius: 24,
    overflow: "hidden",
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  // Sits under the content so the white labels hold up over bright artwork.
  metaFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 32, 36, 0.35)",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  ratingCount: {
    fontSize: 17,
    color: "#FFFFFF",
    marginLeft: 2,
  },
  metaBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  // The strip is decorative, so it gives up width first. Without this the row
  // overflows the card on narrow screens and `overflow: hidden` clips the
  // trailing action buttons out of reach of any touch.
  thumbnails: {
    flexShrink: 1,
    flexDirection: "row",
    gap: 8,
    overflow: "hidden",
  },
  thumbnail: {
    flexShrink: 0,
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbnailActive: {
    borderColor: "#FFFFFF",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  // Never shrinks: these are the card's only controls.
  metaIcons: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Sized past the glyph so there is a real tap target around it.
  metaIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
});
