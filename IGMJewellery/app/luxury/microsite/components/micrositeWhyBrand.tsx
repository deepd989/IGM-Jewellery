import { ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
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
  if (!badges.length) return null;

  const [featured, ...rest] = badges;

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
        {rest.map((badge) => (
          <View
            key={badge.header}
            style={[
              styles.tile,
              { backgroundColor: withAlpha(secondaryColor, 0.25) },
            ]}
          >
            <View
              style={[styles.tileIcon, { backgroundColor: primaryColor }]}
            >
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
      </View>
    </View>
  );
}

const SIDE_PADDING = 16;
const GRID_GAP = 10;

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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
    marginTop: GRID_GAP,
    paddingHorizontal: SIDE_PADDING,
  },
  // Three to a row, with the two gaps between them taken off each third.
  tile: {
    width: `${(100 - 6) / 3}%`,
    padding: 12,
    borderRadius: 14,
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
