export function firstImageHelper(
  userImage: string,
  productImage: string,
  useUserImage: boolean
): string {
  if (useUserImage && userImage) {
    return userImage || "";
  } else {
    return productImage || "";
  }
}
