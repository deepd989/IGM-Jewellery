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
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GAP = 12;
/** Share of the row the centred card takes; the rest peeks on either side. */
const CARD_WIDTH_RATIO = 0.66;
/** Card width ÷ height — the clips are shot tall. */
const CARD_ASPECT_RATIO = 0.63;
/** How far the neighbouring cards fall back from the centred one. */
const SIDE_CARD_SCALE = 0.92;
const CARD_RADIUS = 20;

const SIDE_PADDING = 16;

/**
 * How far from the card in view a clip still plays. Only the cards a shopper
 * can see decode video; the rest stay paused so a long row stays smooth.
 */
const PLAYBACK_WINDOW = 1;

/**
 * Animated.FlatList carries no useful generics; casting back to FlatList keeps
 * `data` and `renderItem` typed while still accepting the native-driven
 * scroll handler.
 */
const AnimatedFlatList = Animated.FlatList as unknown as typeof FlatList;

type LuxurySeenOnYouProps = {
  title?: string;
  /** The product on screen: its own clip leads the rail when it has one. */
  product?: Product;
  /** Defaults to the catalogue products that have a community clip. */
  products?: Product[];
  /** Overrides navigation to the product screen. */
  onPressProduct?: (product: Product) => void;
  /** Overrides what the expand button does; defaults to opening the product. */
  onExpandProduct?: (product: Product) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * "Seen on you": the community's try-on clips, one centred with its
 * neighbours held back on either side.
 */
export default function LuxurySeenOnYou({
  title = "Seen On You!",
  product,
  products,
  onPressProduct,
  onExpandProduct,
  style,
}: LuxurySeenOnYouProps) {
  const router = useRouter();
  const { data: fetchedProducts = [], isLoading } = useGetProductsQuery({});
  const [activeIndex, setActiveIndex] = useState(0);
  // Measured so the cards fit the space this component is actually given.
  const [rowWidth, setRowWidth] = useState(SCREEN_WIDTH);
  const scrollX = useRef(new Animated.Value(0)).current;

  const clips = useMemo(() => {
    if (products) return products;

    const community = filterCommunityProducts(fetchedProducts);
    // The piece being viewed leads the rail whenever it has a clip of its own.
    const current = community.filter((item) => item.id === product?.id);
    const rest = community.filter((item) => item.id !== product?.id);

    return [...current, ...rest];
  }, [products, fetchedProducts, product]);

  const cardWidth = Math.round(rowWidth * CARD_WIDTH_RATIO);
  const cardHeight = Math.round(cardWidth / CARD_ASPECT_RATIO);
  const snapInterval = cardWidth + GAP;
  // Centres the first and last cards rather than pinning them to the edges.
  const sidePadding = Math.max((rowWidth - cardWidth) / 2, SIDE_PADDING);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== rowWidth) {
      setRowWidth(width);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
    if (index !== activeIndex && index >= 0 && index < clips.length) {
      setActiveIndex(index);
    }
  };

  const handlePressProduct = (item: Product) => {
    if (onPressProduct) {
      onPressProduct(item);
      return;
    }
    router.navigate({
      pathname: "/luxury/product/[id]",
      params: { id: item.id },
    });
  };

  const handleExpand = (item: Product) => {
    if (onExpandProduct) {
      onExpandProduct(item);
      return;
    }
    handlePressProduct(item);
  };

  const renderCard = ({ item, index }: { item: Product; index: number }) => {
    const scale = scrollX.interpolate({
      inputRange: [
        (index - 1) * snapInterval,
        index * snapInterval,
        (index + 1) * snapInterval,
      ],
      outputRange: [SIDE_CARD_SCALE, 1, SIDE_CARD_SCALE],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.cardShadow,
          { width: cardWidth, height: cardHeight, transform: [{ scale }] },
        ]}
      >
        <HapticButton
          style={styles.card}
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
          <Ionicons
            name="play"
            size={34}
            color="#FFFFFF"
            style={styles.playIcon}
          />

          <HapticButton
            style={styles.expandButton}
            activeOpacity={0.85}
            onPress={() => handleExpand(item)}
          >
            <Ionicons name="expand" size={22} color={COLORS.primary} />
          </HapticButton>
        </HapticButton>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>

      {clips.length > 0 ? (
        <AnimatedFlatList
          data={clips}
          renderItem={renderCard}
          keyExtractor={(item: Product) => item.id}
          extraData={`${cardWidth}-${activeIndex}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true, listener: handleScroll }
          )}
          scrollEventThrottle={16}
          snapToInterval={snapInterval}
          snapToAlignment="start"
          disableIntervalMomentum // Never fling past a single card
          decelerationRate="fast"
          contentContainerStyle={{
            gap: GAP,
            paddingHorizontal: sidePadding,
          }}
          getItemLayout={(_: unknown, index: number) => ({
            length: snapInterval,
            offset: snapInterval * index,
            index,
          })}
        />
      ) : (
        // Holds the section's height steady while the catalogue loads, so the
        // page doesn't jump once the clips arrive.
        <View
          style={[
            styles.emptyCard,
            { width: cardWidth, height: cardHeight, marginLeft: sidePadding },
          ]}
        >
          {isLoading && <ActivityIndicator size="large" color={COLORS.primary} />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: LUXURY_SPACING,
  },
  cardShadow: {
    borderRadius: CARD_RADIUS,
    backgroundColor: "#0A0A0A",
    // Kept off the card itself: a view cannot both clip its corners and cast a
    // shadow on Android.
    shadowColor: "#052A33",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  card: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "#0A0A0A",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  emptyCard: {
    borderRadius: CARD_RADIUS,
    backgroundColor: "#E2EAEE",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  expandButton: {
    position: "absolute",
    right: 14,
    bottom: 14,
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});
