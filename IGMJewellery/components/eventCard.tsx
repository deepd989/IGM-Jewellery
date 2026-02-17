import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";
import { HapticButton } from "./basic components/hapticButton";

export default function EventCard() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>We have put together looks for you!</Text>
      <Text style={styles.caption}>
        Here’s what we have based on your search and taste
      </Text>

      {/* Image Section */}
      <ImageBackground
        source={{
          uri: "https://drive.google.com/uc?export=download&id=1dQk3phA6_k6IyxSxfXP9lWpZuIBtelAT",
        }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        {/* Overlay Button */}
        <HapticButton
          style={styles.button}
          onPress={() => {
            router.push({ pathname: "/product-list" });
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.buttonText}>Get this look </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={COLORS.primary}
            ></Ionicons>
          </View>
        </HapticButton>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  header: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: COLORS.primary,
  },

  caption: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: 420,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },

  imageRadius: {
    borderRadius: 16,
  },

  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
