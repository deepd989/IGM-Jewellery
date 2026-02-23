import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";

import { OccasionEnum } from "@/constants/occasions";
import { RELATIONSHIPS } from "@/constants/relationships";
import { RouteParam } from "@/constants/routeNavigationConstants";
import { HapticButton } from "./basic components/hapticButton";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function GiftFinder() {
  const navigation = useNavigation<NavigationProp<RouteParam>>();
  const router = useRouter();

  // State for selections
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRelationship, setSelectedRelationship] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    5000, 500000,
  ]);

  // State for controlling which modal is open
  const [openDropdown, setOpenDropdown] = useState<
    "category" | "relationship" | "occasion" | "price" | null
  >(null);

  const categories = [
    "Rings",
    "Earrings",
    "Bangles",
    "Bracelets",
    "Necklaces",
    "Mangalsutras",
  ];
  const relationships = RELATIONSHIPS;
  const occasions = [
    OccasionEnum.Dhanteras,
    OccasionEnum.Tritiya,
    OccasionEnum.KarwaChauth,
    OccasionEnum.DailyWear,
    OccasionEnum.OfficeWear,
    OccasionEnum.PartyWear,
  ];

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
        relationship.toLowerCase().includes(rel.toLowerCase())
      )
    )
      return "Male";
    if (
      femaleRelationships.some((rel) =>
        relationship.toLowerCase().includes(rel.toLowerCase())
      )
    )
      return "Female";
    return "Unisex";
  };

  const handleStartLooking = () => {
    const gender = getGenderFromRelationship(selectedRelationship);
    router.push({
      pathname: "/exploreAi",
      params: {
        value: `I'm looking for a piece of ${selectedCategory} for ${selectedRelationship}. It's to celebrate ${selectedOccasion}, and my budget is around ${priceRange}. Could you show me some options that would be a good fit?`,
      },
    });
  };

  // Helper to render the triggers (buttons) inside the dark card
  const renderDropdownTrigger = (
    label: string,
    value: string,
    type: "category" | "relationship" | "occasion" | "price"
  ) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label}</Text>
      <HapticButton
        style={styles.dropdown}
        onPress={() => setOpenDropdown(type)}
      >
        <Text style={styles.dropdownText}>
          {value !== ""
            ? value
            : `Choose ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#1D3D47" />
      </HapticButton>
    </View>
  );

  // Helper to render the selection modals
  const renderListModal = (
    type: "category" | "relationship" | "occasion",
    data: string[],
    currentValue: string,
    setter: (val: string) => void
  ) => (
    <Modal
      isVisible={openDropdown === type}
      onBackdropPress={() => setOpenDropdown(null)}
      onBackButtonPress={() => setOpenDropdown(null)}
      backdropOpacity={0.5}
      useNativeDriverForBackdrop
      style={styles.modalMargin}
    >
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>Select {type}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((item) => (
            <HapticButton
              key={item}
              style={[
                styles.modalItem,
                currentValue === item && styles.modalItemSelected,
              ]}
              onPress={() => {
                setter(item);
                setOpenDropdown(null);
              }}
            >
              <Text
                style={[
                  styles.modalItemText,
                  currentValue === item && styles.modalItemTextSelected,
                ]}
              >
                {item}
              </Text>
            </HapticButton>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/icon.png")}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>Not sure what to gift?</Text>
          <Text style={styles.subtitle}>
            Let <Text style={styles.brandText}>Elanzia Ai</Text> help you
          </Text>
        </View>

        {/* THE VISUAL CARD FROM YOUR IMAGE */}
        <View style={styles.mainCard}>
          {renderDropdownTrigger(
            "I am looking for...",
            selectedCategory,
            "category"
          )}

          {renderDropdownTrigger(
            "within",
            `₹${priceRange[0]} - ₹${priceRange[1]}`,
            "price"
          )}

          {renderDropdownTrigger(
            "for my",
            selectedRelationship,
            "relationship"
          )}

          {renderDropdownTrigger(
            "on the occasion of",
            selectedOccasion,
            "occasion"
          )}

          <HapticButton
            style={styles.submitButton}
            onPress={handleStartLooking}
          >
            <Text style={styles.buttonText}>Start looking</Text>
            <Ionicons name="sparkles-outline" size={20} color="#1D3D47" />
          </HapticButton>
        </View>
      </ScrollView>

      {/* SELECTION MODALS */}
      {renderListModal(
        "category",
        categories,
        selectedCategory,
        setSelectedCategory
      )}
      {renderListModal(
        "relationship",
        relationships,
        selectedRelationship,
        setSelectedRelationship
      )}
      {renderListModal(
        "occasion",
        occasions,
        selectedOccasion,
        setSelectedOccasion
      )}

      {/* PRICE RANGE MODAL */}
      <Modal
        isVisible={openDropdown === "price"}
        onBackdropPress={() => setOpenDropdown(null)}
        style={styles.modalMargin}
      >
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Select Price Range</Text>
          <View style={{ alignItems: "center", paddingVertical: 30 }}>
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
              unselectedStyle={{ backgroundColor: "#E0E0E0" }}
              markerStyle={styles.sliderMarker}
            />
          </View>
          <Text style={styles.priceText}>
            ₹{priceRange[0].toLocaleString()} — ₹
            {priceRange[1].toLocaleString()}
          </Text>
          <HapticButton
            style={styles.modalCloseButton}
            onPress={() => setOpenDropdown(null)}
          >
            <Text style={styles.modalCloseButtonText}>Apply</Text>
          </HapticButton>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  logoContainer: {
    paddingTop: 40,
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    marginBottom: 25,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#163339",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  brandText: {
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#163339",
  },
  mainCard: {
    backgroundColor: "#163339",
    marginHorizontal: 15,
    paddingHorizontal: 30,
    paddingVertical: 50,
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 80,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  dropdownContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    color: "white",
    marginBottom: 8,
    opacity: 0.8,
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: 50,
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 15,
    color: "#1D3D47",
  },
  submitButton: {
    backgroundColor: "#FFFFFF",
    height: 55,
    borderRadius: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    gap: 10,
    width: 225,
  },
  buttonText: {
    color: "#1D3D47",
    fontSize: 18,
    fontWeight: "700",
  },
  /* MODAL STYLES */
  modalMargin: {
    margin: 20,
    justifyContent: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#163339",
    textAlign: "center",
    marginBottom: 15,
    textTransform: "capitalize",
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0",
  },
  modalItemSelected: {
    backgroundColor: "#F0F7F8",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  modalItemTextSelected: {
    color: "#163339",
    fontWeight: "bold",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D3D47",
    textAlign: "center",
    marginBottom: 20,
  },
  sliderMarker: {
    backgroundColor: "#1D3D47",
    height: 24,
    width: 24,
    borderRadius: 12,
  },
  modalCloseButton: {
    backgroundColor: "#163339",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
