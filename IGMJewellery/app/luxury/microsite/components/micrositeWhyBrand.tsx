import { ChevronRight } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { chunk } from "./micrositeLayout";
import MicrositeSectionHeader from "./micrositeSectionHeader";
import {
  MICROSITE_MUTED,
  MICROSITE_PRIMARY,
  MICROSITE_SECONDARY,
  withAlpha,
} from "./micrositeTheme";
import MicrositeValueIcon from "./micrositeValueIcon";

export type MicrositeTrustBadge = {
  /** Name from the icon map in micrositeValueIcon. */
  iconTag: string;
  header: string;
  description: string;
};

/**
 * The assurances every brand on the storefront makes. Held here rather than
 * fetched: the microsite payload carries no field for them yet, so swapping
 * this default for the brand's own is a one-prop change when it does.
 */
export const MICROSITE_TRUST_BADGES: MicrositeTrustBadge[] = [
  {
    iconTag: "BadgeCheck",
    header: "Authenticity Certificate",
    description: "Unique certificate with every diamond piece purchased",
  },
  {
    iconTag: "ShieldCheck",
    header: "BIS Hallmarked",
    description: "Certified purity on every piece",
  },
  {
    iconTag: "Star",
    header: "Trust Score 4.9★",
    description: "Rated by 10M+ customers",
  },
  {
    iconTag: "Eye",
    header: "Clear Pricing",
    description: "Zero hidden charges, ever",
  },
  {
    iconTag: "Recycle",
    header: "Lifetime Exchange",
    description: "Full value at billed rate",
  },
  {
    iconTag: "Truck",
    header: "Easy Returns",
    description: "30-day hassle-free returns",
  },
  {
    iconTag: "Leaf",
    header: "Ethical Gold",
    description: "Responsibly sourced, conflict-free",
  },
];

type MicrositeWhyBrandProps = {
  brandName: string;
  badges?: MicrositeTrustBadge[];
  primaryColor?: string;
  secondaryColor?: string;
  onSelectFeatured?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Why buy here: the first assurance runs the full width, since it is the one
 * the brand leads with, and the rest sit three to a row beneath it.
 */
export default function MicrositeWhyBrand({
  brandName,
  badges = MICROSITE_TRUST_BADGES,
  primaryColor = MICROSITE_PRIMARY,
  secondaryColor = MICROSITE_SECONDARY,
  onSelectFeatured,
  style,
}: MicrositeWhyBrandProps) {
  const { width } = useWindowDimensions();

  /**
   * Three to a row on a phone, four on a tablet, and two on the narrowest
   * devices, where a third leaves each label a word per line.
   */
  const columns =
    width >= WIDE_BREAKPOINT ? 4 : width >= NARROW_BREAKPOINT ? 3 : 2;

  // The first badge leads on its own row, so the grid holds the rest.
  const rows = useMemo(() => chunk(badges.slice(1), columns), [badges, columns]);

  if (!badges.length) return null;

  const featured = badges[0];

  return (
    <View style={style}>
      <MicrositeSectionHeader
        title={`Why ${brandName}?`}
        primaryColor={primaryColor}
      />

      <View
        style={[
          styles.featured,
          { backgroundColor: withAlpha(primaryColor, 0.07) },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: primaryColor }]}>
          <MicrositeValueIcon tag={featured.iconTag} color="#FFFFFF" size={18} />
        </View>

        <View style={styles.featuredText}>
          <Text style={[styles.featuredHeader, { color: primaryColor }]}>
            {featured.header}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {featured.description}
          </Text>
        </View>

        <ChevronRight size={18} color={secondaryColor} strokeWidth={2.5} />
      </View>

      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={row[0]?.header ?? rowIndex} style={styles.row}>
            {row.map((badge) => (
              <View
                key={badge.header}
                style={[
                  styles.tile,
                  { backgroundColor: withAlpha(secondaryColor, 0.25) },
                ]}
              >
                <View style={[styles.tileIcon, { backgroundColor: primaryColor }]}>
                  <MicrositeValueIcon
                    tag={badge.iconTag}
                    color="#FFFFFF"
                    size={15}
                  />
                </View>

                <Text
                  style={[styles.tileHeader, { color: primaryColor }]}
                  numberOfLines={2}
                >
                  {badge.header}
                </Text>
                <Text style={styles.description} numberOfLines={3}>
                  {badge.description}
                </Text>
              </View>
            ))}

            {/* Keeps a short last row the same width as the rows above it. */}
            {Array.from({ length: columns - row.length }).map((_, index) => (
              <View key={`filler-${index}`} style={styles.filler} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const SIDE_PADDING = 16;
const GRID_GAP = 10;

/** Above this the row carries a fourth tile; below the narrow one, only two. */
const WIDE_BREAKPOINT = 700;
const NARROW_BREAKPOINT = 360;

const styles = StyleSheet.create({
  featured: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 16,
    marginHorizontal: SIDE_PADDING,
    padding: 14,
    borderRadius: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredText: {
    flex: 1,
  },
  featuredHeader: {
    fontSize: 14,
    fontWeight: "800",
  },
  grid: {
    marginTop: GRID_GAP,
    paddingHorizontal: SIDE_PADDING,
  },
  row: {
    flexDirection: "row",
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
    // Tiles in a row stand the same height whatever their label runs to.
    alignItems: "stretch",
  },
  // Width comes from the row: an equal share of whatever is left after the
  // gaps, on any screen.
  tile: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
  },
  filler: {
    flex: 1,
  },
  tileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  tileHeader: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "800",
  },
  description: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
    color: MICROSITE_MUTED,
  },
});
