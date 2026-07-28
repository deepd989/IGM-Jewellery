import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Product } from "@/interfaces/product.interface";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
  Dimensions,
  Image,
  LayoutAnimation,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  UIManager,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/** The white cap over the section: how far it reaches at the centre… */
const DOME_HEIGHT = 120;
/** …and at the screen edges. The gap between the two is the curve. */
const DOME_EDGE = 92;

const SIDE_PADDING = 16;
/** The accordions read as one stack, so they sit tighter than the sections. */
const CARD_GAP = 14;

const DETAILS_TAB = "Product Details";
const PRICE_TAB = "Price Breakdown";

const DETAILS_SECTION = "PRODUCT DETAILS";
const DESCRIPTION_SECTION = "PRODUCT DESCRIPTION";
const STORY_SECTION = "PRODUCT STORY";

const FALLBACK_DESCRIPTION =
  "Celebrate every day in style with the subtle grace of these drop earrings crafted in 22 Karat Yellow Gold in a leaf design.";

type InfoRow = { label: string; value: string };

/** One label/value line in the frosted table. */
const TableRow = ({ label, value }: InfoRow) => (
  <View style={styles.tableRow}>
    <Text style={styles.tableLabel}>{label}</Text>
    <Text style={styles.tableValue}>{value}</Text>
  </View>
);

/** A frosted card; the caller supplies whatever goes inside it. */
const GlassCard = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => (
  <View style={[styles.glassCard, style]}>
    <BlurView
      intensity={24}
      tint="dark"
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
    <View style={styles.glassFill} pointerEvents="none" />
    {children}
  </View>
);

type AccordionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
};

const Accordion = ({ title, isOpen, onToggle, children }: AccordionProps) => (
  <GlassCard>
    <HapticButton
      style={styles.accordionHeader}
      activeOpacity={0.8}
      onPress={onToggle}
    >
      <Text style={styles.accordionTitle}>{title}</Text>
      <Ionicons
        name={isOpen ? "chevron-up" : "chevron-down"}
        size={26}
        color="#FFFFFF"
      />
    </HapticButton>

    {isOpen && (
      <>
        <View style={styles.divider} />
        <View style={styles.accordionBody}>{children}</View>
      </>
    )}
  </GlassCard>
);

type LuxuryKnowYourProductProps = {
  product: Product;
  /** Blurred backdrop; defaults to the product's own artwork. */
  imageUri?: string;
  onKnowMore?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * "Know Your Product": the specification accordions and the price breakdown,
 * set on frosted cards over the blurred artwork. Reads the same resolved
 * attributes as components/products/ProductAccordion.tsx.
 */
export default function LuxuryKnowYourProduct({
  product,
  imageUri,
  onKnowMore,
  style,
}: LuxuryKnowYourProductProps) {
  const [activeTab, setActiveTab] = useState(DETAILS_TAB);
  // Everything starts expanded; each header closes only its own section.
  const [openSections, setOpenSections] = useState<string[]>([
    DETAILS_SECTION,
    DESCRIPTION_SECTION,
    STORY_SECTION,
  ]);

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSections((current) =>
      current.includes(section)
        ? current.filter((open) => open !== section)
        : [...current, section]
    );
  };

  const selectTab = (tab: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  const d = product.productDetails || {};

  // e.g. "14K White Gold" — the same composition the classic accordion uses.
  const metalLabel = [d.metalPurity, d.metalColor, d.metalType]
    .filter(Boolean)
    .join(" ");
  const netWeight = d.netWeight || d.grossWeight;
  const approxDimension =
    d.height && d.width
      ? `${parseFloat(d.height)} × ${parseFloat(d.width)} mm`
      : undefined;

  // Gemstone products lead with the stone; everything else with the diamonds.
  const hasGemstone = !!d.stoneType;
  const stoneLabel = [d.diamondShape, d.stoneType].filter(Boolean).join(" ");

  const infoTitle = hasGemstone
    ? "1. GEMSTONE INFORMATION"
    : "1. DIAMOND INFORMATION";

  const infoRows = (
    hasGemstone
      ? [
          { label: `No. of ${stoneLabel || "Stones"}`, value: d.diamondCount },
          { label: "Approximate Dimension", value: approxDimension },
          { label: "Approximate Tot Carat Weight", value: d.diamondWeight },
          { label: "Quality Grade", value: d.diamondClarity },
          { label: "Setting Type", value: d.diamondSettingType?.toUpperCase() },
        ]
      : [
          {
            label: `No. of ${
              d.diamondShape ? `${d.diamondShape.toLowerCase()} diamonds` : "diamonds"
            }`,
            value: d.diamondCount,
          },
          { label: "Natural Diamond Tot Weight", value: d.diamondWeight },
          { label: "Quality Grade", value: d.diamondClarity },
          { label: "Color Grade", value: d.diamondColor },
          { label: "Setting Type", value: d.diamondSettingType?.toUpperCase() },
        ]
  ).filter((row) => !!row.value) as InfoRow[];

  const discount = product.givenPrice - product.discountedPrice;
  const priceRows: InfoRow[] = [
    { label: "Product Price", value: `₹${product.givenPrice.toLocaleString()}` },
    ...(discount > 0
      ? [{ label: "Discount", value: `− ₹${discount.toLocaleString()}` }]
      : []),
    {
      label: "Grand Total",
      value: `₹${product.discountedPrice.toLocaleString()}`,
    },
  ];

  return (
    <View style={[styles.container, style]}>
      {!!imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.backdrop}
          resizeMode="cover"
          blurRadius={14}
        />
      )}
      <View style={styles.backdropScrim} pointerEvents="none" />

      <View style={styles.dome}>
        <Svg
          width={SCREEN_WIDTH}
          height={DOME_HEIGHT}
          style={StyleSheet.absoluteFill}
        >
          {/* Square across the top, bowing down to DOME_HEIGHT at the centre. */}
          <Path
            d={`M0 0 H${SCREEN_WIDTH} V${DOME_EDGE} Q${SCREEN_WIDTH / 2} ${
              2 * DOME_HEIGHT - DOME_EDGE
            } 0 ${DOME_EDGE} Z`}
            fill="#FFFFFF"
          />
        </Svg>

        <Text style={styles.domeTitle}>Know Your Product</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.tabs}>
          {[DETAILS_TAB, PRICE_TAB].map((tab) => {
            const isActive = tab === activeTab;

            return (
              <HapticButton
                key={tab}
                style={[styles.tab, isActive && styles.tabActive]}
                activeOpacity={0.8}
                onPress={() => selectTab(tab)}
              >
                {isActive && (
                  <BlurView
                    intensity={22}
                    tint="dark"
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                  />
                )}
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab}
                </Text>
              </HapticButton>
            );
          })}
        </View>

        {activeTab === DETAILS_TAB ? (
          <View style={styles.cards}>
            <Accordion
              title={DETAILS_SECTION}
              isOpen={openSections.includes(DETAILS_SECTION)}
              onToggle={() => toggleSection(DETAILS_SECTION)}
            >
              <Text style={styles.detailLine}>SKU {product.sku || "N/A"}</Text>
              {!!metalLabel && (
                <Text style={styles.detailLine}>Metal Purity: {metalLabel}</Text>
              )}
              {!!netWeight && (
                <Text style={styles.detailLine}>
                  Metal Net Weight: {netWeight}
                </Text>
              )}

              {!!d.certOrg && (
                <View style={styles.certPill}>
                  <Text style={styles.certText}>
                    Certificate of Authenticity
                  </Text>
                </View>
              )}

              {infoRows.length > 0 && (
                <>
                  <View style={styles.infoHeader}>
                    <Text style={styles.infoTitle}>{infoTitle}</Text>
                    <HapticButton activeOpacity={0.7} onPress={onKnowMore}>
                      <Text style={styles.knowMore}>Know More</Text>
                    </HapticButton>
                  </View>

                  <View style={styles.table}>
                    {infoRows.map((row) => (
                      <TableRow
                        key={row.label}
                        label={row.label}
                        value={row.value}
                      />
                    ))}
                  </View>
                </>
              )}
            </Accordion>

            <Accordion
              title={DESCRIPTION_SECTION}
              isOpen={openSections.includes(DESCRIPTION_SECTION)}
              onToggle={() => toggleSection(DESCRIPTION_SECTION)}
            >
              <Text style={styles.bodyText}>
                {product.description || FALLBACK_DESCRIPTION}
              </Text>
            </Accordion>

            <Accordion
              title={STORY_SECTION}
              isOpen={openSections.includes(STORY_SECTION)}
              onToggle={() => toggleSection(STORY_SECTION)}
            >
              <Text style={styles.bodyText}>
                {product.description || FALLBACK_DESCRIPTION}
              </Text>
            </Accordion>
          </View>
        ) : (
          <View style={styles.cards}>
            <GlassCard>
              <View style={styles.accordionBody}>
                <View style={styles.table}>
                  {priceRows.map((row) => (
                    <TableRow
                      key={row.label}
                      label={row.label}
                      value={row.value}
                    />
                  ))}
                </View>
                <Text style={styles.taxNote}>(tax inclusive)</Text>
              </View>
            </GlassCard>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    backgroundColor: "#0A1A1F",
  },
  backdrop: StyleSheet.absoluteFillObject,
  backdropScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 22, 26, 0.35)",
  },

  // ── White cap ──
  dome: {
    height: DOME_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    // Sits the title above the dip rather than across it.
    paddingBottom: 16,
  },
  domeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },

  content: {
    paddingHorizontal: SIDE_PADDING,
    paddingTop: LUXURY_SPACING,
    paddingBottom: LUXURY_SPACING,
  },

  // ── Tabs ──
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tab: {
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tabActive: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(30, 46, 50, 0.35)",
  },
  tabText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  tabTextActive: {
    fontWeight: "700",
  },

  // ── Cards ──
  cards: {
    marginTop: LUXURY_SPACING / 2,
    gap: CARD_GAP,
  },
  glassCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  glassFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20, 34, 38, 0.35)",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  accordionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  accordionBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  detailLine: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(255,255,255,0.9)",
  },
  certPill: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  certText: {
    fontSize: 13,
    color: "#FFFFFF",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
  },
  infoTitle: {
    flexShrink: 1,
    fontSize: 14,
    color: "#FFFFFF",
  },
  knowMore: {
    fontSize: 14,
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },

  // ── Frosted table ──
  table: {
    marginTop: 6,
    padding: 18,
    borderRadius: 16,
    gap: 18,
    backgroundColor: "rgba(233, 237, 237, 0.92)",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tableLabel: {
    flex: 1.15,
    fontSize: 13,
    color: COLORS.primary,
  },
  tableValue: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primary,
  },
  taxNote: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },
});
