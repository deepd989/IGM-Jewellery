import { HapticButton } from "@/components/basic components/hapticButton";
import { Product } from "@/interfaces/product.interface";
import React, { useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import LuxuryProductCard from "../../components/luxuryProductCard";
import MicrositeSectionHeader from "./micrositeSectionHeader";
import {
  MICROSITE_CARD_BORDER,
  MICROSITE_MUTED,
  MICROSITE_PRIMARY,
} from "./micrositeTheme";

const SIDE_PADDING = 16;
const GRID_GAP = 12;

/** Kept short: the grid is a taste of the catalogue, not the catalogue. */
const MAX_PRODUCTS = 6;

const ALL = "All";

type MicrositeCatalogueProps = {
  products: Product[];
  primaryColor?: string;
  secondaryColor?: string;
  onViewAll?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * A window onto what the brand sells, filtered by the kinds of piece they
 * actually stock — the chips are built from the products themselves, so a
 * brand is never offered a filter that returns nothing.
 */
export default function MicrositeCatalogue({
  products,
  primaryColor = MICROSITE_PRIMARY,
  secondaryColor,
  onViewAll,
  style,
}: MicrositeCatalogueProps) {
  const [activeType, setActiveType] = useState(ALL);
  /**
   * Measured rather than taken from the window: the section sits inside the
   * page's own gutter, so a width worked out from the screen makes cards too
   * wide for the row they land in and the grid breaks apart.
   */
  const [rowWidth, setRowWidth] = useState(0);

  const handleGridLayout = (event: LayoutChangeEvent) => {
    const measured = event.nativeEvent.layout.width;
    if (measured > 0 && measured !== rowWidth) setRowWidth(measured);
  };

  const cardWidth = rowWidth ? (rowWidth - GRID_GAP) / 2 : undefined;

  const types = useMemo(() => {
    const present = new Set<string>();
    products.forEach((product) => {
      if (product.productType) present.add(product.productType);
    });
    return [ALL, ...Array.from(present)];
  }, [products]);

  const shown = useMemo(() => {
    const matching =
      activeType === ALL
        ? products
        : products.filter((product) => product.productType === activeType);

    return matching.slice(0, MAX_PRODUCTS);
  }, [products, activeType]);

  if (!products.length) return null;

  return (
    <View style={style}>
      <MicrositeSectionHeader
        title="Our Collection"
        align="left"
        primaryColor={primaryColor}
        actionLabel={onViewAll ? "View All" : undefined}
        onAction={onViewAll}
      />

      {types.length > 2 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {types.map((type) => {
            const isActive = type === activeType;

            return (
              <HapticButton
                key={type}
                style={[
                  styles.chip,
                  isActive && { backgroundColor: primaryColor, borderColor: primaryColor },
                ]}
                activeOpacity={0.85}
                onPress={() => setActiveType(type)}
              >
                <Text
                  style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                >
                  {type}
                </Text>
              </HapticButton>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.gridWrapper}>
        <View style={styles.grid} onLayout={handleGridLayout}>
          {/* Cards are held back until the row has been measured, so none is
              ever laid out at the wrong width and then jumps. */}
          {!!cardWidth &&
            shown.map((product) => (
              <LuxuryProductCard
                key={product.id}
                product={product}
                width={cardWidth}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
            ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: {
    gap: 8,
    marginTop: 14,
    paddingHorizontal: SIDE_PADDING,
  },
  chip: {
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: MICROSITE_CARD_BORDER,
    backgroundColor: "#FFFFFF",
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: MICROSITE_MUTED,
  },
  chipLabelActive: {
    color: "#FFFFFF",
  },
  gridWrapper: {
    marginTop: 16,
    paddingHorizontal: SIDE_PADDING,
  },
  // Padding lives on the wrapper so onLayout measures the row itself.
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
    // Rows of two, aligned at the top so a two-line name in one card does not
    // push the card beside it down.
    alignItems: "flex-start",
  },
});
