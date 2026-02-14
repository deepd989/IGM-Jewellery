import { WishlistItem } from "@/interfaces/wishlist.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WISHLIST_KEY_PREFIX = "wishlist_";

/**
 * Get the AsyncStorage key for a user's wishlist
 * Uses "guest" for unauthenticated users
 */
function getStorageKey(userId: string | null): string {
  return `${WISHLIST_KEY_PREFIX}${userId || "guest"}`;
}

/**
 * Load wishlist items from AsyncStorage for a given user
 */
export async function loadWishlist(userId: string | null): Promise<WishlistItem[]> {
  try {
    const key = getStorageKey(userId);
    const data = await AsyncStorage.getItem(key);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error loading wishlist from storage:", error);
    return [];
  }
}

/**
 * Save wishlist items to AsyncStorage for a given user
 */
export async function saveWishlist(userId: string | null, items: WishlistItem[]): Promise<void> {
  try {
    const key = getStorageKey(userId);
    await AsyncStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving wishlist to storage:", error);
  }
}

/**
 * Clear wishlist from AsyncStorage for a given user
 */
export async function clearWishlistStorage(userId: string | null): Promise<void> {
  try {
    const key = getStorageKey(userId);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing wishlist from storage:", error);
  }
}

/**
 * Load guest wishlist and merge into user's wishlist (used on login)
 * Returns the merged list. Clears the guest wishlist after merge.
 */
export async function mergeGuestWishlist(userId: string): Promise<WishlistItem[]> {
  try {
    const guestItems = await loadWishlist(null);
    if (guestItems.length === 0) return await loadWishlist(userId);

    const userItems = await loadWishlist(userId);

    // Merge: add guest items that don't already exist in user's wishlist
    const existingIds = new Set(userItems.map((item) => item.product.id));
    const newItems = guestItems.filter((item) => !existingIds.has(item.product.id));
    const merged = [...userItems, ...newItems];

    // Save merged wishlist and clear guest
    await saveWishlist(userId, merged);
    await clearWishlistStorage(null);

    return merged;
  } catch (error) {
    console.error("Error merging guest wishlist:", error);
    return await loadWishlist(userId);
  }
}
