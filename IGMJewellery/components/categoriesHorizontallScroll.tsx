import { useRouter } from "expo-router";
import React from "react";
import { SHOP_CATEGORIES, getCategoryRoute } from "../store/data/categoriesData";
import GradientHorizontalScroll from "./gradientScroll";
import { SectionHeader } from "./section";

export default function CategoriesHorizontalScroll() {
  const router = useRouter();

  const CategoriesData = SHOP_CATEGORIES.map((category) => ({
    name: category.name,
    img: category.icon,
    onpress: () => router.navigate(getCategoryRoute(category)),
  }));

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
