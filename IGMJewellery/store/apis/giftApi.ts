import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WRAPPER_API } from "../newApis/apiUrl.const";

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

export const giftApi = createApi({
  reducerPath: "giftApi",
  baseQuery: fetchBaseQuery({ baseUrl: WRAPPER_API + "/" }),
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
