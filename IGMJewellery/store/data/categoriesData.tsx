import { ImageSourcePropType } from "react-native";
import { Department, SubCategory } from "../../interfaces/category.interface";

const menDepartmentImage = require("../../assets/images/men_department.png");
const womenDepartmentImage = require("../../assets/images/women_department.png");
const kidsDepartmentImage = require("../../assets/images/kids_department.png");

export const SUB_CATS_RINGS: SubCategory[] = [
  {
    id: "all",
    name: "All",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FRings%2FRing_religious1.webp?alt=media&token=6737a299-e713-42cb-9494-686aec24beda",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FRings%2FCategories_Rings.webp?alt=media&token=75c5bbc1-8e79-4381-abea-e54ded4a129c",
  },
  {
    id: "eternity",
    name: "Eternity",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FRings%2FRing_Eternity.webp?alt=media&token=195729b9-5863-440c-b8cd-762318f7de62",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FRings%2FCategories_Rings.webp?alt=media&token=75c5bbc1-8e79-4381-abea-e54ded4a129c",
  },
  {
    id: "anniversary",
    name: "Anniversary",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FRings%2FRing_anniversary.webp?alt=media&token=9cad0037-bb91-4334-a586-d5290f309bdb",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FRings%2FCategories_Rings.webp?alt=media&token=75c5bbc1-8e79-4381-abea-e54ded4a129c",
  },
  {
    id: "wedding",
    name: "Wedding",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FRings%2FRing_anniversary.webp?alt=media&token=9cad0037-bb91-4334-a586-d5290f309bdb",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FRings%2FCategories_Rings.webp?alt=media&token=75c5bbc1-8e79-4381-abea-e54ded4a129c",
  },
  {
    id: "bands",
    name: "Bands",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FRings%2FRing_band1.webp?alt=media&token=1676602b-9970-4faa-8b26-c4cdda0ac9bd",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FRings%2FCategories_Rings.webp?alt=media&token=75c5bbc1-8e79-4381-abea-e54ded4a129c",
  },
  {
    id: "navratna",
    name: "Navratna",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FRings%2FRing_navratna2.webp?alt=media&token=f9c9debf-7a54-4599-90cf-f06d7f3bad48",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FRings%2FCategories_Rings.webp?alt=media&token=75c5bbc1-8e79-4381-abea-e54ded4a129c",
  },
  {
    id: "religious",
    name: "Religious",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FRings%2FRing_religious1.webp?alt=media&token=6737a299-e713-42cb-9494-686aec24beda",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FRings%2FCategories_Rings.webp?alt=media&token=75c5bbc1-8e79-4381-abea-e54ded4a129c",
  },
  {
    id: "solitaire",
    name: "Solitaire",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FRings%2FRing_solitaire.jpg?alt=media&token=aba2d16c-418e-4dc0-9e05-411bdc62b0ea",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FRings%2FCategories_Rings.webp?alt=media&token=75c5bbc1-8e79-4381-abea-e54ded4a129c",
  },
];

export const SUB_CATS_NECKLACE: SubCategory[] = [
  {
    id: "all",
    name: "All",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FNecklace%2FNecklace_Religious.webp?alt=media&token=470b92fc-5ee7-4fe3-9902-3583ff6f533d",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FNecklace%2FCategories_Necklace.webp?alt=media&token=ad8ba455-b557-400d-b1e6-eff9488655c4",
  },
  {
    id: "choker",
    name: "Choker",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FNecklace%2FNecklace_choker.webp?alt=media&token=d3498606-54e0-46fc-a3eb-a643a754ce9b",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FNecklace%2FCategories_Necklace.webp?alt=media&token=ad8ba455-b557-400d-b1e6-eff9488655c4",
  },
  {
    id: "antique",
    name: "Antique",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FNecklace%2FNeckalace_Antique_religious%20copy%203.webp?alt=media&token=4b8872b8-f7f8-493f-b3e9-2833856c1595",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FNecklace%2FCategories_Necklace.webp?alt=media&token=ad8ba455-b557-400d-b1e6-eff9488655c4",
  },
  {
    id: "lariat",
    name: "Lariat",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FNecklace%2FNecklace_lariat.webp?alt=media&token=118c700f-0746-4370-86df-5974d4c27907",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FNecklace%2FCategories_Necklace.webp?alt=media&token=ad8ba455-b557-400d-b1e6-eff9488655c4",
  },
  {
    id: "gemstone",
    name: "Gemstone",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FNecklace%2FNeckalace_gemstone.webp?alt=media&token=e8bd0db1-3c90-4dea-b776-4d8cc10bd480",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FNecklace%2FCategories_Necklace.webp?alt=media&token=ad8ba455-b557-400d-b1e6-eff9488655c4",
  },
  {
    id: "religious",
    name: "Religious",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FNecklace%2FNecklace_Religious.webp?alt=media&token=470b92fc-5ee7-4fe3-9902-3583ff6f533d",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FNecklace%2FCategories_Necklace.webp?alt=media&token=ad8ba455-b557-400d-b1e6-eff9488655c4",
  },
  {
    id: "rani",
    name: "Rani",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FNecklace%2FNecklace_rani%20haar.webp?alt=media&token=b45d16b9-3ecf-479a-8d19-0076fd9fcddd",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FNecklace%2FCategories_Necklace.webp?alt=media&token=ad8ba455-b557-400d-b1e6-eff9488655c4",
  },
];

export const SUB_CATS_EARRING: SubCategory[] = [
  {
    id: "all",
    name: "All",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FEarrings%2FEarring_Jhumka1.webp?alt=media&token=72fbb7d6-ffc8-4de1-8a8a-c9cc9b349152",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FEarrings%2FCategories_Earrings.webp?alt=media&token=03c91ec1-33d1-438b-a3f0-28fd1d57cb0d",
  },
  {
    id: "chandbali",
    name: "Chandbali",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FEarrings%2FEarring_Chandbali.webp?alt=media&token=3987845a-551a-4c12-98cd-a1b26ac2513f",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FEarrings%2FCategories_Earrings.webp?alt=media&token=03c91ec1-33d1-438b-a3f0-28fd1d57cb0d",
  },
  {
    id: "drops",
    name: "Drops",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FEarrings%2FEarring_Drops3.webp?alt=media&token=905e864f-4eb1-4bc5-a68b-494ffb4c746a",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FEarrings%2FCategories_Earrings.webp?alt=media&token=03c91ec1-33d1-438b-a3f0-28fd1d57cb0d",
  },
  {
    id: "chandelier",
    name: "Chandelier",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FEarrings%2FEarrings_chandelier.webp?alt=media&token=da3c9fb5-45f0-4e61-8821-9cd078f992c7",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FEarrings%2FCategories_Earrings.webp?alt=media&token=03c91ec1-33d1-438b-a3f0-28fd1d57cb0d",
  },
  {
    id: "jhumka",
    name: "Jhumka",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FEarrings%2FEarring_Jhumka1.webp?alt=media&token=72fbb7d6-ffc8-4de1-8a8a-c9cc9b349152",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FEarrings%2FCategories_Earrings.webp?alt=media&token=03c91ec1-33d1-438b-a3f0-28fd1d57cb0d",
  },
  {
    id: "studs",
    name: "Studs",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FEarrings%2FEarring_Studs1.webp?alt=media&token=68b8a592-0a09-430a-a297-e43c559758e2",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FEarrings%2FCategories_Earrings.webp?alt=media&token=03c91ec1-33d1-438b-a3f0-28fd1d57cb0d",
  },
  {
    id: "cuffs",
    name: "Cuffs",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FEarrings%2Fearring_Cuff.webp?alt=media&token=a6c2cdb6-8e1a-4488-9470-33834acf26a8",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FEarrings%2FCategories_Earrings.webp?alt=media&token=03c91ec1-33d1-438b-a3f0-28fd1d57cb0d",
  },
];

export const SUB_CATS_BRACELET: SubCategory[] = [
  {
    id: "all",
    name: "All",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FBracelets%2Fbracelets_kada%203.webp?alt=media&token=06a8f8e2-25d1-4e78-92b5-8117fb1aff97",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBracelets%2FCategories_Bracelets.webp?alt=media&token=e562d3cf-bdfd-42f4-9f25-6e4f2e923f51",
  },
  {
    id: "cuff",
    name: "Cuff",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FBracelets%2Fbracelets_cuff.webp?alt=media&token=b1260d88-170d-4562-ad5b-8c7a15fdfa54",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBracelets%2FCategories_Bracelets.webp?alt=media&token=e562d3cf-bdfd-42f4-9f25-6e4f2e923f51",
  },
  {
    id: "kada",
    name: "Kada",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FBracelets%2Fbracelets_kada%203.webp?alt=media&token=06a8f8e2-25d1-4e78-92b5-8117fb1aff97",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBracelets%2FCategories_Bracelets.webp?alt=media&token=e562d3cf-bdfd-42f4-9f25-6e4f2e923f51",
  },
  {
    id: "slider",
    name: "Slider",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FBracelets%2Fbracelets_slider%203.webp?alt=media&token=bdb84ef0-19eb-4866-92c0-d95f9b66db1d",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBracelets%2FCategories_Bracelets.webp?alt=media&token=e562d3cf-bdfd-42f4-9f25-6e4f2e923f51",
  },
  {
    id: "tennis",
    name: "Tennis",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FBracelets%2Fbracelets_tennis%201.webp?alt=media&token=6b8e23aa-92b2-4bff-b124-ba47dadcc708",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBracelets%2FCategories_Bracelets.webp?alt=media&token=e562d3cf-bdfd-42f4-9f25-6e4f2e923f51",
  },
];

export const SUB_CATS_BANGLE: SubCategory[] = [
  {
    id: "all",
    name: "All",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FBangles%2FBangles_Kangan%201.webp?alt=media&token=7a15aeef-7466-4259-8306-2073074f6dc5",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBangles%2FCategories_Bangles.webp?alt=media&token=01d765a4-5386-4ba9-a6a2-395ef5ac62fc",
  },
  {
    id: "churi",
    name: "Churi",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FBangles%2FBangles_Churi%20final.webp?alt=media&token=bb4932e4-2f11-43e6-a095-2b01ed1f5da2",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBangles%2FCategories_Bangles.webp?alt=media&token=01d765a4-5386-4ba9-a6a2-395ef5ac62fc",
  },
  {
    id: "kangan",
    name: "Kangan",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FBangles%2FBangles_Kangan%201.webp?alt=media&token=7a15aeef-7466-4259-8306-2073074f6dc5",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBangles%2FCategories_Bangles.webp?alt=media&token=01d765a4-5386-4ba9-a6a2-395ef5ac62fc",
  },
  {
    id: "pacheli",
    name: "Pacheli",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FBangles%2FBangles_pacheli%20Final.webp?alt=media&token=90f355c7-4aaa-4ff0-b750-6cddcb7a8ef5",
    subCategoryBannerUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBangles%2FCategories_Bangles.webp?alt=media&token=01d765a4-5386-4ba9-a6a2-395ef5ac62fc",
  },
];

/**
 * A top-level shop category. This is the single source of truth for the
 * categories the storefront offers, the artwork that represents them, and the
 * params /product-list expects — every categories UI reads from SHOP_CATEGORIES
 * so they can never drift apart.
 */
export interface ShopCategory {
  id: string;
  /** Label shown to the shopper. */
  name: string;
  /** `categoryName` param /product-list filters by. */
  categoryName: string;
  /** `productType` param /product-list filters by. */
  productType: string;
  /** Icon for compact, icon-led lists. */
  icon: ImageSourcePropType;
  /** Banner shown at the top of the product list. */
  bannerUrl: string;
  /** Full-bleed artwork for large category cards. */
  coverImageUrl: string;
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    id: "necklace",
    name: "Necklace",
    categoryName: "Necklace",
    productType: "necklace",
    icon: require("../../assets/images/categoryIcons/necklace.png"),
    bannerUrl: SUB_CATS_NECKLACE[0].subCategoryBannerUrl,
    coverImageUrl:
      SUB_CATS_NECKLACE[0].imageUrl ?? SUB_CATS_NECKLACE[0].subCategoryBannerUrl,
  },
  {
    id: "bracelet",
    name: "Bracelets",
    categoryName: "Bracelet",
    productType: "bracelet",
    icon: require("../../assets/images/categoryIcons/bracelet.png"),
    bannerUrl: SUB_CATS_BRACELET[0].subCategoryBannerUrl,
    coverImageUrl:
      SUB_CATS_BRACELET[0].imageUrl ?? SUB_CATS_BRACELET[0].subCategoryBannerUrl,
  },
  {
    id: "earring",
    name: "Earrings",
    categoryName: "Earrings",
    productType: "earring",
    icon: require("../../assets/images/categoryIcons/earring.png"),
    bannerUrl: SUB_CATS_EARRING[0].subCategoryBannerUrl,
    coverImageUrl:
      SUB_CATS_EARRING[0].imageUrl ?? SUB_CATS_EARRING[0].subCategoryBannerUrl,
  },
  {
    id: "ring",
    name: "Rings",
    categoryName: "Rings",
    productType: "ring",
    icon: require("../../assets/images/categoryIcons/ring.png"),
    bannerUrl: SUB_CATS_RINGS[0].subCategoryBannerUrl,
    coverImageUrl:
      SUB_CATS_RINGS[0].imageUrl ?? SUB_CATS_RINGS[0].subCategoryBannerUrl,
  },
  {
    id: "bangle",
    name: "Bangles",
    categoryName: "Bangles",
    productType: "bangle",
    icon: require("../../assets/images/categoryIcons/bangles.png"),
    bannerUrl: SUB_CATS_BANGLE[0].subCategoryBannerUrl,
    coverImageUrl:
      SUB_CATS_BANGLE[0].imageUrl ?? SUB_CATS_BANGLE[0].subCategoryBannerUrl,
  },
  {
    id: "mangalsutra",
    name: "Mangalsutra",
    categoryName: "Mangalsutra",
    productType: "mangalsutra",
    icon: require("../../assets/images/categoryIcons/mangalsutra.png"),
    // Mangalsutra has no sub-categories of its own yet, so it borrows the
    // bangles artwork — swap this once its own imagery exists.
    bannerUrl: SUB_CATS_BANGLE[0].subCategoryBannerUrl,
    coverImageUrl:
      SUB_CATS_BANGLE[0].imageUrl ?? SUB_CATS_BANGLE[0].subCategoryBannerUrl,
  },
];

/** The one definition of where tapping a category takes the shopper. */
export const getCategoryRoute = (category: ShopCategory) => ({
  pathname: "/product-list" as const,
  params: {
    categoryName: category.categoryName,
    productType: category.productType,
    bannerImageUrl: encodeURIComponent(category.bannerUrl),
  },
});

// Mock departments data
export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: "mens",
    name: "Men's",
    imageUrl: menDepartmentImage,
    categories: [
      { id: "m-rings", name: "Rings", subCategories: SUB_CATS_RINGS },
      { id: "m-chains", name: "Necklaces", subCategories: SUB_CATS_NECKLACE },
      { id: "m-bracelet", name: "Bracelets", subCategories: SUB_CATS_BRACELET },
    ],
  },
  {
    id: "womens",
    name: "Women's",
    imageUrl: womenDepartmentImage,
    categories: [
      { id: "w-rings", name: "Rings", subCategories: SUB_CATS_RINGS },
      { id: "w-necklace", name: "Necklaces", subCategories: SUB_CATS_NECKLACE },
      { id: "w-earring", name: "Earrings", subCategories: SUB_CATS_EARRING },
      { id: "w-bracelet", name: "Bracelets", subCategories: SUB_CATS_BRACELET },
      { id: "w-bangle", name: "Bangles", subCategories: SUB_CATS_BANGLE },
    ],
  },
  {
    id: "kids",
    name: "Kid's",
    imageUrl: kidsDepartmentImage,
    categories: [
      { id: "k-rings", name: "Rings", subCategories: SUB_CATS_RINGS },
      { id: "k-earring", name: "Earrings", subCategories: SUB_CATS_EARRING },
      {
        id: "k-bracelets",
        name: "Bracelets",
        subCategories: SUB_CATS_BRACELET,
      },
    ],
  },
];
