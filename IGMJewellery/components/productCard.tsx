import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Product } from "@/interfaces/product.interface";

interface ProductCardProps {
 product:Product,
 deliveryDate: string,
}

const ProductCard: React.FC<ProductCardProps> = ({
 product,
 deliveryDate,
}) => {
  return (
    <View style={styles.card}>
      {/* Top badges */}
      <View style={styles.topRow}>
        {product.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>New</Text>
          </View>
        )}
        <TouchableOpacity>
          <FontAwesome name="heart-o" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Image placeholder */}
      <View style={styles.imagePlaceholder}>
        <Text style={{ color: "#ccc" }}>Image</Text>
      </View>

      {/* Delivery badge */}
      <View style={styles.deliveryBadge}>
        <MaterialIcons name="local-shipping" size={16} color="black" />
        <Text style={styles.deliveryText}>{deliveryDate}</Text>
      </View>

      {/* Price */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{product.discountedPrice.toLocaleString()}</Text>
        <Text style={styles.originalPrice}>₹{product.givenPrice.toLocaleString()}</Text>
      </View>

      {/* Product info */}
      <Text style={styles.productName}>{product.title}</Text>
      <Text style={styles.brand}>{product.brand}</Text>

      {/* Rating */}
      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FontAwesome
            key={i}
            name={i < product.rating ? "star" : "star-o"}
            size={16}
            color="#f5c518"
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.tryNow]}>
          <Text style={styles.tryNowText}>Try Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.tryAtHome]}>
          <Text style={styles.tryAtHomeText}>Try at home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    margin: 10,
    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newBadge: {
    backgroundColor: "#eee",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  deliveryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  deliveryText: {
    marginLeft: 4,
    fontSize: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: "#888",
    marginLeft: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  brand: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 2,
  },
  tryNow: {
    borderWidth: 1,
    borderColor: "#000",
  },
  tryAtHome: {
    backgroundColor: "#000",
  },
  tryNowText: {
    fontWeight: "bold",
  },
  tryAtHomeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProductCard;
