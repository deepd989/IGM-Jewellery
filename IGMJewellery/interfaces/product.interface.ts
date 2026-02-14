import { Gender } from "@/constants/genderEnum";
import { OccasiomEnum } from "@/constants/occasions";
import { Brand } from "@/enums/brand.enum";
import { ProductType } from "@/enums/productType.enum";
import { Review } from "./review.interface";

export interface ProductSpecification {
  label: string;
  value: string;
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
  reviews?: Review[]; // seprate api, use random number for rating value
  occaision: OccasiomEnum[]; // use this as collection_id
  gender: Gender; // user_type and resolve
}
