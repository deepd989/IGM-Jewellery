import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS } from "@/constants/theme";
import { ProductType } from "@/enums/productType.enum";
import { luxuryPrice } from "@/helpers/luxuryPrice";
import { Product } from "@/interfaces/product.interface";
import { getEstimatedDeliveryDate } from "@/utils/deliveryDate";
import { Ionicons } from "@expo/vector-icons";
import { Truck } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

/** The brand line and the delivery pill's glyph, lifted for the dark ground. */
const BRAND_TEAL = "#7FCBBB";

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
 * The details sheet under the gallery: name, price, delivery promise and the
 * specification chips. It paints no ground of its own — the screen's runs
 * through it — so its type is set in LUXURY_COLORS' light ink. Reads the same
 * resolved attributes the classic product screen shows in
 * components/products/ProductInfo.tsx.
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

  // Only rings carry a size, so the picker chip is theirs alone.
  const isRing = product.productType === ProductType.Ring;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{product.name || product.title}</Text>
          <Text style={styles.brand}>{product.brand}</Text>

          <View style={styles.deliveryChip}>
            <Truck size={16} color={LUXURY_COLORS.accent} strokeWidth={1.8} />
            <Text style={styles.deliveryText}>
              Express delivery by {getEstimatedDeliveryDate()}
            </Text>
          </View>
        </View>

        {/* LUXE lists at full price, so there is no struck price under it. */}
        <View style={styles.priceCol}>
          <Text style={styles.price}>
            ₹{luxuryPrice(product)?.toLocaleString()}
          </Text>
          <Text style={styles.taxNote}>(tax inclusive)</Text>
        </View>
      </View>

      <View style={styles.chipRow}>
        {chips.map((chip, index) => (
          <View key={`${chip}-${index}`} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </View>
        ))}

        {isRing && (
          <HapticButton style={styles.sizeChip} onPress={onSelectSize}>
            <Text style={styles.sizeChipText}>Size 12</Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={LUXURY_COLORS.accent}
            />
          </HapticButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // No top gap of its own: the hero's meta card sets the distance to the title.
  container: {
    paddingHorizontal: 16,
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
    color: LUXURY_COLORS.text,
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
    backgroundColor: LUXURY_COLORS.surface,
  },
  deliveryText: {
    fontSize: 14,
    color: LUXURY_COLORS.text,
  },
  priceCol: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  taxNote: {
    marginTop: 8,
    fontSize: 14,
    color: LUXURY_COLORS.textMuted,
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
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.surface,
  },
  chipText: {
    fontSize: 15,
    color: LUXURY_COLORS.text,
  },
  // The one chip that acts: the accent edge is what separates it from the
  // specification chips beside it, now that neither is a white pill.
  sizeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: LUXURY_COLORS.accent,
    backgroundColor: LUXURY_COLORS.surface,
  },
  sizeChipText: {
    fontSize: 15,
    fontWeight: "500",
    color: LUXURY_COLORS.text,
  },
});
