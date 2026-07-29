import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Product } from "@/interfaces/product.interface";
import { useGetProductsQuery } from "@/store/apis/product";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/** The section never shows more than this many products. */
const MAX_PRODUCTS = 10;

const GAP = 12;
/** One card plus a sliver of the next, so the row reads as scrollable. */
const CARDS_PER_VIEW = 1.15;
const SIDE_PADDING = 16;

type LuxuryBestSellersProps = {
  title?: string;
  /** Defaults to the product catalogue. */
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
  // Measured so the cards fit the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [rowWidth, setRowWidth] = useState(SCREEN_WIDTH - SIDE_PADDING * 2);

  const bestSellers = (products ?? fetchedProducts).slice(0, MAX_PRODUCTS);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== rowWidth) {
      setRowWidth(width);
    }
  };

  const cardWidth = Math.round(
    (rowWidth - GAP * (CARDS_PER_VIEW - 1)) / CARDS_PER_VIEW
  );
  const snapInterval = cardWidth + GAP;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
    if (index !== activeIndex && index >= 0 && index < bestSellers.length) {
      setActiveIndex(index);
    }
  };

  const handlePressProduct = (product: Product) => {
    if (onPressProduct) {
      onPressProduct(product);
      return;
    }
    router.navigate({
      pathname: "/luxury/product/[id]",
      params: { id: product.id },
    });
  };

  const handlePressTryOn = (product: Product) => {
    if (onPressTryOn) {
      onPressTryOn(product);
      return;
    }
    router.navigate({
      pathname: "/tryOn",
      params: { productId: product.id },
    });
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
      return;
    }
    router.navigate("/product-list");
  };

  const renderCard = ({ item }: { item: Product }) => {
    const hasDiscount = item.givenPrice > item.discountedPrice;

    return (
      <HapticButton
        style={{ width: cardWidth }}
        activeOpacity={0.9}
        onPress={() => handlePressProduct(item)}
      >
        <View style={[styles.imageWrapper, { height: cardWidth }]}>
          <Image
            source={{ uri: item.thumbnailUrls?.[0] }}
            style={styles.image}
            resizeMode="cover"
          />

          <HapticButton
            style={styles.tryOnWrapper}
            activeOpacity={0.85}
            onPress={() => handlePressTryOn(item)}
          >
            <BlurView intensity={35} tint="dark" style={styles.tryOn}>
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              <Text style={styles.tryOnText}>Try Now</Text>
            </BlurView>
          </HapticButton>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ₹{item.discountedPrice?.toLocaleString()}
          </Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>
              ₹{item.givenPrice.toLocaleString()}
            </Text>
          )}
        </View>

        <Text style={styles.productName} numberOfLines={1}>
          {item.name || item.title}
        </Text>
        <Text style={styles.brandName} numberOfLines={1}>
          {item.brand}
        </Text>
      </HapticButton>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>

      <View onLayout={handleLayout} style={styles.row}>
        <FlatList
          data={bestSellers}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          extraData={cardWidth}
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
      </View>

      {bestSellers.length > 1 && (
        <View style={styles.pagination}>
          {bestSellers.map((product, index) => (
            <View
              key={product.id}
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
  imageWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E2EAEE",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  tryOnWrapper: {
    position: "absolute",
    right: 12,
    bottom: 12,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  tryOn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    // Opaque enough to keep the white label readable over pale product shots.
    backgroundColor: "rgba(10, 24, 30, 0.55)",
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
  originalPrice: {
    fontSize: 18,
    color: LUXURY_COLORS.textMuted,
    textDecorationLine: "line-through",
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
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#C3D0D5",
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
