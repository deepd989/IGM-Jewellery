import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_SPACING } from "@/constants/theme";
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
import { useMemo, useState } from "react";
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

  const handlePressProduct = (product: Product) => {
    if (onPressProduct) {
      onPressProduct(product);
      return;
    }
    router.navigate({
      pathname: "/product/[id]",
      params: { id: product.id },
    });
  };

  const renderCard = ({ item, index }: { item: Product; index: number }) => (
    <HapticButton
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      activeOpacity={0.95}
      onPress={() => handlePressProduct(item)}
    >
      <Video
        source={getCommunityVideoSource(item.sku)}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={Math.abs(index - activeIndex) <= PLAYBACK_WINDOW}
        isLooping
        isMuted
      />

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
          {!!item.thumbnailUrls?.[0] && (
            <Image
              source={{ uri: item.thumbnailUrls[0] }}
              style={styles.thumbnailImage}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.captionText}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name || item.title}
          </Text>
          <Text style={styles.brandName} numberOfLines={1}>
            {item.brand}
          </Text>
          <Text style={styles.price}>
            ₹{item.discountedPrice?.toLocaleString()}
          </Text>
        </View>

        <HapticButton
          style={styles.arrowButton}
          activeOpacity={0.85}
          onPress={(event) => {
            event?.stopPropagation?.();
            handlePressProduct(item);
          }}
        >
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </HapticButton>
      </View>
    </HapticButton>
  );

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>

      {communityProducts.length > 0 ? (
        <FlatList
          data={communityProducts}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          extraData={`${cardWidth}-${activeIndex}`}
          horizontal
          showsHorizontalScrollIndicator={false}
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
            <ActivityIndicator size="large" color={COLORS.primary} />
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
    color: COLORS.primary,
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
    backgroundColor: "#E2EAEE",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
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
