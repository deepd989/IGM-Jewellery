import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const textSearchApi = createApi({
  reducerPath: "textSearchApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }), // Replace with your server URL
  endpoints: (builder) => ({
    searchJewelry: builder.mutation({
      query: ({ userMessage, previousBotMessages }) => ({
        url: "/textsearchAi",
        method: "POST",
        body: { userMessage, previousBotMessages },
      }),
    }),
  }),
});

export const { useSearchJewelryMutation } = textSearchApi;
