import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WRAPPER_API } from "../newApis/apiUrl.const";

export interface BrandAboutSection {
  title?: string;
  paragraphs: string[];
}

export interface Brand {
  bwThumbnailUri?: string;
  profileImageUri: string;
  businessNameKey: string; // optional key for internal use
  businessName: string; // shop_title
  tagline: string; // privacy
  ratingText: string;
  storeButtonLabel: string;
  aboutSections: BrandAboutSection[];
}

interface BrandsQueryParams {
  searchQuery?: string;
}

export interface ApiBrand {
  brandid: string | number;

  brandName: string;

  logoPic: string | null;

  description: string | null;

  tagline: string | null;
}

export const convertApiBrandToBrand = (apiBrand: ApiBrand): Brand => {
  // Generate random rating between 3.5 and 5.0
  const randomRating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);

  return {
    bwThumbnailUri: apiBrand.logoPic || undefined,
    profileImageUri: apiBrand.logoPic || "",
    businessNameKey:
      apiBrand.brandName?.toLowerCase().replace(/\s+/g, "_") || "",
    businessName: apiBrand.brandName,
    tagline: apiBrand.tagline || "",
    ratingText: `${randomRating} · 1k+ reviews`,
    storeButtonLabel: "Visit Site",
    aboutSections: [
      {
        title: "",
        paragraphs: apiBrand.description ? [apiBrand.description] : [],
      },
    ],
  };
};

export const brandsApiService = createApi({
  reducerPath: "brands",
  baseQuery: fetchBaseQuery({ baseUrl: WRAPPER_API + "/" }),
  endpoints: (builder) => ({
    getBrands: builder.query<Brand[], BrandsQueryParams | void>({
      query: () => "/getSellers",
      transformResponse: (response: ApiBrand[], meta, arg) => {
        // Map the API response to your UI model
        let brands = response.map(convertApiBrandToBrand);

        // Client-side filtering
        if (arg?.searchQuery) {
          const q = arg.searchQuery.toLowerCase();
          brands = brands.filter(
            (b) =>
              b.businessName.toLowerCase().includes(q) ||
              b.tagline.toLowerCase().includes(q)
          );
        }
        return brands;
      },
    }),

    getBrandByName: builder.query<Brand | undefined, string>({
      query: () => "/getSellers",
      transformResponse: (response: ApiBrand[], meta, name) => {
        const brands = response.map(convertApiBrandToBrand);
        console.log(
          name,
          brands.map((b) => b.businessNameKey)
        );
        const found = brands.find(
          (b) => b.businessNameKey.toLowerCase() === name.toLowerCase()
        );
        return found;
      },
    }),
  }),
});

export const { useGetBrandsQuery, useGetBrandByNameQuery } = brandsApiService;
