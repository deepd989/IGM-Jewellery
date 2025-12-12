import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Product } from "@/interfaces/product.interface";

interface Props {
  product:Product,
  onTryOn: () => void;
  deliveryDate: string;  
}

const NecklaceCard: React.FC<Props> = ({
  product,
  deliveryDate,
  onTryOn,
}) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        {/* Product Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.thumbnailUrls[0] }} style={styles.image} />

          <TouchableOpacity style={styles.wishlistButton}>
            <AntDesign name="heart" size={22} color="#000" />
          </TouchableOpacity>

          <View style={styles.deliveryTag}>
            <AntDesign name="truck" size={14} color="#555" />
            <Text style={styles.deliveryText}>{deliveryDate}</Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.details}>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.discountedPrice.toLocaleString()}</Text>
            <Text style={styles.oldPrice}>₹{product.givenPrice.toLocaleString()}</Text>
          </View>

          <Text style={styles.brand}>{product.brand}</Text>
        </View>
      </TouchableOpacity>

      {/* Floating "See how it looks on you" Button */}
      <TouchableOpacity style={styles.tryOnButton} onPress={onTryOn}>
        <Ionicons name="sparkles-outline" size={18} color="#fff" />
        <Text style={styles.tryOnText}>See how it looks on you</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NecklaceCard;

const styles = StyleSheet.create({
  wrapper: {
    
  },

  card: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  imageWrapper: {
    width: "100%",
    height: 160,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  wishlistButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    elevation: 3,
  },

  deliveryTag: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    elevation: 2,
  },

  deliveryText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },

  details: {
    marginTop: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },

  oldPrice: {
    fontSize: 14,
    color: "#888",
    marginLeft: 10,
    textDecorationLine: "line-through",
  },

  brand: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },

  // Floating Button
  tryOnButton: {
    position: "absolute",
    bottom: -30,
    // Center horizontally
    alignSelf: "center",
    width: 150 * 1.8,
    height: 42,
    backgroundColor: "#000",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  tryOnText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
});
