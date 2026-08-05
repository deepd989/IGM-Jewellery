import { HapticButton } from "@/components/basic components/hapticButton";
import { useIsFocused } from "@react-navigation/native";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { luxuryPrice } from "@/helpers/luxuryPrice";
import { Product } from "@/interfaces/product.interface";
import { useGetProductsQuery } from "@/store/apis/product";
import {
  filterCommunityProducts,
  getCommunityVideoSource,
} from "@/store/data/communityVideosData";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GAP = 12;
/** One card plus a slice of the next, so the row reads as scrollable. */
const CARDS_PER_VIEW = 1.25;
/** Card width ÷ height — the clips are shot 9:16. */
const CARD_ASPECT_RATIO = 9 / 16;
const CARD_RADIUS = 20;
/**
 * How far from the card in view a clip still plays. Only the cards a shopper
 * can see decode video; the rest stay paused so a long row stays smooth.
 */
const PLAYBACK_WINDOW = 1;
/**
 * How far from the card in view a clip is given a player at all.
 *
 * A paused player is not a free one: expo-av holds an ExoPlayer, and with it a
 * hardware decoder, from mount until unmount. The device has few, and this row
 * shares them with every other clip on the storefront — so a card outside this
 * window paints its still and holds none. Pausing alone was not enough, and a
 * row of thirteen cards could exhaust the decoders on its own.
 *
 * One wider than PLAYBACK_WINDOW, so the card a swipe is heading for has
 * buffered and arrives on a frame rather than on its poster.
 */
const PLAYER_WINDOW = 2;

type CommunityCardProps = {
  product: Product;
  width: number;
  height: number;
  /** Whether this card holds a player at all, or paints its still instead. */
  hasPlayer: boolean;
  /** Of the cards holding a player, whether this one is running. */
  isPlaying: boolean;
  onPress: (product: Product) => void;
};

/**
 * One clip in the row, with the piece it shows captioned over it.
 *
 * Memoised because every card's playback is derived from the row's active
 * index: without this, one scroll frame re-renders every card in the row, when
 * only the two either side of the move actually changed.
 */
const CommunityCard = memo(function CommunityCard({
  product,
  width,
  height,
  hasPlayer,
  isPlaying,
  onPress,
}: CommunityCardProps) {
  // The worn-on-model still, the same one the immersive row uses. The caption
  // thumbnail is a cutout on white and would read wrong blown up to full bleed.
  const poster = product.immersiveThumbnailUrl || product.thumbnailUrls?.[0];

  return (
    <HapticButton
      style={[styles.card, { width, height }]}
      activeOpacity={0.95}
      onPress={() => onPress(product)}
    >
      {/* Exactly one of these paints the card, so a still is never left showing
          under a loaded clip. */}
      {hasPlayer ? (
        <Video
          source={getCommunityVideoSource(product.sku)}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isPlaying}
          isLooping
          isMuted
          // Holds the still until the clip has a frame, so a card scrolled onto
          // mid-load never flashes black.
          usePoster={!!poster}
          posterSource={poster ? { uri: poster } : undefined}
          posterStyle={styles.poster}
        />
      ) : (
        <Image
          source={{ uri: poster }}
          style={styles.video}
          resizeMode="cover"
        />
      )}

      {/* Marks the card as a clip; the whole card is the tap target. */}
      <Ionicons name="play" size={34} color="#FFFFFF" style={styles.playIcon} />

      {/* Keeps the caption legible over whatever the clip is doing */}
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.75)"]}
        style={styles.scrim}
        pointerEvents="none"
      />

      <View style={styles.caption}>
        <View style={styles.thumbnail}>
          {!!product.thumbnailUrls?.[0] && (
            <Image
              source={{ uri: product.thumbnailUrls[0] }}
              style={styles.thumbnailImage}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.captionText}>
          <Text style={styles.productName} numberOfLines={1}>
            {product.name || product.title}
          </Text>
          <Text style={styles.brandName} numberOfLines={1}>
            {product.brand}
          </Text>
          <Text style={styles.price}>
            ₹{luxuryPrice(product)?.toLocaleString()}
          </Text>
        </View>

        <HapticButton
          style={styles.arrowButton}
          activeOpacity={0.85}
          onPress={(event) => {
            event?.stopPropagation?.();
            onPress(product);
          }}
        >
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </HapticButton>
      </View>
    </HapticButton>
  );
});

type LuxuryCommunityCarouselProps = {
  title?: string;
  /** Defaults to the catalogue products that have a community clip. */
  products?: Product[];
  /** Overrides navigation to the product screen. */
  onPressProduct?: (product: Product) => void;
  style?: ViewStyle;
};

export default function LuxuryCommunityCarousel({
  title = "As Seen On You",
  products,
  onPressProduct,
  style,
}: LuxuryCommunityCarouselProps) {
  const router = useRouter();
  const { data: fetchedProducts = [], isLoading } = useGetProductsQuery({});
  const [activeIndex, setActiveIndex] = useState(0);
  // Clips keep decoding while the shopper is off on another screen unless the
  // carousel stops them — two carousels running at once exhausts the device's
  // video decoders.
  const isFocused = useIsFocused();
  // Measured so the cards fit the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [rowWidth, setRowWidth] = useState(SCREEN_WIDTH);

  const communityProducts = useMemo(
    () => products ?? filterCommunityProducts(fetchedProducts),
    [products, fetchedProducts]
  );

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
    if (index !== activeIndex && index >= 0 && index < communityProducts.length) {
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

  const renderCard = useCallback(
    ({ item, index }: { item: Product; index: number }) => {
      const distance = Math.abs(index - activeIndex);
      return (
        <CommunityCard
          product={item}
          width={cardWidth}
          height={cardHeight}
          // Gated on focus as well as distance: a screen the shopper has
          // navigated away from stays mounted in the stack, and a paused player
          // holds its decoder just as a running one does.
          hasPlayer={isFocused && distance <= PLAYER_WINDOW}
          isPlaying={isFocused && distance <= PLAYBACK_WINDOW}
          onPress={handlePressProduct}
        />
      );
    },
    [activeIndex, cardWidth, cardHeight, isFocused, handlePressProduct]
  );

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>

      {communityProducts.length > 0 ? (
        <FlatList
          data={communityProducts}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          // Which cards hold a player and which run is derived from the active
          // index, so a row has to re-render when it moves.
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
        // Holds the section's height steady while the catalogue loads, so the
        // page doesn't jump once the clips arrive.
        <View style={[styles.emptyCard, { height: cardHeight }]}>
          {isLoading && (
            <ActivityIndicator size="large" color={LUXURY_COLORS.text} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
    textAlign: "center",
    marginBottom: LUXURY_SPACING ,
  },
  listContent: {
    gap: GAP,
  },
  card: {
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "#0A0A0A",
  },
  emptyCard: {
    borderRadius: CARD_RADIUS,
    backgroundColor: LUXURY_COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  // expo-av letterboxes its poster with `contain` by default, which reads as a
  // jump against the plain still beside it, cropped to fill.
  poster: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover" as const,
  },
  playIcon: {
    position: "absolute",
    top: 20,
    right: 16,
  },
  scrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "32%",
  },
  caption: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  captionText: {
    flex: 1,
  },
  productName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  brandName: {
    marginTop: 4,
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
  },
  price: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
});
