import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RibbonGiftCard from "./gifting/ribbonGiftCard";

const { width } = Dimensions.get("window");

export default function GiftingCard() {
  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.title}>Gifting made easy</Text>
      <Text style={styles.subtitle}>
        Pick, curate, customise & deliver
      </Text>

      {/* Card */}
        <RibbonGiftCard/>

        {/* CTA Button */}
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Explore gifting</Text>
          <View style={styles.iconCircle}>
            <Ionicons name="arrow-forward" size={18} color="#000" />
          </View>
        </Pressable>
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
    color: "#111",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    textAlign: "center",
    color: "#777",
  },

  card: {
    marginTop: 20,
    height: 320,
    borderRadius: CARD_RADIUS,
    backgroundColor: "#F7F7F7",
    overflow: "hidden",
    position: "relative",
  },

  verticalRibbon: {
    position: "absolute",
    left: 32,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: "#D9D9D9",
  },

  horizontalRibbon: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 56,
    height: 24,
    backgroundColor: "#D9D9D9",
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
    backgroundColor: "#111",
    borderRadius: 999,
    paddingVertical: 10,
    paddingLeft: 18,
    paddingRight: 8,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 14,
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
