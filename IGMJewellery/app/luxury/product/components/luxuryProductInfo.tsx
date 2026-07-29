import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS } from "@/constants/theme";
import { Product } from "@/interfaces/product.interface";
import { getEstimatedDeliveryDate } from "@/utils/deliveryDate";
import { Ionicons } from "@expo/vector-icons";
import { Truck } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

/** The greener teal the brand line and the delivery pill are set in. */
const BRAND_TEAL = "#2F7266";
/** Struck-through price and the tax note. */
const MUTED = "#8FA1A8";

/** Shown when the catalogue has no resolved attributes for this product. */
const FALLBACK_CHIPS = [
  "14 KT Yellow Gold",
  "0.00 g",
  "0.880 g",
  "0.024 C",
  "FG SI",
];

type LuxuryProductInfoProps = {
  product: Product;
  /** Opens the size / metal picker behind the "Size 12" chip. */
  onSelectSize?: () => void;
};

/**
 * The white details sheet under the gallery: name, price, delivery promise and
 * the specification chips. Reads the same resolved attributes the classic
 * product screen shows in components/products/ProductInfo.tsx.
 */
export default function LuxuryProductInfo({
  product,
  onSelectSize,
}: LuxuryProductInfoProps) {
  const d = product.productDetails || {};

  // e.g. "14 KT Yellow Gold" — the same composition the accordion uses.
  const metalLabel = [d.metalPurity, d.metalColor, d.metalType]
    .filter(Boolean)
    .join(" ");
  const stoneGrade = [d.diamondColor, d.diamondClarity].filter(Boolean).join(" ");

  const specChips = [
    metalLabel,
    d.netWeight,
    d.grossWeight,
    d.diamondWeight,
    stoneGrade,
  ].filter(Boolean) as string[];

  const chips = specChips.length > 0 ? specChips : FALLBACK_CHIPS;
  const hasDiscount = product.givenPrice > product.discountedPrice;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{product.name || product.title}</Text>
          <Text style={styles.brand}>{product.brand}</Text>

          <View style={styles.deliveryChip}>
            <Truck size={16} color={BRAND_TEAL} strokeWidth={1.8} />
            <Text style={styles.deliveryText}>
              Express delivery by {getEstimatedDeliveryDate()}
            </Text>
          </View>
        </View>

        <View style={styles.priceCol}>
          <Text style={styles.price}>
            ₹{product.discountedPrice?.toLocaleString()}
          </Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>
              ₹{product.givenPrice.toLocaleString()}
            </Text>
          )}
          <Text style={styles.taxNote}>(tax inclusive)</Text>
        </View>
      </View>

      <View style={styles.chipRow}>
        {chips.map((chip, index) => (
          <View key={`${chip}-${index}`} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </View>
        ))}

        <HapticButton style={styles.sizeChip} onPress={onSelectSize}>
          <Text style={styles.sizeChipText}>Size 12</Text>
          <Ionicons name="chevron-down" size={18} color={COLORS.primary} />
        </HapticButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titleCol: {
    flex: 1,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
  },
  brand: {
    marginTop: 6,
    fontSize: 17,
    color: BRAND_TEAL,
  },
  deliveryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#E8F3EE",
  },
  deliveryText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  priceCol: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
  },
  originalPrice: {
    marginTop: 8,
    fontSize: 17,
    color: MUTED,
    textDecorationLine: "line-through",
  },
  taxNote: {
    marginTop: 8,
    fontSize: 14,
    color: MUTED,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DCE6E9",
    backgroundColor: "#FFFFFF",
  },
  chipText: {
    fontSize: 15,
    color: COLORS.primary,
  },
  sizeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: "#FFFFFF",
  },
  sizeChipText: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.primary,
  },
});
