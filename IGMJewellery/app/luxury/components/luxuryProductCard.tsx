import { HapticButton } from "@/components/basic components/hapticButton";
import { TryOnSelectorModal } from "@/components/products/TryOnSelectorModal";
import { COLORS, LUXURY_COLORS } from "@/constants/theme";
import { useCartStatus } from "@/hooks/useCartStatus";
import { Product } from "@/interfaces/product.interface";
import { useAddToCartMutation } from "@/store/apis/cart";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/apis/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const TILE_RADIUS = 20;
/** Grey used for the unearned stars and the struck-through price. */
const MUTED = "#9AA9AF";

/**
 * The card's details sit on whatever surface the caller gives it: the luxury
 * storefront's dark ground, or a white tile on the listing. Only the type
 * colours differ.
 */
const ON_DARK = {
  text: LUXURY_COLORS.text,
  muted: "rgba(255,255,255,0.65)",
  starFilled: LUXURY_COLORS.accent,
  starEmpty: "rgba(255,255,255,0.3)",
};

type LuxuryProductCardProps = {
  product: Product;
  /** Fixed card width. Omit to fill the space the parent gives the card. */
  width?: number;
  /** Overrides navigation to the product screen. */
  onPress?: (product: Product) => void;
  /** Overrides the wishlist mutation, e.g. on the wishlist screen itself. */
  onRemoveFromWishlist?: () => void;
  /** Forces the heart's state instead of reading it from the wishlist. */
  isInWishlist?: boolean;
  /** Set when the card sits on the storefront's dark ground. */
  onDark?: boolean;
  /**
   * Tightens the type and the actions for cards that sit in a narrow cell —
   * a microsite's grid, where the listing's sizes crowd the tile.
   */
  compact?: boolean;
  /**
   * The palette the card's actions are painted in. Defaults to the
   * storefront's own; a brand's microsite passes its colours instead.
   */
  primaryColor?: string;
  secondaryColor?: string;
  /**
   * Ink for the price the shopper pays. The struck price and the brand stay
   * muted grey whatever this is set to, so the two never compete.
   */
  priceColor?: string;
  style?: ViewStyle;
};

/**
 * The luxury storefront's product card: a rounded artwork tile with the
 * details set on the page background beneath it. Wishlist, bag and try-on all
 * behave exactly as they do in components/products/ProductCard.tsx.
 */
export default function LuxuryProductCard({
  product,
  width,
  onPress,
  onRemoveFromWishlist,
  isInWishlist: propIsInWishlist,
  onDark = false,
  compact = false,
  primaryColor = COLORS.primary,
  secondaryColor = COLORS.secondary,
  priceColor = COLORS.text,
  style,
}: LuxuryProductCardProps) {
  const router = useRouter();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const { isInCart, goToCart } = useCartStatus(product.id);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTryOnSelectorVisible, setIsTryOnSelectorVisible] = useState(false);

  const { data: wishlistData } = useGetWishlistQuery();
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] =
    useRemoveFromWishlistMutation();

  const isInWishlist =
    propIsInWishlist !== undefined
      ? propIsInWishlist
      : wishlistData?.items.some((item) => item.product.id === product.id);

  const isWishlistBusy = isAddingToWishlist || isRemovingFromWishlist;
  const hasDiscount = product.givenPrice > product.discountedPrice;

  const handlePress = () => {
    if (onPress) {
      onPress(product);
      return;
    }
    router.navigate({
      pathname: "/luxury/product/[id]",
      params: { id: product.id },
    });
  };

  /** Adds the piece, or opens the bag once it is already in there. */
  const handleBagPress = async (e: any) => {
    e.stopPropagation();

    if (isInCart) {
      goToCart();
      return;
    }

    try {
      await addToCart({ product, quantity: 1 }).unwrap();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const handleToggleWishlist = async (e: any) => {
    e.stopPropagation();

    if (isInWishlist) {
      // The wishlist screen passes its own remover so the row can animate out.
      if (onRemoveFromWishlist) {
        onRemoveFromWishlist();
        return;
      }
      try {
        await removeFromWishlist(product.id).unwrap();
      } catch (error) {
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

  const renderStars = (rating: number) => (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name="star"
          size={compact ? 11 : 13}
          color={
            star <= rating
              ? onDark
                ? ON_DARK.starFilled
                : primaryColor
              : onDark
                ? ON_DARK.starEmpty
                : "#D3DCE0"
          }
        />
      ))}
    </View>
  );

  return (
    <HapticButton
      style={[styles.card, width ? { width } : styles.fluid, style]}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      <View style={styles.tile}>
        <Image
          source={{ uri: product.thumbnailUrls?.[0] }}
          style={styles.image}
          resizeMode="cover"
        />

        {product.isNew && (
          <View style={[styles.newBadge, { backgroundColor: secondaryColor }]}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        )}

        <HapticButton
          style={styles.favButton}
          onPress={handleToggleWishlist}
          disabled={isWishlistBusy}
        >
          {isWishlistBusy ? (
            <ActivityIndicator size="small" color={primaryColor} />
          ) : (
            <Ionicons
              name={isInWishlist ? "heart" : "heart-outline"}
              size={compact ? 22 : 26}
              color={primaryColor}
            />
          )}
        </HapticButton>
      </View>

      <View style={[styles.priceRow, compact && compactStyles.priceRow]}>
        <Text
          style={[
            styles.price,
            compact && compactStyles.price,
            { color: priceColor },
            // The dark ground overrides any ink a caller asked for.
            onDark && { color: ON_DARK.text },
          ]}
        >
          ₹{product.discountedPrice?.toLocaleString()}
        </Text>
        {hasDiscount && (
          <Text
            style={[
              styles.originalPrice,
              compact && compactStyles.originalPrice,
              onDark && { color: ON_DARK.muted },
            ]}
          >
            ₹{product.givenPrice.toLocaleString()}
          </Text>
        )}
      </View>

      <Text
        style={[
          styles.productName,
          compact && compactStyles.productName,
          onDark && { color: ON_DARK.text },
        ]}
        numberOfLines={1}
      >
        {product.name || product.title}
      </Text>

      <View style={[styles.metaRow, compact && compactStyles.metaRow]}>
        <Text
          style={[
            styles.brandName,
            compact && compactStyles.brandName,
            onDark && { color: ON_DARK.muted },
          ]}
          numberOfLines={1}
        >
          {product.brand}
        </Text>
        {!!product.rating && renderStars(product.rating)}
      </View>

      <View style={[styles.actionRow, compact && compactStyles.actionRow]}>
        <HapticButton
          style={styles.tryNowButton}
          onPress={(e) => {
            e.stopPropagation();
            setIsTryOnSelectorVisible(true);
          }}
        >
          <Ionicons
            name="sparkles"
            size={compact ? 12 : 14}
            color={onDark ? ON_DARK.text : primaryColor}
          />
          <Text
            style={[
              styles.tryNowText,
              compact && compactStyles.tryNowText,
              { color: onDark ? ON_DARK.text : primaryColor },
            ]}
            numberOfLines={1}
          >
            Try Now
          </Text>
        </HapticButton>

        <HapticButton
          style={[
            styles.addToBagButton,
            compact && compactStyles.addToBagButton,
            { backgroundColor: primaryColor },
            isAddingToCart && styles.addToBagButtonDisabled,
          ]}
          onPress={handleBagPress}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : showSuccess ? (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          ) : (
            <Text
              style={[
                styles.addToBagText,
                compact && compactStyles.addToBagText,
              ]}
              numberOfLines={1}
            >
              {isInCart ? "Go To Bag" : "Add To Bag"}
            </Text>
          )}
        </HapticButton>
      </View>

      <TryOnSelectorModal
        visible={isTryOnSelectorVisible}
        onClose={() => setIsTryOnSelectorVisible(false)}
        onSelectVR={() => {
          router.navigate({
            pathname: "/virtualTryOn2",
            params: {
              productId: product.id,
              productTitle: product.title,
            },
          });
        }}
        onSelectAI={() => {
          router.navigate({
            pathname: "/tryOn",
            params: {
              productId: product.id,
            },
          });
        }}
      />
    </HapticButton>
  );
}

const styles = StyleSheet.create({
  card: {
    // The details sit on the page background, so only the tile is a surface.
  },
  fluid: {
    flex: 1,
  },
  tile: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: TILE_RADIUS,
    overflow: "hidden",
    backgroundColor: "#F7FAFB",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  newBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
  },
  newBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  favButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  originalPrice: {
    fontSize: 15,
    color: MUTED,
    textDecorationLine: "line-through",
  },
  productName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    marginTop: 8,
  },
  brandName: {
    flexShrink: 1,
    fontSize: 14,
    color: MUTED,
  },
  stars: {
    flexDirection: "row",
  },
  // Both actions sit on one line where there is room and stack where there is
  // not — half a phone's width leaves the two of them nothing to share.
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 6,
    rowGap: 8,
    marginTop: 14,
  },
  tryNowButton: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: 5,
    paddingVertical: 8,
  },
  tryNowText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  addToBagButton: {
    // Grows into the line it wraps onto rather than sitting stranded at one
    // button's width.
    flexGrow: 1,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
  },
  addToBagButtonDisabled: {
    opacity: 0.6,
  },
  addToBagText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});

/**
 * The same card with everything below the tile brought in a size. Only the
 * details change: the artwork keeps its square, so a compact card still reads
 * as the same object as the listing's.
 */
const compactStyles = StyleSheet.create({
  priceRow: {
    gap: 6,
    marginTop: 10,
  },
  price: {
    fontSize: 16,
  },
  originalPrice: {
    fontSize: 12,
  },
  productName: {
    marginTop: 4,
    fontSize: 13,
  },
  metaRow: {
    marginTop: 5,
  },
  brandName: {
    fontSize: 11,
  },
  actionRow: {
    marginTop: 10,
  },
  tryNowText: {
    fontSize: 11,
  },
  addToBagButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 13,
  },
  addToBagText: {
    fontSize: 11,
  },
});
