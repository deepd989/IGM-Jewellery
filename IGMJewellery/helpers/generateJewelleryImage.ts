import { Product } from "../interfaces/product.interface";
import { WRAPPER_API } from "../store/newApis/apiUrl.const";

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
  setData: (data: string) => void,
  outfitType?: string,
  outfitColor?: string
) {
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
