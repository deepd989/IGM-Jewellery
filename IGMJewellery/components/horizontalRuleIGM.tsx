// components/HorizontalRule.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../constants/theme";

export default function HorizontalRuleIGM() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.diamond} />
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: "50%",
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1.4,
    backgroundColor: COLORS.primary,
  },
  diamond: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.primary,
    transform: [{ rotate: "45deg" }],
    marginHorizontal: 8,
  },
});
