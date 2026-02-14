import { Gender } from "@/constants/genderEnum";
import { OccasiomEnum } from "@/constants/occasions";
import { Brand } from "@/enums/brand.enum";
import { ProductType } from "@/enums/productType.enum";
import { Product, ProductDetails } from "@/interfaces/product.interface";
import { CustomAttribute, MagentoProduct } from "@/magentoModels/product.model";

// Default placeholder image when no images available
const DEFAULT_PRODUCT_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";

// Map of sub_cat resolved labels to ProductType enum
const PRODUCT_TYPE_MAP: Record<string, ProductType> = {
  // Category mappings based on typical jewelry categories
  "ring": ProductType.Ring,
  "rings": ProductType.Ring,
  "engagement": ProductType.Ring,
  "wedding": ProductType.Ring,
  "cocktail": ProductType.Ring,
  "band": ProductType.Ring,
  "solitaire": ProductType.Ring,
  "necklace": ProductType.Necklace,
  "necklaces": ProductType.Necklace,
  "chain": ProductType.Necklace,
  "pendant": ProductType.Necklace,
  "earring": ProductType.Earring,
  "earrings": ProductType.Earring,
  "studs": ProductType.Earring,
  "bali": ProductType.Earring,
  "hoops": ProductType.Earring,
  "bracelet": ProductType.Bracelet,
  "bracelets": ProductType.Bracelet,
  "bangle": ProductType.Bracelet,
  "bangles": ProductType.Bracelet,
  "diamond": ProductType.DiamondStone,
  "diamonds": ProductType.DiamondStone,
  "gold": ProductType.Gold,
  "gift": ProductType.Gift,
  "gifts": ProductType.Gift,
};

// Map seller_id to Brand enum (based on known seller IDs from API response)
const SELLER_TO_BRAND_MAP: Record<string, Brand> = {
  "4": Brand.Tanishq,      // roma-design
  "5": Brand.Malabar,      // rajashri-design  
  "2": Brand.KalyanJewellers, // saeedshop
  "7": Brand.Tanishq,      // tanishq.co.in
};

// Map occasion resolved labels to OccasionEnum
const OCCASION_MAP: Record<string, OccasiomEnum> = {
  "birthday": OccasiomEnum.Birthday,
  "anniversary": OccasiomEnum.Anniversary,
  "wedding": OccasiomEnum.Wedding,
  "graduation": OccasiomEnum.Graduation,
  "diwali": OccasiomEnum.Diwali,
  "festive": OccasiomEnum.Diwali,
  "festival": OccasiomEnum.Diwali,
};

// Map user_type values to Gender enum
const GENDER_MAP: Record<string, Gender> = {
  "male": Gender.male,
  "female": Gender.female,
  "unisex": Gender.unisex,
};

/**
 * Get a custom attribute value from product
 * Works with both raw and pre-resolved custom_attributes
 */
function getCustomAttribute(
  product: MagentoProduct,
  attributeCode: string
): string | number | boolean | string[] | undefined {
  const attr = product.custom_attributes?.find(
    (a: CustomAttribute) => a.attribute_code === attributeCode
  );
  return attr?.value;
}

/**
 * Parse product type from sub_cat (pre-resolved label) or product name
 */
function parseProductType(product: MagentoProduct): ProductType {
  // Try to get from sub_cat attribute (already resolved to label like "Bangles", "Cocktail")
  const subCat = getCustomAttribute(product, "sub_cat");
  if (subCat && typeof subCat === "string") {
    const mappedType = PRODUCT_TYPE_MAP[subCat.toLowerCase()];
    if (mappedType) return mappedType;
  }

  // Try to get from p_type attribute (already resolved to label like "Studded")
  const pType = getCustomAttribute(product, "p_type");
  if (pType && typeof pType === "string") {
    const mappedType = PRODUCT_TYPE_MAP[pType.toLowerCase()];
    if (mappedType) return mappedType;
  }

  // Try from category_ids (already resolved to labels like ["Rings", "Engagement"])
  const categoryIds = getCustomAttribute(product, "category_ids");
  if (Array.isArray(categoryIds)) {
    for (const cat of categoryIds) {
      const mappedType = PRODUCT_TYPE_MAP[String(cat).toLowerCase()];
      if (mappedType) return mappedType;
    }
  }

  // Fallback: parse from product name
  const nameLower = product.name.toLowerCase();
  for (const [keyword, type] of Object.entries(PRODUCT_TYPE_MAP)) {
    if (nameLower.includes(keyword)) {
      return type;
    }
  }

  // Default to Ring if nothing matches
  return ProductType.Ring;
}

/**
 * Parse brand from sellerId (passed from the API response wrapper)
 */
function parseBrandFromSellerId(sellerId: string): Brand {
  const brand = SELLER_TO_BRAND_MAP[sellerId];
  if (brand) return brand;
  return Brand.Tanishq; // Default brand
}

/**
 * Parse occasions from occasion_tags (pre-resolved label)
 */
function parseOccasions(product: MagentoProduct): OccasiomEnum[] {
  const occasionTags = getCustomAttribute(product, "occasion_tags");
  if (!occasionTags) return [];

  const resolved = String(occasionTags).toLowerCase();
  const occasions: OccasiomEnum[] = [];

  for (const [keyword, occasion] of Object.entries(OCCASION_MAP)) {
    if (resolved.includes(keyword)) {
      occasions.push(occasion);
    }
  }

  return occasions;
}

/**
 * Parse gender from user_type attribute (pre-resolved label)
 */
function parseGender(product: MagentoProduct): Gender {
  const userType = getCustomAttribute(product, "user_type");
  if (userType && typeof userType === "string") {
    const mapped = GENDER_MAP[userType.toLowerCase()];
    if (mapped) return mapped;
  }
  return Gender.unisex; // Default to unisex
}

/**
 * Get description from short_description, meta_description, or generate default
 */
function getDescription(product: MagentoProduct): string {
  // Try short_description first (may contain HTML, strip tags)
  const shortDesc = getCustomAttribute(product, "short_description");
  if (shortDesc && typeof shortDesc === "string" && shortDesc.trim()) {
    return shortDesc.replace(/<\/?[^>]+(>|$)/g, "").trim();
  }

  const metaDesc = getCustomAttribute(product, "meta_description");
  if (metaDesc && typeof metaDesc === "string" && metaDesc.trim()) {
    return metaDesc.trim();
  }
  return `Beautiful ${product.name} - Premium quality jewelry crafted with care.`;
}

/**
 * Get thumbnail URLs from media_gallery_entries or use placeholder
 */
function getThumbnailUrls(product: MagentoProduct): string[] {
  if (product.media_gallery_entries && product.media_gallery_entries.length > 0) {
    return product.media_gallery_entries.map((entry: any) => {
      if (entry.file) {
        return `https://www.experapps.xyz/media/catalog/product${entry.file}`;
      }
      return DEFAULT_PRODUCT_IMAGE;
    });
  }
  return [DEFAULT_PRODUCT_IMAGE];
}

/**
 * Generate tags from product attributes (pre-resolved labels)
 */
function generateTags(product: MagentoProduct): string[] {
  const tags: string[] = [];

  // Add metal type tag (already resolved label like "Gold")
  const metalType = getCustomAttribute(product, "metal_type");
  if (metalType && typeof metalType === "string") {
    tags.push(metalType.toLowerCase());
  }

  // Add stone type tag
  const stoneType = getCustomAttribute(product, "stone_type");
  if (stoneType && typeof stoneType === "string") {
    tags.push(stoneType.toLowerCase());
  }

  // Check if new (created within last 30 days)
  const createdAt = new Date(product.created_at);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  if (createdAt > thirtyDaysAgo) {
    tags.push("new");
  }

  return tags;
}

/**
 * Extract product details from pre-resolved custom attributes
 * All values are already human-readable strings
 */
function extractProductDetails(product: MagentoProduct): ProductDetails {
  const details: ProductDetails = {};

  // Metal type (already resolved, e.g. "Gold")
  const metalType = getCustomAttribute(product, "metal_type");
  if (metalType && typeof metalType === "string") {
    details.metalType = metalType;
  }

  // Metal purity (already resolved, e.g. "18K", "14K")
  const goldPurity = getCustomAttribute(product, "gold_purity");
  if (goldPurity && typeof goldPurity === "string") {
    details.metalPurity = goldPurity;
  }

  // Metal finish (already resolved, e.g. "Satin")
  const metalFinish = getCustomAttribute(product, "metal_finish");
  if (metalFinish && typeof metalFinish === "string") {
    details.metalFinish = metalFinish;
  }

  // Net weight
  const netWeight = getCustomAttribute(product, "net_weight");
  if (netWeight && typeof netWeight === "string") {
    const numVal = parseFloat(netWeight);
    if (!isNaN(numVal) && numVal > 0) {
      details.netWeight = `${numVal.toFixed(3)} g`;
    }
  }

  // Gross weight
  const grossWeight = getCustomAttribute(product, "gross_weight");
  if (grossWeight && typeof grossWeight === "string") {
    const numVal = parseFloat(grossWeight);
    if (!isNaN(numVal) && numVal > 0) {
      details.grossWeight = `${numVal.toFixed(3)} g`;
    }
  }

  // Dimensions - use ring_height_mm, ring_width_mm, ring_depth_mm
  const height = getCustomAttribute(product, "ring_height_mm");
  if (height && typeof height === "string") {
    const numVal = parseFloat(height);
    if (!isNaN(numVal) && numVal > 0) {
      details.height = `${numVal} mm`;
    }
  }

  const width = getCustomAttribute(product, "ring_width_mm");
  if (width && typeof width === "string") {
    const numVal = parseFloat(width);
    if (!isNaN(numVal) && numVal > 0) {
      details.width = `${numVal} mm`;
    }
  }

  const depth = getCustomAttribute(product, "ring_depth_mm");
  if (depth && typeof depth === "string") {
    const numVal = parseFloat(depth);
    if (!isNaN(numVal) && numVal > 0) {
      details.depth = `${numVal} mm`;
    }
  }

  // Diamond weight (already a numeric string like "0.9")
  const diamondWeight = getCustomAttribute(product, "d1_wt");
  if (diamondWeight && typeof diamondWeight === "string") {
    const numVal = parseFloat(diamondWeight);
    if (!isNaN(numVal) && numVal > 0) {
      details.diamondWeight = `${numVal.toFixed(3)} C`;
    }
  }

  // Diamond clarity (already resolved, e.g. "VVS")
  const d1Clarity = getCustomAttribute(product, "d1_clarity");
  if (d1Clarity && typeof d1Clarity === "string") {
    details.diamondClarity = d1Clarity;
  }

  // Diamond color (already resolved, e.g. "G - H")
  const d1Color = getCustomAttribute(product, "d1_colour");
  if (d1Color && typeof d1Color === "string") {
    details.diamondColor = d1Color;
  }

  // Stone type (already resolved, e.g. "Natural Diamond")
  const sType = getCustomAttribute(product, "s_type");
  if (sType && typeof sType === "string") {
    details.stoneType = sType;
  }

  return details;
}

/**
 * Check if product is new (created within last 30 days)
 */
function isNewProduct(product: MagentoProduct): boolean {
  const createdAt = new Date(product.created_at);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return createdAt > thirtyDaysAgo;
}

/**
 * Compute discounted price from price, discount, and additional_discount
 */
function computeDiscountedPrice(product: MagentoProduct): number {
  const price = product.price;
  const discount = parseFloat(String(getCustomAttribute(product, "discount") || "0"));
  const additionalDiscount = parseFloat(String(getCustomAttribute(product, "additional_discount") || "0"));
  
  const totalDiscount = (isNaN(discount) ? 0 : discount) + (isNaN(additionalDiscount) ? 0 : additionalDiscount);
  const discounted = price - totalDiscount;
  return discounted > 0 ? discounted : price;
}

/**
 * Get product rating from p_ratings attribute
 */
function getRating(product: MagentoProduct): number {
  const pRatings = getCustomAttribute(product, "p_ratings");
  if (pRatings) {
    const parsed = parseFloat(String(pRatings));
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  // Fallback: random rating between 4.0-5.0
  return 4.0 + Math.random() * 1.0;
}

/**
 * Convert a pre-resolved MagentoProduct to app's Product interface
 * Used with the /getAllProducts endpoint response
 * 
 * @param magentoProduct - The pre-resolved product from the API (custom_attributes already have labels)
 * @param sellerId - The seller ID from the response wrapper (e.g., "4")
 */
export function convertResolvedProduct(magentoProduct: MagentoProduct, sellerId: string): Product {
  return {
    id: String(magentoProduct.id),
    title: magentoProduct.name,
    name: magentoProduct.name,
    description: getDescription(magentoProduct),
    productType: parseProductType(magentoProduct),
    givenPrice: magentoProduct.price,
    discountedPrice: computeDiscountedPrice(magentoProduct),
    brand: parseBrandFromSellerId(sellerId),
    tags: generateTags(magentoProduct),
    thumbnailUrls: getThumbnailUrls(magentoProduct),
    isNew: isNewProduct(magentoProduct),
    sku: magentoProduct.sku,
    rating: getRating(magentoProduct),
    occaision: parseOccasions(magentoProduct),
    gender: parseGender(magentoProduct),
    productDetails: extractProductDetails(magentoProduct),
  };
}

/**
 * Convert array of pre-resolved products from /getAllProducts response
 */
export function convertResolvedProducts(
  items: Array<{ updated: MagentoProduct; sellerId: string }>
): Product[] {
  return items.map((item) => convertResolvedProduct(item.updated, item.sellerId));
}

// ---- Legacy converters (kept for backward compatibility if needed) ----

/**
 * @deprecated Use convertResolvedProduct instead. This was used with raw Magento API data.
 */
export function convertMagentoProduct(magentoProduct: MagentoProduct): Product {
  return convertResolvedProduct(magentoProduct, "4"); // Default seller
}

/**
 * @deprecated Use convertResolvedProducts instead. This was used with raw Magento API data.
 */
export function convertMagentoProducts(magentoProducts: MagentoProduct[]): Product[] {
  return magentoProducts.map(convertMagentoProduct);
}
