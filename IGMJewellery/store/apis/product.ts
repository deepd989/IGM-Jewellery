import { Gender } from "@/constants/genderEnum";
import { OccasiomEnum } from "@/constants/occasions";
import { Brand } from "@/enums/brand.enum";
import { ProductType } from "@/enums/productType.enum";
import { Product } from "@/interfaces/product.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Mock products data
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "24K Diamond Ring",
    name: "Solitaire Shine",
    description:
      "Celebrate every day in style with the subtle grace of this stunning solitaire ring crafted in 24 Karat Gold with premium diamond.",
    productType: ProductType.Ring,
    givenPrice: 25000,
    discountedPrice: 20000,
    brand: Brand.KalyanJewellers,
    tags: ["new", "diamond"],
    thumbnailUrls: [
      "https://drive.google.com/uc?export=download&id=17ZW_TXQetl0TzqUYUChTmEMxZ5pAKpob",
      "https://drive.google.com/uc?export=download&id=1ZdJeI0qgXFT3lMCZWKxKl0hpB9s5iq0K",
      "https://drive.google.com/uc?export=download&id=1Hfl3dKi8FGlHPEX8_FoLqNA02VKEOp8F",
    ],
    isNew: true,
    rating: 4.5,
    sku: "DR001-24K",
    occaision: [OccasiomEnum.Anniversary, OccasiomEnum.Birthday],
    gender: Gender.male,
  },
  {
    id: "2",
    title: "Gold Plated Ring",
    name: "Daily Wear",
    description:
      "Perfect for daily use, this elegant gold plated ring combines style with comfort for everyday elegance.",
    productType: ProductType.Ring,
    givenPrice: 12000,
    discountedPrice: 9500,
    brand: Brand.Malabar,
    tags: ["gold", "sale"],
    thumbnailUrls: [
      "https://drive.google.com/uc?export=download&id=1K9c5crpHKYy55Y8TZMYqBwqQQB6-i5ck",
      "https://drive.google.com/uc?export=download&id=1xbX6sppoa6pbGthVdWfxIP0FhCkJDc2P",
    ],
    isNew: true,
    rating: 5.0,
    sku: "GR002-GP",
    occaision: [OccasiomEnum.Anniversary, OccasiomEnum.Wedding],
    gender: Gender.female,
  },
  {
    id: "3",
    title: "Diamond Studded Ring",
    name: "Green Glory",
    description:
      "Stunning emerald cut ring featuring a magnificent green gemstone set in premium gold.",
    productType: ProductType.Ring,
    givenPrice: 45000,
    discountedPrice: 38000,
    brand: Brand.Tanishq,
    tags: ["gemstone", "premium"],
    thumbnailUrls: [
      "https://drive.google.com/uc?export=download&id=1NpEwC0OOIWeeyVGNP4a7SYtkhyAKZxS6",
      "https://drive.google.com/uc?export=download&id=11ngEf8XGAblEn1DKQG4NpQ04oLgiNJCq",
      "https://drive.google.com/uc?export=download&id=1GWgwnPLGs18P4u-ILTw9pxLdtd8fFX0s",
    ],
    isNew: false,
    rating: 4.8,
    sku: "ER003-EMR",
    occaision: [OccasiomEnum.Anniversary, OccasiomEnum.Birthday],
    gender: Gender.unisex,
  },
  {
    id: "4",
    title: "Pearl Necklace Set",
    name: "Classic Pearl",
    description:
      "Timeless pearl necklace with matching earrings, perfect for special occasions.",
    productType: ProductType.Necklace,
    givenPrice: 35000,
    discountedPrice: 30000,
    brand: Brand.KalyanJewellers,
    tags: ["pearl", "set"],
    thumbnailUrls: [
      "https://drive.google.com/uc?export=download&id=117WAh5AmHHGS255bC_kR6rP4gcdcQWJW",
      "https://drive.google.com/uc?export=download&id=1U-Pu_KD-LbhdqvkY9O3U6XFPaXuRd9f",
      "https://drive.google.com/uc?export=download&id=1t-U2dSER6RylFRLeJ_w1a5R1pyqoRarP",
    ],
    isNew: true,
    rating: 4.6,
    sku: "PN004-CP",
    occaision: [OccasiomEnum.Diwali, OccasiomEnum.Wedding],
    gender: Gender.female,
  },
  {
    id: "5",
    title: "Diamond Necklace",
    name: "Sparkle Wrist",
    description: "Elegant diamond necklace that adds sparkle to any outfit.",
    productType: ProductType.Necklace,
    givenPrice: 55000,
    discountedPrice: 48000,
    brand: Brand.Tanishq,
    tags: ["diamond", "luxury"],
    thumbnailUrls: [
      "https://drive.google.com/uc?export=download&id=1XhYqQUVwV_mfpaY7q-1gyKVTX91pXtTE",
      "https://drive.google.com/uc?export=download&id=1rb-ON1-lmrmQIEJ6t9cQqxJD4feWbcG6",
      "https://drive.google.com/uc?export=download&id=1XhYqQUVwV_mfpaY7q-1gyKVTX91pXtTE",
    ],
    isNew: false,
    rating: 4.9,
    sku: "DB005-SW",
    occaision: [OccasiomEnum.Graduation],
    gender: Gender.unisex,
  },
  {
    id: "prod-001",
    name: "Classic Gold Necklace",
    title: "Classic Gold Necklace",
    description: "Elegant 22K gold necklace with intricate design.",
    productType: ProductType.Necklace,
    givenPrice: 1200,
    discountedPrice: 999,
    brand: Brand.KalyanJewellers,
    tags: ["gold", "necklace", "classic", "22K"],
    isNew: true,
    rating: 5,
    thumbnailUrls: [
      "https://drive.google.com/uc?export=download&id=1IwTBfESPsETRszWL_MI60Q01LGxnihoc",
      "https://drive.google.com/uc?export=download&id=1oTkolVaMA0uREyTECsP_4igyVcuSuLvq",
    ],
    occaision: [],
    gender: Gender.female,
  },
  {
    id: "prod-002",
    name: "Diamond Stud Earrings",
    title: "Diamond Stud Earrings",
    description: "Timeless diamond studs set in 18K white gold.",
    productType: ProductType.DiamondStone,
    givenPrice: 800,
    discountedPrice: 749,
    brand: Brand.Tanishq,
    tags: ["diamond", "earrings", "stud", "white-gold"],
    thumbnailUrls: [
      "https://drive.google.com/uc?export=download&id=1cv1HV0_u8E6u7mAQW9IdDcvFA39xlVev",
      "https://drive.google.com/uc?export=download&id=1NmFTKD_RWCSFxHGnkwyMwdtOE1-BoHMs",
    ],
    occaision: [],
    gender: Gender.female,
  },
  {
    id: "prod-003",
    name: "Silver Charm Bracelet",
    title: "Silver Charm Bracelet",
    description: "Sterling silver bracelet with customizable charms.",
    productType: ProductType.Bracelet,
    givenPrice: 250,
    discountedPrice: 199,
    brand: Brand.KalyanJewellers,
    tags: ["silver", "bracelet", "charms", "sterling"],
    thumbnailUrls: [
      "https://drive.google.com/uc?export=download&id=1cv1HV0_u8E6u7mAQW9IdDcvFA39xlVev",
    ],
    occaision: [],
    gender: Gender.unisex,
  },
  {
    id: "prod-004",
    name: "Ruby Ring",
    title: "Ruby Ring",
    description: "Statement ring featuring a natural ruby centerpiece.",
    productType: ProductType.Ring,
    givenPrice: 950,
    discountedPrice: 875,
    brand: Brand.Tanishq,
    tags: ["ruby", "ring", "gemstone", "statement"],
    thumbnailUrls: [
      "https://drive.google.com/uc?export=download&id=1h9rVj4JHKodi3wYOkYCbAnKRNMb2jRvO",
      "https://drive.google.com/uc?export=download&id=1AkLvQOh50d8gWhHa6y8b5ePI4kksrPyv",
    ],
    occaision: [],
    gender: Gender.male,
  },
  {
    id: "prod-005",
    name: "Ruby Earring",
    title: "Ruby Earring",
    description: "Statement Earring featuring a natural ruby centerpiece.",
    productType: ProductType.Earring,
    givenPrice: 950,
    discountedPrice: 875,
    brand: Brand.Tanishq,
    tags: ["ruby", "ring", "gemstone", "statement"],
    thumbnailUrls: [
      "https://drive.google.com/uc?export=download&id=1oxG-8ZQuAcMs79DPFmdsg-OE2XJ0oOyY",
      "https://drive.google.com/uc?export=download&id=1n4AbwR6sZxAmituiG5_e8q_QUxQhBAjc",
    ],
    isNew: true,
    rating: 4.5,
    sku: "DR001-22K",
    occaision: [],
    gender: Gender.female,
  },
  {
    id: "prod-006",
    name: "Necklace Gift",
    title: "Necklace Gift",
    description: "Timeless necklace gift set in 18K white gold.",
    productType: ProductType.Gift,
    givenPrice: 800,
    discountedPrice: 749,
    brand: Brand.CaratLane,
    tags: ["diamond", "earrings", "stud", "white-gold"],
    thumbnailUrls: [
      "https://drive.google.com/uc?export=download&id=1U-Pu_KD-LbhdqvkY9O3U6XFPaXuRd9fv",
      "https://drive.google.com/uc?export=download&id=117WAh5AmHHGS255bC_kR6rP4gcdcQWJW",
    ],
    isNew: true,
    rating: 4.2,
    sku: "DR001-21K",
    occaision: [],
    gender: Gender.female,
  },

  {
    id: "prod-007",
    name: "Gold Necklace",
    title: "Gold Necklace ",
    description: "Timeless gold necklace set in 18K white gold.",
    productType: ProductType.Gold,
    givenPrice: 800,
    discountedPrice: 749,
    brand: Brand.CaratLane,
    tags: ["diamond", "earrings", "stud", "white-gold"],
    thumbnailUrls: [
      "https://drive.google.com/uc?export=download&id=1hPfa-ZeOObHTkcDcGpNAKTcv2cnKaMNM",
      "https://drive.google.com/uc?export=download&id=14ONAJ3nuOqnd1yBSNjKfJ5KZpQYMbuET",
    ],
    isNew: true,
    rating: 4.5,
    sku: "DR001-22K",
    occaision: [],
    gender: Gender.female,
  },
];

interface ProductsQueryParams {
  sortBy?: string;
  filters?: Record<string, string[]>;
  searchQuery?: string;
}

// Helper function to apply filters
const applyFilters = (
  products: Product[],
  filters: Record<string, string[]>
): Product[] => {
  let filteredProducts = [...products];

  Object.entries(filters).forEach(([categoryId, selectedOptions]) => {
    if (selectedOptions.length === 0) return;

    switch (categoryId) {
      case "productType":
        filteredProducts = filteredProducts.filter((p) =>
          selectedOptions.some(
            (opt) => p.productType.toLowerCase() === opt.toLowerCase()
          )
        );
        break;

      case "brand":
        filteredProducts = filteredProducts.filter((p) =>
          selectedOptions.includes(p.brand)
        );
        break;

      case "priceRange":
        filteredProducts = filteredProducts.filter((p) => {
          const price = p.discountedPrice;
          return selectedOptions.some((range) => {
            switch (range) {
              case "under-10k":
                return price < 10000;
              case "10k-25k":
                return price >= 10000 && price < 25000;
              case "25k-50k":
                return price >= 25000 && price < 50000;
              case "50k-100k":
                return price >= 50000 && price < 100000;
              case "above-100k":
                return price >= 100000;
              default:
                return true;
            }
          });
        });
        break;

      case "gemstone":
        filteredProducts = filteredProducts.filter((p) =>
          selectedOptions.some(
            (gem) =>
              p.tags.some((tag) =>
                tag.toLowerCase().includes(gem.toLowerCase())
              ) ||
              p.title.toLowerCase().includes(gem.toLowerCase()) ||
              p.description.toLowerCase().includes(gem.toLowerCase())
          )
        );
        break;

      case "metal":
        filteredProducts = filteredProducts.filter((p) =>
          selectedOptions.some(
            (metal) =>
              p.tags.some((tag) =>
                tag.toLowerCase().includes(metal.toLowerCase())
              ) ||
              p.title.toLowerCase().includes(metal.toLowerCase()) ||
              p.description.toLowerCase().includes(metal.toLowerCase())
          )
        );
        break;

      case "collection":
        filteredProducts = filteredProducts.filter((p) => {
          return selectedOptions.some((collection) => {
            switch (collection) {
              case "new-arrival":
                return p.isNew === true;
              case "bestseller":
                return (p.rating || 0) >= 4.5;
              case "sale":
                return p.tags.includes("sale");
              case "exclusive":
                return (
                  p.tags.includes("exclusive") || p.tags.includes("premium")
                );
              default:
                return true;
            }
          });
        });
        break;

      case "occasion":
        filteredProducts = filteredProducts.filter((prod) =>
          prod.occaision.some((occ) => selectedOptions.includes(occ))
        );
        break;
    }
  });

  return filteredProducts;
};

// Helper function to apply sorting
const applySorting = (products: Product[], sortBy?: string): Product[] => {
  const sorted = [...products];

  switch (sortBy) {
    case "Latest":
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    case "Price: Low to high":
      return sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);

    case "Price: High to low":
      return sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);

    case "Customer Rating":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    case "Discount":
      return sorted.sort((a, b) => {
        const discountA =
          ((a.givenPrice - a.discountedPrice) / a.givenPrice) * 100;
        const discountB =
          ((b.givenPrice - b.discountedPrice) / b.givenPrice) * 100;
        return discountB - discountA;
      });

    case "Featured":
    default:
      return sorted;
  }
};

export const productApiService = createApi({
  reducerPath: "products",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    // Get all products with optional filters and sorting
    getProducts: builder.query<Product[], ProductsQueryParams | void>({
      queryFn: (params) => {
        let products = [...MOCK_PRODUCTS];

        // Apply filters if provided
        if (params?.filters && Object.keys(params.filters).length > 0) {
          products = applyFilters(products, params.filters);
        }

        // Apply search if provided
        if (params?.searchQuery) {
          const query = params.searchQuery.toLowerCase();
          products = products.filter(
            (p) =>
              p.title.toLowerCase().includes(query) ||
              p.name.toLowerCase().includes(query) ||
              p.description.toLowerCase().includes(query)
          );
        }

        // Apply sorting
        if (params?.sortBy) {
          products = applySorting(products, params.sortBy);
        }

        return { data: products };
      },
    }),

    // Get single product by ID
    getProductById: builder.query<Product, string>({
      queryFn: (id) => {
        const product = MOCK_PRODUCTS.find((p) => p.id === id);

        if (!product) {
          return {
            error: {
              status: 404,
              statusText: "Not Found",
              data: "Product not found",
            },
          };
        }

        return { data: product };
      },
    }),

    // Get featured/new products
    getFeaturedProducts: builder.query<Product[], void>({
      queryFn: () => {
        const featured = MOCK_PRODUCTS.filter((p) => p.isNew).slice(0, 4);
        return { data: featured };
      },
    }),

    // Get products by category/type
    getProductsByType: builder.query<Product[], ProductType>({
      queryFn: (productType) => {
        const products = MOCK_PRODUCTS.filter(
          (p) => p.productType === productType
        );
        return { data: products };
      },
    }),

    // Get products by brand
    getProductsByBrand: builder.query<Product[], string>({
      queryFn: (brand) => {
        const products = MOCK_PRODUCTS.filter((p) => p.brand === brand);
        return { data: products };
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetFeaturedProductsQuery,
  useGetProductsByTypeQuery,
  useGetProductsByBrandQuery,
} = productApiService;
