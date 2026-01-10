import { Product } from "@/interfaces/product.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TrialItem {
  product: Product;
}

export interface GiftAddon {
  id: string;
  title: string;
  price: number;
  isChecked: boolean;
}

interface CartState {
  items: CartItem[];
  trialItems: TrialItem[];
  giftAddons: GiftAddon[];
}

// Mock initial state
const INITIAL_STATE: CartState = {
  items: [],
  trialItems: [],
  giftAddons: [
    { id: "1", title: "Write a Note (Card)", price: 100, isChecked: false },
    { id: "2", title: "Premium Gift Wrap", price: 100, isChecked: false },
    { id: "3", title: "Record a message", price: 100, isChecked: false },
    { id: "4", title: "Deluxe Gift Box", price: 150, isChecked: false },
  ],
};

// In-memory state for mock API
let currentState: CartState = { ...INITIAL_STATE };

export const cartApiService = createApi({
  reducerPath: "cart",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Cart", "Trial", "GiftAddons"],
  endpoints: (builder) => ({
    // Get shopping cart
    getCart: builder.query<CartState, void>({
      queryFn: () => {
        return { data: currentState };
      },
      providesTags: ["Cart"],
    }),

    // Add item to cart
    addToCart: builder.mutation<
      CartState,
      { product: Product; quantity?: number }
    >({
      queryFn: ({ product, quantity = 1 }) => {
        const items = [...currentState.items];
        const index = items.findIndex((item) => item.product.id === product.id);
        if (index >= 0) {
          items[index] = {
            ...items[index],
            quantity: items[index].quantity + quantity,
          };
        } else items.push({ product, quantity });

        currentState = {
          ...currentState,
          items,
        };
        return { data: currentState };
      },
      invalidatesTags: ["Cart"],
    }),

    // Remove item from cart
    removeFromCart: builder.mutation<CartState, string>({
      queryFn: (productId) => {
        let items = [...currentState.items].filter(
          (item) => item.product.id !== productId
        );
        currentState = {
          ...currentState,
          items,
        };

        return { data: { ...currentState } };
      },
      invalidatesTags: ["Cart"],
    }),

    // Update item quantity ✅ FIXED
    updateQuantity: builder.mutation<
      CartState,
      { productId: string; quantity: number }
    >({
      queryFn: ({ productId, quantity }) => {
        currentState = {
          ...currentState,
          items: currentState.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        };
        return { data: currentState };
      },
      invalidatesTags: ["Cart"],
    }),

    // Add to trial ✅ FIXED
    addToTrial: builder.mutation<CartState, Product>({
      queryFn: (product) => {
        const exists = currentState.trialItems.some(
          (item) => item.product.id === product.id
        );

        if (!exists) {
          currentState = {
            ...currentState,
            trialItems: [...currentState.trialItems, { product }],
          };
        }

        return { data: currentState };
      },
      invalidatesTags: ["Trial"],
    }),

    // Remove from trial ✅ FIXED
    removeFromTrial: builder.mutation<CartState, string>({
      queryFn: (productId) => {
        currentState = {
          ...currentState,
          trialItems: currentState.trialItems.filter(
            (item) => item.product.id !== productId
          ),
        };
        return { data: currentState };
      },
      invalidatesTags: ["Trial"],
    }),

    // Toggle gift addon
    toggleGiftAddon: builder.mutation<CartState, string>({
      queryFn: (addonId) => {
        currentState = {
          ...currentState,
          giftAddons: currentState.giftAddons.map((addon) =>
            addon.id === addonId
              ? { ...addon, isChecked: !addon.isChecked }
              : addon
          ),
        };
        return { data: currentState };
      },
      invalidatesTags: ["GiftAddons"],
    }),

    // Clear cart
    clearCart: builder.mutation<CartState, void>({
      queryFn: () => {
        currentState = {
          items: [],
          trialItems: currentState.trialItems,
          giftAddons: currentState.giftAddons.map((a) => ({
            ...a,
            isChecked: false,
          })),
        };
        return { data: currentState };
      },
      invalidatesTags: ["Cart", "GiftAddons"],
    }),

    // Move to wishlist (placeholder - would integrate with wishlist service)
    moveToWishlist: builder.mutation<CartState, string>({
      queryFn: (productId) => {
        currentState = {
          ...currentState,
          items: currentState.items.filter(
            (item) => item.product.id !== productId
          ),
        };
        return { data: currentState };
      },
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateQuantityMutation,
  useAddToTrialMutation,
  useRemoveFromTrialMutation,
  useToggleGiftAddonMutation,
  useClearCartMutation,
  useMoveToWishlistMutation,
} = cartApiService;
