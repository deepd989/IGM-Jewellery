import { OrderDetails } from "@/interfaces/order-details.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BillingAddress,
  DeliveryAddress,
  SavedAddress,
} from "../../interfaces/address.interface";
import { GiftingOptions } from "../../interfaces/giftingOptions.interface";

export interface PaymentMethodType {
  id: string;
  type: "google_pay" | "credit_card" | "debit_card" | "net_banking" | "cod";
  title: string;
}

export interface CheckoutState {
  deliveryAddress?: DeliveryAddress;
  billingAddress?: BillingAddress;
  giftingOptions?: GiftingOptions;
  selectedPaymentMethod?: string;
  appliedCouponCode?: string;
  appliedCouponDiscount?: number;
}

export interface CheckoutSession {
  id: string;
  orderDetails: OrderDetails;
  checkoutState: CheckoutState;
  createdAt: string;
  expiresAt: string;
}

export interface CreateOrderRequest {
  deliveryAddress: DeliveryAddress;
  billingAddress: BillingAddress;
  giftingOptions?: GiftingOptions;
  paymentMethod: string;
  couponCode?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  orderDisplayId: string;
  paymentUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  loyaltyPointsEarned?: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: string;
  description: string;
  validUntil: string;
  isAvailable: boolean;
  discountValue: number;
  minOrderValue?: number;
}

// Mock data
const MOCK_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: "addr_1",
    firstName: "John",
    lastName: "Doe",
    phone: "9870951994",
    email: "emailid@gmail.com",

    street: "Shop Number 201, Avon Enclave",
    landmark: "Andheri East",

    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400066",
    country: "India",

    isDefault: true,
    type: "Home",
  },
];

const MOCK_COUPONS: Coupon[] = [
  {
    id: "coup_1",
    code: "SAVE20",
    discount: "₹20 OFF",
    description: "Get flat ₹20 off on orders above ₹500",
    validUntil: "31st Dec 2024",
    isAvailable: true,
    discountValue: 20,
    minOrderValue: 500,
  },
  {
    id: "coup_2",
    code: "FIRST100",
    discount: "₹100 OFF",
    description: "First order discount - ₹100 off on orders above ₹1000",
    validUntil: "31st Dec 2024",
    isAvailable: true,
    discountValue: 100,
    minOrderValue: 1000,
  },
  {
    id: "coup_3",
    code: "PREMIUM500",
    discount: "₹500 OFF",
    description: "Premium member exclusive - ₹500 off on orders above ₹5000",
    validUntil: "31st Dec 2024",
    isAvailable: false,
    discountValue: 500,
    minOrderValue: 5000,
  },
];

// In-memory state
let checkoutSession: CheckoutSession | null = null;
let savedAddresses: SavedAddress[] = [...MOCK_SAVED_ADDRESSES];

export const checkoutApiService = createApi({
  reducerPath: "checkout",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["CheckoutSession", "SavedAddresses", "Coupons"],
  endpoints: (builder) => ({
    // Initialize checkout session from cart
    initializeCheckout: builder.mutation<CheckoutSession, void>({
      queryFn: async (_, { getState }) => {
        const state = getState() as any;
        const cartData = state.cart.queries?.["getCart(undefined)"]?.data;

        if (!cartData || cartData.items.length === 0) {
          return {
            error: {
              status: 400,
              statusText: "Bad Request",
              data: "Cart is empty",
            },
          };
        }

        // Calculate order details from cart
        const subtotal = cartData.items.reduce(
          (acc: number, item: any) =>
            acc + item.product.givenPrice * item.quantity,
          0,
        );

        const sellingPrice = cartData.items.reduce(
          (acc: number, item: any) =>
            acc + item.product.discountedPrice * item.quantity,
          0,
        );

        const savings = subtotal - sellingPrice;
        const platformFee = 220;

        // Add gift addons cost
        const giftAddonsCost = cartData.giftAddons.reduce(
          (acc: number, addon: any) =>
            acc + (addon.isChecked ? addon.price : 0),
          0,
        );

        const total = sellingPrice + platformFee + giftAddonsCost;

        const orderDetails: OrderDetails = {
          items: cartData.items,
          subtotal: subtotal + giftAddonsCost,
          savings,
          platformFee,
          total,
        };

        const session: CheckoutSession = {
          id: `checkout_${Date.now()}`,
          orderDetails,
          checkoutState: {},
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        };

        checkoutSession = session;
        return { data: session };
      },
      invalidatesTags: ["CheckoutSession"],
    }),

    // Get current checkout session
    getCheckoutSession: builder.query<CheckoutSession, void>({
      queryFn: () => {
        if (!checkoutSession) {
          return {
            error: {
              status: 404,
              statusText: "Not Found",
              data: "No active checkout session",
            },
          };
        }

        if (new Date(checkoutSession.expiresAt) < new Date()) {
          checkoutSession = null;
          return {
            error: {
              status: 410,
              statusText: "Gone",
              data: "Checkout session expired",
            },
          };
        }

        return { data: checkoutSession };
      },
      providesTags: ["CheckoutSession"],
    }),

    // Get saved addresses
    getSavedAddresses: builder.query<SavedAddress[], void>({
      queryFn: () => {
        return { data: savedAddresses };
      },
      providesTags: ["SavedAddresses"],
    }),

    // Add new address
    addAddress: builder.mutation<SavedAddress, Omit<SavedAddress, "id">>({
      queryFn: (address) => {
        const newAddress: SavedAddress = {
          ...address,
          id: `addr_${Date.now()}`,
        };

        savedAddresses.push(newAddress);
        return { data: newAddress };
      },
      invalidatesTags: ["SavedAddresses"],
    }),

    // Update delivery address in session
    updateDeliveryAddress: builder.mutation<CheckoutSession, DeliveryAddress>({
      queryFn: (address) => {
        if (!checkoutSession) {
          return {
            error: {
              status: 404,
              statusText: "Not Found",
              data: "No active checkout session",
            },
          };
        }

        checkoutSession = {
          ...checkoutSession,
          checkoutState: {
            ...checkoutSession.checkoutState,
            deliveryAddress: address,
          },
        };

        return { data: checkoutSession };
      },
      invalidatesTags: ["CheckoutSession"],
    }),

    // Update billing address in session
    updateBillingAddress: builder.mutation<CheckoutSession, BillingAddress>({
      queryFn: (address) => {
        if (!checkoutSession) {
          return {
            error: {
              status: 404,
              statusText: "Not Found",
              data: "No active checkout session",
            },
          };
        }

        checkoutSession = {
          ...checkoutSession,
          checkoutState: {
            ...checkoutSession.checkoutState,
            billingAddress: address,
          },
        };

        return { data: checkoutSession };
      },
      invalidatesTags: ["CheckoutSession"],
    }),

    // Update gifting options
    updateGiftingOptions: builder.mutation<CheckoutSession, GiftingOptions>({
      queryFn: (options) => {
        if (!checkoutSession) {
          return {
            error: {
              status: 404,
              statusText: "Not Found",
              data: "No active checkout session",
            },
          };
        }

        checkoutSession = {
          ...checkoutSession,
          checkoutState: {
            ...checkoutSession.checkoutState,
            giftingOptions: options,
          },
        };

        return { data: checkoutSession };
      },
      invalidatesTags: ["CheckoutSession"],
    }),

    // Get available coupons
    getCoupons: builder.query<Coupon[], void>({
      queryFn: () => {
        return { data: MOCK_COUPONS };
      },
      providesTags: ["Coupons"],
    }),

    // Apply coupon
    applyCoupon: builder.mutation<CheckoutSession, string>({
      queryFn: (couponCode) => {
        if (!checkoutSession) {
          return {
            error: {
              status: 404,
              statusText: "Not Found",
              data: "No active checkout session",
            },
          };
        }

        const coupon = MOCK_COUPONS.find(
          (c) => c.code === couponCode && c.isAvailable,
        );

        if (!coupon) {
          return {
            error: {
              status: 400,
              statusText: "Bad Request",
              data: "Invalid or unavailable coupon code",
            },
          };
        }

        if (
          coupon.minOrderValue &&
          checkoutSession.orderDetails.total < coupon.minOrderValue
        ) {
          return {
            error: {
              status: 400,
              statusText: "Bad Request",
              data: `Minimum order value of ₹${coupon.minOrderValue} required`,
            },
          };
        }

        const newTotal =
          checkoutSession.orderDetails.total - coupon.discountValue;

        checkoutSession = {
          ...checkoutSession,
          orderDetails: {
            ...checkoutSession.orderDetails,
            total: newTotal,
            savings:
              checkoutSession.orderDetails.savings + coupon.discountValue,
          },
          checkoutState: {
            ...checkoutSession.checkoutState,
            appliedCouponCode: couponCode,
            appliedCouponDiscount: coupon.discountValue,
          },
        };

        return { data: checkoutSession };
      },
      invalidatesTags: ["CheckoutSession"],
    }),

    // Remove coupon
    removeCoupon: builder.mutation<CheckoutSession, void>({
      queryFn: () => {
        if (!checkoutSession) {
          return {
            error: {
              status: 404,
              statusText: "Not Found",
              data: "No active checkout session",
            },
          };
        }

        const discount =
          checkoutSession.checkoutState.appliedCouponDiscount || 0;

        checkoutSession = {
          ...checkoutSession,
          orderDetails: {
            ...checkoutSession.orderDetails,
            total: checkoutSession.orderDetails.total + discount,
            savings: checkoutSession.orderDetails.savings - discount,
          },
          checkoutState: {
            ...checkoutSession.checkoutState,
            appliedCouponCode: undefined,
            appliedCouponDiscount: undefined,
          },
        };

        return { data: checkoutSession };
      },
      invalidatesTags: ["CheckoutSession"],
    }),

    // Update payment method
    updatePaymentMethod: builder.mutation<CheckoutSession, string>({
      queryFn: (paymentMethod) => {
        if (!checkoutSession) {
          return {
            error: {
              status: 404,
              statusText: "Not Found",
              data: "No active checkout session",
            },
          };
        }

        checkoutSession = {
          ...checkoutSession,
          checkoutState: {
            ...checkoutSession.checkoutState,
            selectedPaymentMethod: paymentMethod,
          },
        };

        return { data: checkoutSession };
      },
      invalidatesTags: ["CheckoutSession"],
    }),

    // Create order
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      queryFn: async (request, { dispatch, getState }) => {
        if (!checkoutSession) {
          return {
            error: {
              status: 404,
              statusText: "Not Found",
              data: "No active checkout session",
            },
          };
        }

        // Validate required fields
        if (
          !request.deliveryAddress ||
          !request.billingAddress ||
          !request.paymentMethod
        ) {
          return {
            error: {
              status: 400,
              statusText: "Bad Request",
              data: "Missing required fields",
            },
          };
        }

        // Generate order ID
        const orderId = `ord_${Date.now()}`;
        const orderDisplayId = `#${Math.floor(10000 + Math.random() * 90000)}`;

        const loyaltyPointsEarned = 200;

        const state = getState() as any;
        if (state.user?.profile) {
          dispatch({
            type: "user/addLoyaltyPoints",
            payload: loyaltyPointsEarned,
          });
        }

        const response: CreateOrderResponse = {
          orderId,
          orderDisplayId,
          status: "completed",
          loyaltyPointsEarned,
          paymentUrl:
            request.paymentMethod === "google_pay" ? "/payment/upi" : undefined,
        };

        // Clear checkout session after order creation
        checkoutSession = null;

        return { data: response };
      },
      invalidatesTags: ["CheckoutSession"],
    }),

    // Clear checkout session
    clearCheckoutSession: builder.mutation<void, void>({
      queryFn: () => {
        checkoutSession = null;
        return { data: undefined };
      },
      invalidatesTags: ["CheckoutSession"],
    }),
  }),
});

export const {
  useInitializeCheckoutMutation,
  useGetCheckoutSessionQuery,
  useGetSavedAddressesQuery,
  useAddAddressMutation,
  useUpdateDeliveryAddressMutation,
  useUpdateBillingAddressMutation,
  useUpdateGiftingOptionsMutation,
  useGetCouponsQuery,
  useApplyCouponMutation,
  useRemoveCouponMutation,
  useUpdatePaymentMethodMutation,
  useCreateOrderMutation,
  useClearCheckoutSessionMutation,
} = checkoutApiService;
