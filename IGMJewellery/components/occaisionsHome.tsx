import { SectionHeader } from "@/app/home";
import { OCCASIONS } from "@/constants/occasions";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";



export default function OccasionCardList() {
    const data= OCCASIONS
  return (
    <>
    <SectionHeader value="Shop by Occaision"/>
    <View style={styles.container}>
      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          activeOpacity={0.7}

        >
          <Text style={styles.label}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 14,
    paddingHorizontal: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#f3f3f3",
    paddingVertical: 28,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    letterSpacing: 6,
    color: "#1c1c1c",
    fontWeight: "500",
  },
});
