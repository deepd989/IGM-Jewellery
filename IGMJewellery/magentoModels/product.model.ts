export interface MagentoProduct {
  id: number;
  sku: string; // this is unique identifier for product
  name: string;
  attribute_set_id: number;
  price: number;
  status: number;
  visibility: number;
  type_id: "simple" | "configurable" | string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string;
  extension_attributes: ExtensionAttributes;
  product_links: unknown[];
  options: unknown[];
  media_gallery_entries: unknown[];
  tier_prices: unknown[];
  custom_attributes: CustomAttribute[];
  immersiveVideoUrl: string | null;
  //product type missing eg ring, necklace etc.
  // rating of the product missing
  // product should be mapped to occaision or gender
}

export interface ExtensionAttributes {
  website_ids: number[];
  category_links: CategoryLink[];
}

export interface CategoryLink {
  position: number;
  category_id: string;
}

export interface CustomAttribute {
  attribute_code: string;
  value: string | number | boolean | string[];
}
