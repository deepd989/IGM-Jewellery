import { CartItem } from "@/store/apis/cart";
import {
    clearFromStorage,
    loadFromStorage,
    mergeGuestData,
    saveToStorage,
} from "./userStorage";

const PREFIX = "cart";

/**
 * What we persist per user — only cart items and trial items.
 * Gift addons & freebies are app-level defaults, not user data.
 */
export interface PersistedCartData {
  items: CartItem[];
  trialItems: { product: CartItem["product"] }[];
}

const EMPTY: PersistedCartData = { items: [], trialItems: [] };

/**
 * Load cart data from AsyncStorage for a given user
 */
export async function loadCart(userId: string | null): Promise<PersistedCartData> {
  return loadFromStorage<PersistedCartData>(PREFIX, userId, EMPTY);
}

/**
 * Save cart data to AsyncStorage for a given user
 */
export async function saveCart(userId: string | null, data: PersistedCartData): Promise<void> {
  return saveToStorage(PREFIX, userId, data);
}

/**
 * Clear cart from AsyncStorage for a given user
 */
export async function clearCartStorage(userId: string | null): Promise<void> {
  return clearFromStorage(PREFIX, userId);
}

/**
 * Merge guest cart into user's cart on login
 */
export async function mergeGuestCart(userId: string): Promise<PersistedCartData> {
  return mergeGuestData<PersistedCartData>(
    PREFIX,
    userId,
    EMPTY,
    (userData, guestData) => {
      // Merge cart items: sum quantities for same product, add new ones
      const mergedItems = [...userData.items];
      for (const guestItem of guestData.items) {
        const existingIdx = mergedItems.findIndex(
          (i) => i.product.id === guestItem.product.id
        );
        if (existingIdx >= 0) {
          mergedItems[existingIdx] = {
            ...mergedItems[existingIdx],
            quantity: mergedItems[existingIdx].quantity + guestItem.quantity,
          };
        } else {
          mergedItems.push(guestItem);
        }
      }

      // Merge trial items: deduplicate by product ID
      const existingTrialIds = new Set(
        userData.trialItems.map((t) => t.product.id)
      );
      const newTrialItems = guestData.trialItems.filter(
        (t) => !existingTrialIds.has(t.product.id)
      );
      const mergedTrialItems = [...userData.trialItems, ...newTrialItems];

      return { items: mergedItems, trialItems: mergedTrialItems };
    }
  );
}
