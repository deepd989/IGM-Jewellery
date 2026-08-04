import { StyleSheet, Text, View } from "react-native";

export function SectionHeader({
  value,
  color,
}: {
  value: string;
  /** Overrides the heading's ink, for a section set on a dark ground. */
  color?: string;
}) {
  return (
    <View style={{ alignItems: "center", marginBottom: 30 }}>
      <Text style={[styles.hey, !!color && { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hey: { fontSize: 24, fontWeight: "700", color: "#053844" },
});
