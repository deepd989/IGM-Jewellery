import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WRAPPER_API } from "../newApis/apiUrl.const";

export interface MultiBrandCollection {
  id: string;
  name: string;
  collectionBannerUrl: string;
}

export const multiBrandCollectionsApi = createApi({
  reducerPath: "multibrandCollectionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: WRAPPER_API + "/",
  }),
  tagTypes: ["multibrandCollections"],
  endpoints: (builder) => ({
    getMultiBrandCollections: builder.query<MultiBrandCollection[], void>({
      query: () => "/multibrandCollections",
      providesTags: ["multibrandCollections"],

      transformResponse: (response: MultiBrandCollection[]) => {
        return response;
      },
    }),
  }),
});

// Export the auto-generated hook for the query
export const { useGetMultiBrandCollectionsQuery } = multiBrandCollectionsApi;
