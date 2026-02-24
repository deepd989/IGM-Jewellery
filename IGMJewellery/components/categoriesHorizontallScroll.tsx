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
          params: {
            categoryName: "Necklace",
            productType: "necklace",
            bannerImageUrl: encodeURIComponent(
              "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FNecklace%2FCategory_Necklace_text.webp?alt=media&token=1d02d70d-2793-441c-accf-bca5b72477e7",
            ),
          },
        });
      },
    },
    {
      name: "Bracelets",
      img: require("../assets/images/categoryIcons/bracelet.png"),
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: {
            categoryName: "Bracelet",
            productType: "bracelet",
            bannerImageUrl: encodeURIComponent(
              "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBracelets%2FCategory_Bracelets_text.webp?alt=media&token=5e5b914d-e746-4bf8-8a6a-f5b84d2d4b52",
            ),
          },
        });
      },
    },
    {
      name: "Earrings",
      img: require("../assets/images/categoryIcons/earring.png"),
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: {
            categoryName: "Earrings",
            productType: "earring",
            bannerImageUrl: encodeURIComponent(
              "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FEarrings%2FCategory_Earrings_text.webp?alt=media&token=411c118e-eef5-4b17-9374-7a5cf3693b1f",
            ),
          },
        });
      },
    },
    {
      name: "Rings",
      img: require("../assets/images/categoryIcons/ring.png"),
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: {
            categoryName: "Rings",
            productType: "ring",
            bannerImageUrl: encodeURIComponent(
              "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FRings%2FCategory_Rings_text.webp?alt=media&token=8555d1a9-d749-46d8-acb4-f05b7a5bc487",
            ),
          },
        });
      },
    },
    {
      name: "Bangles",
      img: require("../assets/images/categoryIcons/bangles.png"),
      onpress: () => {
        router.push({
          pathname: `/product-list`,
          params: {
            categoryName: "Bangles",
            productType: "bangle",
            bannerImageUrl: encodeURIComponent(
              "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBangles%2FCategory_Bangels_Text.webp?alt=media&token=d5401dad-faed-4c80-a833-919238055d75",
            ),
          },
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
