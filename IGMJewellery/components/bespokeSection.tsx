import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";
import { HapticButton } from "./basic components/hapticButton";
import BespokeVideoComponent from "./bespokeVideo";

export default function BespokeSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Bespoke Jewellery</Text>
      <Text style={styles.subtitle}>Design it, Craft it, Own it</Text>

      {/* Steps */}
      <BespokeVideoComponent></BespokeVideoComponent>

      {/* CTA */}
      <HapticButton style={styles.cta} onPress={() => router.push("/bespoke")}>
        <Text style={styles.ctaText}>Explore Bespoke</Text>
        <View style={styles.iconCircle}>
          <Ionicons name="arrow-forward" size={16} color="#053844" />
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
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: COLORS.primary,
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
    color: "#053844",
  },
  cta: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#053844",
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
