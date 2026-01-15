import { Product } from "@/interfaces/product.interface";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { COLORS, SPACING } from "../../constants/theme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CartItemProps {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  product,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  };

  const discountPercent = product.givenPrice
    ? Math.round(
        ((product.givenPrice - product.discountedPrice) / product.givenPrice) *
          100
      )
    : 0;

  return (
    <View style={styles.container}>
      {/* Delivery Tag */}
      <View style={styles.deliveryTag}>
        <Ionicons name="bus-outline" size={14} color={COLORS.text} />
        <Text style={styles.deliveryText}>Delivery by 19th Nov</Text>
      </View>

      <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
        <Ionicons name="close" size={20} color={COLORS.text} />
      </TouchableOpacity>

      <View style={styles.contentRow}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.thumbnailUrls[0] }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <TouchableOpacity
            onPress={toggleExpand}
            activeOpacity={0.7}
            style={styles.specsContainer}
          >
            <Text
              style={styles.specs}
              numberOfLines={isExpanded ? undefined : 1}
            >
              {product.description}
            </Text>

            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={14}
              color={COLORS.text}
              style={styles.expandIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.qtyBtn} onPress={onDecrement}>
            <Ionicons name="remove" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={onIncrement}>
            <Ionicons name="add" size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.priceContainer}>
          {discountPercent > 0 && (
            <View style={styles.savingsRow}>
              <Text style={styles.savingsLabel}>Save {discountPercent}% </Text>
              <Text style={styles.originalPrice}>
                ₹{product.givenPrice?.toLocaleString()}
              </Text>
            </View>
          )}
          <Text style={styles.finalPrice}>
            ₹{product.discountedPrice.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  specsContainer: {
    marginTop: 4,
  },

  expandIcon: {
    alignSelf: "flex-start",
    marginTop: 2,
  },

  container: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    position: "relative",
  },
  deliveryTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: SPACING.m,
  },
  deliveryText: {
    fontSize: 10,
    color: COLORS.text,
    marginLeft: 4,
    fontWeight: "500",
  },
  removeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
  },
  contentRow: {
    flexDirection: "row",
    marginBottom: SPACING.m,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#FAFAFA",
    borderRadius: 4,
    marginRight: SPACING.m,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    flex: 1,
  },
  brand: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  specs: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  expandIcon: {
    marginTop: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: SPACING.m,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  qtyBtn: {
    padding: 8,
  },
  qtyText: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  savingsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  savingsLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  originalPrice: {
    fontSize: 11,
    textDecorationLine: "line-through",
    color: COLORS.textSecondary,
  },
  finalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
});
