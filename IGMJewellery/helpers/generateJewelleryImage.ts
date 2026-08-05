import { Product } from "../interfaces/product.interface";
import { WRAPPER_API } from "../store/newApis/apiUrl.const";

export type GenerateJewelleryImageOptions = {
  outfitType?: string;
  outfitColor?: string;
  /**
   * Decode the response and hand it back as a base64 data URI.
   *
   * Off by default, and deliberately so: the decode is the expensive half of
   * this call — a multi-megabyte encode on the JS thread — and a caller that
   * only needs the shot to exist server-side should never pay for it.
   */
  returnImage?: boolean;
};

/**
 * Generates the shopper's try-on shot for a piece server-side.
 *
 * Resolves to the shot as a data URI when `returnImage` is set, and to
 * undefined otherwise — or when the request failed. It never throws: every
 * caller treats a missing shot as "show the catalogue image instead".
 *
 * @param userId user id
 * @param product product data
 */
export async function generateJewelleryImage(
  userId: string,
  product: Product,
  options: GenerateJewelleryImageOptions = {}
): Promise<string | undefined> {
  const { outfitType, outfitColor, returnImage = false } = options;

  if (!product || !userId) return;

  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("productId", product.id);
  formData.append("outfitType", outfitType || "");
  formData.append("outfitColor", outfitColor || "");

  const type = product.productType.toLowerCase();
  const jewelleryUrls = { [type]: product.thumbnailUrls[0] };
  formData.append("jewelleryUrls", JSON.stringify(jewelleryUrls));

  try {
    const response = await fetch(`${WRAPPER_API}/generateImageByUrl`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Network response was not ok");

    if (!returnImage) return;

    const blob = await response.blob();
    // Awaited rather than left running on its own: callers await this function
    // before navigating, and an encode still in flight during a screen
    // transition competes with that transition for the JS thread.
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Request failed:", error);
    return;
  }
}
