import { Product } from "@/interfaces/product.interface";
import {
  WishlistItem,
  WishlistState,
} from "@/interfaces/wishlist.interface";
import {
  clearWishlistStorage,
  loadWishlist,
  mergeGuestWishlist,
  saveWishlist,
} from "@/store/apis/wishlistStorage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Module-level user ID for storage scoping.
 * Set from auth context via setCurrentUserId().
 * null = guest user.
 */
let currentUserId: string | null = null;

/**
 * Call this from auth context when userId changes (login/logout).
 * On login: merges any guest wishlist into the user's wishlist.
 * On logout: clears in-memory state (storage persists for next login).
 */
export async function setCurrentUserId(userId: string | null): Promise<void> {
  const previousUserId = currentUserId;
  currentUserId = userId;

  if (userId && !previousUserId) {
    // User just logged in — merge guest wishlist
    const merged = await mergeGuestWishlist(userId);
    wishlistItems = merged;
  } else if (userId) {
    // Already logged in user (or changed user) — load their wishlist
    wishlistItems = await loadWishlist(userId);
  } else {
    // Logged out — load guest wishlist
    wishlistItems = await loadWishlist(null);
  }
}

// In-memory state
let wishlistItems: WishlistItem[] = [];
let compareList: Product[] = [];
let initialized = false;

/**
 * Ensure wishlist is loaded from storage on first access
 */
async function ensureInitialized(): Promise<void> {
  if (initialized) return;
  wishlistItems = await loadWishlist(currentUserId);
  initialized = true;
}

/**
 * Get current wishlist state
 */
function getWishlistState(): WishlistState {
  return {
    items: wishlistItems,
    compareList,
  };
}

export const wishlistApiService = createApi({
  reducerPath: "wishlist",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    // Get wishlist (loads from phone storage on first call)
    getWishlist: builder.query<WishlistState, void>({
      queryFn: async () => {
        await ensureInitialized();
        return { data: getWishlistState() };
      },
      providesTags: ["Wishlist"],
    }),

    // Add item to wishlist (persists to phone storage)
    addToWishlist: builder.mutation<WishlistState, Product>({
      queryFn: async (product) => {
        try {
          await ensureInitialized();

          // Check if already in wishlist
          const exists = wishlistItems.some(
            (item) => item.product.id === product.id
          );

          if (exists) {
            return {
              error: {
                status: 400,
                data: "Item already in wishlist",
              },
            };
          }

          // Add to in-memory state
          const newItem: WishlistItem = {
            product,
            addedAt: Date.now(),
          };
          wishlistItems = [...wishlistItems, newItem];

          // Persist to phone storage
          await saveWishlist(currentUserId, wishlistItems);

          console.log("addToWishlist — saved to storage, total:", wishlistItems.length);
          return { data: getWishlistState() };
        } catch (error: any) {
          console.error("addToWishlist error:", error);
          return {
            error: {
              status: 500,
              data: error.message || "Failed to add to wishlist",
            },
          };
        }
      },
      invalidatesTags: ["Wishlist"],
    }),

    // Remove item from wishlist (persists to phone storage)
    removeFromWishlist: builder.mutation<WishlistState, string>({
      queryFn: async (productId) => {
        try {
          await ensureInitialized();

          const item = wishlistItems.find((i) => i.product.id === productId);

          if (!item) {
            return {
              error: {
                status: 404,
                data: "Item not found in wishlist",
              },
            };
          }

          // Remove from in-memory state
          wishlistItems = wishlistItems.filter(
            (i) => i.product.id !== productId
          );

          // Persist to phone storage
          await saveWishlist(currentUserId, wishlistItems);

          console.log("removeFromWishlist — saved to storage, total:", wishlistItems.length);
          return { data: getWishlistState() };
        } catch (error: any) {
          console.error("removeFromWishlist error:", error);
          return {
            error: {
              status: 500,
              data: error.message || "Failed to remove from wishlist",
            },
          };
        }
      },
      invalidatesTags: ["Wishlist"],
    }),

    // Toggle item in compare list (in-memory only, not persisted)
    toggleCompare: builder.mutation<WishlistState, Product>({
      queryFn: (product) => {
        const exists = compareList.some((item) => item.id === product.id);

        if (exists) {
          compareList = compareList.filter((item) => item.id !== product.id);
        } else {
          if (compareList.length >= 2) {
            return {
              error: {
                status: 400,
                data: "You can only compare 2 products at a time",
              },
            };
          }
          compareList = [...compareList, product];
        }

        return { data: getWishlistState() };
      },
      invalidatesTags: ["Wishlist"],
    }),

    // Clear compare list (in-memory only)
    clearCompare: builder.mutation<WishlistState, void>({
      queryFn: () => {
        compareList = [];
        return { data: getWishlistState() };
      },
      invalidatesTags: ["Wishlist"],
    }),

    // Clear entire wishlist (clears both memory and phone storage)
    clearWishlist: builder.mutation<WishlistState, void>({
      queryFn: async () => {
        wishlistItems = [];
        compareList = [];
        await clearWishlistStorage(currentUserId);
        return { data: getWishlistState() };
      },
      invalidatesTags: ["Wishlist"],
    }),

    // Check if product is in wishlist
    isInWishlist: builder.query<boolean, string>({
      queryFn: (productId) => {
        const isInWishlist = wishlistItems.some(
          (item) => item.product.id === productId
        );
        return { data: isInWishlist };
      },
      providesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useToggleCompareMutation,
  useClearCompareMutation,
  useClearWishlistMutation,
  useIsInWishlistQuery,
} = wishlistApiService;

// Re-export WishlistState for backwards compatibility
export type { WishlistState };
