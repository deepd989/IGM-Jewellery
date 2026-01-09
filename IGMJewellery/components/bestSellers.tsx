import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ProductCard from "./productCard";
import { useSelector } from "react-redux";
import { selectProducts } from "@/store/productSlice";
import { categories } from "@/constants/categories";
import { useGetProductsQuery } from "@/store/apis/product";



export default function BestSellersSection() {
  const { data: products = [], isLoading, isError, error, refetch } = useGetProductsQuery({});
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
            <TouchableOpacity
              key={item}
              onPress={() => setActive(item)}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText,
                ]}
              >
                {item}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ProductCard product={products[0]}  />

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
  