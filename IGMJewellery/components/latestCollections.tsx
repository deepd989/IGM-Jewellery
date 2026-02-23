import { COLORS } from "@/constants/theme";
import { useGetBrandsQuery } from "@/store/apis/brandsApi";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BrandCollection,
  useGetCollectionsQuery,
} from "../store/apis/collectionApi";
import { HapticButton } from "./basic components/hapticButton";

const { width } = Dimensions.get("window");

export default function LatestCollections() {
  const router = useRouter();
  const { data: brandsData = [] } = useGetBrandsQuery({});
  const { data: collectionData } = useGetCollectionsQuery();

  const [activeBrandName, setActiveBrand] = useState<string | null>(
    brandsData[0]?.businessName || ""
  );
  const [collections, setCollections] = useState<BrandCollection[]>([]);

  // Initialize active brand
  useEffect(() => {
    if (!activeBrandName && brandsData.length > 0) {
      setActiveBrand(brandsData[0].businessName);
    }
  }, [brandsData, activeBrandName]);

  // Update collections when active brand changes
  useEffect(() => {
    const aBrand = brandsData.find((b) => b.businessName === activeBrandName);
    if (aBrand && collectionData && collectionData[aBrand.id]) {
      setCollections(collectionData[aBrand.id].collections.slice(0, 3));
    }
  }, [activeBrandName, brandsData, collectionData]);

  const brandNames = useMemo(
    () => brandsData.map((b) => b.businessName),
    [brandsData]
  );

  const handleRedirect = (collectionName: string) => {
    router.push({
      pathname: "/product-list",
      params: { brand: activeBrandName, collection: collectionName },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Newly Unveiled Collections</Text>

      {/* Brand Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brandRow}
      >
        {brandNames.map((brand) => {
          const isActive = brand === activeBrandName;
          const brandInfo = brandsData.find((b) => b.businessName === brand);

          return (
            <HapticButton
              key={brand}
              style={styles.brandItem}
              onPress={() => setActiveBrand(brand)}
            >
              <View
                style={[
                  styles.brandRectangle,
                  isActive && styles.brandActiveBorder,
                ]}
              >
                {isActive && <View style={styles.diamond} />}
                <Image
                  source={{ uri: brandInfo?.profileImageUri }}
                  style={styles.brandImage}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={[styles.brandLabel, isActive && styles.brandLabelActive]}
                numberOfLines={1}
              >
                {brand}
              </Text>
            </HapticButton>
          );
        })}
      </ScrollView>

      {/* Collection Cards */}
      <View style={styles.collectionsList}>
        {collections.map((collection, i) => (
          <HapticButton
            key={i}
            style={styles.collectionCard}
            onPress={() => handleRedirect(collection.title)}
          >
            <Image
              source={{ uri: collection.collectionBannerImgUrl }}
              style={styles.collectionImage}
              resizeMode="cover"
            />

            {/* The "Shop Now" Pill Button */}
            <View style={styles.shopNowBadge}>
              <Text style={styles.shopNowText}>Shop Now</Text>
            </View>

            {/* Optional Title Overlay */}
            <View style={styles.textOverlay}>
              <Text style={styles.collectionTitle}>{collection.title}</Text>
            </View>
          </HapticButton>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.primary || "#053844",
  },
  brandRow: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  brandItem: {
    alignItems: "center",
    marginRight: 20,
  },
  brandRectangle: {
    width: 70,
    height: 70,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8, // Light rounding for the brand boxes
  },
  brandActiveBorder: {
    borderWidth: 1.5,
    borderColor: "#053844",
    backgroundColor: "#FFF",
  },
  brandImage: {
    width: "80%",
    height: "80%",
  },
  brandLabel: {
    fontSize: 12,
    marginTop: 8,
    color: "#666",
    width: 80,
    textAlign: "center",
  },
  brandLabelActive: {
    color: "#053844",
    fontWeight: "700",
  },

  /* Collection Card Styles matching the Image */
  collectionsList: {
    paddingHorizontal: 16,
  },
  collectionCard: {
    width: "100%",
    height: 160,
    marginBottom: 24,
    backgroundColor: "#F2F2F2",
    // This creates the distinctive curved shape
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 60,
    overflow: "hidden",
    position: "relative",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 5,
  },
  collectionImage: {
    width: "100%",
    height: "100%",
  },
  shopNowBadge: {
    position: "absolute",
    bottom: 25,
    right: 35,
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  shopNowText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
  textOverlay: {
    position: "absolute",
    top: 30,
    left: 40,
  },
  collectionTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "300",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
