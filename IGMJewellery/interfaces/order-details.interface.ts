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

export type OrderStatus = 'Dispatched' | 'Delivered' | 'Out for delivery' | 'Processing';

export interface OrderSubItem {
  id: string;
  product: Partial<Product>;
  status: OrderStatus;
  statusDate: string;
  price: number;
}

export interface Order {
  id: string;
  displayId: string;
  orderDate: string;
  totalAmount: number;
  itemCount: number;
  statusSummary: string;
  items: OrderSubItem[];
  deliveryAddress?: {
    name: string;
    line1: string;
    line2: string;
    phone: string;
  };
  paymentMethod?: string;
  pointsEarned?: number;
}
