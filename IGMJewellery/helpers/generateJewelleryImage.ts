import { AiApiUrl } from "../envConstants/AiApiUrl";
import { Product } from "../interfaces/product.interface";

/**
 *
 * @param userId user id
 * @param product product data
 * @param outfitType
 * @param outfitColor
 * @param setData
 */
export async function generateJewelleryImage(
  userId: string,
  product: Product,
  outfitType: string,
  outfitColor: string,
  setData: (data: string) => void
) {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("productId", product.id);
  formData.append("outfitType", outfitType || "suit");
  formData.append("outfitColor", outfitColor || "black");

  const type = product.productType.toLowerCase();
  const jewelleryUrls = { [type]: product.thumbnailUrls[0] };
  formData.append("jewelleryUrls", JSON.stringify(jewelleryUrls));

  try {
    const response = await fetch(`${AiApiUrl}/generateImageByUrl`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      setData(base64data);
    };
  } catch (error) {
    console.error("Request failed:", error);
  }
}
