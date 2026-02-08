import { ProductType } from "@/enums/productType.enum";
import { Product } from "@/interfaces/product.interface";
import { attributeResolver } from "@/magentoModels/conversionHelpers/attributeResolver";
import { convertMagentoProducts } from "@/magentoModels/conversionHelpers/productConverter";
import { MagentoProduct } from "@/magentoModels/product.model";
import {
  SellerListItem,
  SellerListResponse,
} from "@/magentoModels/seller.model";
import {
  API_ACCESS_TOKEN,
  API_BASE_URL,
  API_ENDPOINTS,
} from "@/store/newApis/apiUrl.const";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Cache for products fetched from API
let cachedProducts: Product[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

/**
 * Fetch all sellers from Magento API
 */
async function fetchSellers(): Promise<SellerListItem[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SELLERS}?searchCriteria=string`,
      {
        headers: {
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch sellers: ${response.status}`);
      return [];
    }

    const data: SellerListResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return [];
  }
}

/**
 * Fetch products for a specific seller
 */
async function fetchSellerProducts(
  sellerId: string
): Promise<MagentoProduct[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SELLER_PRODUCTS(sellerId)}`,
      {
        headers: {
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch products for seller ${sellerId}: ${response.status}`
      );
      return [];
    }

    const products: MagentoProduct[] = await response.json();
    return products || [];
  } catch (error) {
    console.error(`Error fetching products for seller ${sellerId}:`, error);
    return [];
  }
}

/**
 * Fetch all products from all sellers
 */
async function fetchAllProducts(): Promise<Product[]> {
  // Check cache first
  const now = Date.now();
  if (cachedProducts && now - cacheTimestamp < CACHE_DURATION) {
    console.log("Returning cached products");
    return cachedProducts;
  }

  console.log("Fetching products from Magento API...");

  // Initialize attribute resolver first
  await attributeResolver.initialize();

  // Fetch all sellers
  const sellers = await fetchSellers();
  console.log(`Found ${sellers.length} sellers`);

  // Fetch products for each seller in parallel
  const allMagentoProducts: MagentoProduct[] = [];

  await Promise.all(
    sellers.map(async (sellerItem) => {
      const sellerId = sellerItem.seller_data.seller_id;
      const products = await fetchSellerProducts(sellerId);
      console.log(`Seller ${sellerId}: ${products.length} products`);
      allMagentoProducts.push(...products);
    })
  );

  console.log(`Total Magento products: ${allMagentoProducts.length}`);

  // Convert to app's Product interface
  const appProducts = convertMagentoProducts(allMagentoProducts);

  // Update cache
  cachedProducts = appProducts;
  cacheTimestamp = now;

  console.log(`Converted ${appProducts.length} products`);
  return appProducts;
}

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
      queryFn: async (params) => {
        try {
          let products = await fetchAllProducts();

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
        } catch (error) {
          console.error("Error in getProducts:", error);
          return {
            error: {
              status: 500,
              statusText: "Error",
              data: "Failed to fetch products",
            },
          };
        }
      },
    }),

    // Get single product by ID
    getProductById: builder.query<Product, string>({
      queryFn: async (id) => {
        try {
          const products = await fetchAllProducts();
          const product = products.find((p) => p.id === id);

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
        } catch (error) {
          console.error("Error in getProductById:", error);
          return {
            error: {
              status: 500,
              statusText: "Error",
              data: "Failed to fetch product",
            },
          };
        }
      },
    }),

    // Get featured/new products
    getFeaturedProducts: builder.query<Product[], void>({
      queryFn: async () => {
        try {
          const products = await fetchAllProducts();
          const featured = products.filter((p) => p.isNew).slice(0, 4);
          return { data: featured };
        } catch (error) {
          console.error("Error in getFeaturedProducts:", error);
          return { data: [] };
        }
      },
    }),

    // Get products by category/type
    getProductsByType: builder.query<Product[], ProductType>({
      queryFn: async (productType) => {
        try {
          const products = await fetchAllProducts();
          const filtered = products.filter(
            (p) => p.productType === productType
          );
          return { data: filtered };
        } catch (error) {
          console.error("Error in getProductsByType:", error);
          return { data: [] };
        }
      },
    }),

    // Get products by brand
    getProductsByBrand: builder.query<Product[], string>({
      queryFn: async (brand) => {
        try {
          const products = await fetchAllProducts();
          const filtered = products.filter((p) => p.brand === brand);
          return { data: filtered };
        } catch (error) {
          console.error("Error in getProductsByBrand:", error);
          return { data: [] };
        }
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
