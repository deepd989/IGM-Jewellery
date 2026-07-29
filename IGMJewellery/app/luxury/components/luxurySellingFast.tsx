import { HapticButton } from "@/components/basic components/hapticButton";
import { TryOnSelectorModal } from "@/components/products/TryOnSelectorModal";
import { COLORS, LUXURY_SPACING } from "@/constants/theme";
import { ProductType } from "@/enums/productType.enum";
import { Product } from "@/interfaces/product.interface";
import { useGetProductsQuery } from "@/store/apis/product";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/apis/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/** Each category shows at most this many cards. */
const MAX_PRODUCTS = 5;

const CARD_RADIUS = 32;
/** Card width ÷ height — the card is taller than it is wide. */
const CARD_ASPECT_RATIO = 0.77;
const PANEL_RADIUS = 24;
/** Teal wash shared by the selected chip and the try-on button. */
const TEAL_GRADIENT = ["#053844", "#00807F"] as const;

type SellingFastCategory = {
  /** Chip label — plural, unlike the singular product type it filters on. */
  label: string;
  productType: ProductType;
};

const CATEGORIES: SellingFastCategory[] = [
  { label: "Earrings", productType: ProductType.Earring },
  { label: "Necklaces", productType: ProductType.Necklace },
  { label: "Rings", productType: ProductType.Ring },
  { label: "Bracelets", productType: ProductType.Bracelet },
  { label: "Bangles", productType: ProductType.Bangles },
];

type LuxurySellingFastProps = {
  title?: string;
  categories?: SellingFastCategory[];
  /** Defaults to the product catalogue. */
  products?: Product[];
  /** Overrides navigation to the category's product list. */
  onPressProduct?: (product: Product) => void;
  style?: ViewStyle;
};

export default function LuxurySellingFast({
  title = "Selling Fast",
  categories = CATEGORIES,
  products,
  onPressProduct,
  style,
}: LuxurySellingFastProps) {
  const router = useRouter();
  const { data: fetchedProducts = [], isLoading } = useGetProductsQuery({});
  const { data: wishlistData } = useGetWishlistQuery();
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();

  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.productType
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [tryOnProduct, setTryOnProduct] = useState<Product>();
  // Measured so the card fits the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [cardWidth, setCardWidth] = useState(SCREEN_WIDTH);
  const listRef = useRef<FlatList<Product>>(null);

  const catalogue = products ?? fetchedProducts;
  const sellingFast = catalogue
    .filter((product) => product.productType === activeCategory)
    .slice(0, MAX_PRODUCTS);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== cardWidth) {
      setCardWidth(width);
    }
  };

  const cardHeight = Math.round(cardWidth / CARD_ASPECT_RATIO);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
    if (index !== activeIndex && index >= 0 && index < sellingFast.length) {
      setActiveIndex(index);
    }
  };

  const handleSelectCategory = (category: SellingFastCategory) => {
    setActiveCategory(category.productType);
    setActiveIndex(0);
    // The new category's cards start at the first one, not wherever the
    // previous category happened to be scrolled to.
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  const handlePressProduct = (product: Product) => {
    if (onPressProduct) {
      onPressProduct(product);
      return;
    }
    router.navigate({
      pathname: "/product-list",
      params: { categoryName: product.productType },
    });
  };

  const handleToggleWishlist = async (product: Product) => {
    const isWishlisted = wishlistData?.items?.some(
      (item) => item.product?.id === product.id
    );

    if (isWishlisted) {
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

  const renderCard = ({ item }: { item: Product }) => {
    const isWishlisted = wishlistData?.items?.some(
      (wishlistItem) => wishlistItem.product?.id === item.id
    );
    const hasDiscount = item.givenPrice > item.discountedPrice;

    return (
      <HapticButton
        style={[styles.card, { width: cardWidth, height: cardHeight }]}
        activeOpacity={0.95}
        onPress={() => handlePressProduct(item)}
      >
        <Image
          source={{ uri: item.thumbnailUrls?.[0] }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        <HapticButton
          style={styles.wishlistWrapper}
          activeOpacity={0.85}
          disabled={isAdding || isRemoving}
          onPress={(event) => {
            event?.stopPropagation?.();
            handleToggleWishlist(item);
          }}
        >
          <BlurView intensity={30} tint="dark" style={styles.wishlistButton}>
            {isAdding || isRemoving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                name={isWishlisted ? "heart" : "heart-outline"}
                size={22}
                color="#FFFFFF"
              />
            )}
          </BlurView>
        </HapticButton>

        {/* Glass panel carrying the price, the product and the try-on entry */}
        <View style={styles.panelWrapper}>
          <BlurView intensity={30} tint="dark" style={styles.panel}>
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

            <HapticButton
              style={styles.tryOnWrapper}
              activeOpacity={0.9}
              onPress={(event) => {
                event?.stopPropagation?.();
                setTryOnProduct(item);
              }}
            >
              <LinearGradient
                colors={[...TEAL_GRADIENT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tryOnButton}
              >
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                <Text style={styles.tryOnText}>Try Now</Text>
              </LinearGradient>
            </HapticButton>
          </BlurView>
        </View>
      </HapticButton>
    );
  };

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        intialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        contentContainerStyle={styles.chipRow}
        style={styles.chipScroll}
      >
        {categories.map((category) => {
          const isActive = category.productType === activeCategory;

          return (
            <HapticButton
              key={category.label}
              style={styles.chipWrapper}
              activeOpacity={0.85}
              onPress={() => handleSelectCategory(category)}
            >
              {isActive ? (
                <LinearGradient
                  colors={[...TEAL_GRADIENT]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.chip}
                >
                  <Text style={[styles.chipText, styles.activeChipText]}>
                    {category.label}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={[styles.chip, styles.inactiveChip]}>
                  <Text style={styles.chipText}>{category.label}</Text>
                </View>
              )}
            </HapticButton>
          );
        })}
      </ScrollView>

      {sellingFast.length > 0 ? (
        <FlatList
          ref={listRef}
          data={sellingFast}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          extraData={`${cardWidth}-${activeCategory}-${wishlistData?.items?.length}`}
          horizontal
          pagingEnabled // One card per page: page width === list width
          disableIntervalMomentum // Never fling past a single card
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          bounces={false}
          getItemLayout={(_, index) => ({
            length: cardWidth,
            offset: cardWidth * index,
            index,
          })}
        />
      ) : (
        // Holds the section's height steady while the catalogue loads or a
        // category comes back empty, so the page doesn't jump.
        <View style={[styles.emptyCard, { height: cardHeight }]}>
          {isLoading && <ActivityIndicator size="large" color={COLORS.primary} />}
        </View>
      )}

      {sellingFast.length > 1 && (
        <View style={styles.pagination}>
          {sellingFast.map((product, index) => (
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

      <TryOnSelectorModal
        visible={!!tryOnProduct}
        onClose={() => setTryOnProduct(undefined)}
        onSelectVR={() => {
          if (!tryOnProduct) return;
          const product = tryOnProduct;
          setTryOnProduct(undefined);
          router.navigate({
            pathname: "/virtualTryOn2",
            params: { productId: product.id, productTitle: product.title },
          });
        }}
        onSelectAI={() => {
          if (!tryOnProduct) return;
          const product = tryOnProduct;
          setTryOnProduct(undefined);
          router.navigate({
            pathname: "/tryOn",
            params: { productId: product.id },
          });
        }}
      />
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
    marginBottom: LUXURY_SPACING,
  },
  chipScroll: {
    marginBottom: LUXURY_SPACING / 2,
    flexGrow: 0,
  },
  chipRow: {
    gap: 8,
    // Lets the last chip run past the edge, so the row reads as scrollable.
    paddingRight: 8,
  },
  chipWrapper: {
    borderRadius: 6,
    overflow: "hidden",
  },
  chip: {
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  inactiveChip: {
    backgroundColor: "#C0E7E5",
  },
  chipText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#306069",
  },
  activeChipText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  card: {
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "#E2EAEE",
  },
  cardImage: {
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
  wishlistWrapper: {
    position: "absolute",
    top: 18,
    right: 16,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  wishlistButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    // Dark enough that the white heart still reads over pale product shots,
    // where a light glass circle would have swallowed it.
    backgroundColor: "rgba(10, 24, 30, 0.45)",
  },
  panelWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 12,
    borderRadius: PANEL_RADIUS,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  panel: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 18,
    // Opaque enough to keep the white type readable over pale product shots.
    backgroundColor: "rgba(10, 24, 30, 0.28)",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  originalPrice: {
    fontSize: 20,
    color: "rgba(255,255,255,0.85)",
    textDecorationLine: "line-through",
  },
  productName: {
    marginTop: 14,
    fontSize: 19,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  brandName: {
    marginTop: 10,
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
  },
  tryOnWrapper: {
    marginTop: 20,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  tryOnButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 44,
  },
  tryOnText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "600",
    letterSpacing: 0.2,
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
});
