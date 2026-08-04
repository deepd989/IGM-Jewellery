import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SPACING } from "../constants/theme";

import { TrialTabContent } from "@/components/trial/TrailTabContent";
import { useCartScreen } from "@/hooks/useCartScreen";
import { HapticButton } from "../components/basic components/hapticButton";
import { BagTabContent } from "../components/cart/BagTabContent";
import { RemoveConfirmationModal } from "../components/cart/RemoveConfirmationModal";
import { useLuxury } from "../context/luxuryContext";
import LuxuryCartScreen from "./luxury/cart";

/**
 * Both storefronts share this route, so every existing link to /cart lands on
 * the presentation the shopper is currently browsing in. The luxury screen also
 * keeps its own route for direct links.
 */
export default function CartScreen() {
  const { isLuxury } = useLuxury();

  return isLuxury ? <LuxuryCartScreen /> : <ClassicCartScreen />;
}

function ClassicCartScreen() {
  const router = useRouter();

  // Everything that is not presentation lives in the hook, so this screen and
  // the luxury one can never drift in what checkout or the tabs do.
  const {
    isBag,
    setActiveTab,
    removingItem,
    setRemovingItem,
    cart,
    trialList,
    giftAddons,
    freebie,
    isLoading,
    isInitializingCheckout,
    handleUpdateQuantity,
    handleToggleGiftAddon,
    calculateTotals,
    footerTotal,
    handleRemove,
    handleMoveToWishlist,
    handleCheckout,
    handleScheduleTrial,
  } = useCartScreen();

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <HapticButton onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </HapticButton>
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
          <HapticButton onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </HapticButton>
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
          <HapticButton
            style={styles.browseButton}
            onPress={() => router.navigate("/product-list")}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </HapticButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </HapticButton>
        <Text style={styles.headerTitle}>
          {isBag ? "Shopping Bag" : "Home Trial"}
        </Text>
        <View></View>
        <HapticButton>
          <Ionicons name="heart-outline" size={24} color={COLORS.text} />
        </HapticButton>
      </View>

      <View style={styles.tabs}>
        {/* 
        Trial bag is set off
         */}
        <HapticButton style={[styles.tab]} onPress={() => setActiveTab("bag")}>
          <Text style={[styles.tabText, isBag && styles.activeTabText]}>
            Shopping Bag {cart.length > 0 && `(${cart.length})`}
          </Text>
          {isBag && <View style={styles.activeDiamond} />}
        </HapticButton>
        {/* Home Trial tab hidden for now
        <HapticButton
          style={[styles.tab]}
          onPress={() => setActiveTab("trial")}
        >
          <Text style={[styles.tabText, !isBag && styles.activeTabText]}>
            Home trial ({trialList.length})
          </Text>
          {!isBag && <View style={styles.activeDiamond} />}
        </HapticButton>
        */}
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
            <HapticButton
              style={styles.browseButton}
              onPress={() => router.navigate("/product-list")}
            >
              <Text style={styles.browseButtonText}>Browse Products</Text>
            </HapticButton>
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
          <HapticButton
            style={styles.browseButton}
            onPress={() => router.navigate("/product-list")}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </HapticButton>
        </View>
      )}

      {((isBag && cart.length > 0) || (!isBag && trialList.length > 0)) && (
        <View style={styles.stickyFooter}>
          <View style={styles.footerInfo}>
            {isBag ? (
              <>
                <Text style={styles.footerPrice}>
                  ₹{footerTotal().toLocaleString()}
                </Text>
                <Text style={styles.footerLink}>View details</Text>
              </>
            ) : (
              <HapticButton
                style={styles.browseBtn}
                onPress={() => router.navigate("/product-list")}
              >
                <Text style={styles.browseText}>Browse trial designs</Text>
              </HapticButton>
            )}
          </View>
          <HapticButton
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
          </HapticButton>
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
    color: COLORS.text,
  },
  footerLink: {
    fontSize: 11,
    color: "#053844",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  browseBtn: {
    paddingVertical: 8,
  },
  browseText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#053844",
  },
  mainBtn: {
    backgroundColor: "#053844",
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
