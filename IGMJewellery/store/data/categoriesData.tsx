import { ImageSourcePropType } from "react-native";
import { Department, SubCategory } from "../../interfaces/category.interface";
import { assetUrl } from "@/constants/assets";

const menDepartmentImage = require("../../assets/images/men_department.png");
const womenDepartmentImage = require("../../assets/images/women_department.png");
const kidsDepartmentImage = require("../../assets/images/kids_department.png");

export const SUB_CATS_RINGS: SubCategory[] = [
  {
    id: "all",
    name: "All",
    imageUrl: assetUrl("subcategory.ring.all"),
    subCategoryBannerUrl: assetUrl("category.banner.ring"),
  },
  {
    id: "eternity",
    name: "Eternity",
    imageUrl: assetUrl("subcategory.ring.eternity"),
    subCategoryBannerUrl: assetUrl("category.banner.ring"),
  },
  {
    id: "anniversary",
    name: "Anniversary",
    imageUrl: assetUrl("subcategory.ring.anniversary"),
    subCategoryBannerUrl: assetUrl("category.banner.ring"),
  },
  {
    id: "wedding",
    name: "Wedding",
    imageUrl: assetUrl("subcategory.ring.wedding"),
    subCategoryBannerUrl: assetUrl("category.banner.ring"),
  },
  {
    id: "bands",
    name: "Bands",
    imageUrl: assetUrl("subcategory.ring.bands"),
    subCategoryBannerUrl: assetUrl("category.banner.ring"),
  },
  {
    id: "navratna",
    name: "Navratna",
    imageUrl: assetUrl("subcategory.ring.navratna"),
    subCategoryBannerUrl: assetUrl("category.banner.ring"),
  },
  {
    id: "religious",
    name: "Religious",
    imageUrl: assetUrl("subcategory.ring.religious"),
    subCategoryBannerUrl: assetUrl("category.banner.ring"),
  },
  {
    id: "solitaire",
    name: "Solitaire",
    imageUrl: assetUrl("subcategory.ring.solitaire"),
    subCategoryBannerUrl: assetUrl("category.banner.ring"),
  },
];

export const SUB_CATS_NECKLACE: SubCategory[] = [
  {
    id: "all",
    name: "All",
    imageUrl: assetUrl("subcategory.necklace.all"),
    subCategoryBannerUrl: assetUrl("category.banner.necklace"),
  },
  {
    id: "choker",
    name: "Choker",
    imageUrl: assetUrl("subcategory.necklace.choker"),
    subCategoryBannerUrl: assetUrl("category.banner.necklace"),
  },
  {
    id: "antique",
    name: "Antique",
    imageUrl: assetUrl("subcategory.necklace.antique"),
    subCategoryBannerUrl: assetUrl("category.banner.necklace"),
  },
  {
    id: "lariat",
    name: "Lariat",
    imageUrl: assetUrl("subcategory.necklace.lariat"),
    subCategoryBannerUrl: assetUrl("category.banner.necklace"),
  },
  {
    id: "gemstone",
    name: "Gemstone",
    imageUrl: assetUrl("subcategory.necklace.gemstone"),
    subCategoryBannerUrl: assetUrl("category.banner.necklace"),
  },
  {
    id: "religious",
    name: "Religious",
    imageUrl: assetUrl("subcategory.necklace.religious"),
    subCategoryBannerUrl: assetUrl("category.banner.necklace"),
  },
  {
    id: "rani",
    name: "Rani",
    imageUrl: assetUrl("subcategory.necklace.raniHaar"),
    subCategoryBannerUrl: assetUrl("category.banner.necklace"),
  },
];

export const SUB_CATS_EARRING: SubCategory[] = [
  {
    id: "all",
    name: "All",
    imageUrl: assetUrl("subcategory.earring.all"),
    subCategoryBannerUrl: assetUrl("category.banner.earring"),
  },
  {
    id: "chandbali",
    name: "Chandbali",
    imageUrl: assetUrl("subcategory.earring.chandbali"),
    subCategoryBannerUrl: assetUrl("category.banner.earring"),
  },
  {
    id: "drops",
    name: "Drops",
    imageUrl: assetUrl("subcategory.earring.drops"),
    subCategoryBannerUrl: assetUrl("category.banner.earring"),
  },
  {
    id: "chandelier",
    name: "Chandelier",
    imageUrl: assetUrl("subcategory.earring.chandelier"),
    subCategoryBannerUrl: assetUrl("category.banner.earring"),
  },
  {
    id: "jhumka",
    name: "Jhumka",
    imageUrl: assetUrl("subcategory.earring.jhumka"),
    subCategoryBannerUrl: assetUrl("category.banner.earring"),
  },
  {
    id: "studs",
    name: "Studs",
    imageUrl: assetUrl("subcategory.earring.studs"),
    subCategoryBannerUrl: assetUrl("category.banner.earring"),
  },
  {
    id: "cuffs",
    name: "Cuffs",
    imageUrl: assetUrl("subcategory.earring.cuffs"),
    subCategoryBannerUrl: assetUrl("category.banner.earring"),
  },
];

export const SUB_CATS_BRACELET: SubCategory[] = [
  {
    id: "all",
    name: "All",
    imageUrl: assetUrl("subcategory.bracelet.all"),
    subCategoryBannerUrl: assetUrl("category.banner.bracelet"),
  },
  {
    id: "cuff",
    name: "Cuff",
    imageUrl: assetUrl("subcategory.bracelet.cuff"),
    subCategoryBannerUrl: assetUrl("category.banner.bracelet"),
  },
  {
    id: "kada",
    name: "Kada",
    imageUrl: assetUrl("subcategory.bracelet.kada"),
    subCategoryBannerUrl: assetUrl("category.banner.bracelet"),
  },
  {
    id: "slider",
    name: "Slider",
    imageUrl: assetUrl("subcategory.bracelet.slider"),
    subCategoryBannerUrl: assetUrl("category.banner.bracelet"),
  },
  {
    id: "tennis",
    name: "Tennis",
    imageUrl: assetUrl("subcategory.bracelet.tennis"),
    subCategoryBannerUrl: assetUrl("category.banner.bracelet"),
  },
];

export const SUB_CATS_BANGLE: SubCategory[] = [
  {
    id: "all",
    name: "All",
    imageUrl: assetUrl("subcategory.bangle.all"),
    subCategoryBannerUrl: assetUrl("category.banner.bangle"),
  },
  {
    id: "churi",
    name: "Churi",
    imageUrl: assetUrl("subcategory.bangle.churi"),
    subCategoryBannerUrl: assetUrl("category.banner.bangle"),
  },
  {
    id: "kangan",
    name: "Kangan",
    imageUrl: assetUrl("subcategory.bangle.kangan"),
    subCategoryBannerUrl: assetUrl("category.banner.bangle"),
  },
  {
    id: "pacheli",
    name: "Pacheli",
    imageUrl: assetUrl("subcategory.bangle.pacheli"),
    subCategoryBannerUrl: assetUrl("category.banner.bangle"),
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
