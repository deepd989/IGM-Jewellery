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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

/** Delivery and handling, added to the bag's total in the footer. */
const FOOTER_SURCHARGE = 220;

/** Home trial only goes out as one brand's pieces, and no more than this many. */
const MAX_TRIAL_ITEMS = 5;

/**
 * Everything the cart screen does that is not presentation: the tab the link
 * asked for, the cart itself, and every mutation the two screens fire.
 *
 * The classic and luxury carts both render from this — the same arrangement
 * useProductListing gives the two listings — so the two can never read a link
 * differently or drift in what checkout does.
 */
export function useCartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialTab = params.tab === "trial" ? "trial" : "bag";
  const [activeTab, setActiveTab] = useState<"bag" | "trial">(initialTab);
  const [removingItem, setRemovingItem] = useState<Product | null>(null);

  const { data: cartData, isLoading } = useGetCartQuery();

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

  const isBag = activeTab === "bag";

  useEffect(() => {
    if (params.tab === "trial") {
      setActiveTab("trial");
    }
  }, [params.tab]);

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = cart.find((i) => i.product.id === id);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    // Stepping below one is a removal, so it goes through the confirmation
    // rather than silently emptying the row.
    if (newQuantity < 1) {
      setRemovingItem(item.product);
      return;
    }

    updateQuantity({ productId: id, quantity: newQuantity });
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

  /** What the footer quotes: the bag, its add-ons and the surcharge. */
  const footerTotal = () => {
    const { subtotal, addons } = calculateTotals();
    return subtotal + addons + FOOTER_SURCHARGE;
  };

  const handleRemove = () => {
    if (!removingItem) return;

    if (isBag) {
      removeFromCart(removingItem.id);
    } else {
      removeFromTrial(removingItem.id);
    }
    setRemovingItem(null);
  };

  const handleMoveToWishlist = () => {
    if (!removingItem) return;

    moveToWishlist(removingItem.id);
    setRemovingItem(null);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before checkout");
      return;
    }

    try {
      await initializeCheckout().unwrap();
      router.navigate("/checkout/address");
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

    if (trialList.length > MAX_TRIAL_ITEMS) {
      Alert.alert(
        "Maximum Limit Exceeded",
        `You can select maximum ${MAX_TRIAL_ITEMS} items for home trial`
      );
      return;
    }

    const brands = new Set(trialList.map((item) => item.product.brand));
    if (brands.size > 1) {
      Alert.alert(
        "Multiple Brands",
        "Home trial is available for items from 1 brand only. Please select items from the same brand."
      );
      return;
    }

    router.navigate("/trial/schedule");
  };

  return {
    // State
    activeTab,
    setActiveTab,
    isBag,
    removingItem,
    setRemovingItem,

    // Data
    cart,
    trialList,
    giftAddons,
    freebie,
    isLoading,
    isInitializingCheckout,

    // Handlers
    handleUpdateQuantity,
    handleToggleGiftAddon,
    calculateTotals,
    footerTotal,
    handleRemove,
    handleMoveToWishlist,
    handleCheckout,
    handleScheduleTrial,
  };
}
