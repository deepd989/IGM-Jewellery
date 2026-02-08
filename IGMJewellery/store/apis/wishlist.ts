import { Product } from "@/interfaces/product.interface";
import {
    AddToWishlistRequest,
    AddToWishlistResponse,
    RemoveFromWishlistRequest,
    WishlistItem,
    WishlistState,
} from "@/interfaces/wishlist.interface";
import { API_ACCESS_TOKEN, API_BASE_URL, API_ENDPOINTS } from "@/store/newApis/apiUrl.const";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Default customer ID (will be replaced with actual auth in future)
const DEFAULT_CUSTOMER_ID = 5;

// Local state for wishlist items (API doesn't provide a get wishlist endpoint that we know of)
let wishlistItems: WishlistItem[] = [];
let compareList: Product[] = [];

/**
 * Add product to wishlist via API
 */
async function addToWishlistApi(
  customerId: number,
  product: Product,
  qty: number = 1
): Promise<AddToWishlistResponse> {
  const productId = parseInt(product.id, 10);
  
  if (isNaN(productId)) {
    throw new Error(`Invalid product ID: ${product.id}`);
  }

  const requestBody: AddToWishlistRequest = {
    customerId,
    productId,
    qty,
  };

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.WISHLIST_ADD}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add to wishlist");
  }

  return data as AddToWishlistResponse;
}

/**
 * Remove product from wishlist via API
 */
async function removeFromWishlistApi(
  customerId: number,
  itemId: number
): Promise<void> {
  const requestBody: RemoveFromWishlistRequest = {
    customerId,
    itemId,
  };

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.WISHLIST_REMOVE}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove from wishlist");
  }
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
    // Get wishlist (returns local state since there's no GET endpoint documented)
    getWishlist: builder.query<WishlistState, void>({
      queryFn: () => {
        console.log("getWishlist called, current state:", getWishlistState());
        return { data: getWishlistState() };
      },
      providesTags: ["Wishlist"],
    }),

    // Add item to wishlist via API
    addToWishlist: builder.mutation<WishlistState, Product>({
      queryFn: async (product) => {
        try {
          // Check if already in wishlist locally
          const exists = wishlistItems.some(
            (item) => item.product.id === product.id
          );

          if (exists) {
            console.log("Product already in wishlist");
            return {
              error: {
                status: 400,
                data: "Item already in wishlist",
              },
            };
          }

          // Call API to add to wishlist
          console.log("Adding to wishlist via API:", product.id);
          const response = await addToWishlistApi(DEFAULT_CUSTOMER_ID, product);
          console.log("API response:", response);

          // Add to local state with itemId from API
          wishlistItems = [
            ...wishlistItems,
            { product, itemId: response.item_id },
          ];

          console.log("addToWishlist - updated state:", getWishlistState());
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

    // Remove item from wishlist via API
    removeFromWishlist: builder.mutation<WishlistState, string>({
      queryFn: async (productId) => {
        try {
          // Find the item in local state to get the itemId
          const item = wishlistItems.find((i) => i.product.id === productId);

          if (!item) {
            console.log("Product not found in wishlist");
            return {
              error: {
                status: 404,
                data: "Item not found in wishlist",
              },
            };
          }

          // Call API to remove from wishlist
          console.log("Removing from wishlist via API, itemId:", item.itemId);
          await removeFromWishlistApi(DEFAULT_CUSTOMER_ID, item.itemId);

          // Remove from local state
          wishlistItems = wishlistItems.filter(
            (i) => i.product.id !== productId
          );

          console.log("removeFromWishlist - updated state:", getWishlistState());
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

    // Toggle item in compare list (local only, not API-backed)
    toggleCompare: builder.mutation<WishlistState, Product>({
      queryFn: (product) => {
        const exists = compareList.some((item) => item.id === product.id);

        if (exists) {
          // Remove from compare
          compareList = compareList.filter((item) => item.id !== product.id);
        } else {
          // Add to compare (max 2 items)
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

        console.log("toggleCompare - updated state:", getWishlistState());
        return { data: getWishlistState() };
      },
      invalidatesTags: ["Wishlist"],
    }),

    // Clear compare list (local only)
    clearCompare: builder.mutation<WishlistState, void>({
      queryFn: () => {
        compareList = [];
        console.log("clearCompare - updated state:", getWishlistState());
        return { data: getWishlistState() };
      },
      invalidatesTags: ["Wishlist"],
    }),

    // Clear entire wishlist (would need API support for full implementation)
    clearWishlist: builder.mutation<WishlistState, void>({
      queryFn: () => {
        // Note: This only clears local state. For full implementation,
        // we'd need to call removeFromWishlist for each item
        wishlistItems = [];
        compareList = [];
        console.log("clearWishlist - updated state:", getWishlistState());
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
