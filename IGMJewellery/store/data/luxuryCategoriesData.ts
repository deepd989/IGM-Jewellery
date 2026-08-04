import { assetUrl } from "@/constants/assets";

/**
 * A category tile in the luxury storefront's "Shop by Categories" section.
 *
 * This is its own source rather than a read of SHOP_CATEGORIES. That list is
 * shared with the classic storefront and carries what the classic UIs need —
 * bundled icons, sub-category lists — while its cover artwork is a borrowed
 * sub-category thumbnail. The luxury tiles are full-bleed editorial shots with
 * manifest keys of their own, so the two can be re-shot and re-ordered
 * independently.
 */
export interface LuxuryShopCategory {
  id: string;
  /** Label shown on the tile. */
  name: string;
  /** `categoryName` param /product-list filters by. */
  categoryName: string;
  /** `productType` param /product-list filters by. */
  productType: string;
  /**
   * Full-bleed tile artwork. Addressed by manifest key rather than URL, so the
   * shot can be swapped from the backend without shipping a build.
   */
  coverImageUrl: string;
  /** Banner shown at the top of the product list the tile opens. */
  bannerUrl: string;
}

/**
 * The categories the section shows, in the order it shows them.
 *
 * The order is the layout: the section pages in threes, and the first of each
 * three is the tall feature tile beside a column of two.
 */
export const LUXURY_SHOP_CATEGORIES: LuxuryShopCategory[] = [
  {
    id: "necklace",
    name: "Necklace",
    categoryName: "Necklace",
    productType: "necklace",
    coverImageUrl: assetUrl("luxury.shopByCategory.necklace"),
    bannerUrl: assetUrl("category.banner.necklace"),
  },
  {
    id: "bracelet",
    name: "Bracelets",
    categoryName: "Bracelet",
    productType: "bracelet",
    coverImageUrl: assetUrl("luxury.shopByCategory.bracelet"),
    bannerUrl: assetUrl("category.banner.bracelet"),
  },
  {
    id: "earring",
    name: "Earrings",
    categoryName: "Earrings",
    productType: "earring",
    coverImageUrl: assetUrl("luxury.shopByCategory.earring"),
    bannerUrl: assetUrl("category.banner.earring"),
  },
  {
    id: "ring",
    name: "Rings",
    categoryName: "Rings",
    productType: "ring",
    coverImageUrl: assetUrl("luxury.shopByCategory.ring"),
    bannerUrl: assetUrl("category.banner.ring"),
  },
  {
    id: "bangle",
    name: "Bangles",
    categoryName: "Bangles",
    productType: "bangle",
    coverImageUrl: assetUrl("luxury.shopByCategory.bangle"),
    bannerUrl: assetUrl("category.banner.bangle"),
  },
  {
    id: "mangalsutra",
    name: "Mangalsutra",
    categoryName: "Mangalsutra",
    productType: "mangalsutra",
    coverImageUrl: assetUrl("luxury.shopByCategory.mangalsutra"),
    // The tile has a shot of its own, but there is still no mangalsutra banner
    // on the backend, so the product list it opens borrows the bangles one —
    // point this at `category.banner.mangalsutra` once that artwork exists.
    bannerUrl: assetUrl("category.banner.bangle"),
  },
];

/** The one definition of where tapping a luxury category tile takes the shopper. */
export const getLuxuryCategoryRoute = (category: LuxuryShopCategory) => ({
  pathname: "/product-list" as const,
  params: {
    categoryName: category.categoryName,
    productType: category.productType,
    bannerImageUrl: encodeURIComponent(category.bannerUrl),
  },
});
