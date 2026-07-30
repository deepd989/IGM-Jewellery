import { BrandMicrositeValue } from "@/interfaces/brandMicrosite.interface";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import MicrositeSectionHeader from "./micrositeSectionHeader";
import {
  MICROSITE_CARD_BORDER,
  MICROSITE_MUTED,
  MICROSITE_PRIMARY,
  MICROSITE_SECONDARY,
  withAlpha,
} from "./micrositeTheme";
import MicrositeValueIcon from "./micrositeValueIcon";

type MicrositeValuesProps = {
  values: BrandMicrositeValue[];
  title?: string;
  primaryColor?: string;
  secondaryColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * What the brand stands on, one row each. The brand's own colour carries the
 * headings and tints the glyphs; the secondary marks the edge of each row.
 */
export default function MicrositeValues({
  values,
  title = "Our Values",
  primaryColor = MICROSITE_PRIMARY,
  secondaryColor = MICROSITE_SECONDARY,
  style,
}: MicrositeValuesProps) {
  if (!values.length) return null;

  return (
    <View style={style}>
      <MicrositeSectionHeader title={title} primaryColor={primaryColor} />

      <View style={styles.list}>
        {values.map((value) => (
          <View key={value.header} style={styles.row}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: withAlpha(primaryColor, 0.08) },
              ]}
            >
              <MicrositeValueIcon tag={value.iconTag} color={primaryColor} />
            </View>

            <View style={styles.text}>
              <Text style={[styles.header, { color: primaryColor }]}>
                {value.header}
              </Text>
              <Text style={styles.description}>{value.description}</Text>
            </View>

            {/* The mark at the row's edge, in the brand's second colour. */}
            <View style={[styles.edge, { backgroundColor: secondaryColor }]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MICROSITE_CARD_BORDER,
    backgroundColor: "#FFFFFF",
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
  },
  header: {
    fontSize: 14,
    fontWeight: "800",
  },
  description: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: MICROSITE_MUTED,
  },
  edge: {
    width: 3,
    height: 26,
    borderRadius: 2,
  },
});
