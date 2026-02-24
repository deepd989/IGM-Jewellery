import { ImageSourcePropType } from "react-native";

export interface SubCategory {
  id: string;
  name: string;
  imageUrl?: string;
  subCategoryBannerUrl: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  productCount?: number;
}

export interface SidebarCategory {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

export interface Department {
  id: string;
  name: string; // e.g. "Men's", "Women's"
  imageUrl: ImageSourcePropType; // URL for the department header image
  categories: SidebarCategory[];
}

// export interface Product {
//   id: string;
//   name: string;
//   price: number;
//   currency: string;
//   imageUrl: string;
//   isNew?: boolean;
// }
