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
  metalType?: string;      // "Yellow Gold", "White Gold", etc.
  metalPurity?: string;    // "14k", "18k", "22k", etc.
  metalFinish?: string;    // "High Polish", "Matte", etc.
  netWeight?: string;      // "0.880 g"
  grossWeight?: string;    // "0.610 g"
  
  // Dimensions
  height?: string;         // "3 mm"
  width?: string;          // "3 mm"
  depth?: string;          // "1 mm"
  
  // Diamond/Stone info
  diamondWeight?: string;  // "0.024 C"
  diamondClarity?: string; // "SI", "VVS", etc.
  diamondColor?: string;   // "FG", "D", etc.
  stoneType?: string;      // "Natural", "Lab-grown", etc.
}

export interface Product {
  title:string;
  id: string;
  name: string;
  description: string;
  productType: ProductType;
  givenPrice: number;
  discountedPrice: number;
  brand: Brand;
  tags: string[]; 
  thumbnailUrls: string[];
  isNew?: boolean;
  sku?: string;
  rating?: number;
  specifications?: ProductSpecification[];
  reviews?: Review[];
  occaision:OccasiomEnum[];
  gender: Gender;
  productDetails?: ProductDetails;
}