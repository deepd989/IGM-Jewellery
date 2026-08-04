import { HapticButton } from "@/components/basic components/hapticButton";
import { OccasionEnum } from "@/constants/occasions";
import { RELATIONSHIPS } from "@/constants/relationships";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Modal from "react-native-modal";

const SCREEN_WIDTH = Dimensions.get("window").width;

const CATEGORIES = [
  "Rings",
  "Earrings",
  "Bangles",
  "Bracelets",
  "Necklaces",
  "Mangalsutras",
];

const OCCASIONS = [
  OccasionEnum.Dhanteras,
  OccasionEnum.Tritiya,
  OccasionEnum.KarwaChauth,
  OccasionEnum.DailyWear,
  OccasionEnum.OfficeWear,
  OccasionEnum.PartyWear,
];

const DEFAULT_PRICE_RANGE: [number, number] = [5000, 500000];

type DropdownType = "category" | "relationship" | "occasion" | "price";

type LuxuryElanziaSearchProps = {
  title?: string;
  style?: ViewStyle;
};

export default function LuxuryElanziaSearch({
  title = "Not sure what to gift?",
  style,
}: LuxuryElanziaSearchProps) {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRelationship, setSelectedRelationship] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [priceRange, setPriceRange] =
    useState<[number, number]>(DEFAULT_PRICE_RANGE);
  // The range always has a value, so this is what tells the trigger whether to
  // show the placeholder or the picked band.
  const [hasPickedPrice, setHasPickedPrice] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<DropdownType | null>(null);

  const handleStartLooking = () => {
    router.navigate({
      pathname: "/exploreAi",
      params: {
        value: `I'm looking for a piece of ${selectedCategory} for ${selectedRelationship}. It's to celebrate ${selectedOccasion}, and my budget is around ${priceRange}. Could you show me some options that would be a good fit?`,
      },
    });
  };

  const renderDropdownTrigger = (
    label: string,
    value: string,
    placeholder: string,
    type: DropdownType
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <HapticButton
        style={styles.dropdown}
        onPress={() => setOpenDropdown(type)}
      >
        <Text style={styles.dropdownText} numberOfLines={1}>
          {value !== "" ? value : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#1D3D47" />
      </HapticButton>
    </View>
  );

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
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Let <Text style={styles.brandText}>Elanzia Ai</Text> help you
          </Text>
        </View>

        <View style={styles.cardWrapper}>
          <BlurView intensity={25} tint="light" style={styles.card}>
            {renderDropdownTrigger(
              "I am looking for...",
              selectedCategory,
              "Choose Category",
              "category"
            )}

            {renderDropdownTrigger(
              "within",
              hasPickedPrice
                ? `₹${priceRange[0].toLocaleString()} - ₹${priceRange[1].toLocaleString()}`
                : "",
              "Choose Price Range",
              "price"
            )}

            {renderDropdownTrigger(
              "for my",
              selectedRelationship,
              "Choose Relationship",
              "relationship"
            )}

            {renderDropdownTrigger(
              "on the occasion of",
              selectedOccasion,
              "Choose Occasion",
              "occasion"
            )}

            <HapticButton
              style={styles.submitButton}
              onPress={handleStartLooking}
            >
              <Text style={styles.submitText}>Start looking</Text>
              {/* Magnifier with a sparkle sitting on its shoulder */}
              <View style={styles.submitIcon}>
                <Ionicons name="search" size={20} color="#FFFFFF" />
                <Ionicons
                  name="sparkles"
                  size={10}
                  color="#FFFFFF"
                  style={styles.submitIconSparkle}
                />
              </View>
            </HapticButton>
          </BlurView>
        </View>
      </View>

      {/* SELECTION MODALS */}
      {renderListModal(
        "category",
        CATEGORIES,
        selectedCategory,
        setSelectedCategory
      )}
      {renderListModal(
        "relationship",
        RELATIONSHIPS,
        selectedRelationship,
        setSelectedRelationship
      )}
      {renderListModal(
        "occasion",
        OCCASIONS,
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
          <View style={styles.sliderRow}>
            <MultiSlider
              sliderLength={SCREEN_WIDTH - 120}
              values={[priceRange[0], priceRange[1]]}
              min={500}
              max={200000}
              step={500}
              onValuesChange={(values) => {
                setPriceRange(values as [number, number]);
                setHasPickedPrice(true);
              }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  // The page's own ground: the section used to sink a photograph behind its
  // card, and now carries none of its own.
  container: {
    alignSelf: "stretch",
    overflow: "hidden",
    backgroundColor: LUXURY_COLORS.primary,
  },
  // No vertical padding: the section grounds on the page's own colour now, so
  // an inset of its own only stacks onto the band's gap. The storefront's
  // rhythm lives in app/luxury/index.tsx's sectionBand.
  content: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: LUXURY_SPACING,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
  },
  brandText: {
    fontWeight: "700",
    fontStyle: "italic",
    color: "#FFFFFF",
  },
  cardWrapper: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    // Lifted from the 0.10 the artwork behind it called for: with a flat ground
    // under the blur there is nothing else to separate the card from the page.
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  field: {
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  dropdown: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "#FFFFFF",
  },
  dropdownText: {
    flexShrink: 1,
    fontSize: 16,
    color: "#1D3D47",
  },
  submitButton: {
    height: 52,
    borderRadius: 26,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  submitText: {
    fontSize: 17,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  submitIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  submitIconSparkle: {
    position: "absolute",
    top: -1,
    right: -3,
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
  sliderRow: {
    alignItems: "center",
    paddingVertical: 30,
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
