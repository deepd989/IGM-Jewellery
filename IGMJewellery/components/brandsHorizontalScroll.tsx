import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Brand, useGetBrandsQuery } from "../store/apis/brandsApi";
import { SectionHeader } from "./section";

/** The section is a taste of the house, not the whole of it. */
const MAX_BRANDS = 5;

export const BrandCard = React.memo(function BrandCard({ title, image: item }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.cardContainer}
      onPress={() =>
        router.navigate({
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
});

export default function BrandsVerticalScroll() {
  const router = useRouter();
  const { data: brandsData = [], isLoading } = useGetBrandsQuery({});

  // Rebuilt only when the brands themselves change: every card takes its item
  // by identity, so a fresh array on each render re-rendered all of them.
  const brandsDataScroll = useMemo(
    () =>
      brandsData.slice(0, MAX_BRANDS).map((brand: Brand, index) => {
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
            router.navigate(`/brandProfile/${brand.businessNameKey}`);
          },
        };
      }),
    [brandsData, router],
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <BrandCard title={item.name.toUpperCase()} image={item} />
    ),
    [],
  );

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
          renderItem={renderItem}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          // The banners run down the page's own scroll. Left scrollable, this
          // list nests a second vertical scroller inside it, which turns off
          // windowing and takes the gesture away from the page.
          scrollEnabled={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 0,
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
