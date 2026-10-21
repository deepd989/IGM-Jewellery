import { HapticButton } from "@/components/basic components/hapticButton";
import React from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import LuxuryScreenHeader from "../../components/luxuryScreenHeader";

export type MicrositeNavItem = {
  key: string;
  label: string;
};

/** The microsite's own sections, in the order the brand presents them. */
export const MICROSITE_NAV_ITEMS: MicrositeNavItem[] = [
  { key: "about", label: "About Us" },
  { key: "stores", label: "Stores" },
  { key: "products", label: "Products" },
  { key: "collection", label: "Collection" },
];

type MicrositeTopNavProps = {
  /** Shown as the page's title. Empty while the microsite is still loading. */
  brandName?: string;
  items?: MicrositeNavItem[];
  /** Key of the highlighted item, when the page tracks one. */
  activeKey?: string;
  onSelect?: (item: MicrositeNavItem) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The band across the top of a microsite: whose site it is and the way back,
 * on the same header every luxury screen uses, with the brand's own sections
 * beneath it. The sections scroll horizontally so a brand can name more than
 * fit the screen, rather than the labels shrinking until they cannot be read.
 */
export default function MicrositeTopNav({
  brandName = "",
  items = MICROSITE_NAV_ITEMS,
  activeKey,
  onSelect,
  style,
}: MicrositeTopNavProps) {
  return (
    <View style={[styles.band, style]}>
      {/* Glass, so the band's own black carries through rather than the
          header painting a second colour over it. */}
      <LuxuryScreenHeader
        title={brandName}
        showBack
        variant="glass"
        style={styles.header}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {items.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <HapticButton
              key={item.key}
              activeOpacity={0.7}
              style={styles.item}
              onPress={() => onSelect?.(item)}
            >
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {item.label.toUpperCase()}
              </Text>
            </HapticButton>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    paddingBottom: 12,
    backgroundColor: "#000000",
  },
  // The tabs sit right under the title, so the header gives up its own gap.
  header: {
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
    paddingHorizontal: 20,
  },
  item: {
    paddingVertical: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: "#FFFFFF",
  },
  labelActive: {
    // The band is black, so the active label is marked by warmth rather than
    // an underline, which reads as a seam against the artwork below it.
    color: "#D8C391",
  },
});
