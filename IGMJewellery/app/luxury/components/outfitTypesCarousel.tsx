import { HapticButton } from "@/components/basic components/hapticButton";
import { assetUrl } from "@/constants/assets";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GAP = 12;
const CARD_RADIUS = 28;
/** Leaves a sliver of the neighbouring cards on both sides of the centred one. */
const CARD_WIDTH_RATIO = 0.68;

export type OutfitTypeCard = {
  id: string;
  label: string;
  image: string;
};

/** Artwork is placeholder — point these at the final URLs when they're hosted. */
const OUTFIT_TYPES: OutfitTypeCard[] = [
  {
    id: "office",
    label: "Office Wear",
    image: assetUrl("luxury.outfitType.officeWear"),
  },
  {
    id: "party",
    label: "Party Wear",
    image: assetUrl("luxury.outfitType.partyWear"),
  },
  {
    id: "wedding",
    label: "Wedding Wear",
    image: assetUrl("luxury.outfitType.weddingWear"),
  },
  {
    id: "festive",
    label: "Festive Wear",
    image: assetUrl("luxury.outfitType.festiveWear"),
  },
  {
    id: "daily",
    label: "Daily Wear",
    image: assetUrl("luxury.outfitType.dailyWear"),
  },
];

type OutfitTypesCarouselProps = {
  title?: string;
  data?: OutfitTypeCard[];
  /** Card width ÷ height. Below 1 the cards stand taller than they are wide. */
  aspectRatio?: number;
  /** Overrides navigation to the product list. */
  onPressCard?: (item: OutfitTypeCard) => void;
  /** Overrides navigation to the product list. */
  onViewAll?: () => void;
  style?: ViewStyle;
};

export default function OutfitTypesCarousel({
  title = "For Every You",
  data = OUTFIT_TYPES,
  aspectRatio = 0.75,
  onPressCard,
  onViewAll,
  style,
}: OutfitTypesCarouselProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  // Measured so the cards fit the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  const cardWidth = Math.round(containerWidth * CARD_WIDTH_RATIO);
  const cardHeight = Math.round(cardWidth / aspectRatio);
  const snapInterval = cardWidth + GAP;
  // Pads the row by exactly the leftover space, so a snapped card sits dead
  // centre and its neighbours peek by the same amount on either side.
  const sidePadding = Math.max(Math.round((containerWidth - cardWidth) / 2), 0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
    if (index !== activeIndex && index >= 0 && index < data.length) {
      setActiveIndex(index);
    }
  };

  const goToProductList = () => {
    router.navigate("/product-list");
  };

  const handlePressCard = (item: OutfitTypeCard) => {
    if (onPressCard) {
      onPressCard(item);
      return;
    }
    goToProductList();
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
      return;
    }
    goToProductList();
  };

  const renderItem = ({ item }: { item: OutfitTypeCard }) => (
    <HapticButton
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      activeOpacity={0.9}
      onPress={() => handlePressCard(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      {/* Keeps the label readable whatever the artwork behind it */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.45)"]}
        style={styles.scrim}
      />
      <Text style={styles.cardLabel} numberOfLines={1}>
        {item.label}
      </Text>
    </HapticButton>
  );

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={cardWidth}
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
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: sidePadding },
        ]}
        getItemLayout={(_, index) => ({
          length: snapInterval,
          offset: snapInterval * index,
          index,
        })}
      />

      <View style={styles.pagination}>
        {data.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <HapticButton style={styles.viewAllWrapper} onPress={handleViewAll}>
        <LinearGradient
          colors={["#175E63", "#053844"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </LinearGradient>
      </HapticButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Deliberately no width: stretching to the parent lets a caller widen the
    // section with negative margins. A fixed 100% would only shift it.
    alignSelf: "stretch",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
    textAlign: "center",
    marginBottom: LUXURY_SPACING,
  },
  listContent: {
    gap: GAP,
  },
  card: {
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: LUXURY_COLORS.surface,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  scrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "35%",
  },
  cardLabel: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 24,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 26,
    backgroundColor: LUXURY_COLORS.text,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  viewAllWrapper: {
    alignSelf: "center",
    marginTop: LUXURY_SPACING,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#052A33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 48,
    paddingHorizontal: 56,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
