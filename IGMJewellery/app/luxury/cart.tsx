import { HapticButton } from "@/components/basic components/hapticButton";
import { BagTabContent } from "@/components/cart/BagTabContent";
import { RemoveConfirmationModal } from "@/components/cart/RemoveConfirmationModal";
import { TrialTabContent } from "@/components/trial/TrailTabContent";
import { useCartScreen } from "@/hooks/useCartScreen";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LuxuryScreenHeader from "./components/luxuryScreenHeader";
import LuxuryWishlistButton from "./components/luxuryWishlistButton";

const SIDE_PADDING = 16;

/** Backdrop behind the sheet, blurred so the type over it stays legible. */
const BACKDROP_BLUR = 22;

/** The gold the storefront gives its primary calls to action. */
const GOLD = "#D8C391";

/**
 * The luxury storefront's cart. Same data, tabs and checkout as app/cart.tsx —
 * both render from useCartScreen — presented the way the luxury listing is:
 * the bag's own artwork blurred behind a dark ground, with the bag itself on a
 * light sheet raised off it.
 */
export default function LuxuryCartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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

  /** The first piece in the bag stands in for the listing's category banner. */
  const backdropUri = cart[0]?.product?.thumbnailUrls?.[0];

  const showFooter =
    (isBag && cart.length > 0) || (!isBag && trialList.length > 0);

  const renderChrome = (children: React.ReactNode) => (
    <View style={styles.container}>
      {!!backdropUri && (
        <Image
          source={{ uri: backdropUri }}
          style={styles.backdrop}
          resizeMode="cover"
          blurRadius={BACKDROP_BLUR}
        />
      )}
      <View style={styles.backdropScrim} pointerEvents="none" />

      <LuxuryScreenHeader
        title={isBag ? "Shopping Bag" : "Home Trial"}
        showBack
        variant="glass"
        right={<LuxuryWishlistButton size={24} color="#FFFFFF" />}
      />

      {children}
    </View>
  );

  if (isLoading) {
    return renderChrome(
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.stateText}>Loading cart…</Text>
      </View>
    );
  }

  if (cart.length === 0 && trialList.length === 0) {
    return renderChrome(
      <View style={styles.centerContent}>
        <Ionicons name="bag-outline" size={56} color="#FFFFFF" />
        <Text style={styles.stateText}>Your bag is empty</Text>
        <Text style={styles.stateSubtext}>
          Add pieces to your bag to see them here
        </Text>
        <HapticButton
          style={styles.stateButton}
          onPress={() => router.navigate("/product-list")}
        >
          <Text style={styles.stateButtonText}>Browse Products</Text>
        </HapticButton>
      </View>
    );
  }

  return renderChrome(
    <>
      <View style={styles.tabs}>
        {/* Home Trial is off, as on the classic cart; the row is kept so the
            two screens stay one change apart when it comes back. */}
        <HapticButton style={styles.tab} onPress={() => setActiveTab("bag")}>
          <Text style={[styles.tabText, isBag && styles.activeTabText]}>
            Shopping Bag {cart.length > 0 && `(${cart.length})`}
          </Text>
          {isBag && <View style={styles.activeDiamond} />}
        </HapticButton>
      </View>

      {/* The bag's own rows are the light surface the luxury cards are: a
          sheet raised off the dark ground rather than a page of its own. */}
      <View style={styles.sheet}>
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
            <View style={styles.emptyTab}>
              <Ionicons name="bag-outline" size={56} color="#8FA1A8" />
              <Text style={styles.emptyTabText}>Your shopping bag is empty</Text>
            </View>
          )
        ) : trialList.length > 0 ? (
          <TrialTabContent trialList={trialList} onRemove={setRemovingItem} />
        ) : (
          <View style={styles.emptyTab}>
            <Ionicons name="home-outline" size={56} color="#8FA1A8" />
            <Text style={styles.emptyTabText}>No trial items</Text>
          </View>
        )}
      </View>

      {showFooter && (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <View style={styles.footerInfo}>
            {isBag ? (
              <>
                <Text style={styles.footerPrice}>
                  ₹{footerTotal().toLocaleString()}
                </Text>
                <Text style={styles.footerLink}>View details</Text>
              </>
            ) : (
              <HapticButton onPress={() => router.navigate("/product-list")}>
                <Text style={styles.footerLink}>Browse trial designs</Text>
              </HapticButton>
            )}
          </View>

          <HapticButton
            style={[
              styles.mainButton,
              isInitializingCheckout && styles.mainButtonDisabled,
            ]}
            onPress={isBag ? handleCheckout : handleScheduleTrial}
            disabled={isInitializingCheckout}
          >
            {isInitializingCheckout ? (
              <ActivityIndicator size="small" color="#04333E" />
            ) : (
              <Text style={styles.mainButtonText}>
                {isBag ? "CHECKOUT" : "SCHEDULE TRIAL"}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1A1F",
  },
  backdrop: StyleSheet.absoluteFillObject,
  backdropScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 22, 26, 0.45)",
  },

  // ── Tabs ──
  tabs: {
    flexDirection: "row",
    paddingHorizontal: SIDE_PADDING,
  },
  tab: {
    flex: 1,
    paddingBottom: 14,
    alignItems: "center",
    position: "relative",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  activeDiamond: {
    position: "absolute",
    bottom: 4,
    width: 6,
    height: 6,
    backgroundColor: GOLD,
    transform: [{ rotate: "45deg" }],
  },

  // ── Sheet ──
  sheet: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#FFFFFF",
  },
  emptyTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 32,
  },
  emptyTabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5A7078",
    textAlign: "center",
  },

  // ── States ──
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  stateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  stateSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
  },
  stateButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
  },
  stateButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#053844",
  },

  // ── Footer ──
  // No fixed height: RN counts padding inside a height, so the safe-area inset
  // would eat into the row and crop it.
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 12,
    paddingHorizontal: SIDE_PADDING,
    backgroundColor: "#08222A",
  },
  footerInfo: {
    flex: 1,
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  footerLink: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: GOLD,
    textDecorationLine: "underline",
  },
  mainButton: {
    height: 48,
    minWidth: 160,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GOLD,
  },
  mainButtonDisabled: {
    opacity: 0.6,
  },
  mainButtonText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#04333E",
  },
});
