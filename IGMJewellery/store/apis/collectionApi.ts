import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WRAPPER_API } from "../newApis/apiUrl.const";

export interface BrandCollection {
  title: string;
  description: string;
  collectionBannerImgUrl: string;
  productIds: string[];
}
export interface CollectionsResponse {
  [brandId: string]: {
    sellerName: string;
    sellerBannerImgUrl: string;
    collections: BrandCollection[];
  };
}

export const collectionsApi = createApi({
  reducerPath: "collectionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: WRAPPER_API + "/",
  }),
  tagTypes: ["Collections"],
  endpoints: (builder) => ({
    // 1. Pass <ResultType, QueryArgType>
    // Since you aren't passing any arguments (query: () => ...), use 'void'
    getCollections: builder.query<CollectionsResponse, void>({
      query: () => "/getCollections",
      providesTags: ["Collections"],

      // The response is now automatically typed as CollectionsResponse
      transformResponse: (response: CollectionsResponse) => {
        return response;
      },
    }),
  }),
});

// Export the auto-generated hook for the query
export const { useGetCollectionsQuery } = collectionsApi;
