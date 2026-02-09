import { Gender } from "@/constants/genderEnum";
import { OccasiomEnum } from "@/constants/occasions";
import { Brand } from "@/enums/brand.enum";
import { ProductType } from "@/enums/productType.enum";
import { Product, ProductDetails } from "@/interfaces/product.interface";
import { CustomAttribute, MagentoProduct } from "@/magentoModels/product.model";
import { attributeResolver } from "./attributeResolver";

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

/**
 * Get a custom attribute value from product
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
 * Parse product type from sub_cat or product name
 */
function parseProductType(product: MagentoProduct): ProductType {
  // Try to get from sub_cat attribute
  const subCat = getCustomAttribute(product, "sub_cat");
  if (subCat) {
    const resolvedLabel = attributeResolver.resolve("sub_cat", subCat).toLowerCase();
    const mappedType = PRODUCT_TYPE_MAP[resolvedLabel];
    if (mappedType) return mappedType;
  }

  // Try to get from p_type attribute
  const pType = getCustomAttribute(product, "p_type");
  if (pType) {
    const resolvedLabel = attributeResolver.resolve("p_type", pType).toLowerCase();
    const mappedType = PRODUCT_TYPE_MAP[resolvedLabel];
    if (mappedType) return mappedType;
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
 * Parse brand from seller_id
 */
function parseBrand(product: MagentoProduct): Brand {
  const sellerId = getCustomAttribute(product, "seller_id");
  if (sellerId) {
    const brand = SELLER_TO_BRAND_MAP[String(sellerId)];
    if (brand) return brand;
  }
  return Brand.Tanishq; // Default brand
}

/**
 * Parse occasions from occasion_tags
 */
function parseOccasions(product: MagentoProduct): OccasiomEnum[] {
  const occasionTags = getCustomAttribute(product, "occasion_tags");
  if (!occasionTags) return [];

  const resolved = attributeResolver.resolve("occasion_tags", occasionTags).toLowerCase();
  const occasions: OccasiomEnum[] = [];

  for (const [keyword, occasion] of Object.entries(OCCASION_MAP)) {
    if (resolved.includes(keyword)) {
      occasions.push(occasion);
    }
  }

  return occasions;
}

/**
 * Get description from meta_description or generate default
 */
function getDescription(product: MagentoProduct): string {
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
    // Media gallery entries typically have a file path that needs base URL
    // For now, return placeholder since actual image URLs may need different handling
    return product.media_gallery_entries.map((entry: any) => {
      if (entry.file) {
        // Construct full URL - this may need adjustment based on actual API
        return `https://www.experapps.xyz/media/catalog/product${entry.file}`;
      }
      return DEFAULT_PRODUCT_IMAGE;
    });
  }
  return [DEFAULT_PRODUCT_IMAGE];
}

/**
 * Generate tags from product attributes
 */
function generateTags(product: MagentoProduct): string[] {
  const tags: string[] = [];

  // Add metal type tag
  const metalType = getCustomAttribute(product, "metal_type");
  if (metalType) {
    const resolvedMetal = attributeResolver.resolve("metal_type", metalType);
    if (resolvedMetal && resolvedMetal !== String(metalType)) {
      tags.push(resolvedMetal.toLowerCase());
    }
  }

  // Add design style tag
  const designStyle = getCustomAttribute(product, "design_style");
  if (designStyle) {
    const resolvedStyle = attributeResolver.resolve("design_style", designStyle);
    if (resolvedStyle && resolvedStyle !== String(designStyle)) {
      tags.push(resolvedStyle.toLowerCase());
    }
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
 * Extract and resolve product details from custom attributes
 */
function extractProductDetails(product: MagentoProduct): ProductDetails {
  const details: ProductDetails = {};

  // Metal type (resolved from ID to label)
  const metalType = getCustomAttribute(product, "metal_type");
  if (metalType) {
    const resolved = attributeResolver.resolve("metal_type", metalType);
    if (resolved && resolved !== String(metalType)) {
      details.metalType = resolved;
    }
  }

  // Metal purity - check gold, platinum, or silver
  const goldPurity = getCustomAttribute(product, "gold_purity");
  if (goldPurity) {
    const resolved = attributeResolver.resolve("gold_purity", goldPurity);
    if (resolved && resolved !== String(goldPurity)) {
      details.metalPurity = resolved;
    }
  }
  if (!details.metalPurity) {
    const platinumPurity = getCustomAttribute(product, "platinum_purity");
    if (platinumPurity) {
      const resolved = attributeResolver.resolve("platinum_purity", platinumPurity);
      if (resolved && resolved !== String(platinumPurity)) {
        details.metalPurity = resolved;
      }
    }
  }
  if (!details.metalPurity) {
    const silverPurity = getCustomAttribute(product, "silver_purity");
    if (silverPurity) {
      const resolved = attributeResolver.resolve("silver_purity", silverPurity);
      if (resolved && resolved !== String(silverPurity)) {
        details.metalPurity = resolved;
      }
    }
  }

  // Metal finish
  const metalFinish = getCustomAttribute(product, "metal_finish");
  if (metalFinish) {
    const resolved = attributeResolver.resolve("metal_finish", metalFinish);
    if (resolved && resolved !== String(metalFinish)) {
      details.metalFinish = resolved;
    }
  }

  // Weights (numeric values, format with unit)
  const netWeight = getCustomAttribute(product, "net_wt");
  if (netWeight && typeof netWeight === "string") {
    const numVal = parseFloat(netWeight);
    if (!isNaN(numVal) && numVal > 0) {
      details.netWeight = `${numVal.toFixed(3)} g`;
    }
  }

  const grossWeight = getCustomAttribute(product, "gross_wt");
  if (grossWeight && typeof grossWeight === "string") {
    const numVal = parseFloat(grossWeight);
    if (!isNaN(numVal) && numVal > 0) {
      details.grossWeight = `${numVal.toFixed(3)} g`;
    }
  }

  // Dimensions (numeric values, format with unit)
  const height = getCustomAttribute(product, "dim_height");
  if (height && typeof height === "string") {
    const numVal = parseFloat(height);
    if (!isNaN(numVal) && numVal > 0) {
      details.height = `${numVal} mm`;
    }
  }

  const width = getCustomAttribute(product, "dim_width");
  if (width && typeof width === "string") {
    const numVal = parseFloat(width);
    if (!isNaN(numVal) && numVal > 0) {
      details.width = `${numVal} mm`;
    }
  }

  const depth = getCustomAttribute(product, "dim_depth");
  if (depth && typeof depth === "string") {
    const numVal = parseFloat(depth);
    if (!isNaN(numVal) && numVal > 0) {
      details.depth = `${numVal} mm`;
    }
  }

  // Diamond weight
  const diamondWeight = getCustomAttribute(product, "d1_wt");
  if (diamondWeight && typeof diamondWeight === "string") {
    const numVal = parseFloat(diamondWeight);
    if (!isNaN(numVal) && numVal > 0) {
      details.diamondWeight = `${numVal.toFixed(3)} C`;
    }
  }

  // Diamond clarity (resolved from ID to label)
  const d1Clarity = getCustomAttribute(product, "d1_clarity");
  if (d1Clarity) {
    const resolved = attributeResolver.resolve("d1_clarity", d1Clarity);
    if (resolved && resolved !== String(d1Clarity)) {
      details.diamondClarity = resolved;
    }
  }

  // Diamond color (resolved from ID to label)
  const d1Color = getCustomAttribute(product, "d1_colour");
  if (d1Color) {
    const resolved = attributeResolver.resolve("d1_colour", d1Color);
    if (resolved && resolved !== String(d1Color)) {
      details.diamondColor = resolved;
    }
  }

  // Stone type
  const stoneType = getCustomAttribute(product, "s_type");
  if (stoneType) {
    const resolved = attributeResolver.resolve("s_type", stoneType);
    if (resolved && resolved !== String(stoneType)) {
      details.stoneType = resolved;
    }
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
 * Convert MagentoProduct to app's Product interface
 */
export function convertMagentoProduct(magentoProduct: MagentoProduct): Product {
  return {
    id: String(magentoProduct.id),
    title: magentoProduct.name,
    name: magentoProduct.name,
    description: getDescription(magentoProduct),
    productType: parseProductType(magentoProduct),
    givenPrice: magentoProduct.price,
    discountedPrice: magentoProduct.price, // No discount data in API, use same price
    brand: parseBrand(magentoProduct),
    tags: generateTags(magentoProduct),
    thumbnailUrls: getThumbnailUrls(magentoProduct),
    isNew: isNewProduct(magentoProduct),
    sku: magentoProduct.sku,
    rating: 4.0 + Math.random() * 1.0, // Generate random rating between 4.0-5.0
    occaision: parseOccasions(magentoProduct),
    gender: Gender.unisex, // Default to unisex as API doesn't provide gender
    productDetails: extractProductDetails(magentoProduct),
  };
}

/**
 * Convert array of MagentoProducts to app's Product interface
 */
export function convertMagentoProducts(magentoProducts: MagentoProduct[]): Product[] {
  return magentoProducts.map(convertMagentoProduct);
}
