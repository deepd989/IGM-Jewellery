import { Product } from "@/interfaces/product.interface";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { getEstimatedDeliveryDate } from "../../utils/deliveryDate";

interface ProductInfoProps {
  product: Product;
  onCustomize?: () => void;
}

const SPEC_CHIPS = [
  "14 KT",
  "Yellow Gold",
  "0.00 g",
  "0.880 g",
  "0.024 C",
  "FG SI",
];

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onCustomize,
}) => {
  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.brand}>{product.brand}</Text>
        </View>
        <View style={styles.priceCol}>
          <Text style={styles.discountPrice}>
            ₹{product.discountedPrice.toLocaleString()}
          </Text>
          {product.givenPrice && (
            <Text style={styles.originalPrice}>
              ₹{product.givenPrice.toLocaleString()}
            </Text>
          )}
          <Text style={styles.taxText}>(tax inclusive)</Text>
        </View>
      </View>

      <View style={styles.expressTag}>
        <Ionicons name="cube-outline" size={14} color={COLORS.text} />
        <Text style={styles.expressText}>
          Delivery by {getEstimatedDeliveryDate()}
        </Text>
      </View>

      {/* Spec Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
      >
        {SPEC_CHIPS.map((chip, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </View>
        ))}
        {/* Size Dropdown Mimic */}
        <TouchableOpacity style={styles.sizeChip}>
          <Text style={styles.sizeText}>Size 12</Text>
          <Ionicons
            name="chevron-down"
            size={14}
            color={COLORS.text}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Action Buttons Row 1 - Visualization & Config */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Try On</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onCustomize}>
          <Ionicons
            name="sparkles"
            size={14}
            color={COLORS.text}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.actionBtnText}>Customize</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Actions removed from here and moved to Sticky Footer in ProductDetailScreen */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.s, // Reduced padding as buttons are gone
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.s,
  },
  titleCol: {
    flex: 1,
    marginRight: SPACING.m,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  brand: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  priceCol: {
    alignItems: "flex-end",
  },
  discountPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: 13,
    textDecorationLine: "line-through",
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  taxText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  expressTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: SPACING.m,
  },
  expressText: {
    fontSize: 11,
    color: COLORS.text,
    marginLeft: 6,
    fontWeight: "500",
  },
  chipScroll: {
    flexDirection: "row",
    marginBottom: SPACING.m,
  },
  chip: {
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  chipText: {
    fontSize: 12,
    color: COLORS.text,
  },
  sizeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.text,
  },
  sizeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: SPACING.s,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginRight: 4,
  },
});
