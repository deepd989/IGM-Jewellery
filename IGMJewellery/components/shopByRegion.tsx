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
    sellerName: "Nordic Designs",
    sellerBannerImgUrl:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=500",
    collections: [{ title: "Minimalist Furniture" }],
    region: "Gujrat",
  },
  "2": {
    sellerName: "Tokyo Tech & Style",
    sellerBannerImgUrl:
      "https://images.unsplash.com/photo-1526738549149-8e07eca2c1cf?q=80&w=500",
    collections: [{ title: "Cyberpunk Tech" }],
    region: "Maharastra",
  },
  "3": {
    sellerName: "Sahara Artisans",
    sellerBannerImgUrl:
      "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=500",
    collections: [{ title: "Handwoven Rugs" }],
    region: "Maharastra",
  },
  "4": {
    sellerName: "Alpine Outdoor",
    sellerBannerImgUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=500",
    collections: [{ title: "Winter Gear" }],
    region: "West Bengal",
  },
};

/**
 * Individual Card Component
 */
const Card = ({ item, cardWidth }) => {
  const router = useRouter();
  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/500" }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.textContainer}>
        <Text style={styles.collectionTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.sellerName} numberOfLines={1}>
          {item.sellerName}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.buttonContainer}
        onPress={() => {
          router.push({
            pathname: "/product-list",
            params: {
              region: item.region.toLowerCase(),
            },
          });
        }}
      >
        <Text style={styles.buttonText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
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
