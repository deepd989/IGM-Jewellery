import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SectionHeader } from "./section";

// --- Dummy Data Definition ---
const REGIONS_DUMMY_DATA = {
  "1": {
    sellerName: "Assam Heritage",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FAssam.webp?alt=media&token=585608eb-b703-4f04-9183-117cbdc179a5",
    collections: [{ title: "Silk & Tea Crafts" }],
    region: "Assam",
  },
  "2": {
    sellerName: "Gujarat Gold & Silk",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FGujarat.webp?alt=media&token=0c187c11-3240-4630-9dac-efa1c314b1f0",
    collections: [{ title: "Patola Collections" }],
    region: "Gujarat",
  },
  "3": {
    sellerName: "Kerala Spices & Arts",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FKerala.webp?alt=media&token=12bef91c-3f2b-4263-9797-ac9570a8e738",
    collections: [{ title: "Traditional Handloom" }],
    region: "Kerala",
  },
  "4": {
    sellerName: "Odisha Temple Crafts",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FOdisha.webp?alt=media&token=264f073e-0ca8-4c8e-b316-755a58af3a70",
    collections: [{ title: "Silver Filigree" }],
    region: "Odisha",
  },
  "5": {
    sellerName: "Punjab Phulkari House",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FPunjab.webp?alt=media&token=e68e7ad9-d7bf-4318-a4e7-5876867ebb78",
    collections: [{ title: "Embroidered Heritage" }],
    region: "Punjab",
  },
  "6": {
    sellerName: "Rajasthan Royal Gems",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FRajasthan.webp?alt=media&token=52ed7845-1514-47bb-80af-648441526c57",
    collections: [{ title: "Jaipur Jewelry" }],
    region: "Rajasthan",
  },
  "7": {
    sellerName: "Tamil Nadu Silks",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FTamil%20Nadu.webp?alt=media&token=4e789072-3553-4552-9e3c-541f0d2b7e9f",
    collections: [{ title: "Kanchipuram Specials" }],
    region: "Tamil Nadu",
  },
  "8": {
    sellerName: "Telangana Pearl Co.",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FTelangana.webp?alt=media&token=fcdc5631-ce8c-47f7-9e66-17a1e7883ee5",
    collections: [{ title: "Hyderabadi Jewelry" }],
    region: "Telangana",
  },
  "9": {
    sellerName: "West Bengal Artistry",
    sellerBannerImgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/State%20Banners%2FWest%20Bengal.webp?alt=media&token=2a546938-3731-43a2-9b7a-bcbca11ca117",
    collections: [{ title: "Terracotta & Silk" }],
    region: "West Bengal",
  },
};

/**
 * Individual Card Component
 */
const Card = ({ item, cardWidth }) => {
  const router = useRouter();
  const navigateToRegion = () => {
    router.push({
      pathname: "/product-list",
      params: {
        region: item.region.toLowerCase(),
        bannerImageUrl: encodeURIComponent(item.image),
      },
    });
  };
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, { width: cardWidth }]}
      onPress={navigateToRegion}
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/500" }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Shop Now</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ShopByRegionCards() {
  const { width } = useWindowDimensions();

  // Mocking the status variables normally provided by a hook like useQuery
  const regionsData = REGIONS_DUMMY_DATA;
  const isLoading = false;
  const error = null;

  /**
   * Data Transformation
   */
  const formattedData = useMemo(() => {
    if (!regionsData) return [];

    return Object.keys(regionsData).map((key) => {
      const seller = regionsData[key];
      const firstCollection = seller.collections?.[0];

      return {
        id: key,
        title: firstCollection?.title || "New Arrivals",
        image: seller.sellerBannerImgUrl || "",
        sellerName: seller.sellerName,
        region: seller.region,
      };
    });
  }, [regionsData]);

  // Layout Calculations
  const numVisibleCards = width > 600 ? 3.5 : 1.2;
  const cardWidth = (width - 32) / numVisibleCards;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Error loading collections.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionHeader value="Regional Wonders" />
      <FlatList
        data={formattedData}
        renderItem={({ item }) => <Card item={item} cardWidth={cardWidth} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingVertical: 10,
  },
  center: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    height: 220,
    marginRight: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  textContainer: {
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.3)", // Darker overlay for better text visibility
    height: "100%",
    justifyContent: "flex-start",
  },
  collectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  sellerName: {
    color: "white",
    fontSize: 12,
    fontWeight: "400",
    marginTop: 2,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  buttonText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
});
