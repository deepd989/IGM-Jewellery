import { Product } from "@/interfaces/product.interface";
import { useAddToCartMutation, useAddToTrialMutation } from "@/store/apis/cart";
import {
    useAddToWishlistMutation,
    useGetWishlistQuery,
    useRemoveFromWishlistMutation,
} from "@/store/apis/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS, SPACING } from "../../constants/theme";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
  onPress: (product: Product) => void;
  isInWishlist?: boolean;
  onRemoveFromWishlist?: () => void;
  isInCompare?: boolean;
  onToggleCompare?: () => void;
}

const { width } = Dimensions.get("window");

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  onPress,
  isInWishlist: propIsInWishlist,
  onRemoveFromWishlist,
  isInCompare,
  onToggleCompare,
}) => {
  const router = useRouter();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToTrial, { isLoading: isAddingToTrial }] = useAddToTrialMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  // Wishlist functionality
  const { data: wishlistData } = useGetWishlistQuery();
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] =
    useRemoveFromWishlistMutation();

  // Determine if in wishlist from props or query
  const isInWishlist =
    propIsInWishlist !== undefined
      ? propIsInWishlist
      : wishlistData?.items.some((item) => item.product.id === product.id);

  const isGrid = viewMode === "grid";
  const cardWidth = isGrid
    ? (width - SPACING.m * 3) / 2
    : width - SPACING.m * 2;

  const handleAddToCart = async (e: any) => {
    e.stopPropagation();
    try {
      console.log("Adding to cart:", product.title);
      await addToCart({ product, quantity: 1 }).unwrap();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const handleTryAtHome = async (e: any) => {
    e.stopPropagation();
    console.log("Try at home clicked for:", product.title);

    try {
      await addToTrial(product).unwrap();
      console.log("Successfully added to trial");

      Alert.alert(
        "Added to Trial List",
        `${product.title} has been added to your home trial list.`,
        [
          {
            text: "Continue Shopping",
            style: "cancel",
            onPress: () => console.log("Continue shopping pressed"),
          },
          {
            text: "View Trial List",
            onPress: () => {
              console.log("Navigating to trial tab");
              router.push("/cart?tab=trial");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Failed to add to trial:", error);

      if (error?.data === "Item already in trial list") {
        Alert.alert(
          "Already in Trial",
          "This item is already in your trial list.",
          [
            { text: "OK", style: "cancel" },
            {
              text: "View Trial List",
              onPress: () => router.push("/cart?tab=trial"),
            },
          ]
        );
      } else {
        Alert.alert("Error", "Failed to add item to trial. Please try again.");
      }
    }
  };

  const handleToggleWishlist = async (e: any) => {
    e.stopPropagation();

    if (isInWishlist) {
      // If we have a custom remove handler (from wishlist screen), use it
      if (onRemoveFromWishlist) {
        onRemoveFromWishlist();
      } else {
        // Otherwise use the mutation directly
        try {
          await removeFromWishlist(product.id).unwrap();
        } catch (error) {
          Alert.alert("Error", "Failed to remove from wishlist");
        }
      }
    } else {
      try {
        await addToWishlist(product).unwrap();
      } catch (error: any) {
        if (error?.data === "Item already in wishlist") {
          Alert.alert(
            "Already in Wishlist",
            "This item is already wishlisted."
          );
        } else {
          Alert.alert("Error", "Failed to add to wishlist");
        }
      }
    }
  };

  const handleCompareToggle = (e: any) => {
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare();
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={10}
            color={COLORS.textSecondary}
          />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => onPress(product)}
      activeOpacity={0.9}
    >
      {/* Image Section */}
      <View style={[styles.imageWrapper, !isGrid && styles.listImageWrapper]}>
        <Image
          source={{ uri: product.thumbnailUrls[0] }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* New Badge */}
        {product.isNew && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>New</Text>
          </View>
        )}

        {/* Favorite Icon */}
        <TouchableOpacity
          style={styles.favIcon}
          onPress={handleToggleWishlist}
          disabled={isAddingToWishlist || isRemovingFromWishlist}
        >
          {isAddingToWishlist || isRemovingFromWishlist ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons
              name={isInWishlist ? "heart" : "heart-outline"}
              size={20}
              color={isInWishlist ? COLORS.primary : COLORS.text}
            />
          )}
        </TouchableOpacity>

        {/* Compare Checkbox - Only show in wishlist */}
        {onToggleCompare && (
          <TouchableOpacity
            style={styles.compareCheckbox}
            onPress={handleCompareToggle}
          >
            <View
              style={[styles.checkbox, isInCompare && styles.checkboxActive]}
            >
              {isInCompare && (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        )}

        {/* Delivery Tag */}
        {/* <View style={styles.deliveryTag}>
          <Ionicons name="cube-outline" size={12} color={COLORS.text} />
          <Text style={styles.deliveryText}>{getEstimatedDeliveryDate()}</Text>
        </View> */}
      </View>

      {/* Details Section */}
      <View style={styles.details}>
        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={styles.discountPrice}>
            ₹{product.discountedPrice.toLocaleString()}
          </Text>
          {product.givenPrice && (
            <Text style={styles.originalPrice}>
              ₹{product.givenPrice.toLocaleString()}
            </Text>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>

        {/* Brand & Rating */}
        <View style={styles.metaRow}>
          <Text style={styles.brandText}>{product.brand}</Text>
          {product.rating && renderStars(product.rating as number)}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.tryNowBtn}
            onPress={(e) => {
              e.stopPropagation();
              onPress(product);
            }}
          >
            <Ionicons
              name="sparkles-outline"
              size={14}
              color={COLORS.primary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.tryNowText}>Try Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addToBagBtn,
              isAddingToCart && styles.addToBagBtnDisabled,
            ]}
            onPress={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : showSuccess ? (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            ) : (
              <Text style={styles.addToBagText}>Add to Bag</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addToBagBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 4,
  },
  addToBagBtnDisabled: {
    opacity: 0.6,
  },
  addToBagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    borderRadius: 8,
    overflow: "hidden",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#FAFAFA",
    position: "relative",
  },
  listImageWrapper: {
    aspectRatio: 1.5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.text,
  },
  favIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  compareCheckbox: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.text,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  deliveryTag: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  deliveryText: {
    fontSize: 10,
    marginLeft: 4,
    fontWeight: "500",
  },
  details: {
    padding: SPACING.s,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.m,
  },
  brandText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  starContainer: {
    flexDirection: "row",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  tryNowBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  tryNowText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
