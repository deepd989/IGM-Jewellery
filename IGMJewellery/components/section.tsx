import { StyleSheet, Text, View } from "react-native";

export function SectionHeader({ value }: { value: string }) {
  return (
    <View style={{ alignItems: "center", marginBottom: 40 }}>
      <Text style={styles.hey}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hey: { fontSize: 24, fontWeight: "700", color: "#000" },
});
