import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface GiftCardData {
  id?: number;
  date: string;
  type: string;
  title: string;
  amount: number;
  status: "unclaimed" | "claimed" | "redeemed" | "expired";
  senderName: string;
  giftMessage: string;
  senderid: string;
}

export interface SendGiftRequest {
  receiverId: string;
  amount: number;
  message: string;
  title: string;
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
    senderid: "+91 9876543210",
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
    senderid: "+91 9876543220",
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
    senderid: "+91 9876543221",
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
    senderid: "+91 9876543223",
  },
];

// Initialize mutable state
let currentState: GiftsState = { gifts: [...MOCK_GIFTS] };

export const giftApi = createApi({
  reducerPath: "giftApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  tagTypes: ["Gifts"],
  endpoints: (builder) => ({
    // 1. Fetch all gifts
    getAllGifts: builder.query<GiftCardData[], string>({
      query: (userid) => `users/${userid}`,
      transformResponse: (response: { gifts: GiftCardData[] }) => {
        return response.gifts;
      },
      providesTags: ["Gifts"],
    }),

    // 2. Delete a gift
    redeemGift: builder.mutation<
      { success: boolean; walletBalance: number }, // Adjusted to match your API response
      { userid: string; giftid: string }
    >({
      query: ({ userid, giftid }) => ({
        url: "/redeemGiftUserId",
        method: "POST",
        body: { userid, giftid },
      }),
      invalidatesTags: (result, error) => (error ? [] : ["Gifts"]),
    }),

    sendGift: builder.mutation<
      GiftCardData,
      SendGiftRequest & { userid: string }
    >({
      query: ({ userid, ...giftDetails }) => ({
        url: "/addGift",
        method: "POST",
        body: {
          userid: userid,
          gift: {
            date: new Date().toISOString(),
            title: giftDetails.title,
            amount: giftDetails.amount,
            giftMessage: giftDetails.message,
            receiverid: giftDetails.receiverId,
          },
        },
      }),
      invalidatesTags: ["Gifts"],
    }),
  }),
});

export const {
  useGetAllGiftsQuery,
  useRedeemGiftMutation,
  useSendGiftMutation,
} = giftApi;
