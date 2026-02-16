export const API_URL = "https://www.experapps.xyz/rest/";
export const API_BASE_URL = "https://www.experapps.xyz/rest/all/V1";

// Local backend server that serves pre-resolved product data
export const WRAPPER_API = "http://localhost:3000"; // Change to your backend URL if different

// Access token for API authentication
export const API_ACCESS_TOKEN = "i3c179msh3zyik4943d2cepu3l0hxezg";

// API Endpoints
export const API_ENDPOINTS = {
  SELLERS: "/mpapi/sellers",
  SELLER_PRODUCTS: (sellerId: string) =>
    `/mpapi/admin/sellers/${sellerId}/product`,
  ATTRIBUTE_OPTIONS: (attributeCode: string) =>
    `/products/attributes/${attributeCode}/options`,
  WISHLIST_ADD: "/connectifysync/wishlist/add",
  WISHLIST_REMOVE: "/connectifysync/wishlist/remove",
} as const;
