import { Product } from "./product.interface";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface OrderDetails {
  items: CartItem[];
  subtotal: number;
  savings: number;
  platformFee: number;
  total: number;
}