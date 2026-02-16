import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WRAPPER_API } from "../newApis/apiUrl.const";

export const textSearchApi = createApi({
  reducerPath: "textSearchApi",
  baseQuery: fetchBaseQuery({ baseUrl: WRAPPER_API + "/" }), // Replace with your server URL
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
