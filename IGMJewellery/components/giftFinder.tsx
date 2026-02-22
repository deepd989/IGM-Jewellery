import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";

import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";

import { OCCASIONS } from "@/constants/occasions";
import { ProductTypes } from "@/constants/productTypes";
import { RELATIONSHIPS } from "@/constants/relationships";
import { RouteParam } from "@/constants/routeNavigationConstants";
import { HapticButton } from "./basic components/hapticButton";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function GiftFinder() {
  const navigation = useNavigation<NavigationProp<RouteParam>>();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRelationship, setSelectedRelationship] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([5000, 50000]);

  const [openDropdown, setOpenDropdown] = useState<
    "category" | "relationship" | "occasion" | "price" | null
  >(null);

  const categories = ProductTypes;
  const relationships = RELATIONSHIPS;
  const occasions = OCCASIONS;

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
      "Aunt",
    ];

    if (
      maleRelationships.some((rel) =>
        relationship.toLowerCase().includes(rel.toLowerCase()),
      )
    )
      return "Male";
    if (
      femaleRelationships.some((rel) =>
        relationship.toLowerCase().includes(rel.toLowerCase()),
      )
    )
      return "Female";
    return "Unisex";
  };

  const handleStartLooking = () => {
    const gender = getGenderFromRelationship(selectedRelationship);
    router.push({
      pathname: "/product-list",
      params: {
        categoryId: selectedCategory,
        gender: gender,
        occasion: selectedOccasion,
        productType: selectedCategory,
      },
    });
  };

  const renderDropdown = (
    label: string,
    value: string,
    type: "category" | "relationship" | "occasion" | "price",
  ) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label}</Text>
      <HapticButton
        style={styles.dropdown}
        onPress={() => setOpenDropdown(type)}
      >
        <Text style={styles.dropdownText}>
          {value !== "" ? value : `Choose ${label}`}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#1D3D47" />
      </HapticButton>
    </View>
  );

  const renderListModal = (
    type: "category" | "relationship" | "occasion",
    data: string[],
    setter: any,
  ) => (
    <Modal
      isVisible={openDropdown === type}
      onBackdropPress={() => setOpenDropdown(null)}
      backdropOpacity={0.4}
    >
      <View style={styles.modalBox}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((item) => (
            <HapticButton
              key={item}
              style={styles.modalItem}
              onPress={() => {
                setter(item);
                setOpenDropdown(null);
              }}
            >
              <Text style={styles.modalItemText}>{item}</Text>
            </HapticButton>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.wrapper}>
      {/* Top Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Image
            source={require("../assets/images/icon.png")}
            style={{ width: 80, height: 80, borderRadius: 50 }}
          />
        </View>
      </View>

      <Text style={styles.title}>Not sure what to gift?</Text>
      <Text style={styles.subtitle}>
        Let{" "}
        <Text
          style={{ fontWeight: "bold", fontStyle: "italic", color: "#FFFFFF" }}
        >
          Zeywar Ai
        </Text>{" "}
        help you
      </Text>

      <View style={styles.mainCard}>
        {renderDropdown("I am looking for...", selectedCategory, "category")}
        {renderDropdown(
          "within",
          `₹${priceRange[0]} - ₹${priceRange[1]}`,
          "price",
        )}
        {renderDropdown("for my", selectedRelationship, "relationship")}
        {renderDropdown("on the occasion of", selectedOccasion, "occasion")}

        <HapticButton style={styles.submitButton} onPress={handleStartLooking}>
          <Text style={styles.buttonText}>Start looking</Text>
          <Ionicons name="sparkles-outline" size={18} color="#053844" />
        </HapticButton>
      </View>

      {renderListModal("category", categories, setSelectedCategory)}
      {renderListModal("relationship", relationships, setSelectedRelationship)}
      {renderListModal("occasion", occasions, setSelectedOccasion)}

      {/* PRICE RANGE MODAL */}
      <Modal
        isVisible={openDropdown === "price"}
        onBackdropPress={() => setOpenDropdown(null)}
      >
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Select Price Range</Text>
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <MultiSlider
              sliderLength={SCREEN_WIDTH - 120}
              values={[priceRange[0], priceRange[1]]}
              min={500}
              max={200000}
              step={500}
              onValuesChange={(values) =>
                setPriceRange(values as [number, number])
              }
              selectedStyle={{ backgroundColor: "#1D3D47" }}
              markerStyle={{
                backgroundColor: "#1D3D47",
                height: 24,
                width: 24,
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
    backgroundColor: "#053844",
  },
  logoContainer: {
    backgroundColor: "#053844",
    height: 160,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0A4D5C",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 25,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  mainCard: {
    backgroundColor: "#053844",
    flex: 1,
    marginHorizontal: 10,
    marginBottom: -20,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingHorizontal: 35,
    paddingTop: 40,
  },
  dropdownContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 30,
    height: 50,
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "transparent",
  },
  dropdownText: {
    fontSize: 15,
    color: "#1D3D47",
  },
  submitButton: {
    backgroundColor: "#FFFFFF",
    height: 48,
    borderRadius: 30,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 30,
    alignSelf: "center",
  },
  buttonText: {
    color: "#053844",
    fontSize: 16,
    fontWeight: "600",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 25,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1D3D47",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1D3D47",
    textAlign: "center",
  },
});
