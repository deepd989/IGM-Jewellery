import { Gender } from "@/constants/genderEnum";
import { OccasiomEnum } from "@/constants/occasions";
import { Brand } from "@/enums/brand.enum";
import { ProductType } from "@/enums/productType.enum";
import { Review } from "./review.interface";

export interface ProductSpecification {
  label: string;
  value: string;
}

/**
 * Resolved product details from Magento custom_attributes
 * Values are human-readable labels resolved via the attribute options API
 */
export interface ProductDetails {
  // Material info
  metalType?: string; // "Yellow Gold", "White Gold", etc.
  metalPurity?: string; // "14k", "18k", "22k", etc.
  metalFinish?: string; // "High Polish", "Matte", etc.
  metalColor?: string; // "Yellow", "White", "Rose"
  netWeight?: string; // "0.880 g"
  grossWeight?: string; // "0.610 g"

  // Dimensions
  height?: string; // "3 mm"
  width?: string; // "3 mm"
  depth?: string; // "1 mm"

  // Diamond info
  diamondWeight?: string; // "0.024 C"
  diamondClarity?: string; // "SI", "VVS", etc.
  diamondColor?: string; // "FG", "D", etc.
  diamondCount?: string; // "64"
  diamondShape?: string; // "Round"
  diamondType?: string; // "Accent Stones"
  diamondSettingType?: string; // "Prong"

  // Stone/Gemstone info
  stoneType?: string; // "Natural Diamond", "Gemstone", etc.

  // Certification
  certOrg?: string; // "GIA", "IGI", etc.
}

export interface Product {
  title: string; // not getting title use name from api instead
  id: string;
  name: string;
  description: string; // use short_description from api
  productType: ProductType; // getting is as 7,9 -> we need hardcode 7 to ring and 9 to earring
  givenPrice: number; // use "price" from api
  discountedPrice: number; // use random number from 5-10% off from given price
  brand: Brand; // seprate api.
  tags: string[];
  thumbnailUrls: string[]; // media_gallery_entries
  isNew?: boolean;
  sku?: string; //same as id
  rating?: number; // p_ratings
  specifications?: ProductSpecification[];
  reviews?: Review[];
  occaision: OccasiomEnum[];
  gender: Gender;
  productDetails?: ProductDetails;
  isImmersiveProduct: boolean;
  immersiveThumbnailUrl?: string; // URL for immersive product thumbnail
}
