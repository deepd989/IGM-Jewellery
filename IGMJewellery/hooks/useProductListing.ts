import { Product } from "@/interfaces/product.interface";
import { useGetCategoryHierarchyQuery } from "@/store/apis/categories";
import { useGetProductsQuery } from "@/store/apis/product";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

export type ListingFilters = Record<string, string[]>;

/** The orders both sort sheets offer. */
export const SORT_OPTIONS = [
  "Latest",
  "Discount",
  "Price: Low to high",
  "Price: High to low",
  "Customer Rating",
];

/** Chip values that map to a sort order rather than a filter. */
const CHIP_SORT: Record<string, string> = {
  Latest: "Latest",
  "Best Sellers": "Popularity",
  All: "Latest",
};

/** Collection values that come from the chip row, not the filter sheet. */
const CHIP_COLLECTIONS = ["new-arrival", "bestseller"];

/** Splits a comma-separated navigation param into its values. */
const parseFilterParam = (param: string | string[] | undefined): string[] => {
  if (!param) return [];
  if (Array.isArray(param)) return param;
  return param
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
};

/** Maps a category id from the categories screen onto a product type. */
const getCategoryProductType = (catId: string): string | null => {
  const lowerCatId = catId.toLowerCase();
  if (lowerCatId.includes("rings")) return "ring";
  if (lowerCatId.includes("necklace") || lowerCatId.includes("chains"))
    return "necklace";
  if (lowerCatId.includes("earring")) return "earring";
  if (lowerCatId.includes("bracelet")) return "bracelet";
  if (lowerCatId.includes("pendant")) return "pendant";
  if (lowerCatId.includes("bangle")) return "bangles";
  if (lowerCatId.includes("anklet")) return "anklet";
  if (lowerCatId.includes("mangalsutra")) return "mangalsutra";
  if (lowerCatId.includes("nose-pin")) return "nose-pin";
  return null;
};

/**
 * Everything the product listing screens do apart from drawing themselves:
 * reading the navigation params into a filter set, fetching against it, and
 * naming the page. Both the classic and the luxury listing render from this,
 * so the two can never disagree about what a link means.
 */
export function useProductListing(propFilters?: ListingFilters) {
  const params = useLocalSearchParams();

  // Navigation context
  const departmentId = params.departmentId as string | undefined;
  const categoryId = params.categoryId as string | undefined;
  const subCategoryId = params.subCategoryId as string | undefined;
  const categoryName = params.categoryName as string | undefined;
  const subCategoryName = params.subCategoryName as string | undefined;

  // Filter params
  const gender = params.gender as string | undefined;
  const occasion = params.occasion as string | undefined;
  const productType = params.productType as string | undefined;
  const brand = params.brand as string | undefined;
  const collection = params.collection as string | undefined;
  const region = params.region as string | undefined;
  const minPrice = params.minPrice as string | undefined;
  const maxPrice = params.maxPrice as string | undefined;
  const metal = params.metal as string | undefined;
  const gemstone = params.gemstone as string | undefined;
  const searchQuery = params.searchQuery as string | undefined;
  const priceRange = params.priceRange as string | undefined;
  const bannerImageUrl = params.bannerImageUrl as string | undefined;

  /**
   * A link may open the listing in a particular order — the offers section
   * asks for the biggest discounts first. Anything not on the sheet's own list
   * is ignored rather than sent to the API as a value it cannot honour.
   */
  const sortParam = params.sort as string | undefined;
  const initialSort =
    sortParam && SORT_OPTIONS.includes(sortParam)
      ? sortParam
      : "Customer Rating";

  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [selectedChip, setSelectedChip] = useState("All");
  const [activeFilters, setActiveFilters] = useState<ListingFilters>({});

  const { data: hierarchy } = useGetCategoryHierarchyQuery(
    { departmentId, categoryId, subCategoryId },
    { skip: !departmentId && !categoryId }
  );

  // Initialize filters from navigation params and any passed in as props.
  useEffect(() => {
    const newFilters: ListingFilters = {};

    if (categoryId) {
      const categoryProductType = getCategoryProductType(categoryId);
      if (categoryProductType) {
        newFilters.productType = [categoryProductType];
      }
    }

    // A direct productType param overrides the category mapping.
    const productTypeValues = parseFilterParam(productType);
    if (productTypeValues.length > 0) {
      newFilters.productType = productTypeValues;
    }

    const occasionValues = parseFilterParam(occasion);
    if (occasionValues.length > 0) {
      newFilters.occasion = occasionValues;
    }

    const subCategoriesValues = parseFilterParam(subCategoryId);
    if (subCategoriesValues.length > 0 && subCategoryId !== "all") {
      newFilters.subCategoryId = subCategoriesValues;
    }

    const brandValues = parseFilterParam(brand);
    if (brandValues.length > 0) {
      newFilters.brand = brandValues;
    }

    const collectionValues = parseFilterParam(collection);
    if (collectionValues.length > 0) {
      newFilters.collection = collectionValues;
    }

    const regionValues = parseFilterParam(region);
    if (regionValues.length > 0) {
      newFilters.region = regionValues;
    }

    // The categories screen sends a department; map it onto a gender.
    if (departmentId) {
      const deptGenderMap: Record<string, string> = {
        mens: "male",
        womens: "female",
        kids: "kids",
      };
      const mappedGender = deptGenderMap[departmentId];
      if (mappedGender) {
        newFilters.gender = [mappedGender];
      }
    }

    // A direct gender param overrides the department mapping.
    const genderValues = parseFilterParam(gender);
    if (genderValues.length > 0) {
      newFilters.gender = genderValues;
    }

    const priceRangeValues = parseFilterParam(priceRange);
    if (priceRangeValues.length > 0) {
      newFilters.priceRange = priceRangeValues;
    }

    if (minPrice) newFilters.minPrice = [minPrice];
    if (maxPrice) newFilters.maxPrice = [maxPrice];

    const metalValues = parseFilterParam(metal);
    if (metalValues.length > 0) {
      newFilters.metal = metalValues;
    }

    const gemstoneValues = parseFilterParam(gemstone);
    if (gemstoneValues.length > 0) {
      newFilters.gemstone = gemstoneValues;
    }

    if (searchQuery) {
      newFilters.searchQuery = [searchQuery];
    }

    if (propFilters && Object.keys(propFilters).length > 0) {
      Object.keys(propFilters).forEach((key) => {
        if (propFilters[key] && propFilters[key].length > 0) {
          newFilters[key] = [
            ...new Set([...(newFilters[key] || []), ...propFilters[key]]),
          ];
        }
      });
    }

    setActiveFilters(newFilters);
  }, [
    departmentId,
    categoryId,
    subCategoryId,
    productType,
    occasion,
    brand,
    collection,
    region,
    gender,
    minPrice,
    maxPrice,
    metal,
    gemstone,
    searchQuery,
    priceRange,
    propFilters,
  ]);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery({
    sortBy: selectedSort,
    filters: activeFilters,
  });

  /** Chip-driven collection values are not shown as removable filters. */
  const activeFilterCount = useMemo(
    () =>
      Object.entries(activeFilters).reduce((total, [key, options]) => {
        if (key === "collection" && options.some((o) => CHIP_COLLECTIONS.includes(o))) {
          return total;
        }
        return total + options.length;
      }, 0),
    [activeFilters]
  );

  const activeFilterTags = useMemo(() => {
    const tags: string[] = [];

    Object.entries(activeFilters).forEach(([key, values]) => {
      if (key === "collection") {
        values
          .filter((v) => !CHIP_COLLECTIONS.includes(v))
          .forEach((value) => tags.push(value));
      } else {
        values.forEach((value) => tags.push(value));
      }
    });

    return tags;
  }, [activeFilters]);

  /** Drops one value from whichever filter holds it. */
  const removeFilterValue = useCallback((value: string) => {
    setActiveFilters((current) => {
      const next: ListingFilters = {};

      Object.keys(current).forEach((key) => {
        const remaining = current[key].filter((v) => v !== value);
        if (remaining.length > 0) {
          next[key] = remaining;
        }
      });

      return next;
    });
  }, []);

  const applyFilters = useCallback((filters: ListingFilters) => {
    setActiveFilters(filters);
    // A manual filter set supersedes whatever chip was highlighted.
    setSelectedChip("All");
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setSelectedChip("All");
  }, []);

  const selectChip = useCallback((chip: string) => {
    setSelectedChip(chip);
    setSelectedSort(CHIP_SORT[chip] ?? "Latest");
  }, []);

  /**
   * "All" is the tile that means the whole category rather than a sub-category
   * of its own, so it is not a heading a shopper would recognise — the
   * category's name stands in for it.
   */
  const namedSubCategory =
    subCategoryName &&
    subCategoryName.toLowerCase() !== "all" &&
    subCategoryId !== "all"
      ? subCategoryName
      : undefined;

  /** The heading, from whichever piece of context is most specific. */
  const pageTitle = useMemo(() => {
    if (namedSubCategory) return namedSubCategory;
    if (categoryName) return categoryName;
    if (occasion)
      return `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Collection`;
    if (brand) return brand;
    if (collection) return `${collection} Collection`;
    if (region) return `From ${region} Region`;
    if (gender)
      return `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Jewellery`;
    if (hierarchy?.category) return hierarchy.category.name;
    if (productType)
      return `${productType.charAt(0).toUpperCase() + productType.slice(1)}s`;
    return "Products";
  }, [
    namedSubCategory,
    categoryName,
    occasion,
    brand,
    collection,
    region,
    gender,
    hierarchy,
    productType,
  ]);

  const breadcrumb = useMemo(() => {
    const parts: string[] = [];

    if (hierarchy?.department) parts.push(hierarchy.department.name);
    if (hierarchy?.category && !categoryName) parts.push(hierarchy.category.name);
    if (categoryName) parts.push(categoryName);
    if (namedSubCategory) parts.push(namedSubCategory);

    if (parts.length === 0) {
      if (gender) parts.push(gender.charAt(0).toUpperCase() + gender.slice(1));
      if (occasion) parts.push(occasion.charAt(0).toUpperCase() + occasion.slice(1));
      if (brand) parts.push(brand);
      if (collection) parts.push(collection);
      if (region) parts.push(region);
    }

    return parts.join(" / ");
  }, [hierarchy, categoryName, namedSubCategory, gender, occasion, brand, collection, region]);

  return {
    products: products as Product[],
    isLoading,
    isError,
    error,
    refetch,

    activeFilters,
    activeFilterCount,
    activeFilterTags,
    removeFilterValue,
    applyFilters,
    clearFilters,

    selectedSort,
    setSelectedSort,
    selectedChip,
    selectChip,

    pageTitle,
    breadcrumb,
    bannerImageUrl,
  };
}
