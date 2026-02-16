import { Product } from "@/interfaces/product.interface";
import {
    clearCartStorage,
    loadCart,
    mergeGuestCart,
    PersistedCartData,
    saveCart,
} from "@/store/apis/cartStorage";
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
  image?: string;
}

interface CartState {
  items: CartItem[];
  trialItems: TrialItem[];
  giftAddons: GiftAddon[];
  freebie?: {
    id: string;
    title: string;
    subtitle: string;
    minOrderValue: number;
    isVisible: boolean;
  } | null;
}

// Default gift addons (not user-specific, same for everyone)
const DEFAULT_GIFT_ADDONS: GiftAddon[] = [
  { id: "1", title: "Write a Note (Card)", price: 100, isChecked: false, image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=200" },
  { id: "2", title: "Premium Gift Wrap", price: 100, isChecked: false, image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=200" },
  { id: "3", title: "Record a message", price: 100, isChecked: false, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=200" },
  { id: "4", title: "Deluxe Gift Box", price: 150, isChecked: false, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200" },
];

const DEFAULT_FREEBIE = {
  id: "freebie-1",
  title: "Necklace Box",
  subtitle: "Congratulations! Available on orders above ₹5,000",
  minOrderValue: 5000,
  isVisible: true,
};

/**
 * Module-level user ID for storage scoping.
 * Set from auth context via setCurrentCartUserId().
 */
let currentUserId: string | null = null;

// In-memory state
let currentState: CartState = {
  items: [],
  trialItems: [],
  giftAddons: [...DEFAULT_GIFT_ADDONS],
  freebie: { ...DEFAULT_FREEBIE },
};
let initialized = false;

/**
 * Call from auth context on login/logout/bootstrap.
 */
export async function setCurrentCartUserId(userId: string | null): Promise<void> {
  const previousUserId = currentUserId;
  currentUserId = userId;

  if (userId && !previousUserId) {
    // Login — merge guest cart
    const merged = await mergeGuestCart(userId);
    currentState = {
      ...currentState,
      items: merged.items,
      trialItems: merged.trialItems,
    };
  } else if (userId) {
    // Changed user — load their cart
    const data = await loadCart(userId);
    currentState = {
      ...currentState,
      items: data.items,
      trialItems: data.trialItems,
    };
  } else {
    // Logout — load guest cart
    const data = await loadCart(null);
    currentState = {
      ...currentState,
      items: data.items,
      trialItems: data.trialItems,
    };
  }

  // Reset addons on user change
  currentState.giftAddons = [...DEFAULT_GIFT_ADDONS];
  currentState.freebie = { ...DEFAULT_FREEBIE };
  initialized = true;
}

/**
 * Ensure cart is loaded from phone storage on first access
 */
async function ensureInitialized(): Promise<void> {
  if (initialized) return;
  const data = await loadCart(currentUserId);
  currentState = {
    ...currentState,
    items: data.items,
    trialItems: data.trialItems,
  };
  initialized = true;
}

/**
 * Persist current cart items + trial items to phone storage
 */
async function persistCart(): Promise<void> {
  const data: PersistedCartData = {
    items: currentState.items,
    trialItems: currentState.trialItems,
  };
  await saveCart(currentUserId, data);
}

export const cartApiService = createApi({
  reducerPath: "cart",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    // Get shopping cart
    getCart: builder.query<CartState, void>({
      queryFn: async () => {
        await ensureInitialized();
        return { data: { ...currentState } };
      },
      providesTags: ["Cart"],
    }),

    // Add item to cart
    addToCart: builder.mutation<
      CartState,
      { product: Product; quantity?: number }
    >({
      queryFn: async ({ product, quantity = 1 }) => {
        await ensureInitialized();

        const items = [...currentState.items];
        const index = items.findIndex((item) => item.product.id === product.id);
        if (index >= 0) {
          items[index] = {
            ...items[index],
            quantity: items[index].quantity + quantity,
          };
        } else {
          items.push({ product, quantity });
        }

        currentState = { ...currentState, items };
        await persistCart();

        console.log("addToCart — saved to storage, total:", items.length);
        return { data: { ...currentState } };
      },
      invalidatesTags: ["Cart"],
    }),

    // Remove item from cart
    removeFromCart: builder.mutation<CartState, string>({
      queryFn: async (productId) => {
        await ensureInitialized();

        currentState = {
          ...currentState,
          items: currentState.items.filter(
            (item) => item.product.id !== productId
          ),
        };
        await persistCart();

        console.log("removeFromCart — saved to storage, total:", currentState.items.length);
        return { data: { ...currentState } };
      },
      invalidatesTags: ["Cart"],
    }),

    // Update item quantity
    updateQuantity: builder.mutation<
      CartState,
      { productId: string; quantity: number }
    >({
      queryFn: async ({ productId, quantity }) => {
        await ensureInitialized();

        currentState = {
          ...currentState,
          items: currentState.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        };
        await persistCart();

        return { data: { ...currentState } };
      },
      invalidatesTags: ["Cart"],
    }),

    // Add to trial
    addToTrial: builder.mutation<CartState, Product>({
      queryFn: async (product) => {
        await ensureInitialized();

        const exists = currentState.trialItems.some(
          (item) => item.product.id === product.id
        );

        if (exists) {
          return {
            error: {
              status: 400,
              data: "Item already in trial list",
            },
          };
        }

        currentState = {
          ...currentState,
          trialItems: [...currentState.trialItems, { product }],
        };
        await persistCart();

        console.log("addToTrial — saved to storage, total:", currentState.trialItems.length);
        return { data: { ...currentState } };
      },
      invalidatesTags: ["Cart"],
    }),

    // Remove from trial
    removeFromTrial: builder.mutation<CartState, string>({
      queryFn: async (productId) => {
        await ensureInitialized();

        currentState = {
          ...currentState,
          trialItems: currentState.trialItems.filter(
            (item) => item.product.id !== productId
          ),
        };
        await persistCart();

        return { data: { ...currentState } };
      },
      invalidatesTags: ["Cart"],
    }),

    // Toggle gift addon (in-memory only — not user-specific)
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
        return { data: { ...currentState } };
      },
      invalidatesTags: ["Cart"],
    }),

    // Clear trial items
    clearTrial: builder.mutation<CartState, void>({
      queryFn: async () => {
        currentState = { ...currentState, trialItems: [] };
        await persistCart();
        return { data: { ...currentState } };
      },
      invalidatesTags: ["Cart"],
    }),

    // Clear entire cart
    clearCart: builder.mutation<CartState, void>({
      queryFn: async () => {
        currentState = {
          items: [],
          trialItems: [],
          giftAddons: currentState.giftAddons.map((a) => ({
            ...a,
            isChecked: false,
          })),
          freebie: currentState.freebie,
        };
        await clearCartStorage(currentUserId);
        return { data: { ...currentState } };
      },
      invalidatesTags: ["Cart"],
    }),

    // Move to wishlist (removes from cart, persists)
    moveToWishlist: builder.mutation<CartState, string>({
      queryFn: async (productId) => {
        await ensureInitialized();

        currentState = {
          ...currentState,
          items: currentState.items.filter(
            (item) => item.product.id !== productId
          ),
        };
        await persistCart();

        return { data: { ...currentState } };
      },
      invalidatesTags: ["Cart"],
    }),

    // Dismiss freebie banner
    dismissFreebie: builder.mutation<CartState, void>({
      queryFn: () => {
        if (!currentState.freebie) {
          return { data: { ...currentState } };
        }

        currentState = {
          ...currentState,
          freebie: { ...currentState.freebie, isVisible: false },
        };

        return { data: { ...currentState } };
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
  useClearTrialMutation,
  useMoveToWishlistMutation,
  useDismissFreebieMutation,
} = cartApiService;
