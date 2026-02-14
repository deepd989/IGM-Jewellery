import { WishlistItem } from "@/interfaces/wishlist.interface";
import {
  clearFromStorage,
  loadFromStorage,
  mergeGuestData,
  saveToStorage,
} from "./userStorage";

const PREFIX = "wishlist";

/**
 * Load wishlist items from AsyncStorage for a given user
 */
export async function loadWishlist(userId: string | null): Promise<WishlistItem[]> {
  return loadFromStorage<WishlistItem[]>(PREFIX, userId, []);
}

/**
 * Save wishlist items to AsyncStorage for a given user
 */
export async function saveWishlist(userId: string | null, items: WishlistItem[]): Promise<void> {
  return saveToStorage(PREFIX, userId, items);
}

/**
 * Clear wishlist from AsyncStorage for a given user
 */
export async function clearWishlistStorage(userId: string | null): Promise<void> {
  return clearFromStorage(PREFIX, userId);
}

/**
 * Load guest wishlist and merge into user's wishlist (used on login)
 */
export async function mergeGuestWishlist(userId: string): Promise<WishlistItem[]> {
  return mergeGuestData<WishlistItem[]>(
    PREFIX,
    userId,
    [],
    (userData, guestData) => {
      const existingIds = new Set(userData.map((item) => item.product.id));
      const newItems = guestData.filter((item) => !existingIds.has(item.product.id));
      return [...userData, ...newItems];
    }
  );
}
