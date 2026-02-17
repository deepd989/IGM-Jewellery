import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WRAPPER_API } from "../newApis/apiUrl.const";

export interface BrandCollection {
  title: string;
  description?: string;
  imageUri: string; //https://www.experapps.xyz/media/avatar/{file_id}
  productIds: string[];
}

// Define the API slice
export const collectionsApi = createApi({
  reducerPath: "collectionsApi",
  baseQuery: fetchBaseQuery({
    // Replace with your actual backend base URL
    baseUrl: WRAPPER_API + "/",
  }),
  tagTypes: ["Collections"],
  endpoints: (builder) => ({
    // Define the getCollections query
    getCollections: builder.query({
      query: () => "/getCollections",
      // This tag allows you to "invalidate" and refetch data later if needed
      providesTags: ["Collections"],

      transformResponse: (response) => {
        return response;
      },
    }),
  }),
});

// Export the auto-generated hook for the query
export const { useGetCollectionsQuery } = collectionsApi;
