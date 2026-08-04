import { HapticButton } from "@/components/basic components/hapticButton";
import { AssetKey, assetUrl } from "@/constants/assets";
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
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import LuxuryMediaLoader from "./luxuryMediaLoader";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GAP = 12;
/**
 * One card plus a slice of the next, so the row reads as scrollable. Held
 * tighter than a row of square artwork would be: the clips are portrait, so a
 * card this wide is already a tall section.
 */
const CARDS_PER_VIEW = 1.25;
/**
 * Card width ÷ height. The clips are shot 9:16, but a card that tall runs to
 * over half the screen, so the frame is held shorter than the footage and
 * ResizeMode.COVER crops the clip's top and bottom into it.
 */
const CARD_ASPECT_RATIO = 3 / 4;
const SIDE_PADDING = 16;
const CARD_RADIUS = 16;

/**
 * How far from the card in view a clip is given a player at all. Every player
 * costs a video decoder, and the device has few — the storefront's other rows
 * want them too. Cards outside this window paint their poster and hold none.
 *
 * One wider than PLAYBACK_WINDOW, so the card a swipe is heading for has
 * buffered and arrives on a frame rather than on its poster.
 */
const PLAYER_WINDOW = 2;
/**
 * How far from the card in view a clip actually runs. The row shows a card and
 * a slice of the next, so both of those play; everything else stays paused.
 */
const PLAYBACK_WINDOW = 1;

type ReelEntry = {
  /** The manifest key the clip is served under, resolved to a backend URL. */
  videoKey: AssetKey;
  /**
   * The piece being worn. Matched against the catalogue by product id, or by
   * SKU for the entries still written that way — the two identify the same
   * piece, so either may be used here.
   */
  productId: string;
};

/**
 * The reel this section plays, in order.
 *
 * Each entry pairs a clip with the piece it shows. The product id is what the
 * card resolves against the catalogue — it supplies the price, the name and
 * the brand under the clip, and it is the product page a tap on the card
 * opens.
 *
 * A product the catalogue does not carry drops out of the reel rather than
 * rendering a clip that goes nowhere.
 */
const BEST_SELLER_REEL: ReelEntry[] = [
  { videoKey: "luxury.bestSellers.video1", productId: "25" },
  { videoKey: "luxury.bestSellers.video2", productId: "26" },
  { videoKey: "luxury.bestSellers.video3", productId: "144" },
  { videoKey: "luxury.bestSellers.video4", productId: "61" },
  { videoKey: "luxury.bestSellers.video5", productId: "120" },
  { videoKey: "luxury.bestSellers.video6", productId: "42" },
  { videoKey: "luxury.bestSellers.video7", productId: "34" },
  { videoKey: "luxury.bestSellers.video8", productId: "58" },
];

type ReelSlide = ReelEntry & {
  /** The clip's URL, resolved through the asset manifest. */
  video: string;
  /** Shown until the clip has a frame, and for cards holding no player. */
  poster?: string;
  product: Product;
};

type ReelCardProps = {
  slide: ReelSlide;
  width: number;
  height: number;
  /** Whether this card holds a player at all, or paints its poster instead. */
  hasPlayer: boolean;
  /** Of the cards holding a player, whether this one is running. */
  isPlaying: boolean;
  onPress: (product: Product) => void;
  onPressTryOn: (product: Product) => void;
};

/**
 * One clip in the reel, with the piece it shows set underneath.
 *
 * Memoised because every card's playback is derived from the row's active
 * index: without this, one swipe re-renders every card in the row, when only
 * the two either side of the move actually changed.
 */
const ReelCard = memo(function ReelCard({
  slide,
  width,
  height,
  hasPlayer,
  isPlaying,
  onPress,
  onPressTryOn,
}: ReelCardProps) {
  const { product } = slide;
  /** False until the card has a picture — a clip frame, or its poster still. */
  const [isReady, setIsReady] = useState(false);

  return (
    <HapticButton
      style={{ width }}
      activeOpacity={0.9}
      onPress={() => onPress(product)}
    >
      <View style={[styles.mediaWrapper, { height }]}>
        {/* Under the media, not over it: whichever picture arrives first — the
            poster still or the clip's own frame — covers the loader. A card
            that has a still to show is never made to spin over it. */}
        {!isReady && <LuxuryMediaLoader style={styles.media} spinnerSize="small" />}

        {/* Exactly one of these paints the card, so a poster is never left
            showing under a loaded clip. */}
        {hasPlayer ? (
          <Video
            source={{ uri: slide.video }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            shouldPlay={isPlaying}
            isLooping
            isMuted
            // Holds the still until the clip has a frame, so a card scrolled
            // onto mid-load never flashes black.
            usePoster={!!slide.poster}
            posterSource={slide.poster ? { uri: slide.poster } : undefined}
            posterStyle={styles.poster}
            // Both, rather than the first frame alone: onReadyForDisplay is the
            // one that means "there is a picture", but it has not been
            // dependable on Android, and a loader that never clears is worse
            // than one that clears a beat early.
            onReadyForDisplay={() => setIsReady(true)}
            onLoad={() => setIsReady(true)}
          />
        ) : (
          <Image
            source={{ uri: slide.poster }}
            style={styles.media}
            resizeMode="cover"
            // Clears on failure too: a still that will not load leaves the card
            // on its own ground rather than spinning at the shopper forever.
            onLoadEnd={() => setIsReady(true)}
          />
        )}

        <HapticButton
          style={styles.tryOnWrapper}
          activeOpacity={0.85}
          onPress={(event) => {
            event?.stopPropagation?.();
            onPressTryOn(product);
          }}
        >
          <BlurView intensity={75} tint="dark" style={styles.tryOn}>
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
            <Text style={styles.tryOnText}>Try Now</Text>
          </BlurView>
        </HapticButton>
      </View>

      {/* LUXE lists at full price, so there is no struck price beside it. */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>
          ₹{luxuryPrice(product)?.toLocaleString()}
        </Text>
      </View>

      <Text style={styles.productName} numberOfLines={1}>
        {product.name || product.title}
      </Text>
      <Text style={styles.brandName} numberOfLines={1}>
        {product.brand}
      </Text>
    </HapticButton>
  );
});

type LuxuryBestSellersProps = {
  title?: string;
  /** The catalogue the reel's SKUs are resolved against. */
  products?: Product[];
  /** Overrides navigation to the product screen. */
  onPressProduct?: (product: Product) => void;
  /** Overrides navigation to the try-on screen. */
  onPressTryOn?: (product: Product) => void;
  /** Overrides navigation to the full product list. */
  onViewAll?: () => void;
  style?: ViewStyle;
};

export default function LuxuryBestSellers({
  title = "Our Best Sellers",
  products,
  onPressProduct,
  onPressTryOn,
  onViewAll,
  style,
}: LuxuryBestSellersProps) {
  const router = useRouter();
  const { data: fetchedProducts = [] } = useGetProductsQuery({});
  const [activeIndex, setActiveIndex] = useState(0);
  // Clips keep decoding while the shopper is off on another screen unless the
  // row stops them — the storefront's other video rows want the decoders.
  const isFocused = useIsFocused();
  // Measured so the cards fit the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [rowWidth, setRowWidth] = useState(SCREEN_WIDTH - SIDE_PADDING * 2);

  const catalogue = products ?? fetchedProducts;

  // The reel is a fixed list, so this only runs again when the catalogue does.
  const slides = useMemo<ReelSlide[]>(() => {
    // Keyed by both, so a reel entry may name either without a code change.
    const byId = new Map<string, Product>();
    for (const product of catalogue) {
      if (product.id) byId.set(product.id, product);
      if (product.sku) byId.set(product.sku, product);
    }

    return BEST_SELLER_REEL.flatMap((entry) => {
      const product = byId.get(entry.productId);
      if (!product) return [];
      return [
        {
          ...entry,
          video: assetUrl(entry.videoKey),
          poster: product.immersiveThumbnailUrl || product.thumbnailUrls?.[0],
          product,
        },
      ];
    });
  }, [catalogue]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== rowWidth) {
      setRowWidth(width);
    }
  };

  const cardWidth = Math.round(
    (rowWidth - GAP * (CARDS_PER_VIEW - 1)) / CARDS_PER_VIEW
  );
  const cardHeight = Math.round(cardWidth / CARD_ASPECT_RATIO);
  const snapInterval = cardWidth + GAP;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
    if (index !== activeIndex && index >= 0 && index < slides.length) {
      setActiveIndex(index);
    }
  };

  // Stable so the memoised cards are not re-rendered by a new handler alone.
  const handlePressProduct = useCallback(
    (product: Product) => {
      if (onPressProduct) {
        onPressProduct(product);
        return;
      }
      router.navigate({
        pathname: "/luxury/product/[id]",
        params: { id: product.id },
      });
    },
    [onPressProduct, router]
  );

  const handlePressTryOn = useCallback(
    (product: Product) => {
      if (onPressTryOn) {
        onPressTryOn(product);
        return;
      }
      router.navigate({
        pathname: "/tryOn",
        params: { productId: product.id },
      });
    },
    [onPressTryOn, router]
  );

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
      return;
    }
    router.navigate("/product-list");
  };

  const renderCard = useCallback(
    ({ item, index }: { item: ReelSlide; index: number }) => {
      const distance = Math.abs(index - activeIndex);
      return (
        <ReelCard
          slide={item}
          width={cardWidth}
          height={cardHeight}
          hasPlayer={distance <= PLAYER_WINDOW}
          isPlaying={isFocused && distance <= PLAYBACK_WINDOW}
          onPress={handlePressProduct}
          onPressTryOn={handlePressTryOn}
        />
      );
    },
    [
      activeIndex,
      cardWidth,
      cardHeight,
      isFocused,
      handlePressProduct,
      handlePressTryOn,
    ]
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>

      <View onLayout={handleLayout} style={styles.row}>
        {slides.length > 0 ? (
          <FlatList
            data={slides}
            renderItem={renderCard}
            // Keyed by clip, not by product: the same piece may appear in the
            // reel more than once, so its id is not unique across the row.
            keyExtractor={(slide) => slide.videoKey}
            // Which cards hold a player and which run is derived from the
            // active index, so a row has to re-render when it moves.
            extraData={`${cardWidth}-${activeIndex}-${isFocused}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            // Only the cards near the viewport are mounted, so an off-screen
            // card holds no decoded artwork.
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={5}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={snapInterval}
            snapToAlignment="start"
            disableIntervalMomentum // Never fling past a single card
            decelerationRate="fast"
            contentContainerStyle={styles.listContent}
            getItemLayout={(_, index) => ({
              length: snapInterval,
              offset: snapInterval * index,
              index,
            })}
          />
        ) : (
          // Holds the row's height while the catalogue loads, so the page does
          // not jump once the reel's SKUs resolve.
          <LuxuryMediaLoader
            style={[
              styles.placeholderCard,
              { width: cardWidth, height: cardHeight },
            ]}
          />
        )}
      </View>

      {slides.length > 1 && (
        <View style={styles.pagination}>
          {slides.map((slide, index) => (
            <View
              key={slide.videoKey}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}

      <HapticButton style={styles.viewAllWrapper} onPress={handleViewAll}>
        <LinearGradient
          colors={["#175E63", "#053844"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </LinearGradient>
      </HapticButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    paddingHorizontal: SIDE_PADDING,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
    textAlign: "center",
    marginBottom: LUXURY_SPACING,
  },
  row: {
    // Lets the peeking card run to the section's edge.
    marginRight: -SIDE_PADDING,
  },
  listContent: {
    gap: GAP,
    paddingRight: SIDE_PADDING,
  },
  mediaWrapper: {
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: LUXURY_COLORS.surface,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  // expo-av letterboxes its poster with `contain` by default, which reads as a
  // jump against the plain poster beside it, cropped to fill.
  poster: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover" as const,
  },
  placeholderCard: {
    borderRadius: CARD_RADIUS,
    backgroundColor: LUXURY_COLORS.surface,
  },
  tryOnWrapper: {
    position: "absolute",
    right: 12,
    bottom: 12,
    borderRadius: 14,
    overflow: "hidden",
    // The lit edge that separates the glass from what it sits on.
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  tryOn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    // Lighter than it was: the heavier blur now does most of the work of
    // holding the artwork back, and a thinner tint lets the glass read as
    // glass. Still dark enough to carry the white label over a pale shot.
    backgroundColor: "rgba(10, 24, 30, 0.42)",
  },
  tryOnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 14,
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  productName: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: "600",
    color: LUXURY_COLORS.text,
  },
  brandName: {
    marginTop: 6,
    fontSize: 15,
    color: LUXURY_COLORS.textMuted,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: LUXURY_SPACING / 2,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: LUXURY_COLORS.text,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  viewAllWrapper: {
    alignSelf: "center",
    marginTop: LUXURY_SPACING,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#052A33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 48,
    paddingHorizontal: 56,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
