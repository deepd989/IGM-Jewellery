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
import { useGetCollectionsQuery } from "../store/apis/collectionApi";
import { SectionHeader } from "./section";

/**
 * Individual Card Component
 * Displays the Seller's Banner and the Title of their first collection
 */
const Card = ({ item, cardWidth }) => {
  const router = useRouter();
  return (
    <View style={[styles.card, { width: cardWidth }]}>
      {/* Background Image: Seller Banner */}
      <Image
        source={{ uri: item.image || "" }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Text Overlay for better readability */}
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
              collection: item.title.toLowerCase(),
              brand: item.sellerName.toLowerCase(),
            },
          });
        }}
      >
        <Text style={styles.buttonText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function BrandCollectionCards() {
  const { data: collectionsData, isLoading, error } = useGetCollectionsQuery();
  const { width } = useWindowDimensions();

  /**
   * Data Transformation:
   * Converts the API Object into an Array, picking only the first collection
   * from each seller.
   */
  const formattedData = useMemo(() => {
    if (!collectionsData) return [];

    return Object.keys(collectionsData).map((key) => {
      const seller = collectionsData[key];
      const firstCollection = seller.collections?.[0];

      return {
        id: key, // Using the object key (e.g., "4") as the ID
        title: firstCollection.title || "New Arrivals",
        image: seller.sellerBannerImgUrl || "", // Fallback to empty string if no image
        sellerName: seller.sellerName,
      };
    });
  }, [collectionsData]);

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
      <SectionHeader value="The Latest Arrivals" />
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
    overflow: "hidden", // Ensures image/overlay stay inside corners
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
    backgroundColor: "rgba(0,0,0,0.25)", // Subtle dark overlay for text contrast
    height: "100%",
    justifyContent: "flex-start",
  },
  collectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
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
