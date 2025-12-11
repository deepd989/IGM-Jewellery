import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import homePageIcon from "../assets/images/homePageIcon.png"; // or "./assets/..." if under app/assets
const IGMJewelleryPage: React.FC = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {/* Top Banner Image */}
      <Image
        source={homePageIcon}
        style={styles.mainImage}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>IGM Jewellery</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        India’s first AI-powered jewellery marketplace, where heritage meets
        high tech
      </Text>
    </ScrollView>
  );
};

export default IGMJewelleryPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainImage: {
    width: "100%",
    height: 650,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 26,
    lineHeight: 22,
    marginBottom: 40,
  },
});
