import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WRAPPER_API } from "../newApis/apiUrl.const";

export interface BrandAboutSection {
  title?: string;
  paragraphs: string[];
}

export interface Brand {
  id: string;
  bwThumbnailUri?: string;
  profileImageUri: string;
  /** Brand's signature colour, used as a backdrop behind its imagery. */
  brandPrimaryColor?: string;
  /** Cover art for the brand's feature tile. */
  mainCoverUri?: string;
  /** Cover art for the brand's "New In" tile. */
  newInCoverUri?: string;
  /** Cover art for the brand's "Collections" tile. */
  collectionsCoverUri?: string;
  businessNameKey: string; // optional key for internal use
  businessName: string; // shop_title
  tagline: string; // privacy
  ratingText: string;
  storeButtonLabel: string;
  aboutSections: BrandAboutSection[];
}

/**
 * The house LUXE carries. Everything else in the catalogue is withheld while
 * the luxury storefront is showing; Massy still sees the whole list.
 */
export const LUXE_BRAND_IDS = ["4","10","12", "13", "15", "18", "25"];

export interface BrandsQueryParams {
  searchQuery?: string;
  /**
   * Narrows the list to {@link LUXE_BRAND_IDS}. Passed as an argument rather
   * than read from a module flag so the two storefronts cache separately —
   * `transformResponse` only runs on a fetch, so a flag flipped after one
   * would leave the other's list in place.
   */
  luxeOnly?: boolean;
}

export interface ApiBrand {
  brandid: string | number;

  brandName: string;

  logoPic: string | null;

  description: string | null;

  tagline: string | null;

  brandPrimaryColor?: string | null;

  mainCover?: string | null;

  newInCover?: string | null;

  collectionsCover?: string | null;
}

export const convertApiBrandToBrand = (apiBrand: ApiBrand): Brand => {
  // Generate random rating between 3.5 and 5.0
  const randomRating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);

  return {
    id: apiBrand.brandid.toString(),
    bwThumbnailUri: apiBrand.logoPic || undefined,
    profileImageUri: apiBrand.logoPic || "",
    brandPrimaryColor: apiBrand.brandPrimaryColor || undefined,
    mainCoverUri: apiBrand.mainCover || undefined,
    newInCoverUri: apiBrand.newInCover || undefined,
    collectionsCoverUri: apiBrand.collectionsCover || undefined,
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

        if (arg?.luxeOnly) {
          brands = brands.filter((b) => LUXE_BRAND_IDS.includes(b.id));
        }else{
          brands = brands.filter((b) => !LUXE_BRAND_IDS.includes(b.id));
        }

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
        let found = brands.find(
          (b) => b.businessNameKey.toLowerCase() === name.toLowerCase()
        );
        if (!found) {
          found = brands.find(
            (b) => b.businessName.toLowerCase() === name.toLowerCase()
          );
        }
        if (!found) {
          console.warn(`Brand not found for name: ${name}`);
        }
        return found;
      },
    }),
  }),
});

export const { useGetBrandsQuery, useGetBrandByNameQuery } = brandsApiService;
