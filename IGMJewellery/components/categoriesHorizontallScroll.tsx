import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import GradientHorizontalScroll from "./gradientScroll";
import { SectionHeader } from "./section";

export default function CategoriesHorizontalScroll() {
  const router = useRouter();
  const CategoriesData = [
    {
      name: "Necklace",
      img: require("../assets/images/dummyImages/dummyNecklace.png"),
      gradient: {
        gradientStartColor: "#F7FCFB",
        gradientEndColor: "#EBF5F3",
      },
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: { categoryName: "Necklace", productType: "necklace" },
        });
      },
    },
    {
      name: "Bracelets",
      img: require("../assets/images/dummyImages/dummyBracelete.png"),
      gradient: {
        gradientStartColor: "#FDF9F3",
        gradientEndColor: "#F8F1E5",
      },
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: { categoryName: "Bracelet", productType: "bracelet" },
        });
      },
    },
    {
      name: "Earrings",
      img: require("../assets/images/dummyImages/dummyEarring.png"),
      gradient: {
        gradientStartColor: "#F3F7FA",
        gradientEndColor: "#E6EEF4",
      },
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: { categoryName: "Earrings", productType: "earring" },
        });
      },
    },
    {
      name: "Rings",
      img: require("../assets/images/dummyImages/dummyRing.png"),
      gradient: {
        gradientStartColor: "#F7FCFB",
        gradientEndColor: "#EBF5F3",
      },
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: { categoryName: "Rings", productType: "ring" },
        });
      },
    },
    {
      name: "Diamonds",
      img: require("../assets/images/dummyImages/dummyDiamond.png"),
      gradient: {
        gradientStartColor: "#FDF9F3",
        gradientEndColor: "#F8F1E5",
      },
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: { categoryName: "Diamond", productType: "diamond" },
        });
      },
    },
  ];
  return (
    <>
      <SectionHeader value="Shop by Categories" />
      <GradientHorizontalScroll data={CategoriesData} />
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
