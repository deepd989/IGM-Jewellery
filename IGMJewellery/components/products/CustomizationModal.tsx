import { Product } from "@/interfaces/product.interface";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { HapticButton } from "../basic components/hapticButton";

interface CustomizationModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
}

const { height } = Dimensions.get("window");

// Size options matching Figma
const SIZES = [
  { id: "5", label: "Size 5", measurement: "40.8mm", available: false },
  { id: "7", label: "Size 7", measurement: "42.8mm", available: true },
  {
    id: "11",
    label: "Size 11",
    measurement: "44.8mm",
    available: true,
    recommended: true,
  },
  { id: "13", label: "Size 13", measurement: "46.8mm", available: true },
  { id: "15", label: "Size 15", measurement: "48.8mm", available: false },
];

const METAL_COLORS = [
  {
    id: "yellow-14kt",
    label: "Yellow Gold",
    purity: "14 KT",
    status: "Ready to ship",
  },
  {
    id: "yellow-18kt",
    label: "Yellow Gold",
    purity: "18 KT",
    status: "Made to order",
  },
  {
    id: "yellow-18kt-2",
    label: "Yellow Gold",
    purity: "18 KT",
    status: "Ready to ship",
  },
  {
    id: "yellow-18kt-3",
    label: "Yellow Gold",
    purity: "18 KT",
    status: "Ready to ship",
  },
];

const PURITIES = [
  { id: "14KT", label: "14 KT" },
  { id: "18KT", label: "18 KT" },
  { id: "22KT", label: "22 KT" },
];

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  visible,
  onClose,
  product,
}) => {
  const [selectedSize, setSelectedSize] = useState("11");
  const [selectedMetal, setSelectedMetal] = useState("yellow-14kt");
  const [selectedPurity, setSelectedPurity] = useState("18KT");

  const currentSize = SIZES.find((s) => s.id === selectedSize);
  const estimatedPrice = 22000;
  const additionalCost = 2000;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <HapticButton onPress={onClose} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={COLORS.text} />
            </HapticButton>
            <Text style={styles.headerTitle}>Configuration</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Size Selection with Ring Visual */}
            <View style={styles.sizeSection}>
              <View style={styles.sizeSectionHeader}>
                <Text style={styles.sectionTitle}>Select Size</Text>
                <HapticButton>
                  <Text style={styles.linkText}>View size guide</Text>
                </HapticButton>
              </View>

              {/* Ring Visual and Size Options Side by Side */}
              <View style={styles.sizeContentRow}>
                {/* Ring Visual - Left Side */}
                <View style={styles.ringContainer}>
                  <View style={styles.ringVisual}>
                    <View style={styles.ringOuter}>
                      <View style={styles.ringInner} />
                    </View>
                    <View style={styles.ringShadow} />
                  </View>
                </View>

                {/* Size Options - Right Side (Vertical) */}
                <View style={styles.sizeOptionsContainer}>
                  {SIZES.map((size) => {
                    const isSelected = size.id === selectedSize;

                    return (
                      <HapticButton
                        key={size.id}
                        style={[
                          styles.sizeOption,
                          isSelected && styles.sizeOptionSelected,
                          !size.available && styles.sizeOptionDisabled,
                        ]}
                        onPress={() =>
                          size.available && setSelectedSize(size.id)
                        }
                        disabled={!size.available}
                      >
                        {isSelected ? (
                          <View style={styles.sizeOptionCenter}>
                            <Text style={styles.sizeLabel}>{size.label}</Text>
                            <Text style={styles.sizeMeasurement}>
                              {size.measurement}
                            </Text>
                            {size.recommended && (
                              <View style={styles.statusBadge}>
                                <Text style={styles.statusBadgeText}>
                                  Ready to ship
                                </Text>
                              </View>
                            )}
                          </View>
                        ) : (
                          <Text
                            style={[
                              styles.sizeLabelSide,
                              !size.available && styles.sizeLabelDisabled,
                            ]}
                          >
                            {size.label}
                          </Text>
                        )}
                      </HapticButton>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Metal Color Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Metal Color</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.metalOptionsScroll}
              >
                {METAL_COLORS.map((metal) => {
                  const isSelected = metal.id === selectedMetal;
                  return (
                    <HapticButton
                      key={metal.id}
                      style={[
                        styles.metalOption,
                        isSelected && styles.metalOptionSelected,
                      ]}
                      onPress={() => setSelectedMetal(metal.id)}
                    >
                      <Text style={styles.metalPurity}>{metal.purity}</Text>
                      <Text style={styles.metalLabel}>{metal.label}</Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>
                          {metal.status}
                        </Text>
                      </View>
                    </HapticButton>
                  );
                })}
              </ScrollView>
            </View>

            {/* Gold Purity Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Gold Purity</Text>
              <View style={styles.purityRow}>
                {PURITIES.map((purity) => {
                  const isSelected = purity.id === selectedPurity;
                  return (
                    <HapticButton
                      key={purity.id}
                      style={[
                        styles.purityOption,
                        isSelected && styles.purityOptionSelected,
                      ]}
                      onPress={() => setSelectedPurity(purity.id)}
                    >
                      <Text
                        style={[
                          styles.purityText,
                          isSelected && styles.purityTextSelected,
                        ]}
                      >
                        {purity.label}
                      </Text>
                    </HapticButton>
                  );
                })}
              </View>
            </View>

            {/* Price Summary */}
            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Estimated price</Text>
                <Text style={styles.deliveryText}>Delivery by 20th Nov</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceAmount}>
                  ₹{estimatedPrice.toLocaleString()}
                </Text>
                <Text style={styles.additionalCost}>
                  (Additional ₹{additionalCost.toLocaleString()})
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Footer */}
          <View style={styles.footer}>
            <HapticButton style={styles.confirmBtn} onPress={onClose}>
              <Text style={styles.confirmBtnText}>CONFIRM CUSTOMIZATION</Text>
            </HapticButton>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    maxHeight: height * 0.95,
    height: height * 0.95,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.m,
    paddingTop: SPACING.l,
    backgroundColor: "#F5F5F5",
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Status badge (shared by size & metal sections)
  statusBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // Size Section
  sizeSection: {
    backgroundColor: "#F5F5F5",
    paddingBottom: SPACING.l,
  },
  sizeSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  linkText: {
    fontSize: 12,
    color: COLORS.text,
    textDecorationLine: "underline",
  },
  sizeContentRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.m,
    gap: SPACING.m,
  },
  ringContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.l,
  },
  ringVisual: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  ringOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 12,
    borderColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "#FFFFFF",
  },
  ringInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "transparent",
  },
  ringShadow: {
    position: "absolute",
    bottom: -10,
    width: 80,
    height: 10,
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  sizeOptionsContainer: {
    flex: 1,
    gap: SPACING.s,
  },
  sizeOption: {
    padding: SPACING.m,
    alignItems: "flex-start",
    justifyContent: "center",
    minHeight: 50,
  },
  sizeOptionSelected: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.text,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sizeOptionDisabled: {
    opacity: 0.3,
  },
  sizeOptionCenter: {
    alignItems: "flex-start",
  },
  sizeLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  sizeLabelSide: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sizeLabelDisabled: {
    textDecorationLine: "line-through",
  },
  sizeMeasurement: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },

  // Metal Color Section
  section: {
    padding: SPACING.m,
    backgroundColor: "#FFFFFF",
  },
  metalOptionsScroll: {
    paddingTop: SPACING.m,
    gap: SPACING.m,
  },
  metalOption: {
    width: 100,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    alignItems: "center",
  },
  metalOptionSelected: {
    borderColor: COLORS.text,
    borderWidth: 2,
    backgroundColor: "#FAFAFA",
  },
  metalPurity: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  metalLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  // Purity Section
  purityRow: {
    flexDirection: "row",
    gap: SPACING.m,
    marginTop: SPACING.m,
  },
  purityOption: {
    flex: 1,
    paddingVertical: SPACING.m,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    alignItems: "center",
  },
  purityOptionSelected: {
    borderColor: COLORS.text,
    borderWidth: 2,
    backgroundColor: "#FAFAFA",
  },
  purityText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  purityTextSelected: {
    color: COLORS.text,
    fontWeight: "700",
  },

  // Price Section
  priceSection: {
    padding: SPACING.m,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  priceLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  deliveryText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  additionalCost: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.m,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
