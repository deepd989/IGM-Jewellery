import { Product } from "@/interfaces/product.interface";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { getBrandKey } from "../../utils/brandKeyMap";
import { HapticButton } from "../basic components/hapticButton";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  product: Product;
}

// ─── Reusable info table row ───
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={styles.infoDivider} />
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

// ─── Accordion toggle ───
const AccordionItem = ({
  title,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <View style={styles.itemContainer}>
    <HapticButton style={styles.header} onPress={onToggle} activeOpacity={0.8}>
      <Text style={styles.headerText}>{title}</Text>
      <Ionicons
        name={isOpen ? "chevron-up" : "chevron-down"}
        size={20}
        color={COLORS.text}
      />
    </HapticButton>
    {isOpen && <View style={styles.content}>{children}</View>}
  </View>
);

export const ProductAccordion: React.FC<AccordionProps> = ({ product }) => {
  const [openSection, setOpenSection] = useState<string | null>(
    "PRODUCT DETAILS"
  );
  const router = useRouter();

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSection(openSection === section ? null : section);
  };

  const handleExploreBrand = () => {
    const brandKey = getBrandKey(product.brand);
    router.push(`/brandProfile/${brandKey}`);
  };

  // Extract product details with fallbacks
  const d = product.productDetails || {};

  // Build metal purity + type label  e.g. "18K White Gold"
  const metalLabel = [d.metalPurity, d.metalColor, d.metalType]
    .filter(Boolean)
    .join(" ");

  // Approximate dimension string  e.g. "16.97 × 5.42 mm"
  const approxDimension =
    d.height && d.width
      ? `${parseFloat(d.height)} × ${parseFloat(d.width)} mm`
      : undefined;

  // ─── Build gemstone rows (only if stoneType exists) ───
  const hasGemstone = !!d.stoneType;
  const gemstoneRows: { label: string; value: string }[] = [];
  if (hasGemstone) {
    // No. of <shape> <type>
    const stoneLabel = [d.diamondShape, d.stoneType].filter(Boolean).join(" ");
    if (d.diamondCount) {
      gemstoneRows.push({
        label: `No. of ${stoneLabel || "Stones"}`,
        value: d.diamondCount,
      });
    }
    if (approxDimension) {
      gemstoneRows.push({
        label: "Approximate Dimension",
        value: approxDimension,
      });
    }
    if (d.diamondWeight) {
      gemstoneRows.push({
        label: "Approximate Tot Carat Weight",
        value: d.diamondWeight,
      });
    }
    if (d.diamondClarity) {
      gemstoneRows.push({ label: "Quality Grade", value: d.diamondClarity });
    }
    if (d.diamondSettingType) {
      gemstoneRows.push({
        label: "Setting Type",
        value: d.diamondSettingType.toUpperCase(),
      });
    }
  }

  // ─── Build diamond rows (only if diamond info present) ───
  const hasDiamond = !!(d.diamondCount || d.diamondWeight);
  const diamondRows: { label: string; value: string }[] = [];
  if (hasDiamond) {
    const diamondLabel = d.diamondShape
      ? `${d.diamondShape.toLowerCase()} diamonds`
      : "diamonds";
    if (d.diamondCount) {
      diamondRows.push({
        label: `No. of ${diamondLabel}`,
        value: d.diamondCount,
      });
    }
    if (d.diamondWeight) {
      diamondRows.push({
        label: "Natural Diamond Tot Weight",
        value: d.diamondWeight,
      });
    }
    if (d.diamondClarity) {
      diamondRows.push({ label: "Quality Grade", value: d.diamondClarity });
    }
    if (d.diamondColor) {
      diamondRows.push({ label: "Color Grade", value: d.diamondColor });
    }
    if (d.diamondSettingType) {
      diamondRows.push({
        label: "Setting Type",
        value: d.diamondSettingType.toUpperCase(),
      });
    }
  }

  return (
    <View style={styles.container}>
      {/* Visual Menu Bar */}
      <View style={styles.menuBar}>
        <View style={styles.menuItem}>
          <Ionicons
            name="diamond-outline"
            size={24}
            color={COLORS.primary}
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Product Details</Text>
          <View style={styles.activeDot} />
        </View>
        <View style={[styles.menuItem, { opacity: 0.3 }]}>
          <Ionicons
            name="cash-outline"
            size={24}
            color={COLORS.primary}
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Price Breakdown</Text>
        </View>
      </View>

      {/* ══════════════ PRODUCT DETAILS ══════════════ */}
      <AccordionItem
        title="PRODUCT DETAILS"
        isOpen={openSection === "PRODUCT DETAILS"}
        onToggle={() => toggleSection("PRODUCT DETAILS")}
      >
        {/* SKU */}
        <Text style={styles.sku}>SKU {product.sku || "N/A"}</Text>

        {/* Metal summary */}
        {metalLabel ? (
          <Text style={styles.metalLine}>
            Metal Purity: {metalLabel}
          </Text>
        ) : null}
        {d.grossWeight ? (
          <Text style={styles.metalLine}>
            Metal Weight: {d.grossWeight}
          </Text>
        ) : null}

        {/* Certificate badge */}
        {d.certOrg ? (
          <View style={styles.certRow}>
            <Ionicons
              name="shield-checkmark"
              size={18}
              color={COLORS.primary}
            />
            <Text style={styles.certText}>
              Certificate of Authenticity ({d.certOrg})
            </Text>
          </View>
        ) : null}

        {/* ── GEMSTONE INFORMATION ── */}
        {hasGemstone && gemstoneRows.length > 0 && (
          <View style={styles.infoSection}>
            <View style={styles.infoSectionHeader}>
              <Text style={styles.infoSectionTitle}>
                1. GEMSTONE INFORMATION
              </Text>
              
            </View>
            <View style={styles.infoTable}>
              {gemstoneRows.map((row, i) => (
                <InfoRow key={i} label={row.label} value={row.value} />
              ))}
            </View>
          </View>
        )}

        {/* ── DIAMOND INFORMATION ── */}
        {hasDiamond && diamondRows.length > 0 && (
          <View style={styles.infoSection}>
            <View style={styles.infoSectionHeader}>
              <Text style={styles.infoSectionTitle}>
                {hasGemstone ? "2." : "1."} DIAMOND INFORMATION
              </Text>
              
            </View>
            <View style={styles.infoTable}>
              {diamondRows.map((row, i) => (
                <InfoRow key={i} label={row.label} value={row.value} />
              ))}
            </View>
          </View>
        )}
      </AccordionItem>

      {/* ══════════════ DESCRIPTION ══════════════ */}
      <AccordionItem
        title="DESCRIPTION"
        isOpen={openSection === "DESCRIPTION"}
        onToggle={() => toggleSection("DESCRIPTION")}
      >
        <Text style={styles.descriptionTitle}>
          {product.productType} {product.name}, {product.brand}
        </Text>
        <Text style={styles.descriptionText}>
          {product.description ||
            "Celebrate every day in style with the subtle grace of these drop earrings crafted in 22 Karat Yellow Gold in a leaf design."}
        </Text>
      </AccordionItem>

      {/* ══════════════ PRODUCT STORY ══════════════ */}
      <AccordionItem
        title="PRODUCT STORY"
        isOpen={openSection === "PRODUCT STORY"}
        onToggle={() => toggleSection("PRODUCT STORY")}
      >
        <View style={styles.storyContent}>
          <Text style={styles.storyDesc}>
            {product.description ||
              "Celebrate every day in style with the subtle grace of these drop earrings crafted in 22 Karat Yellow Gold in a leaf design."}
          </Text>

          <View style={styles.storyFeatures}>
            <Text style={styles.storyFeaturesText}>
              100% Certified
            </Text>
            <Text style={styles.storyFeaturesDivider}>|</Text>
            <Text style={styles.storyFeaturesText}>
              15 Days return
            </Text>
            <Text style={styles.storyFeaturesDivider}>|</Text>
            <Text style={styles.storyFeaturesText}>
              1 year Warranty
            </Text>
          </View>

          <View style={styles.storyBrandBox}>
            <View style={styles.placeholderLogo} />
            <Text style={styles.storyTitle}>
              ABOUT {product.brand.toUpperCase()}
            </Text>
            <Text style={styles.storyDescAlt}>
              {product.description ||
                "Celebrate every day in style with the subtle grace of these drop earrings crafted in 22 Karat Yellow Gold in a leaf design."}
            </Text>
            <HapticButton
              style={styles.exploreBtn}
              onPress={handleExploreBrand}
            >
              <Text style={styles.exploreBtnText}>Explore Brand</Text>
              <Ionicons name="chevron-forward" size={14} color="#FFF" />
            </HapticButton>
          </View>
        </View>
      </AccordionItem>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 8,
    borderTopColor: "#F9F9F9",
  },

  // ── Menu Bar ──
  menuBar: {
    flexDirection: "row",
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  menuIcon: {
    marginBottom: 8,
  },
  menuText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "600",
  },
  activeDot: {
    position: "absolute",
    bottom: -SPACING.s - 1,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: "#FFF",
    transform: [{ rotate: "45deg" }],
    zIndex: 10,
  },

  // ── Accordion general ──
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.m,
    backgroundColor: "#FFFFFF",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    textTransform: "uppercase",
  },
  content: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
  },

  // ── Product Details ──
  sku: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  metalLine: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  certRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.s,
    marginBottom: SPACING.m,
    gap: 8,
  },
  certText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "500",
    textDecorationLine: "underline",
  },

  // ── Info sections (Gemstone / Diamond) ──
  infoSection: {
    marginTop: SPACING.m,
  },
  infoSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.s,
  },
  infoSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },
  knowMore: {
    fontSize: 13,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  infoTable: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  infoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    minHeight: 44,
  },
  infoLabel: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#FAFAFA",
  },
  infoDivider: {
    width: 1,
    backgroundColor: "#F0F0F0",
  },
  infoValue: {
    flex: 0.7,
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  // ── Description ──
  descriptionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // ── Product Story ──
  storyContent: {
    alignItems: "center",
  },
  storyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.m,
  },
  storyFeatures: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: SPACING.m,
  },
  storyFeaturesText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  storyFeaturesDivider: {
    fontSize: 12,
    color: COLORS.primary,
    marginHorizontal: 8,
    fontWeight: "400",
  },
  storyBrandBox: {
    alignItems: "center",
    paddingHorizontal: SPACING.m,
  },
  placeholderLogo: {
    width: 60,
    height: 60,
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
    marginBottom: SPACING.m,
  },
  storyTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: SPACING.s,
    textTransform: "uppercase",
  },
  storyDescAlt: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: SPACING.m,
  },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  exploreBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
});
