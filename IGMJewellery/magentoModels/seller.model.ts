export interface SellerByProduct {
  seller: Seller;
  message: string;
}

export interface Seller {
  entity_id: string;
  is_seller: string; // "1" or "0"
  seller_id: string;
  payment_source: string | null;
  twitter_id: string | null;
  facebook_id: string | null;
  youtube_id: string | null;
  vimeo_id: string | null;
  instagram_id: string | null;
  pinterest_id: string | null;
  moleskine_id: string | null;
  tiktok_id: string | null;
  tw_active: string;
  fb_active: string;
  youtube_active: string;
  vimeo_active: string;
  instagram_active: string;
  pinterest_active: string;
  moleskine_active: string;
  tiktok_active: string;
  others_info: string | null;
  banner_pic: string | null;
  shop_url: string;
  shop_title: string | null;
  logo_pic: string | null;
  company_locality: string | null;
  country_pic: string | null;
  company_description: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  background_width: string | null;
  store_id: string;
  contact_number: string | null;
  return_policy: string | null;
  shipping_policy: string | null;
  created_at: string; // ISO format string
  updated_at: string; // ISO format string
  admin_notification: string;
  privacy_policy: string | null;
  allowed_categories: string;
  allowed_attributeset_ids: string;
  is_separate_panel: string | null;
  low_stock_quantity: number | null;
  fulfilment_image: string | null;
  fulfilment_text: string | null;
  // tagline missing
  // seller ratings missing
  // no data for ABOUT SECTION of seller
}

// Single seller item in list response
export interface SellerListItem {
  seller_data: Seller;
  collection_items: unknown[];
}

// Browse all sellers API response
export interface SellerListResponse {
  items: SellerListItem[];
  search_criteria: {
    filter_groups: unknown[];
  };
  total_count: number;
}

// Attribute option for resolving custom_attributes
export interface AttributeOption {
  label: string;
  value: string;
}

