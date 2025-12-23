import { Brand } from "@/enums/brand.enum";
import { ProductType } from "@/enums/productType.enum";
import { CartItem } from "@/interfaces/order-details.interface";

// --- DUMMY DATA (Normally from Redux) ---
export const DUMMY_CART_ITEMS: CartItem[] = [
  {
    product: {
      id: '1',
      title: '24K Diamond Ring',
      name: 'Solitaire Shine',
      description: 'Elegant ring',
      productType: ProductType.Ring,
      givenPrice: 25000,
      discountedPrice: 20000,
      brand: Brand.Kalyan,
      thumbnailUrls: ["https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=400"],
      tags: [],
      rating: 5
    },
    quantity: 1,
    selectedSize: '12'
  },
  {
    product: {
      id: '2',
      title: 'Gold Plated Necklace',
      name: 'Luxe Chain',
      description: 'Stunning piece',
      productType: ProductType.Necklace,
      givenPrice: 150000,
      discountedPrice: 130000,
      brand: Brand.Malabar,
      thumbnailUrls: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400'],
      tags: [],
      rating: 4
    },
    quantity: 1,
    selectedSize: 'One Size'
  }
];
