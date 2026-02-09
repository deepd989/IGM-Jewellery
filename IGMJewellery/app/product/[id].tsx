import { CustomizationModal } from "@/components/products/CustomizationModal";
import { DeliveryCheck } from "@/components/products/DeliveryCheck";
import { ProductAccordion } from "@/components/products/ProductAccordion";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ReviewSection } from "@/components/products/ReviewSection";

import { CartBadge } from "@/components/cart/CardBadge";
import { useGetProductByIdQuery } from "@/store/apis/product";
import { useGetWishlistQuery } from "@/store/apis/wishlist";
// Import Cart Mutations
import { useAddToCartMutation, useAddToTrialMutation } from "@/store/apis/cart";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../auth/authContext";
import { COLORS, SPACING } from "../../constants/theme";
import { generateJewelleryImage } from "../../helpers/generateJewelleryImage";
import { Product } from "../../interfaces/product.interface";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isCustomizeVisible, setIsCustomizeVisible] = useState(false);
  const { userObject, apiUrl, imageGlobal, phoneNumber } = useAuth();
  const [firstImageBase64State, setFirstImageBase64State] = useState("");

  // Cart & Trial Logic
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToTrial, { isLoading: isAddingToTrial }] = useAddToTrialMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch product from Redux API
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(id as string);

  useEffect(() => {
    generateJewelleryImage(
      apiUrl,
      phoneNumber as string,
      product as Product,
      "casual wear",
      "black",
      setFirstImageBase64State
    );
  }, [product]);

  useEffect(() => {
    console.log("First image base64 updated.", firstImageBase64State);
  }, [firstImageBase64State]);

  // Get wishlist data for header heart icon
  const { data: wishlistData } = useGetWishlistQuery();
  const wishlistCount = wishlistData?.items.length || 0;

  const handleAddToCart = async () => {
    if (!product) return;
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

  const handleTryAtHome = async () => {
    if (!product) return;
    console.log("Try at home clicked for:", product.title);

    try {
      await addToTrial(product).unwrap();
      Alert.alert(
        "Added to Trial List",
        `${product.title} has been added to your home trial list.`,
        [
          {
            text: "Continue Shopping",
            style: "cancel",
          },
          {
            text: "View Trial List",
            onPress: () => router.push("/cart?tab=trial"),
          },
        ]
      );
    } catch (error: any) {
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
        Alert.alert("Error", "Failed to add item to trial.");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => router.push("/searchPage")}
          >
            <Ionicons name="search-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => router.push("/wishlist")}
          >
            <Ionicons
              name={wishlistCount > 0 ? "heart" : "heart-outline"}
              size={22}
              color={wishlistCount > 0 ? COLORS.primary : COLORS.text}
            />
            {wishlistCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{wishlistCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => router.push("/cart")}
          >
            <CartBadge iconSize={22} iconColor={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProductImageGallery
          images={[...product.thumbnailUrls, firstImageBase64State]}
          product={product}
        />

        <View style={styles.infoWrapper}>
          <ProductInfo
            product={product}
            onCustomize={() => setIsCustomizeVisible(true)}
          />
        </View>

        <DeliveryCheck />
        <ProductAccordion product={product} />
        <ReviewSection product={product} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.stickyTryBtn}
          onPress={handleTryAtHome}
          disabled={isAddingToTrial}
        >
          {isAddingToTrial ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              <Ionicons name="home-outline" size={18} color={COLORS.primary} />
              <Text style={styles.stickyTryText}>Try at Home</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.stickyAddBtn,
            showSuccess && styles.stickyAddBtnSuccess,
          ]}
          onPress={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : showSuccess ? (
            <>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.stickyAddText}>Added!</Text>
            </>
          ) : (
            <>
              <Ionicons name="bag-add-outline" size={18} color="#FFFFFF" />
              <Text style={styles.stickyAddText}>Add to Cart</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <CustomizationModal
        visible={isCustomizeVisible}
        onClose={() => setIsCustomizeVisible(false)}
        product={product}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  backBtn: { padding: 4 },
  headerRight: { flexDirection: "row" },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.l,
  },
  errorText: {
    marginTop: SPACING.m,
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding to prevent footer overlap
  },
  infoWrapper: { backgroundColor: "#FFF" },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  // Sticky Footer Styles
  stickyFooter: {
    flexDirection: "row",
    padding: SPACING.m,
    paddingBottom: Platform.OS === "ios" ? 0 : SPACING.m, // SafeAreaView handles iOS bottom
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  stickyTryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    gap: 8,
  },
  stickyTryText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  stickyAddBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    gap: 8,
  },
  stickyAddBtnSuccess: {
    backgroundColor: "#4CAF50",
  },
  stickyAddText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
