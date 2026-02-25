import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Brand, useGetBrandsQuery } from "../store/apis/brandsApi";
import { SectionHeader } from "./section";

export const BrandCard = ({ title, image: item }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.cardContainer}
      onPress={() =>
        router.push({
          pathname: "/product-list",
          params: {
            brand: title.toLowerCase(),
            bannerImageUrl: encodeURIComponent(item.imgUrl),
          },
        })
      }
    >
      <ImageBackground
        source={{ uri: item.imgUrl }}
        style={styles.image}
        imageStyle={{ borderRadius: 15 }} // Smooth corners like the reference
      >
        {/* <View style={styles.overlay}>
          <Text style={styles.text}>{title}</Text>
        </View> */}
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default function BrandsHorizontalScroll() {
  const router = useRouter();
  const { data: brandsData = [], isLoading } = useGetBrandsQuery({});
  const brandsDataScroll: unknown[] = brandsData.map((brand: Brand, index) => {
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
      imgUrl: brand.profileImageUri,
      gradient: gradient,
      onpress: () => {
        router.push(`/brandProfile/${brand.businessNameKey}`);
      },
    };
  });
  return (
    <>
      <SectionHeader value="House of Brands" />
      {/* <GradientHorizontalScroll
        data={brandsDataScroll}
        cardWidth={125}
        cardHeight={125}
      /> */}

      <View style={styles.container}>
        <FlatList
          data={brandsDataScroll}
          keyExtractor={(item: any) => item.name}
          renderItem={({ item }) => (
            <BrandCard title={item.name.toUpperCase()} image={item} />
          )}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8", // Light gray screen background to see the white cards clearly
    paddingTop: 50,
  },
  listPadding: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  cardContainer: {
    height: 120, // Fixed height for each banner
    width: "100%",
    marginBottom: 15,
    // Optional shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
