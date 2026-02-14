import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { HapticButton } from "./basic components/hapticButton";

export default function BespokeSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Bespoke jewellery</Text>
      <Text style={styles.subtitle}>Pick, curate, customise & deliver</Text>

      {/* Steps */}
      <View
        style={[
          styles.step,
          styles.clipBottomLeft,
          styles.clipTopRight,
          styles.clipBottomRight,
        ]}
      >
        <Text style={styles.stepText}>Submit your designs</Text>
      </View>

      <View style={[styles.step, styles.clipBottomLeft, styles.clipTopRight]}>
        <Text style={styles.stepText}>Get assigned a design consultant</Text>
      </View>

      <View style={[styles.step, styles.clipTopLeft, styles.clipBottomRight]}>
        <Text style={styles.stepText}>Ideate, curate and customise</Text>
      </View>

      {/* CTA */}
      <HapticButton style={styles.cta} onPress={() => router.push("/bespoke")}>
        <Text style={styles.ctaText}>Explore Bespoke</Text>
        <View style={styles.iconCircle}>
          <Ionicons name="arrow-forward" size={16} color="#000" />
        </View>
      </HapticButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  step: {
    backgroundColor: "#E0E0E0",
    borderRadius: 40,
    paddingVertical: 30,
    paddingHorizontal: 24,
    marginBottom: 8,
    alignItems: "center",
    width: "100%",
  },
  clipTopLeft: {
    borderTopLeftRadius: 0,
  },
  clipBottomLeft: {
    borderBottomLeftRadius: 0,
  },
  clipBottomRight: {
    borderBottomRightRadius: 0,
  },
  clipTopRight: {
    borderTopRightRadius: 0,
  },
  stepText: {
    fontSize: 15,
    color: "#000",
  },
  cta: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  ctaText: {
    color: "#fff",
    fontSize: 15,
    marginRight: 12,
  },
  iconCircle: {
    backgroundColor: "#fff",
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
