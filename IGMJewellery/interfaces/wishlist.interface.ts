import { Product } from "./product.interface";

/**
 * Wishlist item stored in phone storage
 */
export interface WishlistItem {
  product: Product;
  addedAt: number; // Timestamp when item was added
}

/**
 * Local wishlist state
 */
export interface WishlistState {
  items: WishlistItem[];
  compareList: Product[];
  isLoading?: boolean;
}
