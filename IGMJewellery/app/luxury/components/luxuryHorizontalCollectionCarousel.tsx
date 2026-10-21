import { HapticButton } from "@/components/basic components/hapticButton";
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
  Text,
  View,
  ViewStyle,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GAP = 12;
/** Two full cards plus a sliver of the third, so the row reads as scrollable. */
const CARDS_PER_VIEW = 2.15;

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

      {/* Glassmorphic caption pill */}
      <View style={styles.glassPillWrapper}>
        <BlurView intensity={40} tint="dark" style={styles.glassPillContent}>
          <Text style={styles.titleText} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.arrowButton}>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </View>
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
    backgroundColor: "#E7EDF0",
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  glassPillWrapper: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  glassPillContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    backgroundColor: "rgba(30, 30, 30, 0.3)",
  },
  titleText: {
    flex: 1,
    marginRight: 8,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
});
