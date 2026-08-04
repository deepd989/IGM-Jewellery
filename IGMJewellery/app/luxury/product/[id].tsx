import { HapticButton } from "@/components/basic components/hapticButton";
import { CustomizationModal } from "@/components/products/CustomizationModal";
import { TryOnSelectorModal } from "@/components/products/TryOnSelectorModal";
import { LUXURY_COLORS } from "@/constants/theme";
import { useCartStatus } from "@/hooks/useCartStatus";
import { useAddToCartMutation } from "@/store/apis/cart";
import { useGetProductByIdQuery } from "@/store/apis/product";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/auth/authContext";
import { useGetImage } from "../../customHooks/tryOnImageLoader";
import LuxurySeparator from "../components/luxurySeparator";
import LuxuryBrandStory from "./components/luxuryBrandStory";
import LuxuryCallButton from "./components/luxuryCallButton";
import LuxuryCustomerReviews from "./components/luxuryCustomerReviews";
import LuxuryDeliveryDetails from "./components/luxuryDeliveryDetails";
import LuxuryDiscounts from "./components/luxuryDiscounts";
import LuxuryKnowYourProduct from "./components/luxuryKnowYourProduct";
import LuxurySeenOnYou from "./components/luxurySeenOnYou";
import LuxuryYouMayLike from "./components/luxuryYouMayLike";
import LuxuryProductHero from "./components/luxuryProductHero";
import LuxuryProductInfo from "./components/luxuryProductInfo";
import LuxuryStickyActionBar, {
  LUXURY_ACTION_BAR_HEIGHT,
} from "./components/luxuryStickyActionBar";

/**
 * The same ground the storefront sits on (app/luxury/index.tsx), so the product
 * screen carries on from the page the shopper arrived from. Everything set
 * directly on it reads in LUXURY_COLORS' light ink rather than the dark teal
 * the sheet called for while it was white.
 */
const PAGE_BACKGROUND = LUXURY_COLORS.primary;

/**
 * The luxury storefront's product screen. Same data and cart/try-on behaviour
 * as app/product/[id].tsx, presented as a full-bleed gallery with the details
 * on a sheet beneath it.
 */
export default function LuxuryProductDetailScreen() {
  const { id: productId, fromTryOn } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();

  const [isCustomizeVisible, setIsCustomizeVisible] = useState(false);
  const [isTryOnSelectorVisible, setIsTryOnSelectorVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const { isInCart, goToCart } = useCartStatus(productId as string);
  const { base64String: tryOnImage } = useGetImage(`${productId}_${userId}`);

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId as string);

  /** The shopper's own try-on shot leads the gallery when they arrived from it. */
  const getImageUrls = () => {
    if (!product) return [];
    if (fromTryOn === "true" && tryOnImage) {
      return [tryOnImage, ...(product.thumbnailUrls || [])];
    }
    if (tryOnImage) {
      return [
        product.thumbnailUrls[0],
        tryOnImage,
        ...(product.thumbnailUrls.slice(1) || []),
      ];
    }
    return product.thumbnailUrls || [];
  };

  /** Adds the piece, or opens the bag once it is already in there. */
  const handleBagPress = async () => {
    if (!product) return;

    if (isInCart) {
      goToCart();
      return;
    }

    try {
      await addToCart({ product, quantity: 1 }).unwrap();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Add to cart error:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={LUXURY_COLORS.accent} />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.container}>
        <View style={[styles.errorHeader, { paddingTop: insets.top + 8 }]}>
          <HapticButton onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color={LUXURY_COLORS.text} />
          </HapticButton>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* The gallery runs under the status bar, so its glyphs go light. */}
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              LUXURY_ACTION_BAR_HEIGHT + Math.max(insets.bottom, 12) + 24,
          },
        ]}
      >
        <LuxuryProductHero product={product} images={getImageUrls()} />

        <LuxuryProductInfo
          product={product}
          onSelectSize={() => setIsCustomizeVisible(true)}
        />

        <LuxurySeparator />

        {/* Buttons in this section are presentational for now, as asked. */}
        <LuxuryDeliveryDetails />

        <LuxurySeparator />

        {/* <LuxuryDiscounts imageUri={product.thumbnailUrls?.[0]} /> */}

        {/* The section opens on a white cap, so the gap above it reads as one
            surface with the dark offers rail behind. */}
        <LuxurySeparator />

        <LuxuryKnowYourProduct
          product={product}
          imageUri={product.thumbnailUrls?.[0]}
        />

        <LuxurySeparator />
        <LuxuryYouMayLike product={product} />

        <LuxuryBrandStory
          product={product}
          imageUri={product.thumbnailUrls?.[0]}
        />

        <LuxurySeparator />

        <LuxurySeenOnYou product={product} />

        <LuxurySeparator />

        <LuxuryCustomerReviews product={product} />
      </ScrollView>

      <LuxuryCallButton
        style={[
          styles.callButton,
          { bottom: LUXURY_ACTION_BAR_HEIGHT + Math.max(insets.bottom, 12) + 16 },
        ]}
      />

      <LuxuryStickyActionBar
        onTryNow={() => setIsTryOnSelectorVisible(true)}
        onAddToBag={handleBagPress}
        isAddingToBag={isAddingToCart}
        showSuccess={showSuccess}
        isInBag={isInCart}
      />

      <CustomizationModal
        visible={isCustomizeVisible}
        onClose={() => setIsCustomizeVisible(false)}
        product={product}
      />

      <TryOnSelectorModal
        visible={isTryOnSelectorVisible}
        onClose={() => setIsTryOnSelectorVisible(false)}
        onSelectVR={() => {
          router.navigate({
            pathname: "/virtualTryOn2",
            params: {
              productId: product.id,
              productTitle: product.title,
              tryOnUrl: (product as any).vrTryOnUrl || "",
            },
          });
        }}
        onSelectAI={() => {
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
    flex: 1,
    backgroundColor: PAGE_BACKGROUND,
  },
  scrollContent: {
    backgroundColor: PAGE_BACKGROUND,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "600",
    color: LUXURY_COLORS.text,
  },
  callButton: {
    position: "absolute",
    right: 16,
  },
});
