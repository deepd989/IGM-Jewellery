import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const BRANDS = ["Tanishq", "Kalyan Jewellers", "Caratlane", "TVZ"];

export default function LatestCollections() {
  const [activeBrand, setActiveBrand] = useState("Tanishq");

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
        {BRANDS.map((brand) => {
          const isActive = brand === activeBrand;

          return (
            <TouchableOpacity
              key={brand}
              style={styles.brandItem}
              onPress={() => setActiveBrand(brand)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.brandCircle,
                  isActive && styles.brandCircleActive,
                ]}
              >
                {isActive && <View style={styles.diamond} />}
              </View>

              <Text
                style={[
                  styles.brandLabel,
                  isActive && styles.brandLabelActive,
                ]}
              >
                {brand}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Collection Cards */}
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.collectionCard}>
          <Text style={styles.collectionText}>[COLLECTIONS]</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#222",
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

  brandCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
    backgroundColor: "#000",
    transform: [{ rotate: "45deg" }],
  },

  brandLabel: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },

  brandLabelActive: {
    color: "#000",
    fontWeight: "600",
  },

  /* Collections */
  collectionCard: {
    height: 140,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#F2F2F2",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  collectionText: {
    color: "#CFCFCF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
