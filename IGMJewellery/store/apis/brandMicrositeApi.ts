import {
  BrandMicrosite,
  BrandMicrositeRequest,
} from "@/interfaces/brandMicrosite.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WRAPPER_API } from "../newApis/apiUrl.const";

export const brandMicrositeApi = createApi({
  reducerPath: "brandMicrositeApi",
  baseQuery: fetchBaseQuery({ baseUrl: WRAPPER_API + "/" }),
  tagTypes: ["BrandMicrosite"],
  endpoints: (builder) => ({
    /**
     * A brand's microsite. Answers 404 for a brand that has none, which
     * surfaces as the query's error rather than an empty microsite.
     */
    getBrandMicrosite: builder.query<BrandMicrosite, string>({
      query: (brandId) => `brand-microsite/${brandId}`,
      providesTags: (result, error, brandId) => [
        { type: "BrandMicrosite", id: brandId },
      ],
    }),

    /** Creates or replaces a brand's microsite. */
    saveBrandMicrosite: builder.mutation<BrandMicrosite, BrandMicrositeRequest>({
      query: (body) => ({
        url: "brand-microsite",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) =>
        error ? [] : [{ type: "BrandMicrosite", id: arg.brandId }],
    }),
  }),
});

export const { useGetBrandMicrositeQuery, useSaveBrandMicrositeMutation } =
  brandMicrositeApi;
