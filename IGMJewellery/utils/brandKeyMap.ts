/**
 * Convert a brand name to a URL-safe key for routing.
 * Since brand names now come from the API as strings,
 * we generate the key by lowercasing and replacing spaces with underscores.
 */
export function getBrandKey(brandName: string): string {
  return brandName.toLowerCase().replace(/\s+/g, "_");
}
