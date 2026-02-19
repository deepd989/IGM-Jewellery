import { COLORS } from "@/constants/theme";
import { Brand, useGetBrandsQuery } from "@/store/apis/brandsApi";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  BrandCollection,
  useGetCollectionsQuery,
} from "../store/apis/collectionApi";
import { HapticButton } from "./basic components/hapticButton";

export default function LatestCollections() {
  const {
    data: brandsData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBrandsQuery({});
  const router = useRouter();
  const [activeBrandName, setActiveBrand] = useState<string | null>(null);
  const {
    data: collectionData,
    isLoading: collectionIsLoading,
    error: collectionError,
  } = useGetCollectionsQuery();

  const [collections, setCollections] = useState<BrandCollection[]>([]);
  useEffect(() => {
    if (!activeBrandName && brandsData.length > 0) {
      setActiveBrand(brandsData[0].businessName);
    }
  }, [brandsData, activeBrandName]);

  const brandNames = useMemo(
    () => brandsData.map((b) => b.businessName),
    [brandsData]
  );

  useMemo(() => {
    const aBrand = brandsData.find(
      (b) => b.businessName === activeBrandName
    ) as Brand;
    if (aBrand && collectionData && collectionData[aBrand.id]) {
      setCollections(collectionData[aBrand.id].collections.slice(0, 3)); // Show only top 3 collections for the active brand
    }
  }, [brandsData, activeBrandName]);

  const handleRedirect = (collectionName: string) => {
    const navigationData = {
      brand: activeBrandName,
      collection: collectionName,
    };
    router.push({
      pathname: "/product-list",
      params: navigationData,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Latest Collections</Text>

      {/* Brand Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brandRow}
      >
        {brandNames.map((brand) => {
          const isActive = brand === activeBrandName;

          return (
            <HapticButton
              key={brand}
              style={styles.brandItem}
              onPress={() => setActiveBrand(brand)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.brandRectangle,
                  isActive && styles.brandCircleActive,
                ]}
              >
                {isActive && <View style={styles.diamond} />}
                <Image
                  source={{
                    uri: brandsData.find((b) => b.businessName === brand)
                      ?.profileImageUri,
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              <Text
                style={[styles.brandLabel, isActive && styles.brandLabelActive]}
              >
                {brand}
              </Text>
            </HapticButton>
          );
        })}
      </ScrollView>

      {/* Collection Cards */}
      {collections?.map((collection, i) => (
        <HapticButton
          key={i}
          style={styles.collectionCard}
          onPress={() => handleRedirect(collection.title)}
        >
          {/* <Image 
            source={{ uri: collection.imageUri }} 
            style={styles.collectionImage}
            resizeMode="cover"
          /> */}
          <Text style={styles.placeholder}>
            {" "}
            Insert Collection Display Cover Here
          </Text>
          <View style={styles.collectionOverlay}>
            <Text style={styles.collectionTitle}>{collection.title}</Text>
            {collection.description && (
              <Text style={styles.collectionDescription}>
                {collection.description}
              </Text>
            )}
          </View>
        </HapticButton>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    backgroundColor: "#fff",
  },
  placeholder: {
    color: "#AAA",
    fontSize: 16,
    textAlign: "center",
    marginTop: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.text,
  },

  /* Brands */
  brandRow: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  brandItem: {
    alignItems: "center",
    marginRight: 24,
  },
  image: {
    width: "100%",
    height: "100%",
    padding: 10,
  },

  brandRectangle: {
    width: 64,
    height: 64,
    // borderRadius: 32,
    backgroundColor: "#F3F3F3",
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  brandCircleActive: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#777",
  },

  diamond: {
    position: "absolute",
    top: -10,
    width: 10,
    height: 10,
    backgroundColor: "#053844",
    transform: [{ rotate: "45deg" }],
  },

  brandLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    width: 100,
    overflow: "hidden",
  },

  brandLabelActive: {
    color: "#053844",
    fontWeight: "600",
  },

  /* Collections */
  collectionCard: {
    height: 200,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#F2F2F2",
    borderRadius: 32,
    overflow: "hidden",
    position: "relative",
  },

  collectionImage: {
    width: "100%",
    height: "100%",
  },

  collectionOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },

  collectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },

  collectionDescription: {
    color: "#FFF",
    fontSize: 14,
    opacity: 0.9,
  },

  collectionText: {
    color: "#CFCFCF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
