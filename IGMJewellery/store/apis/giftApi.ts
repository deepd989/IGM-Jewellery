import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface GiftCardData {
  id: number;
  date: string;
  type: string;
  title: string;
  amount: number;
  status: "unclaimed" | "claimed" | "redeemed" | "expired";
  senderName: string;
  giftMessage: string;
  senderPhone: string;
}

export interface SendGiftRequest {
  receiverId: string;
  amount: number;
  message: string;
  senderName: string;
}

interface GiftsState {
  gifts: GiftCardData[];
}

const MOCK_GIFTS: GiftCardData[] = [
  {
    id: 1,
    date: "11/25",
    type: "IGM Gift Card",
    title: "Happy Birthday!",
    amount: 10000,
    status: "unclaimed",
    senderName: "Alice",
    giftMessage: "Wishing you a day filled with love and joy!",
    senderPhone: "+91 9876543210",
  },
  {
    id: 2,
    date: "11/25",
    type: "IGM Gift Card",
    title: "Get Well Soon!",
    amount: 2000,
    status: "unclaimed",
    senderName: "Bob",
    giftMessage: "Hope you feel better soon!",
    senderPhone: "+91 9876543220",
  },
  {
    id: 3,
    date: "11/20",
    type: "IGM Gift Card",
    title: "Congratulations!",
    amount: 5000,
    status: "redeemed",
    senderName: "Charlie",
    giftMessage: "Well done on your achievement!",
    senderPhone: "+91 9876543221",
  },
  {
    id: 4,
    date: "10/15",
    type: "IGM Gift Card",
    title: "Happy Anniversary!",
    amount: 3000,
    status: "expired",
    senderName: "Diana",
    giftMessage: "Cheers to many more years together!",
    senderPhone: "+91 9876543223",
  },
];

// Initialize mutable state
let currentState: GiftsState = { gifts: [...MOCK_GIFTS] };

export const giftApi = createApi({
  reducerPath: "giftApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Gifts"],
  endpoints: (builder) => ({
    // 1. Fetch all gifts
    getAllGifts: builder.query<GiftsState, void>({
      queryFn: () => ({ data: currentState }),
      providesTags: ["Gifts"],
    }),

    // 2. Delete a gift
    deleteGift: builder.mutation<{ success: boolean }, number>({
      queryFn: (giftId) => {
        const initialLength = currentState.gifts.length;
        // Filter out the gift from currentState
        let newGiftsArray = currentState.gifts.filter((g) => g.id !== giftId);
        currentState = { ...currentState, gifts: newGiftsArray };
        if (currentState.gifts.length < initialLength) {
          return { data: { success: true } };
        }

        return {
          error: {
            status: 404,
            statusText: "Not Found",
            data: "Gift not found",
          },
        };
      },
      invalidatesTags: ["Gifts"],
    }),

    // 3. Send a gift
    sendGift: builder.mutation<GiftCardData, SendGiftRequest>({
      queryFn: (giftDetails: SendGiftRequest) => {
        // Find the highest current ID to avoid duplicates
        const newId = currentState.gifts.reduce(
          (max, g) => Math.max(max, g.id),
          0
        );

        const newGift: GiftCardData = {
          id: newId + 1,
          date: new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
          }),
          type: "IGM Gift Card",
          title: "Gift Card",
          amount: giftDetails.amount,
          status: "unclaimed",
          senderName: giftDetails.senderName,
          giftMessage: giftDetails.message,
          senderPhone: "",
        };
        // currentState.gifts = [...currentState.gifts, newGift];

        return { data: newGift };
      },
      invalidatesTags: ["Gifts"],
    }),
  }),
});

export const {
  useGetAllGiftsQuery,
  useDeleteGiftMutation,
  useSendGiftMutation,
} = giftApi;
