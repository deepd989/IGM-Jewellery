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
      banner:
        "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FNecklace%2FCategory_Necklace_text.webp?alt=media&token=1d02d70d-2793-441c-accf-bca5b72477e7",
    },
    {
      name: "Bracelets",
      img: require("../assets/images/categoryIcons/bracelet.png"),
      productType: "bracelet",
      banner:
        "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBracelets%2FCategory_Bracelets_text.webp?alt=media&token=5e5b914d-e746-4bf8-8a6a-f5b84d2d4b52",
    },
    {
      name: "Earrings",
      img: require("../assets/images/categoryIcons/earring.png"),
      productType: "earring",
      banner:
        "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FEarrings%2FCategory_Earrings_text.webp?alt=media&token=411c118e-eef5-4b17-9374-7a5cf3693b1f",
    },
    {
      name: "Rings",
      img: require("../assets/images/categoryIcons/ring.png"),
      productType: "ring",
      banner:
        "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FRings%2FCategory_Rings_text.webp?alt=media&token=8555d1a9-d749-46d8-acb4-f05b7a5bc487",
    },
    {
      name: "Bangles",
      img: require("../assets/images/categoryIcons/bangles.png"),
      productType: "bangle",
      banner:
        "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Category%20Horizontal%20Banners%2FBangles%2FCategory_Bangels_Text.webp?alt=media&token=d5401dad-faed-4c80-a833-919238055d75",
    },
    {
      name: "Mangalsutra",
      img: require("../assets/images/categoryIcons/mangalsutra.png"),
      productType: "mangalsutra",
      banner: null,
    },
  ];

  const handleNavigation = (item) => {
    router.push({
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
