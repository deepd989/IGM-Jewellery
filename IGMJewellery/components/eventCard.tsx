import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { COLORS } from "../constants/theme";
import { HapticButton } from "./basic components/hapticButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_PADDING = 16;
const IMAGE_WIDTH = SCREEN_WIDTH - CARD_PADDING * 2;

const FESTIVE_ITEMS = [
  {
    id: "GNK-40",
    image: require("../assets/images/festiveInspo/GNK-40.jpg"),
    sku: "GNK-40",
  },
  {
    id: "GNK-NK-37",
    image: require("../assets/images/festiveInspo/GNK-NK-37.jpg"),
    sku: "GNK-NK-37",
  },
  {
    id: "DER-109",
    image: require("../assets/images/festiveInspo/DER-109.jpg"),
    sku: "DER-109",
  },
  {
    id: "DNK-108",
    image: require("../assets/images/festiveInspo/DNK-108.jpg"),
    sku: "DNK-108",
  },
  {
    id: "Kana1",
    image: require("../assets/images/festiveInspo/Kana1.jpg"),
    sku: "Kana1",
  },
];

export default function EventCard() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handlePress = (sku: string) => {
    router.push({
      pathname: "/product/[id]",
      params: { id: sku },
    });
  };

  const renderItem = ({ item }: { item: (typeof FESTIVE_ITEMS)[0] }) => (
    <HapticButton
      onPress={() => handlePress(item.sku)}
      style={styles.imageWrapper}
    >
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <View style={styles.overlayButton}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.buttonText}>Get this look </Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
        </View>
      </View>
    </HapticButton>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Looks styled for you</Text>

      <FlatList
        ref={flatListRef}
        data={FESTIVE_ITEMS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={IMAGE_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingHorizontal: CARD_PADDING }}
        getItemLayout={(_, index) => ({
          length: IMAGE_WIDTH,
          offset: IMAGE_WIDTH * index,
          index,
        })}
      />

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {FESTIVE_ITEMS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },

  header: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: 16,
  },

  imageWrapper: {
    width: IMAGE_WIDTH,
    height: 480,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },

  overlayButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 8,
    gap: 8,
  },

  dot: {
    borderRadius: 4,
    height: 8,
  },

  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },

  dotInactive: {
    width: 8,
    backgroundColor: "#D1D5DB",
  },
});
