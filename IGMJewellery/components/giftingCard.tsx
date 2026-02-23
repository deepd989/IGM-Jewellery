import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";
import RibbonGiftCard from "./gifting/ribbonGiftCard";

const { width } = Dimensions.get("window");

export default function GiftingCard({
  showExploreButton = false,
  showHeader = false,
  amount,
  description,
  sendAGiftButton,
  imgUrl,
}: {
  showExploreButton?: boolean;
  showHeader?: boolean;
  amount?: number;
  description?: string;
  sendAGiftButton?: boolean;
  imgUrl?: string;
}) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Heading */}
      {showHeader && (
        <View>
          <Text style={styles.title}>Gifting made easy</Text>
          <Text style={styles.subtitle}>Pick, curate, customise & deliver</Text>
        </View>
      )}

      {/* Card */}
      <RibbonGiftCard imgUrl={imgUrl} />

      {amount && amount > 0 && (
        <Text
          style={{
            fontSize: 24,
            fontWeight: "600",
            marginRight: 10,
            position: "absolute",
            right: 0,
            bottom: 126,
            color: COLORS.text,
          }}
        >
          {" "}
          ₹ {amount.toLocaleString("en-IN")}
        </Text>
      )}

      {description && (
        <Text
          style={{
            fontSize: 24,
            fontWeight: "600",
            position: "absolute",
            right: -10,
            bottom: 176,
            marginRight: 10,
            color: COLORS.text,
          }}
        >
          {description}
        </Text>
      )}

      {/* CTA Button */}
      {showExploreButton && (
        <Pressable style={styles.button} onPress={() => router.push("/gift")}>
          <Text style={styles.buttonText}>Explore gifting</Text>
          <View style={styles.iconCircle}>
            <Ionicons name="arrow-forward" size={18} color="#053844" />
          </View>
        </Pressable>
      )}

      {sendAGiftButton && (
        <Pressable
          style={styles.button}
          onPress={() => router.push("/giftStepperPage")}
        >
          <Text style={styles.buttonText}>Send A Gift</Text>
          <View style={styles.iconCircle}>
            <Ionicons name="arrow-forward" size={18} color="#053844" />
          </View>
        </Pressable>
      )}
    </View>
  );
}

const CARD_RADIUS = 20;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    textAlign: "center",
    color: COLORS.textSecondary,
  },

  card: {
    marginTop: 20,
    height: 320,
    borderRadius: CARD_RADIUS,
    backgroundColor: COLORS.primaryLight,
    overflow: "hidden",
    position: "relative",
  },

  verticalRibbon: {
    position: "absolute",
    left: 32,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: COLORS.primary,
  },

  horizontalRibbon: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 56,
    height: 24,
    backgroundColor: COLORS.primary,
  },

  knot: {
    position: "absolute",
    left: 44,
    bottom: 68,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },

  knotPetal: {
    position: "absolute",
    width: 18,
    height: 28,
    backgroundColor: "#BDBDBD",
    borderRadius: 4,
    transform: [{ rotate: "45deg" }],
  },

  button: {
    position: "absolute",
    right: 20,
    bottom: 36,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 999,
    paddingVertical: 10,
    paddingLeft: 18,
    paddingRight: 8,
  },

  buttonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },

  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
