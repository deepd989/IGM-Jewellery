import { CustomizationModal } from "@/components/products/CustomizationModal";
import { DeliveryCheck } from "@/components/products/DeliveryCheck";
import { ProductAccordion } from "@/components/products/ProductAccordion";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ReviewSection } from "@/components/products/ReviewSection";

import { CartBadge } from "@/components/cart/CardBadge";
import { useGetProductByIdQuery } from "@/store/apis/product";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, SPACING } from "../../constants/theme";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isCustomizeVisible, setIsCustomizeVisible] = useState(false);

  // Fetch product from Redux API
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(id as string);

  // Loading state
  if (isLoading) {
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
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading product details...</Text>
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
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={COLORS.error}
          />
          <Text style={styles.errorText}>Product not found</Text>
          <Text style={styles.errorSubtext}>
            {error?.toString() ||
              "The product you are looking for does not exist."}
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
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
          <TouchableOpacity style={styles.iconWrapper}>
            <Ionicons name="search-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconWrapper}>
            <Ionicons name="heart-outline" size={22} color={COLORS.text} />
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
        {/* Gallery */}
        <ProductImageGallery images={product.thumbnailUrls} />

        {/* Info & Specs */}
        <View style={styles.infoWrapper}>
          <ProductInfo
            product={product}
            onCustomize={() => setIsCustomizeVisible(true)}
          />
        </View>

        {/* Delivery & Highlights */}
        <DeliveryCheck />

        {/* Accordion */}
        <ProductAccordion product={product} />

        {/* Reviews */}
        <ReviewSection product={product} />
      </ScrollView>

      {/* Customization Bottom Sheet Modal */}
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
    paddingTop: Platform.OS === "android" ? 30 : 0,
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
  backBtn: {
    padding: 4,
  },
  headerRight: {
    flexDirection: "row",
  },
  iconBtn: {
    marginLeft: SPACING.m,
    padding: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.l,
  },
  loadingText: {
    marginTop: SPACING.m,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    marginTop: SPACING.m,
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  errorSubtext: {
    marginTop: SPACING.s,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: SPACING.l,
  },
  backButton: {
    marginTop: SPACING.l,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  infoWrapper: {
    backgroundColor: "#FFF",
  },

  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
