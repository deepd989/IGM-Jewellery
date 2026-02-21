import { clearFromStorage, loadFromStorage, saveToStorage } from "./userStorage";

/**
 * Storage key prefix for AI chat history
 */
const CHAT_PREFIX = "ai_chat";

export interface StoredMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string; // ISO string for JSON serialization
  searchParams?: {
    occasion?: string;
    gender?: string;
    productType?: string;
    categoryName?: string;
    subCategoryName?: string;
    minPrice?: string;
    maxPrice?: string;
    metal?: string;
    gemstone?: string;
    brand?: string;
    searchQuery?: string;
  };
}

/**
 * Load chat history from AsyncStorage
 */
export async function loadChatHistory(
  userId: string | null
): Promise<StoredMessage[]> {
  return loadFromStorage<StoredMessage[]>(CHAT_PREFIX, userId, []);
}

/**
 * Save chat history to AsyncStorage
 */
export async function saveChatHistory(
  userId: string | null,
  messages: StoredMessage[]
): Promise<void> {
  // Keep only the last 100 messages to avoid storage bloat
  const trimmed = messages.slice(0, 100);
  await saveToStorage(CHAT_PREFIX, userId, trimmed);
}

/**
 * Clear chat history from AsyncStorage
 */
export async function clearChatHistory(
  userId: string | null
): Promise<void> {
  await clearFromStorage(CHAT_PREFIX, userId);
}
