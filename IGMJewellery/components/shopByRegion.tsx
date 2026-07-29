import {
  REGIONS,
  REGION_ORDER,
  getRegionRoute,
} from "@/store/data/regionsData";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
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
import { assetUrl } from "@/constants/assets";

type RegionCard = {
  id: string;
  title: string;
  image: string;
  sellerName: string;
  region: string;
};

/**
 * Individual Card Component
 */
const Card = React.memo(function Card({
  item,
  cardWidth,
}: {
  item: RegionCard;
  cardWidth: number;
}) {
  const router = useRouter();
  const navigateToRegion = () => {
    router.navigate(getRegionRoute(REGIONS[item.id]));
  };
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, { width: cardWidth }]}
      onPress={navigateToRegion}
    >
      <Image
        source={{ uri: item.image || assetUrl("placeholder.regionCard") }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Shop Now</Text>
      </View>
    </TouchableOpacity>
  );
});

export default function ShopByRegionCards() {
  const { width } = useWindowDimensions();

  // Mocking the status variables normally provided by a hook like useQuery
  const regionsData = REGIONS;
  const isLoading = false;
  const error = null;

  /**
   * Data Transformation
   */
  const formattedData = useMemo<RegionCard[]>(() => {
    if (!regionsData) return [];

    return Object.keys(regionsData)
      .map((key) => {
        const seller = regionsData[key];
        const firstCollection = seller.collections?.[0];

        return {
          id: key,
          title: firstCollection?.title || "New Arrivals",
          image: seller.sellerBannerImgUrl || "",
          sellerName: seller.sellerName,
          region: seller.region,
        };
      })
      .sort((a, b) => {
        return REGION_ORDER.indexOf(a.id) - REGION_ORDER.indexOf(b.id);
      });
  }, [regionsData]);

  // Layout Calculations
  const numVisibleCards = width > 600 ? 3.5 : 1.2;
  const cardWidth = (width - 32) / numVisibleCards;

  const renderItem = useCallback(
    ({ item }: { item: RegionCard }) => (
      <Card item={item} cardWidth={cardWidth} />
    ),
    [cardWidth]
  );

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
        renderItem={renderItem}
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
