import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Truck } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Clipboard,
  Dimensions,
  FlatList,
  Image,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SIDE_PADDING = 16;
const GAP = 12;
/** One card plus a sliver of the next, so the row reads as scrollable. */
const CARDS_PER_VIEW = 1.08;

const CARD_HEIGHT = 210;
/** The ticket's tear-off stub. */
const STUB_WIDTH = 92;
/** Vertical run the rotated stub label is allowed to fill. */
const STUB_LABEL_LENGTH = 130;
const NOTCH_SIZE = 26;

const BODY_BG = "#F8F8F6";
const MUTED = "#9A9A9A";
const CODE_TEAL = "#2F6B62";

/** How long the button stays on "Copied" after a tap. */
const COPIED_FEEDBACK_MS = 2000;

export type LuxuryDiscount = {
  id: string;
  /** Large label on the stub, set vertically. */
  stubLabel: string;
  /** Small horizontal caption under it, e.g. "OFF". */
  stubCaption?: string;
  /** Drawn above the stub label. */
  icon?: "truck";
  /** Corner flag, e.g. "NEW". */
  badge?: string;
  /** Darker stub for the non-percentage offers. */
  dark?: boolean;
  issuer: string;
  title: string;
  description: string;
  code: string;
  expiry: string;
};

/** Placeholder offers until the promotions API is wired up. */
const DUMMY_DISCOUNTS: LuxuryDiscount[] = [
  {
    id: "icici",
    stubLabel: "40%",
    stubCaption: "OFF",
    badge: "NEW",
    issuer: "ICICI Bank",
    title: "Upto 30% Off",
    description: "On ICICI Credit cards",
    code: "FLASH40",
    expiry: "Ends tonight",
  },
  {
    id: "shipping",
    stubLabel: "Free Ship",
    icon: "truck",
    dark: true,
    issuer: "Free Shipping",
    title: "No Delivery Fee",
    description: "On orders above ₹5,000",
    code: "SHIPFREE",
    expiry: "Ends in 2 days",
  },
  {
    id: "hdfc",
    stubLabel: "₹2K",
    stubCaption: "OFF",
    issuer: "HDFC Bank",
    title: "Flat ₹2,000 Off",
    description: "On HDFC Credit cards",
    code: "HDFC2K",
    expiry: "Ends 30 Nov",
  },
  {
    id: "welcome",
    stubLabel: "10%",
    stubCaption: "OFF",
    badge: "NEW",
    issuer: "First Order",
    title: "Extra 10% Off",
    description: "On your first purchase",
    code: "WELCOME10",
    expiry: "Limited period",
  },
];

type LuxuryDiscountsProps = {
  title?: string;
  /** Defaults to the placeholder offers above. */
  discounts?: LuxuryDiscount[];
  /** Blurred backdrop; defaults to the product's own artwork. */
  imageUri?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * The offers rail: coupon tickets over a blurred backdrop, each with a code the
 * shopper can copy to the clipboard in one tap.
 */
export default function LuxuryDiscounts({
  title = "Offers & Benefits",
  discounts = DUMMY_DISCOUNTS,
  imageUri,
  style,
}: LuxuryDiscountsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // Measured so the cards fit the space this component is actually given.
  const [rowWidth, setRowWidth] = useState(SCREEN_WIDTH - SIDE_PADDING * 2);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== rowWidth) {
      setRowWidth(width);
    }
  };

  const cardWidth = Math.round(
    (rowWidth - GAP * (CARDS_PER_VIEW - 1)) / CARDS_PER_VIEW
  );
  const snapInterval = cardWidth + GAP;

  const handleCopy = (discount: LuxuryDiscount) => {
    Clipboard.setString(discount.code);
    setCopiedId(discount.id);

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(
      () => setCopiedId(null),
      COPIED_FEEDBACK_MS
    );
  };

  const renderCard = ({ item }: { item: LuxuryDiscount }) => {
    const isCopied = copiedId === item.id;

    return (
      <View style={[styles.card, { width: cardWidth }]}>
        <View style={[styles.stub, item.dark && styles.stubDark]}>
          {!!item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}

          <View style={styles.stubCenter}>
            {item.icon === "truck" && (
              <Truck size={26} color="#FFFFFF" strokeWidth={2} />
            )}

            {/* The box reserves the vertical run the rotated label fills. */}
            <View style={styles.stubLabelBox}>
              <Text style={styles.stubLabel} numberOfLines={1}>
                {item.stubLabel}
              </Text>
            </View>

            {!!item.stubCaption && (
              <Text style={styles.stubCaption}>{item.stubCaption}</Text>
            )}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.issuerChip}>
            <Text style={styles.issuerText}>{item.issuer.toUpperCase()}</Text>
          </View>

          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>

          <View style={styles.codeRow}>
            <View style={styles.codePill}>
              <Text style={styles.codeText}>{item.code}</Text>
            </View>

            <HapticButton
              style={styles.copyButton}
              activeOpacity={0.85}
              onPress={() => handleCopy(item)}
            >
              <Ionicons
                name={isCopied ? "checkmark" : "copy-outline"}
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.copyText}>
                {isCopied ? "Copied" : "Copy"}
              </Text>
            </HapticButton>
          </View>

          <Text style={styles.expiry}>{item.expiry}</Text>
        </View>

        {/* Perforation between the stub and the body. */}
        <View style={styles.notch} pointerEvents="none" />
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {!!imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.backdrop}
          resizeMode="cover"
          blurRadius={18}
        />
      )}
      <View style={styles.backdropScrim} pointerEvents="none" />

      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>

      <View onLayout={handleLayout} style={styles.row}>
        <FlatList
          data={discounts}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          extraData={`${cardWidth}-${copiedId}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          // Only the cards near the viewport are mounted, so an off-screen
          // card holds no decoded artwork.
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={5}
          snapToInterval={snapInterval}
          snapToAlignment="start"
          disableIntervalMomentum // Never fling past a single card
          decelerationRate="fast"
          contentContainerStyle={styles.listContent}
          getItemLayout={(_, index) => ({
            length: snapInterval,
            offset: snapInterval * index,
            index,
          })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    paddingVertical: LUXURY_SPACING,
    paddingLeft: SIDE_PADDING,
    backgroundColor: "#0A1A1F",
  },
  backdrop: StyleSheet.absoluteFillObject,
  backdropScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 22, 26, 0.45)",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.5,
    // The title centres on the screen, not on the padded row.
    marginRight: SIDE_PADDING,
    marginBottom: LUXURY_SPACING,
  },
  row: {
    // Lets the peeking card run to the screen's edge.
    marginRight: -SIDE_PADDING,
  },
  listContent: {
    gap: GAP,
    paddingRight: SIDE_PADDING,
  },

  // ── Ticket ──
  card: {
    flexDirection: "row",
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: BODY_BG,
  },
  stub: {
    width: STUB_WIDTH,
    backgroundColor: "#4A8079",
  },
  stubDark: {
    backgroundColor: "#0F3B44",
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: 12,
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  stubCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingBottom: 14,
  },
  stubLabelBox: {
    width: 46,
    height: STUB_LABEL_LENGTH,
    alignItems: "center",
    justifyContent: "center",
  },
  stubLabel: {
    // Laid out along its own axis, then stood on end; the box above reserves
    // the space it visually occupies.
    width: STUB_LABEL_LENGTH,
    textAlign: "center",
    transform: [{ rotate: "-90deg" }],
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  stubCaption: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#FFFFFF",
  },
  body: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 18,
    justifyContent: "center",
    gap: 6,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#DCDCDC",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: BODY_BG,
  },
  notch: {
    position: "absolute",
    left: STUB_WIDTH - NOTCH_SIZE / 2,
    top: (CARD_HEIGHT - NOTCH_SIZE) / 2,
    width: NOTCH_SIZE,
    height: NOTCH_SIZE,
    borderRadius: NOTCH_SIZE / 2,
    backgroundColor: BODY_BG,
  },
  issuerChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#EDEDEA",
  },
  issuerText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: CODE_TEAL,
  },
  cardTitle: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  cardDescription: {
    fontSize: 14,
    color: MUTED,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  codePill: {
    flexShrink: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: CODE_TEAL,
  },
  codeText: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: CODE_TEAL,
  },
  copyButton: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#4A8079",
  },
  copyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  expiry: {
    marginTop: 6,
    fontSize: 14,
    color: MUTED,
  },
});
