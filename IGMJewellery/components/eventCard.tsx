import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { COLORS } from "../constants/theme";
import { HapticButton } from "./basic components/hapticButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// --- CAROUSEL CONFIGURATION ---
// 0.75 means the card takes 75% of screen width.
// The remaining 25% is split: 12.5% for the left peek, 12.5% for the right peek.
const CARD_WIDTH = SCREEN_WIDTH * 0.71;
const SPACING = 10;
const SNAP_INTERVAL = CARD_WIDTH + SPACING;
// This inset ensures the first card starts in the dead center
const SIDE_INSET = (SCREEN_WIDTH - CARD_WIDTH) / 2;

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
    sku: "DER-109-01",
  },
  {
    id: "Kana1",
    image: require("../assets/images/festiveInspo/Kana1.jpg"),
    sku: "Kana1",
  },
  {
    id: "DNK-108",
    image: require("../assets/images/festiveInspo/DNK-108.jpg"),
    sku: "DNK-108",
  },
];

export default function EventCard() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
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

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof FESTIVE_ITEMS)[0];
    index: number;
  }) => {
    // Distance from the center of the screen
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5], // Side cards are 50% transparent
      extrapolate: "clamp",
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9], // Side cards are 10% smaller
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[styles.cardContainer, { opacity, transform: [{ scale }] }]}
      >
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
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Looks styled for you</Text>

      <Animated.FlatList
        data={FESTIVE_ITEMS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        // Physics & Snapping
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        // Spacing: contentContainerStyle adds the necessary padding at start and end
        contentContainerStyle={{
          paddingHorizontal: SIDE_INSET,
        }}
        // Scroll Event mapping to Animated Value
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
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
    paddingVertical: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: SPACING, // Adds spacing between cards
  },
  imageWrapper: {
    width: "100%",
    height: 480,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  overlayButton: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    // Elevation for Android
    elevation: 5,
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
    marginTop: 24,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: "#E5E7EB",
  },
});
