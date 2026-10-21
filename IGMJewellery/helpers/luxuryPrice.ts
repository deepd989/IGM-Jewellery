import { Product } from "@/interfaces/product.interface";

/**
 * What LUXE lists a piece at.
 *
 * The luxury storefront doesn't discount. Where the Massy storefront shows the
 * pair — `discountedPrice` beside a struck-through `givenPrice` — LUXE shows
 * the catalogue's own price on its own, and never the struck one.
 *
 * `discountedPrice` is only a fallback for the odd product the catalogue has no
 * price for, so a card never lands on ₹0.
 */
export const luxuryPrice = (product: Product) =>
  product.givenPrice || product.discountedPrice;
