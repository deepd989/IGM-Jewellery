import { useGetCartQuery } from "@/store/apis/cart";
import { useRouter } from "expo-router";
import { useCallback } from "react";

/**
 * Whether a piece is already in the bag, and the jump to it.
 *
 * Every bag button in the app reads from this: once the piece is in the bag the
 * button stops offering to add it again and takes the shopper to the cart
 * instead.
 *
 * `selectFromResult` narrows the subscription to this one product's membership,
 * so a card only re-renders when its own piece goes in or out of the bag —
 * adding one item doesn't re-render every card on the page.
 */
export function useCartStatus(productId?: string) {
  const router = useRouter();

  const { isInCart } = useGetCartQuery(undefined, {
    selectFromResult: ({ data }) => ({
      isInCart:
        !!productId &&
        !!data?.items.some((item) => item.product.id === productId),
    }),
  });

  const goToCart = useCallback(() => {
    router.navigate("/cart");
  }, [router]);

  return { isInCart, goToCart };
}
