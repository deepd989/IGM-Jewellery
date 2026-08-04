import { useAuth } from "@/auth/authContext";
import { useClearCartMutation } from "@/store/apis/cart";
import { useClearWishlistMutation } from "@/store/apis/wishlist";
import { WRAPPER_API } from "@/store/newApis/apiUrl.const";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

/**
 * Puts the shopper back to a clean slate: the try-on photos the wrapper API
 * holds for them are deleted server-side, and their bag and wishlist are
 * emptied on the device.
 *
 * Both storefronts reset through this, so the classic and luxury profile
 * screens can't drift on what "reset" means.
 *
 * The local clear runs even when the server call fails — the shopper asked for
 * their data to go, so we remove what we can and say what didn't happen.
 */
export function useResetProfile() {
  const { userId, setImageGlobalUsage } = useAuth();
  const [clearWishlist] = useClearWishlistMutation();
  const [clearCart] = useClearCartMutation();
  const [isResetting, setIsResetting] = useState(false);

  const runReset = useCallback(async () => {
    setIsResetting(true);

    // Guests upload their try-on photo under the same "GUEST" id, so they get
    // to clear it too.
    const imageOwnerId = userId || "GUEST";
    let imagesDeleted = true;

    try {
      const response = await fetch(
        `${WRAPPER_API}/deleteUserImages/${imageOwnerId}`,
        { method: "DELETE" }
      );
      imagesDeleted = response.ok;
      if (!response.ok) {
        console.error("deleteUserImages failed with status:", response.status);
      }
    } catch (error) {
      imagesDeleted = false;
      console.error("deleteUserImages request failed:", error);
    }

    try {
      await clearWishlist().unwrap();
      await clearCart().unwrap();
      // Nothing left to render the shopper into, so drop back to catalogue art.
      setImageGlobalUsage(false);

      Alert.alert(
        "Profile Reset",
        imagesDeleted
          ? "Your try-on photos, wishlist and bag have been cleared."
          : "Your wishlist and bag have been cleared, but your try-on photos could not be removed. Please try again."
      );
    } catch (error) {
      console.error("Failed to clear wishlist/cart:", error);
      Alert.alert("Error", "Could not reset your profile. Please try again.");
    } finally {
      setIsResetting(false);
    }
  }, [userId, clearWishlist, clearCart, setImageGlobalUsage]);

  /** Asks first — this throws away the shopper's saved pieces. */
  const resetProfile = useCallback(() => {
    Alert.alert(
      "Reset Profile",
      "This deletes your try-on photos and empties your wishlist and bag. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            void runReset();
          },
        },
      ]
    );
  }, [runReset]);

  return { resetProfile, isResetting };
}
