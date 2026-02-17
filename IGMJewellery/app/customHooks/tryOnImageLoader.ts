import { Buffer } from "buffer"; // You may need to install this: npm install buffer
import { useEffect, useState } from "react";
import { WRAPPER_API } from "../../store/newApis/apiUrl.const";

export const useGetImage = (imageId: string) => {
  const [base64String, setBase64String] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Replace with your actual machine IP or domain
  const BASE_URL = WRAPPER_API;

  useEffect(() => {
    if (!imageId) return;

    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/getImage/${imageId}`);
        console.log("fetching image from:", `${BASE_URL}/getImage/${imageId}`);

        if (!response.ok) {
          throw new Error("Image not found or server error");
        }

        // Get the response as an arrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // Convert Buffer to Base64
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        setBase64String(`data:image/png;base64,${base64}`);
      } catch (err) {
        console.error("Error fetching image:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [imageId]);

  return { isLoading, base64String, error };
};
