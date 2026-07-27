import { HapticButton } from "@/components/basic components/hapticButton";
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

export type LuxuryCollectionCard = {
  id: string;
  title: string;
  image: string;
  route?: string;
};

const DEFAULT_DATA: LuxuryCollectionCard[] = [
  {
    id: "1",
    title: "Trending Rings",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Latest Collection",
    image:
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Everyday Gold",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Bridal Edit",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
  },
];

type LuxuryHorizontalCollectionCarouselProps = {
  data?: LuxuryCollectionCard[];
  /** Card width ÷ height. 1 keeps the cards square. */
  aspectRatio?: number;
  /** Overrides the default navigation to `item.route`. */
  onPressCard?: (item: LuxuryCollectionCard) => void;
  style?: ViewStyle;
};

export default function LuxuryHorizontalCollectionCarousel({
  data = DEFAULT_DATA,
  aspectRatio = 1,
  onPressCard,
  style,
}: LuxuryHorizontalCollectionCarouselProps) {
  const router = useRouter();
  // Measured so the cards fit the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);

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

  const handlePress = (item: LuxuryCollectionCard) => {
    if (onPressCard) {
      onPressCard(item);
      return;
    }
    if (item.route) {
      router.navigate(item.route as any);
    }
  };

  const renderItem = ({ item }: { item: LuxuryCollectionCard }) => (
    <HapticButton
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      onPress={() => handlePress(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      {/* Glassmorphic caption pill */}
      <View style={styles.glassPillWrapper}>
        <BlurView intensity={40} tint="dark" style={styles.glassPillContent}>
          <Text style={styles.titleText} numberOfLines={1}>
            {item.title}
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
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={cardWidth}
        horizontal
        showsHorizontalScrollIndicator={false}
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
