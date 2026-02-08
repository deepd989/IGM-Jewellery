export function firstImageHelper(
  userImage: string,
  productImage: string,
  useUserImage: boolean
): string {
  if (useUserImage) {
    return userImage || "";
  } else {
    return productImage || "";
  }
}
