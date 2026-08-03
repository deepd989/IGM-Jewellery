/**
 * The two storefronts the app presents. Everything that names one — a toggle,
 * a switch, a label — reads from here rather than repeating the string, so
 * renaming a storefront is one edit and a typo is a type error.
 *
 * The identifier is not the word a shopper sees: `luxe` is shown as "LUXE" on
 * the toggle and as "Luxury" on the cover that runs while the storefronts
 * swap. Those live below, one map per surface, since they genuinely differ.
 */
export const STOREFRONT = {
  massy: "elanzia",
  luxe: "luxe",
} as const;

export type Storefront = (typeof STOREFRONT)[keyof typeof STOREFRONT];

/** What the header's segmented toggle calls each storefront. */
export const STOREFRONT_LABEL: Record<Storefront, string> = {
  [STOREFRONT.massy]: "Elanzia",
  [STOREFRONT.luxe]: "LUXE",
};

/** What the cover names while the storefronts swap under it. */
export const STOREFRONT_SWITCH_LABEL: Record<Storefront, string> = {
  [STOREFRONT.massy]: "ELANZIA",
  [STOREFRONT.luxe]: "LUXE",
};

/** The storefront a `isLuxury` flag stands for. */
export const storefrontOf = (isLuxury: boolean): Storefront =>
  isLuxury ? STOREFRONT.luxe : STOREFRONT.massy;
