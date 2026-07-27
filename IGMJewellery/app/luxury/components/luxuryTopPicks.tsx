import { COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Product } from "@/interfaces/product.interface";
import { useGetProductsQuery } from "@/store/apis/product";
import { useState } from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import LuxuryProductCard from "./luxuryProductCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/** Two cards per row, so the count is kept even. */
const MAX_PRODUCTS = 4;
const COLUMN_GAP = 14;

type LuxuryTopPicksProps = {
  title?: string;
  /** Defaults to the product catalogue. */
  products?: Product[];
  /** Overrides navigation to the product screen. */
  onPressProduct?: (product: Product) => void;
  style?: ViewStyle;
};

export default function LuxuryTopPicks({
  title = "Top picks for you",
  products,
  onPressProduct,
  style,
}: LuxuryTopPicksProps) {
  const { data: fetchedProducts = [] } = useGetProductsQuery({});
  // Measured so the cards fit the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [gridWidth, setGridWidth] = useState(SCREEN_WIDTH);

  const topPicks = (products ?? fetchedProducts).slice(0, MAX_PRODUCTS);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== gridWidth) {
      setGridWidth(width);
    }
  };

  const cardWidth = Math.floor((gridWidth - COLUMN_GAP) / 2);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.grid} onLayout={handleLayout}>
        {topPicks.map((product) => (
          <LuxuryProductCard
            key={product.id}
            product={product}
            width={cardWidth}
            onPress={onPressProduct}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: LUXURY_SPACING,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: COLUMN_GAP,
    // Rows breathe more than columns do, so each card reads as one block.
    rowGap: LUXURY_SPACING / 2,
  },
});
