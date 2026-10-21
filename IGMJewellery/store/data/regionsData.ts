import { assetUrl } from "@/constants/assets";

/**
 * The regions the storefront sells from, the artwork that represents them, and
 * the params /product-list expects — this is the single source of truth every
 * regions UI reads from, so they can never drift apart.
 */
export interface RegionCollection {
  title: string;
}

export interface Region {
  id: string;
  /** `region` param /product-list filters by (lower-cased on the way out). */
  region: string;
  sellerName: string;
  /** Banner shown at the top of the product list. */
  sellerBannerImgUrl: string;
  collections: RegionCollection[];
  /** The craft the region is known for. */
  craftName: string;
  /** Short blurb about that craft. */
  description: string;
  /** Portrait artwork for large, editorial region cards. Placeholder for now. */
  portraitImageUrl?: string;
  /** Product close-up beside the blurb. Placeholder for now. */
  productImageUrl?: string;
}

export const REGIONS: Record<string, Region> = {
  "7": {
    id: "7",
    region: "Tamil Nadu",
    sellerName: "Tamil Nadu Silks",
    sellerBannerImgUrl: assetUrl("region.banner.tamilNadu"),
    collections: [{ title: "Kanchipuram Specials" }],
    craftName: "Temple Jewellery",
    description:
      "Gold work born in the temples of Tamil Nadu, carrying deity motifs once made for temple dancers.",
    portraitImageUrl: assetUrl("region.portrait.tamilNadu"),
    productImageUrl: assetUrl("region.product.tamilNadu"),
  },
  "6": {
    id: "6",
    region: "Rajasthan",
    sellerName: "Rajasthan Royal Gems",
    sellerBannerImgUrl: assetUrl("region.banner.rajasthan"),
    collections: [{ title: "Jaipur Jewelry" }],
    craftName: "Thewa Jewellery",
    description:
      "A 400-year-old art form from Rajasthan, with gold filigree work fused onto brightly colored glass.",
    portraitImageUrl: assetUrl("region.portrait.rajasthan"),
    productImageUrl: assetUrl("region.product.rajasthan"),
  },
  "2": {
    id: "2",
    region: "Gujarat",
    sellerName: "Gujarat Gold & Silk",
    sellerBannerImgUrl: assetUrl("region.banner.gujarat"),
    collections: [{ title: "Patola Collections" }],
    craftName: "Kutch Silver",
    description:
      "Oxidised silver from the Kutch desert, hand-punched with the beadwork motifs the region is known for.",
    portraitImageUrl: assetUrl("region.portrait.gujarat"),
    productImageUrl: assetUrl("region.product.gujarat"),
  },
  "1": {
    id: "1",
    region: "Assam",
    sellerName: "Assam Heritage",
    sellerBannerImgUrl: assetUrl("region.banner.assam"),
    collections: [{ title: "Silk & Tea Crafts" }],
    craftName: "Assamese Gold",
    description:
      "Enamelled gold pieces such as the Gam Kharu and Jonbiri, shaped after the valley's flowers and birds.",
    portraitImageUrl: assetUrl("region.portrait.assam"),
    productImageUrl: assetUrl("region.product.assam"),
  },
  "3": {
    id: "3",
    region: "Kerala",
    sellerName: "Kerala Spices & Arts",
    sellerBannerImgUrl: assetUrl("region.banner.kerala"),
    collections: [{ title: "Traditional Handloom" }],
    craftName: "Kasu Mala",
    description:
      "Layered coin and Palakka necklaces in warm Kerala gold, worn for weddings and temple festivals.",
    portraitImageUrl: assetUrl("region.portrait.kerala"),
    productImageUrl: assetUrl("region.product.kerala"),
  },
  "4": {
    id: "4",
    region: "Odisha",
    sellerName: "Odisha Temple Crafts",
    sellerBannerImgUrl: assetUrl("region.banner.odisha"),
    collections: [{ title: "Silver Filigree" }],
    craftName: "Tarakasi Filigree",
    description:
      "Cuttack's silver filigree, drawn into threads finer than wire and coiled into lace by hand.",
    portraitImageUrl: assetUrl("region.portrait.odisha"),
    productImageUrl: assetUrl("region.product.odisha"),
  },
  "5": {
    id: "5",
    region: "Punjab",
    sellerName: "Punjab Phulkari House",
    sellerBannerImgUrl: assetUrl("region.banner.punjab"),
    collections: [{ title: "Embroidered Heritage" }],
    craftName: "Pippal Patti",
    description:
      "Leaf-shaped gold jhumkas and jadau sets that echo the Phulkari embroidery of Punjab.",
    portraitImageUrl: assetUrl("region.portrait.punjab"),
    productImageUrl: assetUrl("region.product.punjab"),
  },
  "8": {
    id: "8",
    region: "Telangana",
    sellerName: "Telangana Pearl Co.",
    sellerBannerImgUrl: assetUrl("region.banner.telangana"),
    collections: [{ title: "Hyderabadi Jewelry" }],
    craftName: "Hyderabadi Pearls",
    description:
      "The pearl strings and Karanphool sets that made Hyderabad the city of pearls.",
    portraitImageUrl: assetUrl("region.portrait.telangana"),
    productImageUrl: assetUrl("region.product.telangana"),
  },
  "9": {
    id: "9",
    region: "West Bengal",
    sellerName: "West Bengal Artistry",
    sellerBannerImgUrl: assetUrl("region.banner.westBengal"),
    collections: [{ title: "Terracotta & Silk" }],
    craftName: "Nakshi Gold",
    description:
      "Bengal's nakshi work — gold beaten thin and chased with patterns, from bala bangles to sita haars.",
    portraitImageUrl: assetUrl("region.portrait.westBengal"),
    productImageUrl: assetUrl("region.product.westBengal"),
  },
};

/** The order the storefront shows regions in. */
export const REGION_ORDER = ["7", "6", "2", "1", "3", "4", "5", "8", "9"];

/** Every region, already in display order. */
export const REGION_LIST: Region[] = REGION_ORDER.map((id) => REGIONS[id]).filter(
  Boolean
);

/** The one definition of where tapping a region takes the shopper. */
export const getRegionRoute = (region: Region) => ({
  pathname: "/product-list" as const,
  params: {
    region: region.region.toLowerCase(),
    bannerImageUrl: encodeURIComponent(region.sellerBannerImgUrl),
  },
});
