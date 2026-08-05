import { useEffect, useState } from "react";
import { WRAPPER_API } from "../../store/newApis/apiUrl.const";

/**
 * Resolves a shopper's generated try-on shot to a plain HTTP URL.
 *
 * The image is handed to <Image> as a URL rather than a base64 data URI on
 * purpose. Pulling the bytes into JS and encoding them left four live copies
 * of a multi-megabyte PNG on the JS thread (ArrayBuffer, Buffer, the base64
 * string, and the `data:` prefix concat), and a data URI is then decoded at
 * full resolution natively with no disk cache and no downsampling. Landing on
 * the product screen straight after a try-on paid all of that at once, which
 * is what was killing the app.
 *
 * A HEAD request only asks whether the shot exists yet — the bytes never reach
 * JS, and the native image layer fetches and caches them itself.
 */
export const useGetImage = (imageId: string) => {
  const [imageUri, setImageUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageId) {
      setImageUri("");
      return;
    }

    // The answer can land after the screen has moved on; ignore it if it does.
    let isCurrent = true;
    const url = `${WRAPPER_API}/getImage/${imageId}`;

    const checkImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { method: "HEAD" });
        if (!isCurrent) return;

        // A 404 just means this shopper has no try-on shot for this piece yet,
        // which is the ordinary case rather than a failure.
        setImageUri(response.ok ? url : "");
      } catch (err: any) {
        if (!isCurrent) return;
        console.error("Error checking try-on image:", err);
        setError(err.message);
        setImageUri("");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    checkImage();

    return () => {
      isCurrent = false;
    };
  }, [imageId]);

  return { isLoading, imageUri, error };
};
