import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SPACING } from "../constants/theme";

import { TrialTabContent } from "@/components/trial/TrailTabContent";
import { Product } from "@/interfaces/product.interface";
import {
  useGetCartQuery,
  useMoveToWishlistMutation,
  useRemoveFromCartMutation,
  useRemoveFromTrialMutation,
  useToggleGiftAddonMutation,
  useUpdateQuantityMutation,
} from "@/store/apis/cart";
import { useInitializeCheckoutMutation } from "@/store/apis/checkout";
import { BagTabContent } from "../components/cart/BagTabContent";
import { RemoveConfirmationModal } from "../components/cart/RemoveConfirmationModal";

export default function CartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Check if tab param is passed from navigation
  const initialTab = params.tab === "trial" ? "trial" : "bag";
  const [activeTab, setActiveTab] = useState<"bag" | "trial">(initialTab);
  const [removingItem, setRemovingItem] = useState<Product | null>(null);

  // Fetch cart data from Redux
  const { data: cartData, isLoading } = useGetCartQuery();

  // Mutations
  const [updateQuantity] = useUpdateQuantityMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [removeFromTrial] = useRemoveFromTrialMutation();
  const [toggleGiftAddon] = useToggleGiftAddonMutation();
  const [moveToWishlist] = useMoveToWishlistMutation();
  const [initializeCheckout, { isLoading: isInitializingCheckout }] =
    useInitializeCheckoutMutation();

  const cart = cartData?.items || [];
  const trialList = cartData?.trialItems || [];
  const giftAddons = cartData?.giftAddons || [];
  const freebie = cartData?.freebie || null;

  // Update tab based on URL params
  useEffect(() => {
    if (params.tab === "trial") {
      setActiveTab("trial");
    }
  }, [params.tab]);

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = cart.find((i) => i.product.id === id);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity < 1) {
        setRemovingItem(item.product);
        return;
      }
      updateQuantity({
        productId: id,
        quantity: newQuantity,
      });
    }
  };

  const handleToggleGiftAddon = (id: string) => {
    toggleGiftAddon(id);
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.product.discountedPrice * item.quantity,
      0
    );
    const savings = cart.reduce(
      (acc, item) =>
        acc +
        (item.product.givenPrice! - item.product.discountedPrice) *
          item.quantity,
      0
    );
    const addons = giftAddons.reduce(
      (acc, item) => (item.isChecked ? acc + item.price : acc),
      0
    );
    return { subtotal, savings, addons };
  };

  const handleRemove = () => {
    if (removingItem) {
      if (activeTab === "bag") {
        removeFromCart(removingItem.id);
      } else {
        removeFromTrial(removingItem.id);
      }
      setRemovingItem(null);
    }
  };

  const handleMoveToWishlist = () => {
    if (removingItem) {
      moveToWishlist(removingItem.id);
      setRemovingItem(null);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert(
        "Empty Cart",
        "Please add items to your cart before checkout"
      );
      return;
    }

    try {
      await initializeCheckout().unwrap();
      router.push("/checkout/address");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.data || "Failed to start checkout. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleScheduleTrial = () => {
    if (trialList.length === 0) {
      Alert.alert("No Items", "Please add items to trial list");
      return;
    }

    // Check if user has more than 5 items or items from multiple brands
    if (trialList.length > 5) {
      console.log("Trial list exceeds maximum limit:", trialList.length);
      Alert.alert(
        "Maximum Limit Exceeded",
        "You can select maximum 5 items for home trial"
      );
      return;
    }

    // Check if all items are from the same brand
    const brands = new Set(trialList.map((item) => item.product.brand));
    if (brands.size > 1) {
      console.log("Trial list exceeds maximum limit:", trialList.length);
      Alert.alert(
        "Multiple Brands",
        "Home trial is available for items from 1 brand only. Please select items from the same brand."
      );
      return;
    }

    router.push("/trial/schedule");
  };

  const isBag = activeTab === "bag";

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
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Empty cart state
  if (cart.length === 0 && trialList.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <Ionicons
            name="cart-outline"
            size={80}
            color={COLORS.textSecondary}
          />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add items to your cart to see them here
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/product-list")}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isBag ? "Shopping Bag" : "Home Trial"}
        </Text>
        <View></View>
        {/* <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color={COLORS.text} />
        </TouchableOpacity> */}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab]}
          onPress={() => setActiveTab("bag")}
        >
          <Text style={[styles.tabText, isBag && styles.activeTabText]}>
            Shopping Bag {cart.length > 0 && `(${cart.length})`}
          </Text>
          {isBag && <View style={styles.activeDiamond} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab]}
          onPress={() => setActiveTab("trial")}
        >
          <Text style={[styles.tabText, !isBag && styles.activeTabText]}>
            Home trial ({trialList.length})
          </Text>
          {!isBag && <View style={styles.activeDiamond} />}
        </TouchableOpacity>
      </View>

      {isBag ? (
        cart.length > 0 ? (
          <BagTabContent
            cart={cart}
            updateQuantity={handleUpdateQuantity}
            onRemove={setRemovingItem}
            giftAddons={giftAddons}
            toggleGiftAddon={handleToggleGiftAddon}
            calculateTotals={calculateTotals}
            freebie={freebie}
          />
        ) : (
          <View style={styles.emptyTabContent}>
            <Ionicons
              name="bag-outline"
              size={64}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyTabText}>Your shopping bag is empty</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push("/product-list")}
            >
              <Text style={styles.browseButtonText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        )
      ) : trialList.length > 0 ? (
        <TrialTabContent trialList={trialList} onRemove={setRemovingItem} />
      ) : (
        <View style={styles.emptyTabContent}>
          <Ionicons
            name="home-outline"
            size={64}
            color={COLORS.textSecondary}
          />
          <Text style={styles.emptyTabText}>No trial items</Text>
          <Text style={styles.emptyTabSubtext}>
            Add items to your home trial list from product pages
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/product-list")}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      )}

      {((isBag && cart.length > 0) || (!isBag && trialList.length > 0)) && (
        <View style={styles.stickyFooter}>
          <View style={styles.footerInfo}>
            {isBag ? (
              <>
                <Text style={styles.footerPrice}>
                  ₹
                  {(
                    calculateTotals().subtotal +
                    calculateTotals().addons +
                    220
                  ).toLocaleString()}
                </Text>
                <Text style={styles.footerLink}>View details</Text>
              </>
            ) : (
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => router.push("/product-list")}
              >
                <Text style={styles.browseText}>Browse trial designs</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.mainBtn,
              isInitializingCheckout && styles.mainBtnDisabled,
            ]}
            onPress={isBag ? handleCheckout : handleScheduleTrial}
            disabled={isInitializingCheckout}
          >
            {isInitializingCheckout ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.mainBtnText}>
                {isBag ? "CHECKOUT" : "Schedule trial"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <RemoveConfirmationModal
        visible={!!removingItem}
        product={removingItem}
        onClose={() => setRemovingItem(null)}
        onRemove={handleRemove}
        onWishlist={handleMoveToWishlist}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.m,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyTitle: {
    marginTop: SPACING.l,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  emptySubtitle: {
    marginTop: SPACING.s,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  browseButton: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyTabContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  emptyTabText: {
    marginTop: SPACING.m,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  emptyTabSubtext: {
    marginTop: SPACING.s,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: SPACING.l,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    position: "relative",
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.text,
    fontWeight: "700",
  },
  activeDiamond: {
    position: "absolute",
    bottom: -3,
    width: 6,
    height: 6,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: COLORS.text,
    transform: [{ rotate: "45deg" }],
  },
  stickyFooter: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  footerInfo: {
    flex: 1,
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: "800",
  },
  footerLink: {
    fontSize: 11,
    color: "#000",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  browseBtn: {
    paddingVertical: 8,
  },
  browseText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  mainBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 4,
    minWidth: 140,
    alignItems: "center",
  },
  mainBtnDisabled: {
    opacity: 0.6,
  },
  mainBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 1,
  },
});
