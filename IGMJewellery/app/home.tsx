import React from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import NecklaceCard from "@/components/homePageCard";
import SearchBar from "@/components/searchBar";

export default function HomeScreen() {
  return (
    // todo add in safe area
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.deliveryText}>
          Deliver to <Text style={styles.bold}>Mumbai 400 999</Text>
        </Text>
        <Ionicons name="chevron-down" size={18} />
      </View>

      {/* Search Row */}
     <SearchBar />
      {/* Center Graphic */}
      <View style={styles.centerBox}>
        <Feather name="star" size={32} color="#bbb" />
        <Text style={styles.hey}>Hey there!</Text>
        <Text style={styles.sparkle}>What sparkle are we looking for today?</Text>
      </View>

      {/* Voice Search Box */}
      <View style={styles.voiceBox}>
        <TextInput
          placeholder="Sonar is listening"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <Ionicons name="mic-outline" size={22} />
        <Feather name="bar-chart-2" size={22} />
      </View>

      {/* Tag Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
        {["Ai powered", "TBZ latest collection", "Rings", "Wedding", "Men’s gifting", "Mom’s gift", "Anniversary"].map(
          (chip, idx) => (
            <View key={idx} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          )
        )}
      </ScrollView>

    <View style={{backgroundColor: "lightgrey", paddingTop: 6, marginTop: 10, borderRadius: 8, paddingHorizontal: 12}}>
      {/* Category Icons (static placeholders) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconRow}>
        {["●", "○", "◇", "▦", "🎁", "👂", "💍"].map((i, idx) => (
          <Text key={idx} style={styles.iconItem}>{i}</Text>
        ))}
      </ScrollView>

      {/* Necklace Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Necklace</Text>
        <Ionicons name="chevron-forward" size={18} />
      </View>

      {/* Product Card */}
      <NecklaceCard
            title="24K Gold Necklace"
            brand="Kalyan Jewellers"
            price={20000}
            oldPrice={25000}
            deliveryDate="19th Nov"
            image="https://your-image-url-here"
            />
    </View>
    </ScrollView>
  
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },

  header: { flexDirection: "row", alignItems: "center", gap: 6 },
  deliveryText: { fontSize: 14, color: "#444" },
  bold: { fontWeight: "600" },

  centerBox: { alignItems: "center", marginTop: 30 },
  hey: { marginTop: 10, fontSize: 18, fontWeight: "600" },
  sparkle: { color: "#555", marginTop: 3 },

  voiceBox: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 30,
    gap: 12,
  },
  input: { flex: 1 },

  chipsRow: { marginTop: 15, flexGrow: 0 },
  chip: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  chipText: { fontSize: 12, color: "#444" },

  iconRow: { marginTop: 20, flexGrow: 0 },
  iconItem: { fontSize: 22, marginRight: 20 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    alignItems: "center",
  },
  sectionTitle: { fontSize: 20, fontWeight: "600" },

  card: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  productImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#eee",
    borderRadius: 8,
  },

  heartIcon: { position: "absolute", top: 20, right: 20 },

  deliveryDate: { marginTop: 8, color: "#666", fontSize: 12 },

  productName: { marginTop: 6, fontSize: 18, fontWeight: "600" },

  priceRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  price: { fontSize: 18, fontWeight: "700" },
  cutPrice: { fontSize: 14, color: "#888", textDecorationLine: "line-through" },

  brand: { marginTop: 4, color: "#444" },

  tryButton: {
    marginTop: 14,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  tryButtonText: { color: "#fff", fontWeight: "600" },
});
