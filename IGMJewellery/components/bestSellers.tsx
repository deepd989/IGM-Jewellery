import { categories } from "@/constants/categories";
import { useGetProductsQuery } from "@/store/apis/product";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { HapticButton } from "./basic components/hapticButton";
import ProductCard2 from "./productCard";

export default function BestSellersSection() {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery({});
  const [active, setActive] = useState("Earrings");

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Our best sellers</Text>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {categories.map((item) => {
          const isActive = item === active;
          return (
            <HapticButton
              key={item}
              onPress={() => setActive(item)}
              style={styles.tab}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {item}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </HapticButton>
          );
        })}
      </ScrollView>

      <ProductCard2 product={products[0]} />

      {/* Card */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },

  tabs: {
    paddingBottom: 12,
  },

  tab: {
    marginRight: 20,
    alignItems: "center",
  },

  tabText: {
    fontSize: 16,
    color: "#777",
  },

  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#000",
    marginTop: 6,
  },

  info: {
    marginTop: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
