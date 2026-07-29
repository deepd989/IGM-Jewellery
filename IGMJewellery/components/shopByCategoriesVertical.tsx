import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/theme";
import { SectionHeader } from "./section";
import { assetUrl } from "@/constants/assets";

// Get screen width to calculate responsive item sizes
const { width } = Dimensions.get("window");
const numColumns = 2;
const gap = 25; // Space between cards

export default function CategoriesGrid() {
  const router = useRouter();

  const CategoriesData = [
    {
      name: "Necklace",
      img: require("../assets/images/categoryIcons/necklace.png"),
      productType: "necklace",
      banner: assetUrl("category.banner.necklace.withText"),
    },
    {
      name: "Bracelets",
      img: require("../assets/images/categoryIcons/bracelet.png"),
      productType: "bracelet",
      banner: assetUrl("category.banner.bracelet.withText"),
    },
    {
      name: "Earrings",
      img: require("../assets/images/categoryIcons/earring.png"),
      productType: "earring",
      banner: assetUrl("category.banner.earring.withText"),
    },
    {
      name: "Rings",
      img: require("../assets/images/categoryIcons/ring.png"),
      productType: "ring",
      banner: assetUrl("category.banner.ring.withText"),
    },
    {
      name: "Bangles",
      img: require("../assets/images/categoryIcons/bangles.png"),
      productType: "bangle",
      banner: assetUrl("category.banner.bangle.withText"),
    },
    {
      name: "Mangalsutra",
      img: require("../assets/images/categoryIcons/mangalsutra.png"),
      productType: "mangalsutra",
      banner: null,
    },
  ];

  const handleNavigation = (item) => {
    router.navigate({
      pathname: `/product-list`,
      params: {
        categoryName: item.name,
        productType: item.productType,
        bannerImageUrl: item.banner
          ? encodeURIComponent(item.banner)
          : undefined,
      },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleNavigation(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageWrapper}>
        <Image source={item.img} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={CategoriesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={numColumns}
        ListHeaderComponent={<SectionHeader value="Shop by Categories" />}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "flex-start", // Keeps items aligned to the left if the last row is incomplete
  },
  card: {
    backgroundColor: "#FFF",
    // Calculate width: (Total Width - padding) / columns - margin
    width: (width - gap * 2) / numColumns - gap, // Slightly reduce width for better spacing
    margin: gap / 2,
    // padding: 10,
    alignItems: "center",
    justifyContent: "center",
    // Shadow for depth
  },
  imageWrapper: {
    width: (width - gap * 2) / numColumns - gap,
    height: (width - gap * 2) / numColumns - gap,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "center",
  },
});
