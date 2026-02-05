export const API_URL = "https://www.experapps.xyz/rest/";
export const API_BASE_URL = "https://www.experapps.xyz/rest/all/V1";

// Access token for API authentication
export const API_ACCESS_TOKEN = "i3c179msh3zyik4943d2cepu3l0hxezg";

// API Endpoints
export const API_ENDPOINTS = {
  SELLERS: "/mpapi/sellers",
  SELLER_PRODUCTS: (sellerId: string) => `/mpapi/admin/sellers/${sellerId}/product`,
  ATTRIBUTE_OPTIONS: (attributeCode: string) => `/products/attributes/${attributeCode}/options`,
} as const;
