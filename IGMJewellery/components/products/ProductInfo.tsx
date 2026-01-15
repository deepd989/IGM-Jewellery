import { Product } from "@/interfaces/product.interface";
import { useAddToCartMutation, useAddToTrialMutation } from "@/store/apis/cart";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { getEstimatedDeliveryDate } from "../../utils/deliveryDate";

interface ProductInfoProps {
  product: Product;
  onCustomize?: () => void;
}

const SPEC_CHIPS = [
  "14 KT",
  "Yellow Gold",
  "0.00 g",
  "0.880 g",
  "0.024 C",
  "FG SI",
];

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onCustomize,
}) => {
  const router = useRouter();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToTrial, { isLoading: isAddingToTrial }] = useAddToTrialMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    try {
      console.log("Adding to cart:", product.title);
      await addToCart({ product, quantity: 1 }).unwrap();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Add to cart error:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart({ product, quantity: 1 }).unwrap();
      router.push("/cart");
    } catch (error) {
      Alert.alert("Error", "Failed to proceed to checkout");
    }
  };

  const handleTryAtHome = async () => {
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
            onPress: () => console.log("Continue shopping"),
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

      // Check if item already in trial
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

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.brand}>{product.brand}</Text>
        </View>
        <View style={styles.priceCol}>
          <Text style={styles.discountPrice}>
            ₹{product.discountedPrice.toLocaleString()}
          </Text>
          {product.givenPrice && (
            <Text style={styles.originalPrice}>
              ₹{product.givenPrice.toLocaleString()}
            </Text>
          )}
          <Text style={styles.taxText}>(tax inclusive)</Text>
        </View>
      </View>

      <View style={styles.expressTag}>
        <Ionicons name="cube-outline" size={14} color={COLORS.text} />
        <Text style={styles.expressText}>
          Delivery by {getEstimatedDeliveryDate()}
        </Text>
      </View>

      {/* Spec Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
      >
        {SPEC_CHIPS.map((chip, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </View>
        ))}
        {/* Size Dropdown Mimic */}
        <TouchableOpacity style={styles.sizeChip}>
          <Text style={styles.sizeText}>Size 12</Text>
          <Ionicons
            name="chevron-down"
            size={14}
            color={COLORS.text}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Action Buttons Row 1 */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Try On</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onCustomize}>
          <Ionicons
            name="sparkles"
            size={14}
            color={COLORS.text}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.actionBtnText}>Customize</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Action Buttons */}
      <View style={styles.cartActionsContainer}>
        {/* Try at Home Button */}
        <TouchableOpacity
          style={styles.tryHomeFullBtn}
          onPress={handleTryAtHome}
          disabled={isAddingToTrial}
        >
          <Ionicons name="home-outline" size={18} color={COLORS.primary} />
          <Text style={styles.tryHomeFullText}>Try at Home</Text>
          {isAddingToTrial && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{ marginLeft: 8 }}
            />
          )}
        </TouchableOpacity>

        {/* Add to Cart & Buy Now */}
        <View style={styles.purchaseRow}>
          <TouchableOpacity
            style={[
              styles.addToCartBtn,
              showSuccess && styles.addToCartBtnSuccess,
            ]}
            onPress={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : showSuccess ? (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                <Text style={styles.addToCartText}>Added!</Text>
              </>
            ) : (
              <>
                <Ionicons name="bag-add-outline" size={18} color="#FFFFFF" />
                <Text style={styles.addToCartText}>ADD TO CART</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buyNowBtn}
            onPress={handleBuyNow}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buyNowText}>BUY NOW</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.s,
  },
  titleCol: {
    flex: 1,
    marginRight: SPACING.m,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  brand: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  priceCol: {
    alignItems: "flex-end",
  },
  discountPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: 13,
    textDecorationLine: "line-through",
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  taxText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  expressTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: SPACING.m,
  },
  expressText: {
    fontSize: 11,
    color: COLORS.text,
    marginLeft: 6,
    fontWeight: "500",
  },
  chipScroll: {
    flexDirection: "row",
    marginBottom: SPACING.m,
  },
  chip: {
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  chipText: {
    fontSize: 12,
    color: COLORS.text,
  },
  sizeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.text,
  },
  sizeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: SPACING.m,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginRight: 4,
  },

  // Cart Actions
  cartActionsContainer: {
    marginTop: SPACING.s,
  },
  tryHomeFullBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginBottom: SPACING.s,
    gap: 8,
  },
  tryHomeFullText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  purchaseRow: {
    flexDirection: "row",
    gap: 12,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    gap: 6,
  },
  addToCartBtnSuccess: {
    backgroundColor: "#4CAF50",
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  buyNowBtn: {
    flex: 1,
    height: 50,
    backgroundColor: "#000000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buyNowText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
