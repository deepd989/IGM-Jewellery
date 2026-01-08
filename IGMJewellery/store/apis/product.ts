import { Brand } from '@/enums/brand.enum';
import { ProductType } from '@/enums/productType.enum';
import { Product } from '@/interfaces/product.interface';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Mock products data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: '24K Diamond Ring',
    name: 'Solitaire Shine',
    description: 'Celebrate every day in style with the subtle grace of this stunning solitaire ring crafted in 24 Karat Gold with premium diamond.',
    productType: ProductType.Ring,
    givenPrice: 25000,
    discountedPrice: 20000,
    brand: Brand.Kalyan,
    tags: ['new', 'diamond'],
    thumbnailUrls: [
      'https://images.unsplash.com/photo-1605100804763-eb2fc645a382?q=80&w=600',
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=600',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600'
    ],
    isNew: true,
    rating: 4.5,
    sku: 'DR001-24K'
  },
  {
    id: '2',
    title: 'Gold Plated Ring',
    name: 'Daily Wear',
    description: 'Perfect for daily use, this elegant gold plated ring combines style with comfort for everyday elegance.',
    productType: ProductType.Ring,
    givenPrice: 12000,
    discountedPrice: 9500,
    brand: Brand.Malabar,
    tags: ['gold', 'sale'],
    thumbnailUrls: [
      'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=600',
      'https://images.unsplash.com/photo-1605100804763-eb2fc645a382?q=80&w=600'
    ],
    isNew: true,
    rating: 5.0,
    sku: 'GR002-GP'
  },
  {
    id: '3',
    title: 'Emerald Cut Ring',
    name: 'Green Glory',
    description: 'Stunning emerald cut ring featuring a magnificent green gemstone set in premium gold.',
    productType: ProductType.Ring,
    givenPrice: 45000,
    discountedPrice: 38000,
    brand: Brand.Tanishq,
    tags: ['gemstone', 'premium'],
    thumbnailUrls: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600',
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=600',
      'https://images.unsplash.com/photo-1605100804763-eb2fc645a382?q=80&w=600'
    ],
    isNew: false,
    rating: 4.8,
    sku: 'ER003-EMR'
  },
  {
    id: '4',
    title: 'Pearl Necklace Set',
    name: 'Classic Pearl',
    description: 'Timeless pearl necklace with matching earrings, perfect for special occasions.',
    productType: ProductType.Necklace,
    givenPrice: 35000,
    discountedPrice: 30000,
    brand: Brand.Kalyan,
    tags: ['pearl', 'set'],
    thumbnailUrls: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600'
    ],
    isNew: true,
    rating: 4.6,
    sku: 'PN004-CP'
  },
  {
    id: '5',
    title: 'Diamond Bracelet',
    name: 'Sparkle Wrist',
    description: 'Elegant diamond bracelet that adds sparkle to any outfit.',
    productType: ProductType.Bracelet,
    givenPrice: 55000,
    discountedPrice: 48000,
    brand: Brand.Tanishq,
    tags: ['diamond', 'luxury'],
    thumbnailUrls: [
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=600'
    ],
    isNew: false,
    rating: 4.9,
    sku: 'DB005-SW'
  }
];

interface ProductsQueryParams {
  category?: string;
  brand?: Brand;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'newest';
  searchQuery?: string;
}

export const productApiService = createApi({
  reducerPath: 'products',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    // Get all products with optional filters
    getProducts: builder.query<Product[], ProductsQueryParams | void>({
      queryFn: (params) => {
        let filteredProducts = [...MOCK_PRODUCTS];

        if (params) {
          // Filter by brand
          if (params.brand) {
            filteredProducts = filteredProducts.filter(p => p.brand === params.brand);
          }

          // Filter by price range
          if (params.minPrice !== undefined) {
            filteredProducts = filteredProducts.filter(p => p.discountedPrice >= params.minPrice!);
          }
          if (params.maxPrice !== undefined) {
            filteredProducts = filteredProducts.filter(p => p.discountedPrice <= params.maxPrice!);
          }

          // Search by title or name
          if (params.searchQuery) {
            const query = params.searchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(p => 
              p.title.toLowerCase().includes(query) || 
              p.name.toLowerCase().includes(query)
            );
          }

          // Sort products
          if (params.sortBy) {
            switch (params.sortBy) {
              case 'price-low':
                filteredProducts.sort((a, b) => a.discountedPrice - b.discountedPrice);
                break;
              case 'price-high':
                filteredProducts.sort((a, b) => b.discountedPrice - a.discountedPrice);
                break;
              case 'rating':
                filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
              case 'newest':
                filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            }
          }
        }

        return { data: filteredProducts };
      },
    }),

    // Get single product by ID
    getProductById: builder.query<Product, string>({
      queryFn: (id) => {
        const product = MOCK_PRODUCTS.find(p => p.id === id);
        
        if (!product) {
          return { 
            error: { 
              status: 404, 
              statusText: 'Not Found',
              data: 'Product not found' 
            } 
          };
        }

        return { data: product };
      },
    }),

   
    getFeaturedProducts: builder.query<Product[], void>({
      queryFn: () => {
        const featured = MOCK_PRODUCTS.filter(p => p.isNew).slice(0, 4);
        return { data: featured };
      },
    }),

    
    getProductsByType: builder.query<Product[], ProductType>({
      queryFn: (productType) => {
        const products = MOCK_PRODUCTS.filter(p => p.productType === productType);
        return { data: products };
      },
    }),

    
    getProductsByBrand: builder.query<Product[], Brand>({
      queryFn: (brand) => {
        const products = MOCK_PRODUCTS.filter(p => p.brand === brand);
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