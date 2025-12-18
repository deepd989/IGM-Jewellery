import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import homePageIcon from "../assets/images/homePageIcon.png"; // or "./assets/..." if under app/assets
import { Link } from "expo-router";
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
      <Link href="/signUp" style={styles.secondaryLinkText}>SignUp link</Link>
      <Link href="/login" style={styles.secondaryLinkText}>
        phone number login →
      </Link>
      <Link href="/home" style={styles.secondaryLinkText}>
        Explore Home →
      </Link>
      <Link href="/gift" style={styles.secondaryLinkText}>
        Explore gift
      </Link>
      <Link href="/brands" style={styles.secondaryLinkText}>
        Explore brands
      </Link>
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
  secondaryLinkText: {
    fontSize: 16,
    color: "#007aff",
    marginTop: 6,
  },
});
