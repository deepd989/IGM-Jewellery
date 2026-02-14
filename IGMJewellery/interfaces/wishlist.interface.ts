import { Product } from "./product.interface";

/**
 * Wishlist API Request/Response Types
 */

// Super attribute for configurable products
export interface SuperAttribute {
  [attributeId: string]: string; // e.g., "93": "52"
}

// Custom option for products
export interface CustomOption {
  option_id: string;
  option_value: string;
}

// Options for configurable products
export interface ConfigurableOptions {
  super_attribute: SuperAttribute;
}

// Product option with custom options
export interface ProductOption {
  extension_attributes: {
    custom_options: CustomOption[];
  };
}

// Add to wishlist request payload
export interface AddToWishlistRequest {
  customerId: number;
  productId: number;
  qty: number;
  options?: ConfigurableOptions;
  product_option?: ProductOption;
}

// Add to wishlist success response
export interface AddToWishlistResponse {
  success: boolean;
  wishlist_id: number;
  item_id: number;
}

// Remove from wishlist request payload
export interface RemoveFromWishlistRequest {
  customerId: number;
  itemId: number;
}

// Remove from wishlist success response
export interface RemoveFromWishlistResponse {
  success: boolean;
  message?: string;
}

// API error response
export interface WishlistApiError {
  message: string;
  trace?: string;
}

// Wishlist item with API item_id for removal operations
export interface WishlistItem {
  product: Product;
  itemId: number; // API item_id needed for removal
}

// Local wishlist state (combine API data with local compare list)
export interface WishlistState {
  items: WishlistItem[];
  compareList: Product[];
  isLoading?: boolean;
}
