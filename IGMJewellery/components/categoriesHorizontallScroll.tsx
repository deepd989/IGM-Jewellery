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
      img: require("../assets/images/categoryIcons/necklace.png"),
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: { categoryName: "Necklace", productType: "necklace" },
        });
      },
    },
    {
      name: "Bracelets",
      img: require("../assets/images/categoryIcons/bracelet.png"),
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: { categoryName: "Bracelet", productType: "bracelet" },
        });
      },
    },
    {
      name: "Earrings",
      img: require("../assets/images/categoryIcons/earring.png"),
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: { categoryName: "Earrings", productType: "earring" },
        });
      },
    },
    {
      name: "Rings",
      img: require("../assets/images/categoryIcons/ring.png"),
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: { categoryName: "Rings", productType: "ring" },
        });
      },
    },
    {
      name: "Bangles",
      img: require("../assets/images/categoryIcons/bangles.png"),
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: { categoryName: "Bangles", productType: "bangle" },
        });
      },
    },
    {
      name: "Mangalsutra",
      img: require("../assets/images/categoryIcons/mangalsutra.png"),
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: { categoryName: "Mangalsutra", productType: "mangalsutra" },
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
