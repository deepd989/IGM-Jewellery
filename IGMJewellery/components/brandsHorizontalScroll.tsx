import { useRouter } from "expo-router";
import React from "react";
import { ImageSourcePropType, StyleSheet } from "react-native";
import { Brand, useGetBrandsQuery } from "../store/apis/brandsApi";
import GradientHorizontalScroll, { ScrollGradientItem } from "./gradientScroll";
import { SectionHeader } from "./section";

export default function BrandsHorizontalScroll() {
  const router = useRouter();
  const { data: brandsData = [], isLoading } = useGetBrandsQuery({});
  const brandsDataScroll: ScrollGradientItem[] = brandsData.map(
    (brand: Brand, index) => {
      let gradient: { gradientStartColor: string; gradientEndColor: string };

      // Determine the gradient based on the index
      if (index % 3 === 0) {
        gradient = {
          gradientStartColor: "#F7FCFB",
          gradientEndColor: "#EBF5F3",
        };
      } else if (index % 3 === 1) {
        gradient = {
          gradientStartColor: "#FDF9F3",
          gradientEndColor: "#F8F1E5",
        };
      } else {
        gradient = {
          gradientStartColor: "#F3F7FA",
          gradientEndColor: "#E6EEF4",
        };
      }

      return {
        name: brand.businessName,
        img: { uri: brand.profileImageUri } as ImageSourcePropType,
        gradient: gradient,
        onpress: () => {
          router.push(`/brandProfile/${brand.businessNameKey}`);
        },
      };
    }
  );
  return (
    <>
      <SectionHeader value="House of Brands" />
      <GradientHorizontalScroll
        data={brandsDataScroll}
        cardWidth={125}
        cardHeight={125}
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
