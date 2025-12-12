// components/HorizontalRule.tsx
import React from "react";
import { View, StyleSheet } from "react-native";

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
    alignItems: "center",
    width: "100%",
    marginVertical: 40,
  },
  line: {
    flex: 1,
    height: 1.4,
    backgroundColor: "#333",
  },
  diamond: {
    width: 10,
    height: 10,
    backgroundColor: "#333",
    transform: [{ rotate: "45deg" }],
    marginHorizontal: 8,
  },
});
