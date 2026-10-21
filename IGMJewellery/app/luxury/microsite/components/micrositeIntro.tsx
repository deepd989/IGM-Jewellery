import { BrandMicrositeDescription } from "@/interfaces/brandMicrosite.interface";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { MICROSITE_PRIMARY, MICROSITE_TEXT } from "./micrositeTheme";

type MicrositeIntroProps = {
  description: BrandMicrositeDescription;
  primaryColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * The brand in their own words — the one section that is all type, so it is
 * set centred and given room rather than boxed like the rest.
 */
export default function MicrositeIntro({
  description,
  primaryColor = MICROSITE_PRIMARY,
  style,
}: MicrositeIntroProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: primaryColor }]}>
        {description.title}
      </Text>
      <Text style={styles.body}>{description.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  body: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 24,
    textAlign: "center",
    color: MICROSITE_TEXT,
  },
});
