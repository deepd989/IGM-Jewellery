import { BrandMicrositeInfoAttributes } from "@/interfaces/brandMicrosite.interface";
import { Award, CalendarDays, Store, Users } from "lucide-react-native";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  compactCount,
  MICROSITE_MUTED,
  MICROSITE_PRIMARY,
  MICROSITE_TEXT,
  withAlpha,
} from "./micrositeTheme";

type MicrositeStatsProps = {
  attributes: BrandMicrositeInfoAttributes;
  primaryColor?: string;
  style?: StyleProp<ViewStyle>;
};

const ICON_SIZE = 15;

/**
 * The brand's credentials in four tiles: how long they have traded, how far
 * they reach, who they serve, and where they stand.
 */
export default function MicrositeStats({
  attributes,
  primaryColor = MICROSITE_PRIMARY,
  style,
}: MicrositeStatsProps) {
  const founded = new Date(attributes.establishedDate);
  const foundedYear = Number.isNaN(founded.getTime())
    ? ""
    : `${founded.getFullYear()}`;

  const tiles = [
    {
      key: "established",
      value: foundedYear,
      label: "Est.",
      icon: <CalendarDays size={ICON_SIZE} color="#FFFFFF" strokeWidth={2.2} />,
    },
    {
      key: "stores",
      value: attributes.numberOfStores
        ? `${compactCount(attributes.numberOfStores)}`
        : "",
      label: "Stores",
      icon: <Store size={ICON_SIZE} color="#FFFFFF" strokeWidth={2.2} />,
    },
    {
      key: "customers",
      value: compactCount(attributes.numberOfCustomers),
      label: "Customers",
      icon: <Users size={ICON_SIZE} color="#FFFFFF" strokeWidth={2.2} />,
    },
    {
      key: "rank",
      value: attributes.rank,
      label: "Rank",
      icon: <Award size={ICON_SIZE} color="#FFFFFF" strokeWidth={2.2} />,
      // The rank is a phrase rather than a figure, so it is set smaller and
      // given the room to wrap.
      isPhrase: true,
    },
  ].filter((tile) => !!tile.value);

  return (
    <View style={[styles.row, style]}>
      {tiles.map((tile) => (
        <View
          key={tile.key}
          style={[
            styles.tile,
            { backgroundColor: withAlpha(primaryColor, 0.05) },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: primaryColor }]}>
            {tile.icon}
          </View>

          <Text
            style={[styles.value, tile.isPhrase && styles.valuePhrase]}
            numberOfLines={2}
          >
            {tile.value}
          </Text>
          <Text style={styles.label} numberOfLines={1}>
            {tile.label.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
  },
  tile: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    color: MICROSITE_TEXT,
  },
  valuePhrase: {
    fontSize: 11,
    lineHeight: 14,
  },
  label: {
    marginTop: 3,
    fontSize: 9,
    letterSpacing: 0.6,
    textAlign: "center",
    color: MICROSITE_MUTED,
  },
});
