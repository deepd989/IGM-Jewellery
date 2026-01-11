import { Product } from "@/interfaces/product.interface";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";

interface TrialItemCardProps {
  product: Product;
  onRemove: () => void;
  index: number;
  total: number;
}

export const TrialItemCard: React.FC<TrialItemCardProps> = ({
  product,
  onRemove,
  index,
  total,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnailUrls[0] }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {index + 1}/{total}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.row}>
          <View style={styles.tag}>
            <Ionicons name="pricetag-outline" size={10} color="#666" />
            <Text style={styles.tagText}>Try Before Buy</Text>
          </View>
          <TouchableOpacity onPress={onRemove}>
            <Ionicons name="close" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>
          ₹{product.discountedPrice.toLocaleString()}
        </Text>

        <View style={styles.footer}>
          <View style={styles.skuBox}>
            <Text style={styles.skuText}>
              SKU: {product.sku || "JE03H31-YGQ"}
            </Text>
          </View>
          <Text style={styles.availability}>
            Free trial available{" "}
            <Text style={{ fontWeight: "800" }}>TODAY</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  imageContainer: {
    width: 100,
    height: 120,
    backgroundColor: "#FAFAFA",
    borderRadius: 4,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  countBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#FFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
  },
  countText: {
    fontSize: 10,
    color: "#666",
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 10,
    color: "#666",
    marginLeft: 4,
  },
  brand: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  footer: {
    marginTop: "auto",
  },
  skuBox: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  skuText: {
    fontSize: 10,
    color: "#666",
  },
  availability: {
    fontSize: 10,
    color: "#8E8E93",
  },
});
