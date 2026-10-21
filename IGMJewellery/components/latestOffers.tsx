import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Product } from "@/interfaces/product.interface";
import { useGetProductsQuery } from "@/store/apis/product";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowRight, Star } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SIDE_PADDING = 16;
const GRID_GAP = 10;
const CARD_RADIUS = 16;

/** The lead card and the stack beside it split the row between them. */
const LEAD_FLEX = 49;
const STACK_FLEX = 51;

/** How many offers the grid shows: one lead plus a stack of three. */
const OFFER_COUNT = 4;

/** The listing's own name for the order this section promises. */
const DISCOUNT_SORT = "Discount";

/** The panel is a light band on the storefront's dark ground. */
const PANEL = "#EDF3F5";

type Offer = {
  product: Product;
  /** "TBZ at", "All Earrings at" — whichever the product can name. */
  label: string;
  discount: number;
};

type LatestOffersProps = {
  style?: StyleProp<ViewStyle>;
};

/** "Earring" → "Earrings", but "Earrings" is left alone. */
const plural = (word: string) => (word.endsWith("s") ? word : `${word}s`);

const discountOf = (product: Product) => {
  const given = product.givenPrice ?? 0;
  const paid = product.discountedPrice ?? 0;
  if (given <= 0 || paid <= 0 || paid >= given) return 0;
  return Math.round(((given - paid) / given) * 100);
};

/** One offer tile: the piece, held back under its own caption. */
const OfferCard = ({
  offer,
  showBadge = false,
  style,
  onPress,
}: {
  offer: Offer;
  showBadge?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) => (
  <HapticButton style={[styles.card, style]} activeOpacity={0.9} onPress={onPress}>
    <Image
      source={{ uri: offer.product.thumbnailUrls?.[0] }}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      transition={200}
    />

    <LinearGradient
      colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.75)"]}
      locations={[0.45, 1]}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />

    {showBadge && (
      <View style={styles.badge}>
        <Star size={13} color="#FFFFFF" fill="#FFFFFF" />
        <Text style={styles.badgeText}>New Additions</Text>
      </View>
    )}

    <View style={styles.caption}>
      <View style={styles.captionText}>
        <Text style={styles.captionLabel} numberOfLines={1}>
          {offer.label}
        </Text>
        <Text style={styles.captionOffer} numberOfLines={1}>
          Upto {offer.discount} % Off
        </Text>
      </View>

      <ArrowRight size={22} color="#FFFFFF" strokeWidth={2.4} />
    </View>
  </HapticButton>
);

/**
 * The best-discounted pieces in the catalogue, as one lead tile and a stack of
 * three. Every tile opens the listing in the same order the section promises —
 * biggest discount first — narrowed to whatever that tile named.
 */
export default function LatestOffers({ style }: LatestOffersProps) {
  const router = useRouter();
  const { data: products = [] } = useGetProductsQuery({});

  // Measured so the grid fits the space this section is actually given, rather
  // than assuming the full screen width.
  const [gridWidth, setGridWidth] = useState(SCREEN_WIDTH - SIDE_PADDING * 2);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== gridWidth) setGridWidth(width);
  };

  const offers = useMemo<Offer[]>(() => {
    return products
      .map((product) => ({
        product,
        discount: discountOf(product),
        label: product.brand
          ? `${product.brand} at`
          : `All ${plural(product.productType ?? "Piece")} at`,
      }))
      .filter((offer) => offer.discount > 0)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, OFFER_COUNT);
  }, [products]);

  /** Opens the listing biggest-discount-first, narrowed to one tile's subject. */
  const openOffers = (offer?: Offer) => {
    router.navigate({
      pathname: "/product-list",
      params: {
        sort: DISCOUNT_SORT,
        ...(offer?.product.brand
          ? { brand: offer.product.brand.toLowerCase() }
          : offer?.product.productType
            ? { productType: offer.product.productType }
            : {}),
        ...(offer
          ? {
              bannerImageUrl: encodeURIComponent(
                offer.product.thumbnailUrls?.[0] ?? ""
              ),
            }
          : {}),
      },
    });
  };

  // Nothing is discounted, so there is no offer to make.
  if (offers.length < OFFER_COUNT) return null;

  const [lead, ...stack] = offers;
  // A square grid, as the lead tile is as tall as the three beside it.
  const gridHeight = gridWidth;
  const stackCardHeight = Math.round(
    (gridHeight - GRID_GAP * (stack.length - 1)) / stack.length
  );

  return (
    <View style={[styles.panel, style]}>
      <Text style={styles.title}>Latest Offers & Discounts</Text>

      <View
        style={[styles.grid, { height: gridHeight }]}
        onLayout={handleLayout}
      >
        <OfferCard
          offer={lead}
          showBadge
          style={styles.lead}
          onPress={() => openOffers(lead)}
        />

        <View style={styles.stack}>
          {stack.map((offer) => (
            <OfferCard
              key={offer.product.id}
              offer={offer}
              style={{ height: stackCardHeight }}
              onPress={() => openOffers(offer)}
            />
          ))}
        </View>
      </View>

      <HapticButton
        style={styles.actionWrapper}
        activeOpacity={0.85}
        onPress={() => openOffers()}
      >
        <LinearGradient
          colors={LUXURY_COLORS.gradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.action}
        >
          <Text style={styles.actionLabel}>View All Offers</Text>
          <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.4} />
        </LinearGradient>
      </HapticButton>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignSelf: "stretch",
    paddingVertical: LUXURY_SPACING / 2,
    paddingHorizontal: SIDE_PADDING,
    backgroundColor: PANEL,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.primary,
  },

  // ── Grid ──
  grid: {
    flexDirection: "row",
    gap: GRID_GAP,
    marginTop: LUXURY_SPACING / 2,
  },
  lead: {
    flex: LEAD_FLEX,
  },
  stack: {
    flex: STACK_FLEX,
    gap: GRID_GAP,
  },
  card: {
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: "#DCE6EA",
  },
  badge: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(20, 26, 28, 0.45)",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  caption: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    padding: 12,
  },
  captionText: {
    flex: 1,
  },
  captionLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },
  captionOffer: {
    marginTop: 2,
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // ── Action ──
  actionWrapper: {
    alignSelf: "center",
    marginTop: LUXURY_SPACING / 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    height: 56,
    paddingHorizontal: 40,
  },
  actionLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
