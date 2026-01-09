import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";

import { RELATIONSHIPS } from "@/constants/relationships";
import { OCCASIONS } from "@/constants/occasions";
import { ProductTypes } from "@/constants/productTypes";
import { RouteParam } from "@/constants/routeNavigationConstants";

export default function GiftFinder() {
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const navigation = useNavigation<NavigationProp<RouteParam>>();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRelationship, setSelectedRelationship] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    5000,
    50000,
  ]);

  const [openDropdown, setOpenDropdown] = useState<
    "category" | "relationship" | "occasion" | "price" | null
  >(null);

  const categories = ProductTypes;
  const relationships = RELATIONSHIPS;
  const occasions = OCCASIONS;

  // Helper function to determine gender based on relationship
  const getGenderFromRelationship = (relationship: string): string => {
    const maleRelationships = [
      "Father",
      "Brother",
      "Husband",
      "Boyfriend",
      "Son",
      "Grandfather",
      "Uncle",
    ];

    const femaleRelationships = [
      "Mother",
      "Sister",
      "Wife",
      "Girlfriend",
      "Daughter",
      "Grandmother",
      "Aunt"
    ];

    if (maleRelationships.some((rel) => relationship.toLowerCase().includes(rel.toLowerCase()))) {
      return "Male";
    } else if (femaleRelationships.some((rel) => relationship.toLowerCase().includes(rel.toLowerCase()))) {
      return "Female";
    }
    return "Unisex";
  };

  const handleStartLooking = () => {
    const gender = getGenderFromRelationship(selectedRelationship);

    navigation.navigate("product-list", {
      categoryId: selectedCategory,
      gender: gender,
      occasion: selectedOccasion,
      productType: selectedCategory,
    });
  };

  const renderDropdown = (
    label: string,
    value: string,
    type: "category" | "relationship" | "occasion" | "price"
  ) => (
    <TouchableOpacity
      style={styles.dropdown}
      onPress={() => setOpenDropdown(type)}
    >
      <Text style={styles.dropdownText}>
        {value !== "" ? value : `Choose ${label}`}
      </Text>
      <Ionicons name="chevron-down" size={20} color="#333" />
    </TouchableOpacity>
  );

  const renderListModal = (
    type: "category" | "relationship" | "occasion",
    data: string[],
    setter: any
  ) => (
    <Modal
      isVisible={openDropdown === type}
      onBackdropPress={() => setOpenDropdown(null)}
    >
      <View style={styles.modalBox}>
        <ScrollView>
          {data.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.modalItem}
              onPress={() => {
                setter(item);
                setOpenDropdown(null);
              }}
            >
              <Text style={styles.modalItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Not sure what to gift?</Text>
      <Text style={styles.subtitle}>
        Let <Text style={{ fontWeight: "700" }}>Sonar</Text> help you
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>I am looking for...</Text>
        {renderDropdown("Category", selectedCategory, "category")}

        <Text style={styles.label}>within</Text>
        {renderDropdown(
          "Price Range",
          `₹${priceRange[0]} - ₹${priceRange[1]}`,
          "price"
        )}

        <Text style={styles.label}>for my</Text>
        {renderDropdown("Relationship", selectedRelationship, "relationship")}

        <Text style={styles.label}>on the occasion of</Text>
        {renderDropdown("Occasion", selectedOccasion, "occasion")}

        <TouchableOpacity style={styles.button} onPress={handleStartLooking}>
          <Text style={styles.buttonText}>Start looking</Text>
          <Ionicons name="search-outline" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* CATEGORY DROPDOWN */}
      {renderListModal("category", categories, setSelectedCategory)}

      {/* RELATIONSHIP DROPDOWN */}
      {renderListModal("relationship", relationships, setSelectedRelationship)}

      {/* OCCASION DROPDOWN */}
      {renderListModal("occasion", occasions, setSelectedOccasion)}

      {/* PRICE RANGE MODAL */}
      <Modal
        isVisible={openDropdown === "price"}
        onBackdropPress={() => setOpenDropdown(null)}
      >
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Select Price Range</Text>

          <View style={{ width: "100%", paddingHorizontal: 0, paddingVertical: 20 }}>
            <MultiSlider
              sliderLength={SCREEN_WIDTH - 100}
              values={[priceRange[0], priceRange[1]]}
              min={500}
              max={200000}
              step={500}
              onValuesChange={(values) =>
                setPriceRange(values as [number, number])
              }
              selectedStyle={{ backgroundColor: "black" }}
              markerStyle={{
                backgroundColor: "black",
                height: 20,
                width: 20,
                borderRadius: 10,
              }}
            />
          </View>

          <Text style={styles.priceText}>
            ₹{priceRange[0]} — ₹{priceRange[1]}
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 24,
  },
  label: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 15,
    color: "#444",
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dropdownText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
