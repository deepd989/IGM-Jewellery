import { Product } from "@/interfaces/product.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface WishlistState {
  items: Product[];
  compareList: Product[];
}

// Mock initial state
const INITIAL_STATE: WishlistState = {
  items: [],
  compareList: [],
};

// In-memory state for mock API
let currentState: WishlistState = { ...INITIAL_STATE };

export const wishlistApiService = createApi({
  reducerPath: "wishlist",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    // Get wishlist
    getWishlist: builder.query<WishlistState, void>({
      queryFn: () => {
        console.log("getWishlist called, current state:", currentState);
        return { data: currentState };
      },
      providesTags: ["Wishlist"],
    }),

    // Add item to wishlist
    addToWishlist: builder.mutation<WishlistState, Product>({
      queryFn: (product) => {
        const exists = currentState.items.some(
          (item) => item.id === product.id,
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

        currentState = {
          ...currentState,
          items: [...currentState.items, product],
        };

        console.log("addToWishlist - updated state:", currentState);
        return { data: currentState };
      },
      invalidatesTags: ["Wishlist"],
    }),

    // Remove item from wishlist
    removeFromWishlist: builder.mutation<WishlistState, string>({
      queryFn: (productId) => {
        currentState = {
          ...currentState,
          items: currentState.items.filter((item) => item.id !== productId),
        };

        console.log("removeFromWishlist - updated state:", currentState);
        return { data: currentState };
      },
      invalidatesTags: ["Wishlist"],
    }),

    // Toggle item in compare list
    toggleCompare: builder.mutation<WishlistState, Product>({
      queryFn: (product) => {
        const exists = currentState.compareList.some(
          (item) => item.id === product.id,
        );

        if (exists) {
          // Remove from compare
          currentState = {
            ...currentState,
            compareList: currentState.compareList.filter(
              (item) => item.id !== product.id,
            ),
          };
        } else {
          // Add to compare (max 2 items)
          if (currentState.compareList.length >= 2) {
            return {
              error: {
                status: 400,
                data: "You can only compare 2 products at a time",
              },
            };
          }

          currentState = {
            ...currentState,
            compareList: [...currentState.compareList, product],
          };
        }

        console.log("toggleCompare - updated state:", currentState);
        return { data: currentState };
      },
      invalidatesTags: ["Wishlist"],
    }),

    // Clear compare list
    clearCompare: builder.mutation<WishlistState, void>({
      queryFn: () => {
        currentState = {
          ...currentState,
          compareList: [],
        };

        console.log("clearCompare - updated state:", currentState);
        return { data: currentState };
      },
      invalidatesTags: ["Wishlist"],
    }),

    // Clear entire wishlist
    clearWishlist: builder.mutation<WishlistState, void>({
      queryFn: () => {
        currentState = {
          items: [],
          compareList: [],
        };

        console.log("clearWishlist - updated state:", currentState);
        return { data: currentState };
      },
      invalidatesTags: ["Wishlist"],
    }),

    // Check if product is in wishlist
    isInWishlist: builder.query<boolean, string>({
      queryFn: (productId) => {
        const isInWishlist = currentState.items.some(
          (item) => item.id === productId,
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
