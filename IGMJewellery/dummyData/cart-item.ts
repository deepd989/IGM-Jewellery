import { assetUrl } from "@/constants/assets";
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
      thumbnailUrls: [assetUrl("mock.cartItem.solitaireRing")],
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
      thumbnailUrls: [assetUrl("mock.cartItem.luxeChainNecklace")],
      tags: [],
      rating: 4
    },
    quantity: 1,
    selectedSize: 'One Size'
  }
];
