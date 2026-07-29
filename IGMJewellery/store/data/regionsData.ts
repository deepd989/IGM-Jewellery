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
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FTamil%20Nadu.webp?alt=media&token=4e789072-3553-4552-9e3c-541f0d2b7e9f",
    collections: [{ title: "Kanchipuram Specials" }],
    craftName: "Temple Jewellery",
    description:
      "Gold work born in the temples of Tamil Nadu, carrying deity motifs once made for temple dancers.",
    portraitImageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    productImageUrl:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
  },
  "6": {
    id: "6",
    region: "Rajasthan",
    sellerName: "Rajasthan Royal Gems",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FRajasthan.webp?alt=media&token=52ed7845-1514-47bb-80af-648441526c57",
    collections: [{ title: "Jaipur Jewelry" }],
    craftName: "Thewa Jewellery",
    description:
      "A 400-year-old art form from Rajasthan, with gold filigree work fused onto brightly colored glass.",
    portraitImageUrl:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800&auto=format&fit=crop",
    productImageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
  },
  "2": {
    id: "2",
    region: "Gujarat",
    sellerName: "Gujarat Gold & Silk",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FGujarat.webp?alt=media&token=0c187c11-3240-4630-9dac-efa1c314b1f0",
    collections: [{ title: "Patola Collections" }],
    craftName: "Kutch Silver",
    description:
      "Oxidised silver from the Kutch desert, hand-punched with the beadwork motifs the region is known for.",
    portraitImageUrl:
      "https://images.unsplash.com/photo-1595535373192-fc8935bacd89?q=80&w=800&auto=format&fit=crop",
    productImageUrl:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=800&auto=format&fit=crop",
  },
  "1": {
    id: "1",
    region: "Assam",
    sellerName: "Assam Heritage",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FAssam.webp?alt=media&token=585608eb-b703-4f04-9183-117cbdc179a5",
    collections: [{ title: "Silk & Tea Crafts" }],
    craftName: "Assamese Gold",
    description:
      "Enamelled gold pieces such as the Gam Kharu and Jonbiri, shaped after the valley's flowers and birds.",
    portraitImageUrl:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop",
    productImageUrl:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
  },
  "3": {
    id: "3",
    region: "Kerala",
    sellerName: "Kerala Spices & Arts",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FKerala.webp?alt=media&token=12bef91c-3f2b-4263-9797-ac9570a8e738",
    collections: [{ title: "Traditional Handloom" }],
    craftName: "Kasu Mala",
    description:
      "Layered coin and Palakka necklaces in warm Kerala gold, worn for weddings and temple festivals.",
    portraitImageUrl:
      "https://images.unsplash.com/photo-1602752250015-52934bc45613?q=80&w=800&auto=format&fit=crop",
    productImageUrl:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
  },
  "4": {
    id: "4",
    region: "Odisha",
    sellerName: "Odisha Temple Crafts",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FOdisha.webp?alt=media&token=264f073e-0ca8-4c8e-b316-755a58af3a70",
    collections: [{ title: "Silver Filigree" }],
    craftName: "Tarakasi Filigree",
    description:
      "Cuttack's silver filigree, drawn into threads finer than wire and coiled into lace by hand.",
    portraitImageUrl:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=800&auto=format&fit=crop",
    productImageUrl:
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
  },
  "5": {
    id: "5",
    region: "Punjab",
    sellerName: "Punjab Phulkari House",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FPunjab.webp?alt=media&token=e68e7ad9-d7bf-4318-a4e7-5876867ebb78",
    collections: [{ title: "Embroidered Heritage" }],
    craftName: "Pippal Patti",
    description:
      "Leaf-shaped gold jhumkas and jadau sets that echo the Phulkari embroidery of Punjab.",
    portraitImageUrl:
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=800&auto=format&fit=crop",
    productImageUrl:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
  },
  "8": {
    id: "8",
    region: "Telangana",
    sellerName: "Telangana Pearl Co.",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FTelangana.webp?alt=media&token=fcdc5631-ce8c-47f7-9e66-17a1e7883ee5",
    collections: [{ title: "Hyderabadi Jewelry" }],
    craftName: "Hyderabadi Pearls",
    description:
      "The pearl strings and Karanphool sets that made Hyderabad the city of pearls.",
    portraitImageUrl:
      "https://images.unsplash.com/photo-1600721391689-2564bb8055de?q=80&w=800&auto=format&fit=crop",
    productImageUrl:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=800&auto=format&fit=crop",
  },
  "9": {
    id: "9",
    region: "West Bengal",
    sellerName: "West Bengal Artistry",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FWest%20Bengal.webp?alt=media&token=2a546938-3731-43a2-9b7a-bcbca11ca117",
    collections: [{ title: "Terracotta & Silk" }],
    craftName: "Nakshi Gold",
    description:
      "Bengal's nakshi work — gold beaten thin and chased with patterns, from bala bangles to sita haars.",
    portraitImageUrl:
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=800&auto=format&fit=crop",
    productImageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
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
