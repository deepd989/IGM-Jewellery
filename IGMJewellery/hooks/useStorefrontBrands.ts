import { useLuxury } from "@/context/luxuryContext";
import {
  BrandsQueryParams,
  useGetBrandsQuery,
} from "@/store/apis/brandsApi";

/**
 * The brands the storefront the shopper is browsing carries.
 *
 * LUXE stocks only its own house — see `LUXE_BRAND_IDS` — while Massy shows
 * the whole catalogue. Every brand list reads through this rather than calling
 * `useGetBrandsQuery` directly, so the two storefronts can never disagree
 * about what is on offer.
 *
 * Returns the query result unchanged, so it is a drop-in for the generated
 * hook.
 */
export function useStorefrontBrands(params?: BrandsQueryParams) {
  const { isLuxury } = useLuxury();

  return useGetBrandsQuery({ ...params, luxeOnly: isLuxury });
}
