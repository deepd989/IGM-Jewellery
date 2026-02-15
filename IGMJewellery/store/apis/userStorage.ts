import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Shared AsyncStorage helper for user-scoped data (wishlist, cart, etc.)
 * All keys are prefixed and scoped by userId (or "guest" for unauthenticated users).
 */

function buildKey(prefix: string, userId: string | null): string {
  return `${prefix}_${userId || "guest"}`;
}

/**
 * Load data from AsyncStorage
 */
export async function loadFromStorage<T>(
  prefix: string,
  userId: string | null,
  fallback: T
): Promise<T> {
  try {
    const key = buildKey(prefix, userId);
    const data = await AsyncStorage.getItem(key);
    if (!data) return fallback;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error loading ${prefix} from storage:`, error);
    return fallback;
  }
}

/**
 * Save data to AsyncStorage
 */
export async function saveToStorage<T>(
  prefix: string,
  userId: string | null,
  data: T
): Promise<void> {
  try {
    const key = buildKey(prefix, userId);
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${prefix} to storage:`, error);
  }
}

/**
 * Clear data from AsyncStorage
 */
export async function clearFromStorage(
  prefix: string,
  userId: string | null
): Promise<void> {
  try {
    const key = buildKey(prefix, userId);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing ${prefix} from storage:`, error);
  }
}

/**
 * Merge guest data into user data. Returns merged result.
 * Clears guest entry after successful merge.
 *
 * @param prefix - storage key prefix (e.g., "wishlist", "cart")
 * @param userId - the logged-in user's ID
 * @param merger - function that merges guest data into user data
 */
export async function mergeGuestData<T>(
  prefix: string,
  userId: string,
  fallback: T,
  merger: (userData: T, guestData: T) => T
): Promise<T> {
  try {
    const guestData = await loadFromStorage<T>(prefix, null, fallback);
    const userData = await loadFromStorage<T>(prefix, userId, fallback);

    const merged = merger(userData, guestData);

    await saveToStorage(prefix, userId, merged);
    await clearFromStorage(prefix, null);

    return merged;
  } catch (error) {
    console.error(`Error merging guest ${prefix}:`, error);
    return await loadFromStorage<T>(prefix, userId, fallback);
  }
}
