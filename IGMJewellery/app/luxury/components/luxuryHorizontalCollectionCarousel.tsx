import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS } from "@/constants/theme";
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
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GAP = 12;
/** Two full cards plus a sliver of the third, so the row reads as scrollable. */
const CARDS_PER_VIEW = 2.15;

/** Diameter of the glass arrow in the card's corner. */
const ARROW_SIZE = 38;

type LuxuryHorizontalCollectionCarouselProps = {
  /** Overrides the collections fetched from the API. */
  data?: MultiBrandCollection[];
  /** Card width ÷ height. 1 keeps the cards square. */
  aspectRatio?: number;
  /** Overrides navigation to the collection's product list. */
  onPressCard?: (item: MultiBrandCollection) => void;
  style?: ViewStyle;
};

export default function LuxuryHorizontalCollectionCarousel({
  data,
  aspectRatio = 1,
  onPressCard,
  style,
}: LuxuryHorizontalCollectionCarouselProps) {
  const router = useRouter();
  const { data: collections = [] } = useGetMultiBrandCollectionsQuery();
  // Measured so the cards fit the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);

  const cards = data ?? collections;

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  const cardWidth = Math.round(
    (containerWidth - GAP * (CARDS_PER_VIEW - 1)) / CARDS_PER_VIEW
  );
  const cardHeight = Math.round(cardWidth / aspectRatio);
  const snapInterval = cardWidth + GAP;

  const handlePress = (item: MultiBrandCollection) => {
    if (onPressCard) {
      onPressCard(item);
      return;
    }
    router.navigate({
      pathname: "/product-list",
      params: {
        subCategoryId: String(item.id),
        bannerImageUrl: encodeURIComponent(item.collectionBannerUrl),
      },
    });
  };

  const renderItem = ({ item }: { item: MultiBrandCollection }) => (
    <HapticButton
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      onPress={() => handlePress(item)}
    >
      <Image
        source={{ uri: item.collectionBannerUrl }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      {/* Glassmorphic arrow, on its own in the corner. The radius and the clip
          live on the wrapper: a BlurView does not round its own blur. */}
      <View style={styles.arrowWrapper}>
        <BlurView intensity={40} tint="dark" style={styles.arrowGlass}>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </BlurView>
      </View>
    </HapticButton>
  );

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <FlatList
        data={cards}
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
        contentContainerStyle={styles.listContent}
        getItemLayout={(_, index) => ({
          length: snapInterval,
          offset: snapInterval * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  listContent: {
    gap: GAP,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: LUXURY_COLORS.surface,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  arrowWrapper: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    borderRadius: ARROW_SIZE / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  arrowGlass: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // The lit face over the blur, so the glass reads as raised off the artwork.
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});
