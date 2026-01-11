import { Product } from "@/interfaces/product.interface";
import { useAddToCartMutation, useAddToTrialMutation } from "@/store/apis/cart";
import { Ionicons } from "@expo/vector-icons";
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
}

const { width } = Dimensions.get("window");

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  onPress,
}) => {
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToTrial, { isLoading: isAddingToTrial }] = useAddToTrialMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  const isGrid = viewMode === "grid";
  const cardWidth = isGrid
    ? (width - SPACING.m * 3) / 2
    : width - SPACING.m * 2;

  const handleAddToCart = async (e: any) => {
    e.stopPropagation();
    try {
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
    try {
      await addToTrial(product).unwrap();
      Alert.alert(
        "Added to Trial",
        `${product.title} has been added to your home trial list.`,
        [
          { text: "Continue Shopping", style: "cancel" },
          {
            text: "View Trial List",
            onPress: () => {
              // Navigate to cart with trial tab active
              // You'll need to import useRouter
              // router.push('/cart?tab=trial');
            },
          },
        ]
      );
    } catch (error) {
      console.error("Failed to add to trial:", error);
      Alert.alert("Error", "Failed to add item to trial");
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
        <TouchableOpacity style={styles.favIcon}>
          <Ionicons name="heart-outline" size={20} color={COLORS.text} />
        </TouchableOpacity>

        {/* Add to Cart Icon */}
        <TouchableOpacity
          style={[styles.cartIcon, showSuccess && styles.cartIconSuccess]}
          onPress={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : showSuccess ? (
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          ) : (
            <Ionicons name="bag-add-outline" size={18} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {/* Delivery Tag */}
        <View style={styles.deliveryTag}>
          <Ionicons name="bus-outline" size={12} color={COLORS.text} />
          <Text style={styles.deliveryText}>19th Nov</Text>
        </View>
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
            onPress={() => onPress(product)}
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
              styles.tryHomeBtn,
              isAddingToTrial && styles.tryHomeBtnDisabled,
            ]}
            onPress={handleTryAtHome}
            disabled={isAddingToTrial}
          >
            {isAddingToTrial ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.tryHomeText}>Try at home</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 4,
  },
  cartIcon: {
    position: "absolute",
    top: 48,
    right: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cartIconSuccess: {
    backgroundColor: "#4CAF50",
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
  tryHomeBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 4,
  },
  tryHomeBtnDisabled: {
    opacity: 0.6,
  },
  tryHomeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
