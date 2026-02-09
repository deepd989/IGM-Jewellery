import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to IGM Jewellery</Text>
      <Text style={styles.subtitle}>
        Your personalized experience is ready.
      </Text>
      <TouchableOpacity style={styles.primary} onPress={onNext}>
        <Text style={styles.primaryText}>Start exploring</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center" },
  subtitle: { marginTop: 8, textAlign: "center", color: "#666" },
  primary: {
    marginTop: 24,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  primaryText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
