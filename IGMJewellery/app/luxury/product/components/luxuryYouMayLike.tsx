import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Product } from "@/interfaces/product.interface";
import { useGetProductsQuery } from "@/store/apis/product";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
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

/** The rail never shows more than this many products. */
const MAX_PRODUCTS = 6;

const GAP = 12;
/** Share of the row the centred card takes; the rest peeks on either side. */
const CARD_WIDTH_RATIO = 0.67;
/** Card width ÷ height. */
const CARD_ASPECT_RATIO = 0.74;
/** How far the neighbouring cards shrink back from the centred one. */
const SIDE_CARD_SCALE = 0.78;
const CARD_RADIUS = 20;

const SIDE_PADDING = 16;

const TRUST_POINTS = ["100% Certified", "15 Days return", "1 year Warranty"];

/**
 * Animated.FlatList carries no useful generics; casting back to FlatList keeps
 * `data` and `renderItem` typed while still accepting the native-driven
 * scroll handler.
 */
const AnimatedFlatList = Animated.FlatList as unknown as typeof FlatList;

type LuxuryYouMayLikeProps = {
  title?: string;
  /** The product on screen: its siblings fill the rail, and it is left out. */
  product?: Product;
  /** Defaults to products related to the one above. */
  products?: Product[];
  /** Overrides navigation to the product screen. */
  onPressProduct?: (product: Product) => void;
  /** Overrides navigation to the full product list. */
  onViewAll?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The recommendations rail: a centred card with its neighbours held back on
 * either side, closing on the guarantee bar.
 */
export default function LuxuryYouMayLike({
  title = "Products You May Like",
  product,
  products,
  onPressProduct,
  onViewAll,
  style,
}: LuxuryYouMayLikeProps) {
  const router = useRouter();
  const { data: fetchedProducts = [] } = useGetProductsQuery({});
  const [activeIndex, setActiveIndex] = useState(0);
  // Measured so the cards fit the space this component is actually given.
  const [rowWidth, setRowWidth] = useState(SCREEN_WIDTH);
  const scrollX = useRef(new Animated.Value(0)).current;

  const related = useMemo(() => {
    if (products) return products.slice(0, MAX_PRODUCTS);

    const others = fetchedProducts.filter((item) => item.id !== product?.id);
    const sameKind = others.filter(
      (item) =>
        item.brand === product?.brand || item.productType === product?.productType
    );

    // Falls back to the wider catalogue when nothing matches.
    return (sameKind.length > 0 ? sameKind : others).slice(0, MAX_PRODUCTS);
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
    if (index !== activeIndex && index >= 0 && index < related.length) {
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

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
      return;
    }
    router.navigate({
      pathname: "/product-list",
      params: product ? { productType: product.productType } : {},
    });
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
          <Image
            source={{ uri: item.thumbnailUrls?.[0] }}
            style={styles.cardImage}
            resizeMode="cover"
          />

          {/* Keeps the caption legible over pale artwork. */}
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]}
            style={styles.cardScrim}
            pointerEvents="none"
          />

          <View style={styles.caption}>
            <Text style={styles.price}>
              ₹{item.discountedPrice?.toLocaleString()}
            </Text>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name || item.title}
            </Text>
            <Text style={styles.brandName} numberOfLines={1}>
              {item.brand}
            </Text>
          </View>
        </HapticButton>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>

      <AnimatedFlatList
        data={related}
        renderItem={renderCard}
        keyExtractor={(item: Product) => item.id}
        extraData={cardWidth}
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

      {related.length > 1 && (
        <View style={styles.pagination}>
          {related.map((item, index) => (
            <View
              key={item.id}
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

      <View style={styles.trustBar}>
        {TRUST_POINTS.map((point, index) => (
          <View key={point} style={styles.trustItem}>
            {index > 0 && <View style={styles.trustDivider} />}
            <Text style={styles.trustText}>{point}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: LUXURY_SPACING,
  },

  // ── Card ──
  cardShadow: {
    borderRadius: CARD_RADIUS,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#E2EAEE",
  },
  cardImage: StyleSheet.absoluteFillObject,
  cardScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "45%",
  },
  caption: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  productName: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  brandName: {
    marginTop: 4,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },

  // ── Pagination ──
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: LUXURY_SPACING / 2,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 22,
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: "#C3D0D5",
  },

  // ── View all ──
  viewAllWrapper: {
    alignSelf: "center",
    marginTop: LUXURY_SPACING,
    borderRadius: 12,
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
    paddingHorizontal: 64,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  // ── Guarantee bar ──
  trustBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: LUXURY_SPACING,
    paddingVertical: 14,
    paddingHorizontal: SIDE_PADDING,
    backgroundColor: "#C6A961",
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  trustDivider: {
    width: 1,
    height: 16,
    marginHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  trustText: {
    fontSize: 13,
    color: "#FFFFFF",
  },
});
