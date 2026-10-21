import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { SHOP_CATEGORIES, getCategoryRoute } from "../store/data/categoriesData";
import GradientHorizontalScroll from "./gradientScroll";
import { SectionHeader } from "./section";

export default function CategoriesHorizontalScroll() {
  const router = useRouter();

  // The category list is fixed; only the press handlers need building, and
  // rebuilding them per render re-rendered the whole row with them.
  const CategoriesData = useMemo(
    () =>
      SHOP_CATEGORIES.map((category) => ({
        name: category.name,
        img: category.icon,
        onpress: () => router.navigate(getCategoryRoute(category)),
      })),
    [router]
  );

  return (
    <>
      <SectionHeader value="Shop by Categories" />
      <GradientHorizontalScroll
        data={CategoriesData}
        cardHeight={125}
        cardWidth={125}
      />
    </>
  );
}
