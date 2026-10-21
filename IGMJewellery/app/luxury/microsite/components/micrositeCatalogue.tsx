import { HapticButton } from "@/components/basic components/hapticButton";
import { Product } from "@/interfaces/product.interface";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import LuxuryProductCard from "../../components/luxuryProductCard";
import { chunk } from "./micrositeLayout";
import MicrositeSectionHeader from "./micrositeSectionHeader";
import {
  MICROSITE_CARD_BORDER,
  MICROSITE_MUTED,
  MICROSITE_PRIMARY,
} from "./micrositeTheme";

const SIDE_PADDING = 16;
const GRID_GAP = 12;

/** Above this, the row carries a third card rather than two wide ones. */
const WIDE_BREAKPOINT = 700;

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
  const { width: windowWidth } = useWindowDimensions();

  /**
   * Cards take their width from the row they sit in rather than a figure
   * worked out from the screen, so the grid holds whatever gutter the page
   * puts around it and re-lays itself when the device turns.
   */
  const columns = windowWidth >= WIDE_BREAKPOINT ? 3 : 2;

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

  const rows = useMemo(() => chunk(shown, columns), [shown, columns]);

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
        {rows.map((row, rowIndex) => (
          <View key={row[0]?.id ?? rowIndex} style={styles.row}>
            {row.map((product) => (
              <View key={product.id} style={styles.cell}>
                <LuxuryProductCard
                  product={product}
                  compact
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
              </View>
            ))}

            {/* Holds the last row's cards to the same width as the rows above
                when the products do not divide evenly. */}
            {Array.from({ length: columns - row.length }).map((_, index) => (
              <View key={`filler-${index}`} style={styles.cell} />
            ))}
          </View>
        ))}
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
  row: {
    flexDirection: "row",
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
    // Cards start at the top of the row, so a two-line name in one does not
    // drag the card beside it down.
    alignItems: "flex-start",
  },
  cell: {
    flex: 1,
  },
});
