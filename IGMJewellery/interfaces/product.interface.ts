import { Brand } from "@/enums/brand.enum";
import { ProductType } from "@/enums/productType.enum";
import { Review } from "./review.interface";
import { OccasiomEnum } from "@/constants/occasions";
import { Gender } from "@/constants/genderEnum";


export interface ProductSpecification {
  label: string;
  value: string;
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
}