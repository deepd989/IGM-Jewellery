import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import {
  SUB_CATS_BANGLE,
  SUB_CATS_BRACELET,
  SUB_CATS_EARRING,
  SUB_CATS_NECKLACE,
  SUB_CATS_RINGS,
} from "../store/data/categoriesData";
import GradientHorizontalScroll from "./gradientScroll";
import { SectionHeader } from "./section";

export default function CategoriesHorizontalScroll() {
  const router = useRouter();

  const CategoriesData = [
    {
      name: "Necklace",
      img: require("../assets/images/categoryIcons/necklace.png"),
      onpress: () => {
        router.navigate({
          pathname: `/product-list`,
          params: {
            categoryName: "Necklace",
            productType: "necklace",
            bannerImageUrl: encodeURIComponent(
              SUB_CATS_NECKLACE[0].subCategoryBannerUrl
            ),
          },
        });
      },
    },
    {
      name: "Bracelets",
      img: require("../assets/images/categoryIcons/bracelet.png"),
      onpress: () => {
        router.navigate({
          pathname: `/product-list`,
          params: {
            categoryName: "Bracelet",
            productType: "bracelet",
            bannerImageUrl: encodeURIComponent(
              SUB_CATS_BRACELET[0].subCategoryBannerUrl
            ),
          },
        });
      },
    },
    {
      name: "Earrings",
      img: require("../assets/images/categoryIcons/earring.png"),
      onpress: () => {
        router.navigate({
          pathname: `/product-list`,
          params: {
            categoryName: "Earrings",
            productType: "earring",
            bannerImageUrl: encodeURIComponent(
              SUB_CATS_EARRING[0].subCategoryBannerUrl
            ),
          },
        });
      },
    },
    {
      name: "Rings",
      img: require("../assets/images/categoryIcons/ring.png"),
      onpress: () => {
        router.navigate({
          pathname: `/product-list`,
          params: {
            categoryName: "Rings",
            productType: "ring",
            bannerImageUrl: encodeURIComponent(
              SUB_CATS_RINGS[0].subCategoryBannerUrl
            ),
          },
        });
      },
    },
    {
      name: "Bangles",
      img: require("../assets/images/categoryIcons/bangles.png"),
      onpress: () => {
        router.navigate({
          pathname: `/product-list`,
          params: {
            categoryName: "Bangles",
            productType: "bangle",
            bannerImageUrl: encodeURIComponent(
              SUB_CATS_BANGLE[0].subCategoryBannerUrl
            ),
          },
        });
      },
    },
    {
      name: "Mangalsutra",
      img: require("../assets/images/categoryIcons/mangalsutra.png"),
      onpress: () => {
        router.navigate({
          pathname: `/product-list`,
          params: {
            categoryName: "Mangalsutra",
            productType: "mangalsutra",
            bannerImageUrl: encodeURIComponent(
              SUB_CATS_BANGLE[0].subCategoryBannerUrl
            ),
          },
        });
      },
    },
  ];
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8", // Light gray screen background to see the white cards clearly
    paddingTop: 50,
  },
});
