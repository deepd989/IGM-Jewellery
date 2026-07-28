import { FILTER_CATEGORIES } from "@/dummyData/filters";
import { WRAPPER_API } from "@/store/newApis/apiUrl.const";
import { useEffect, useMemo, useState } from "react";

export type FilterOption = { id: string; label: string };

/**
 * The filter sheet's categories, with the brand list filled in from the
 * sellers endpoint. Shared by both filter sheets so they always offer the same
 * options.
 */
export function useFilterCategories() {
  const [brandOptions, setBrandOptions] = useState<FilterOption[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${WRAPPER_API}/getSellers`);
        if (response.ok) {
          const sellers = await response.json();
          setBrandOptions(
            sellers.map((s: { brandid: string; brandName: string }) => ({
              id: s.brandName.toLowerCase(),
              label: s.brandName,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  return useMemo(
    () =>
      FILTER_CATEGORIES.map((cat) =>
        cat.id === "brand" && brandOptions.length > 0
          ? { ...cat, options: brandOptions }
          : cat
      ),
    [brandOptions]
  );
}
