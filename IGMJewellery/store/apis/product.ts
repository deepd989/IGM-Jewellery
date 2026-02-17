import { ProductType } from "@/enums/productType.enum";
import { Product } from "@/interfaces/product.interface";
import { convertResolvedProducts } from "@/magentoModels/conversionHelpers/productConverter";
import { MagentoProduct } from "@/magentoModels/product.model";
import { WRAPPER_API } from "@/store/newApis/apiUrl.const";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Cache for products fetched from API
let cachedProducts: Product[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

/**
 * Response shape from /getAllProducts endpoint
 * Each item has a pre-resolved product and the seller ID
 */
interface AllProductsResponseItem {
  updated: MagentoProduct;
  sellerId: string;
}

/**
 * Fetch all products from the backend /getAllProducts endpoint.
 * This single call replaces the old multi-step flow of:
 *   1. Fetching sellers
 *   2. Fetching products per seller
 *   3. Resolving custom attribute IDs to labels
 *
 * The backend now handles all of that and returns pre-resolved products.
 */
async function fetchAllProducts(): Promise<Product[]> {
  // Check cache first
  const now = Date.now();
  if (cachedProducts && now - cacheTimestamp < CACHE_DURATION) {
    console.log("Returning cached products");
    return cachedProducts;
  }

  console.log("Fetching products from /getAllProducts...");

  try {
    const response = await fetch(`${WRAPPER_API}/getAllProducts`);

    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.status}`);
      return cachedProducts || [];
    }

    const data: AllProductsResponseItem[] = await response.json();
    console.log(`Received ${data.length} products from backend`);

    // Convert pre-resolved products to app's Product interface
    const appProducts = convertResolvedProducts(data);

    // Update cache
    cachedProducts = appProducts;
    cacheTimestamp = now;

    console.log(`Converted ${appProducts.length} products`);
    return appProducts;
  } catch (error) {
    console.error("Error fetching products from /getAllProducts:", error);
    // Return stale cache if available, otherwise empty
    return cachedProducts || [];
  }
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
          selectedOptions.some(
            (opt) => p.brand.toLowerCase() === opt.toLowerCase()
          )
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
          selectedOptions.some((gem) => {
            const stoneType = p.productDetails?.stoneType?.toLowerCase() || "";
            return stoneType.includes(gem.toLowerCase());
          })
        );
        break;

      case "metal":
        filteredProducts = filteredProducts.filter((p) =>
          selectedOptions.some((metal) => {
            const metalType = p.productDetails?.metalType?.toLowerCase() || "";
            return metalType.includes(metal.toLowerCase());
          })
        );
        break;

      case "occasion":
        filteredProducts = filteredProducts.filter((prod) =>
          prod.occaision.some((occ) =>
            selectedOptions.some(
              (opt) => occ.toLowerCase() === opt.toLowerCase()
            )
          )
        );
        break;

      case "gender":
        filteredProducts = filteredProducts.filter((prod) =>
          selectedOptions.some(
            (opt) => prod.gender.toLowerCase() === opt.toLowerCase()
          )
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
