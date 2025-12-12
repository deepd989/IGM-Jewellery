import { Brand } from "@/enums/brand.enum";
import { ProductType } from "@/enums/productType.enum";

export interface Product {
  title:string;
  id: string;
  name: string;
  description: string;
  productType: ProductType;
  givenPrice: number;
  discountedPrice: number;
  brand: Brand;
  tags: string[]; //
  thumbnailUrls: string[];
  isNew?: boolean;
  rating: number;
}