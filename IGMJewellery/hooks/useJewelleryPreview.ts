import { generateJewelleryImage } from "@/helpers/generateJewelleryImage";
import { Product } from "@/interfaces/product.interface";
import { useEffect, useState } from "react";

/**
 * What the preview asks for. The card shows the piece worn rather than staged,
 * so the prompt leaves the outfit open and lets the shot dress itself.
 */
const PREVIEW_OUTFIT_TYPE =
  "any outfit that goes with the jewellery and a person's face";
const PREVIEW_OUTFIT_COLOR = "any color";

/**
 * Previews held between mounts, keyed by shopper and piece.
 *
 * A card that scrolls out of its list's window unmounts, and without this it
 * would generate its preview again — paying for the round trip and the encode
 * again — every single time it scrolled back into view.
 *
 * Bounded, because an entry is a whole image held as a string on the JS heap.
 * Map iterates in insertion order, so the first key is always the oldest.
 */
const MAX_CACHED_PREVIEWS = 12;
const previews = new Map<string, string>();

/** Requests in flight, so two cards showing one piece generate it once. */
const inFlight = new Map<string, Promise<string | undefined>>();

/**
 * How many previews generate at once.
 *
 * A wishlist opens a screenful of cards together, and each preview is an image
 * generation round trip followed by a base64 encode on the JS thread. Left
 * unbounded they arrive as one burst: the requests compete for the connection
 * and the encodes land on the JS thread together, freezing the very grid the
 * shopper is trying to scroll.
 */
const MAX_CONCURRENT_PREVIEWS = 2;
let running = 0;
const waiting: (() => void)[] = [];

function runWhenFree<T>(task: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const start = () => {
      running += 1;
      task()
        .then(resolve, reject)
        .finally(() => {
          running -= 1;
          waiting.shift()?.();
        });
    };

    if (running < MAX_CONCURRENT_PREVIEWS) start();
    else waiting.push(start);
  });
}

function remember(key: string, uri: string) {
  if (previews.size >= MAX_CACHED_PREVIEWS) {
    const oldest = previews.keys().next().value;
    if (oldest !== undefined) previews.delete(oldest);
  }
  previews.set(key, uri);
}

function loadPreview(key: string, userId: string, product: Product) {
  const pending = inFlight.get(key);
  if (pending) return pending;

  const request = runWhenFree(() =>
    generateJewelleryImage(userId, product, {
      outfitType: PREVIEW_OUTFIT_TYPE,
      outfitColor: PREVIEW_OUTFIT_COLOR,
      returnImage: true,
    })
  )
    .then((uri) => {
      if (uri) remember(key, uri);
      return uri;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, request);
  return request;
}

/**
 * The shopper wearing this piece, generated on demand and shared across cards.
 *
 * Returns an empty uri whenever there is nothing to show — the preview was not
 * asked for, is still generating, or failed — so callers fall back to the
 * catalogue shot.
 */
export function useJewelleryPreview(
  product: Product,
  userId: string | null | undefined,
  enabled: boolean
) {
  const key = enabled && userId && product?.id ? `${userId}_${product.id}` : "";
  // Seeded from the cache so a card scrolling back into the window paints its
  // preview on the first render instead of flashing the loader again.
  const [uri, setUri] = useState(() => (key ? previews.get(key) ?? "" : ""));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!key) {
      setUri("");
      return;
    }

    const cached = previews.get(key);
    if (cached) {
      setUri(cached);
      return;
    }

    // The preview can land after this card has been recycled onto another
    // piece; ignore it if it does.
    let isCurrent = true;
    setUri("");
    setIsLoading(true);

    loadPreview(key, userId as string, product)
      .then((result) => {
        if (isCurrent) setUri(result ?? "");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
    // Keyed on the shopper-and-piece pair alone. `product` is a fresh object
    // every time the catalogue query refetches, and re-running on that would
    // regenerate a preview the cache already holds.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { uri, isLoading };
}
