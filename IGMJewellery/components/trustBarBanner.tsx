import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const TrustBar = () => {
  const trustItems = [
    { id: 1, icon: "shield-check", text: "5000+ Brands" },
    { id: 2, icon: "shield-check", text: "100% Refund" },
    { id: 3, icon: "shield-check", text: "Lifetime Exchange" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {trustItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <View style={styles.item}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color="#1a3a3a"
              />
              <Text style={styles.text}>{item.text}</Text>
            </View>

            {/* Add divider between items, but not after the last one */}
            {index < trustItems.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9fbfb",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 80,
    marginBottom: 80,
  },
  scrollContent: {
    paddingHorizontal: 20,
    alignItems: "center",
    // Ensures items are centered on wider screens
    minWidth: Dimensions.get("window").width,
    justifyContent: "space-around",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  text: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "600",
    color: "#4a6767",
  },
  divider: {
    width: 1.5,
    height: 30,
    backgroundColor: "#4a6767",
    opacity: 0.3,
    marginHorizontal: 15,
  },
});

export default TrustBar;
