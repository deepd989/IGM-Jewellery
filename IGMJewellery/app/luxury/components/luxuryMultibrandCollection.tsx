import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Brand } from "@/store/apis/brandsApi";
import { useStorefrontBrands } from "@/hooks/useStorefrontBrands";
import {
  MultiBrandCollection,
  useGetMultiBrandCollectionsQuery,
} from "@/store/apis/multibrandCollectionsApi";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GAP = 12;
/** One card plus a slice of the next, so the row reads as scrollable. */
const CARDS_PER_VIEW = 1.35;
/** Card width ÷ height — above 1 the cards are landscape. */
const CARD_ASPECT_RATIO = 1.5;
const SIDE_PADDING = 16;

type LuxuryMultibrandCollectionProps = {
  title?: string;
  /** Overrides navigation to the collection's product list. */
  onPressCollection?: (collection: MultiBrandCollection) => void;
  /** Overrides navigation to the full product list. */
  onViewAll?: () => void;
  style?: ViewStyle;
};

export default function LuxuryMultibrandCollection({
  title = "Latest Collections",
  onPressCollection,
  onViewAll,
  style,
}: LuxuryMultibrandCollectionProps) {
  const router = useRouter();
  const { data: collections = [] } = useGetMultiBrandCollectionsQuery();
  const { data: brands = [] } = useStorefrontBrands({});
  const [selectedBrandId, setSelectedBrandId] = useState<string>();
  const [activeIndex, setActiveIndex] = useState(0);
  // Measured so the cards fit the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [rowWidth, setRowWidth] = useState(SCREEN_WIDTH - SIDE_PADDING * 2);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== rowWidth) {
      setRowWidth(width);
    }
  };

  const activeBrand =
    brands.find((brand) => brand.id === selectedBrandId) ?? brands[0];

  const cardWidth = Math.round(
    (rowWidth - GAP * (CARDS_PER_VIEW - 1)) / CARDS_PER_VIEW
  );
  const cardHeight = Math.round(cardWidth / CARD_ASPECT_RATIO);
  const snapInterval = cardWidth + GAP;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
    if (index !== activeIndex && index >= 0) {
      setActiveIndex(index);
    }
  };

  const handlePressCollection = (collection: MultiBrandCollection) => {
    if (onPressCollection) {
      onPressCollection(collection);
      return;
    }
    router.navigate({
      pathname: "/product-list",
      params: {
        subCategoryId: String(collection.id),
        bannerImageUrl: encodeURIComponent(collection.collectionBannerUrl),
      },
    });
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
      return;
    }
    router.navigate("/product-list");
  };

  const handleSelectBrand = (brand: Brand) => {
    setSelectedBrandId(brand.id);
    setActiveIndex(0);
  };

  const renderCard = ({ item }: { item: MultiBrandCollection }) => (
    <HapticButton
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      activeOpacity={0.85}
      onPress={() => handlePressCollection(item)}
    >
      <Image
        source={{ uri: item.collectionBannerUrl }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
      </View>
    </HapticButton>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {/* brand chiplist current brands data and collection data are not mapped  */}
        {/* {brands.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            // Only the cards near the viewport are mounted, so an off-screen
            // card holds no decoded artwork.
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={5}
            contentContainerStyle={styles.chipRow}
            style={styles.chipScroll}
          >
            {brands.map((brand) => {
              const isActive = brand.id === activeBrand?.id;
              return (
                <HapticButton
                  key={brand.id}
                  style={[styles.chip, isActive && styles.activeChip]}
                  onPress={() => handleSelectBrand(brand)}
                >
                  <Text
                    style={[styles.chipText, isActive && styles.activeChipText]}
                    numberOfLines={1}
                  >
                    {brand.businessName}
                  </Text>
                </HapticButton>
              );
            })}
          </ScrollView>
        )} */}

        <View onLayout={handleLayout} style={styles.row}>
          <FlatList
            data={collections}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            extraData={cardWidth}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
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

        {/* <HapticButton style={styles.viewAllWrapper} onPress={handleViewAll}>
          <BlurView intensity={30} tint="dark" style={styles.viewAll}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </BlurView>
        </HapticButton> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Deliberately no width: stretching to the parent lets a caller widen the
    // section with negative margins. A fixed 100% would only shift it.
    alignSelf: "stretch",
    borderRadius: 20,
    overflow: "hidden",
    // The page's own ground: the section used to sink the leading collection's
    // artwork behind its cards, and now carries none of its own.
    backgroundColor: LUXURY_COLORS.primary,
  },
  // No vertical padding: the section grounds on the page's own colour now, so
  // an inset of its own only stacks onto the band's gap. The storefront's
  // rhythm lives in app/luxury/index.tsx's sectionBand.
  content: {
    paddingHorizontal: SIDE_PADDING,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: LUXURY_SPACING,
  },
  chipScroll: {
    // Lets the row bleed to both edges while the cards stay inset.
    marginHorizontal: -SIDE_PADDING,
    marginBottom: LUXURY_SPACING / 2,
    flexGrow: 0,
  },
  chipRow: {
    gap: 10,
    paddingHorizontal: SIDE_PADDING,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  activeChip: {
    backgroundColor: "#DCE1E1",
    borderColor: "#DCE1E1",
  },
  chipText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontWeight: "600",
  },
  activeChipText: {
    color: "#0B3B45",
  },
  row: {
    // Lets the peeking card run to the section's edge.
    marginRight: -SIDE_PADDING,
  },
  listContent: {
    gap: GAP,
    paddingRight: SIDE_PADDING,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  cardFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  cardTitle: {
    flexShrink: 1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  viewAllWrapper: {
    alignSelf: "center",
    marginTop: LUXURY_SPACING,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    paddingHorizontal: 60,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  viewAllText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
