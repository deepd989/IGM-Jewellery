import React from "react";
import { StyleSheet } from "react-native";
import GradientHorizontalScroll from "./gradientScroll";
import { SectionHeader } from "./section";

const CategoriesData = [
  {
    name: "Necklace",
    img: require("../assets/images/dummyImages/dummyNecklace.png"),
    gradient: {
      gradientStartColor: "#F7FCFB",
      gradientEndColor: "#EBF5F3",
    },
  },
  {
    name: "Bracelets",
    img: require("../assets/images/dummyImages/dummyBracelete.png"),
    gradient: {
      gradientStartColor: "#FDF9F3",
      gradientEndColor: "#F8F1E5",
    },
  },
  {
    name: "Earrings",
    img: require("../assets/images/dummyImages/dummyEarring.png"),
    gradient: {
      gradientStartColor: "#F3F7FA",
      gradientEndColor: "#E6EEF4",
    },
  },
  {
    name: "Rings",
    img: require("../assets/images/dummyImages/dummyRing.png"),
    gradient: {
      gradientStartColor: "#F7FCFB",
      gradientEndColor: "#EBF5F3",
    },
  },
  {
    name: "Diamonds",
    img: require("../assets/images/dummyImages/dummyDiamond.png"),
    gradient: {
      gradientStartColor: "#FDF9F3",
      gradientEndColor: "#F8F1E5",
    },
  },
];

export default function CategoriesHorizontalScroll() {
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
