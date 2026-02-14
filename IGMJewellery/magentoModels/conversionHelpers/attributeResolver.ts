import { AttributeOption } from "@/magentoModels/seller.model";
import { API_ACCESS_TOKEN, API_BASE_URL, API_ENDPOINTS } from "@/store/newApis/apiUrl.const";

/**
 * AttributeResolver - Caches and resolves Magento custom_attributes to human-readable labels
 * 
 * This is a singleton service that:
 * 1. Fetches attribute options from the API
 * 2. Caches them to avoid repeated calls
 * 3. Provides synchronous lookups after initial fetch
 */
class AttributeResolverService {
  private cache: Map<string, Map<string, string>> = new Map();
  private fetchPromises: Map<string, Promise<void>> = new Map();
  private initialized = false;

  // Attributes we commonly need to resolve
  private readonly PRELOAD_ATTRIBUTES = [
    "sub_cat",      // Product category/type
    "brand_id",     // Brand name
    "collection_id",// Collection name
    "p_type",       // Product type
    "metal_type",   // Metal type
    "metal_finish", // Metal finish
    "gold_purity",  // Gold purity (14k, 18k, 22k)
    "platinum_purity", // Platinum purity
    "silver_purity",   // Silver purity
    "occasion_tags",// Occasion tags
    "design_style", // Design style
    "d1_clarity",   // Diamond clarity
    "d1_colour",    // Diamond color
    "d1_type",      // Diamond type
    "s_type",       // Stone type
  ];

  /**
   * Fetch and cache options for a single attribute
   */
  async fetchAttribute(attributeCode: string): Promise<void> {
    // Return existing promise if already fetching
    if (this.fetchPromises.has(attributeCode)) {
      return this.fetchPromises.get(attributeCode);
    }

    // Return immediately if already cached
    if (this.cache.has(attributeCode)) {
      return Promise.resolve();
    }

    const fetchPromise = (async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.ATTRIBUTE_OPTIONS(attributeCode)}`,
          {
            headers: {
              "Authorization": `Bearer ${API_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.warn(`Failed to fetch attribute options for ${attributeCode}: ${response.status}`);
          return;
        }

        const options: AttributeOption[] = await response.json();
        const optionMap = new Map<string, string>();
        
        options.forEach((opt) => {
          if (opt.value && opt.label && opt.label.trim()) {
            optionMap.set(opt.value, opt.label.trim());
          }
        });

        this.cache.set(attributeCode, optionMap);
      } catch (error) {
        console.warn(`Error fetching attribute ${attributeCode}:`, error);
      } finally {
        this.fetchPromises.delete(attributeCode);
      }
    })();

    this.fetchPromises.set(attributeCode, fetchPromise);
    return fetchPromise;
  }

  /**
   * Initialize by preloading common attributes
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log("AttributeResolver: Preloading common attributes...");
    await Promise.all(
      this.PRELOAD_ATTRIBUTES.map((attr) => this.fetchAttribute(attr))
    );
    this.initialized = true;
    console.log("AttributeResolver: Initialization complete");
  }

  /**
   * Resolve an attribute value to its label
   * Returns the original value if not found in cache
   */
  resolve(attributeCode: string, value: string | number | boolean | string[]): string {
    // Handle array values (e.g., category_ids)
    if (Array.isArray(value)) {
      return value
        .map((v) => this.resolveSingle(attributeCode, String(v)))
        .filter(Boolean)
        .join(", ");
    }

    return this.resolveSingle(attributeCode, String(value));
  }

  private resolveSingle(attributeCode: string, value: string): string {
    const optionMap = this.cache.get(attributeCode);
    if (!optionMap) {
      return value;
    }

    return optionMap.get(value) || value;
  }

  /**
   * Check if an attribute is cached
   */
  isCached(attributeCode: string): boolean {
    return this.cache.has(attributeCode);
  }

  /**
   * Get all cached options for an attribute
   */
  getOptions(attributeCode: string): Map<string, string> | undefined {
    return this.cache.get(attributeCode);
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
    this.initialized = false;
  }
}

// Export singleton instance
export const attributeResolver = new AttributeResolverService();
