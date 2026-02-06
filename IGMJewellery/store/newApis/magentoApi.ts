import { MagentoProduct } from "@/magentoModels/product.model";
import { AttributeOption, SellerListResponse } from "@/magentoModels/seller.model";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ACCESS_TOKEN, API_BASE_URL, API_ENDPOINTS } from "./apiUrl.const";

/**
 * Magento API Service
 * Central service for all Magento API calls
 */
export const magentoApiService = createApi({
  reducerPath: "magentoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${API_ACCESS_TOKEN}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get all sellers
    getSellers: builder.query<SellerListResponse, string | void>({
      query: (searchCriteria = "string") => 
        `${API_ENDPOINTS.SELLERS}?searchCriteria=${searchCriteria}`,
    }),

    // Get products for a specific seller
    getSellerProducts: builder.query<MagentoProduct[], string>({
      query: (sellerId) => API_ENDPOINTS.SELLER_PRODUCTS(sellerId),
    }),

    // Get attribute options for resolving custom_attributes
    getAttributeOptions: builder.query<AttributeOption[], string>({
      query: (attributeCode) => API_ENDPOINTS.ATTRIBUTE_OPTIONS(attributeCode),
    }),
  }),
});

export const {
  useGetSellersQuery,
  useGetSellerProductsQuery,
  useGetAttributeOptionsQuery,
  useLazyGetSellersQuery,
  useLazyGetSellerProductsQuery,
  useLazyGetAttributeOptionsQuery,
} = magentoApiService;
