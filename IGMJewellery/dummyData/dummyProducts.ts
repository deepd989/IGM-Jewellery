import { Product } from "@/interfaces/product.interface";
import { Brand } from "@/enums/brand.enum";
import { ProductType } from "@/enums/productType.enum";

export const dummyProducts: Product[] = [
  {
    id: "prod-001",
    name: "Classic Gold Necklace",
    description: "Elegant 22K gold necklace with intricate design.",
    productType: ProductType.Necklace,
    givenPrice: 1200,
    discountedPrice: 999,
    brand: Brand.KalyanJewellers,
    tags: ["gold", "necklace", "classic", "22K"],
    thumbnailUrls: [
      "https://example.com/images/necklace-001-1.jpg",
      "https://example.com/images/necklace-001-2.jpg",
    ],
  },
  {
    id: "prod-002",
    name: "Diamond Stud Earrings",
    description: "Timeless diamond studs set in 18K white gold.",
    productType: ProductType.DiamondStone,
    givenPrice: 800,
    discountedPrice: 749,
    brand: Brand.Tanishq,
    tags: ["diamond", "earrings", "stud", "white-gold"],
    thumbnailUrls: [
      "https://example.com/images/earrings-002-1.jpg",
      "https://example.com/images/earrings-002-2.jpg",
    ],
  },
  {
    id: "prod-003",
    name: "Silver Charm Bracelet",
    description: "Sterling silver bracelet with customizable charms.",
    productType: ProductType.Bracelet,
    givenPrice: 250,
    discountedPrice: 199,
    brand: Brand.KalyanJewellers,
    tags: ["silver", "bracelet", "charms", "sterling"],
    thumbnailUrls: [
      "https://example.com/images/bracelet-003-1.jpg",
    ],
  },
  {
    id: "prod-004",
    name: "Ruby Ring",
    description: "Statement ring featuring a natural ruby centerpiece.",
    productType: ProductType.Ring,
    givenPrice: 950,
    discountedPrice: 875,
    brand: Brand.Tanishq,
    tags: ["ruby", "ring", "gemstone", "statement"],
    thumbnailUrls: [
      "https://example.com/images/ring-004-1.jpg",
      "https://example.com/images/ring-004-2.jpg",
    ],
  },
];