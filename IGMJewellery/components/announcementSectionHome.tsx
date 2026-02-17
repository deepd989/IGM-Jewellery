import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { HapticButton } from "./basic components/hapticButton";

const { width } = Dimensions.get("window");

// 1. DIMENSIONS
const CARD_WIDTH = width * 0.82;
const SPACING = 8;
const SIDE_SPACING = (width - CARD_WIDTH) / 2;
const SNAP_INTERVAL = CARD_WIDTH + SPACING * 2;

const SwipeAndShopComponent = () => {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

  const cards = [
    { id: "1", title: "Swipe & Shop", type: "swipe" },
    { id: "2", title: "AI Face Replace", type: "ai" },
  ];

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SIDE_SPACING }}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="center"
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true } // Now using native driver for performance
        )}
      >
        {cards.map((item, index) => {
          // 2. ANIMATION LOGIC FOR CARDS
          const inputRange = [
            (index - 1) * SNAP_INTERVAL,
            index * SNAP_INTERVAL,
            (index + 1) * SNAP_INTERVAL,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.92, 1, 0.92], // Shrink side cards
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6], // Fade side cards
            extrapolate: "clamp",
          });

          if (item.type === "swipe") {
            return (
              <Animated.View
                key={item.id}
                style={[styles.card, { transform: [{ scale }], opacity }]}
              >
                <HapticButton
                  activeOpacity={0.9}
                  style={styles.cardInner}
                  onPress={() => router.push("/immersiveProductList")}
                >
                  <View style={styles.iconContainerGold}>
                    <Feather
                      name="mouse-pointer"
                      size={26}
                      color="white"
                      style={styles.swipeIcon}
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <View style={styles.titleRow}>
                      <Text style={styles.titleText}>Swipe & Shop</Text>
                      <View style={styles.badge}>
                        <Sparkles size={16} color="#FFF" fill="#FFF" />
                        <Text style={styles.badgeText}>New</Text>
                      </View>
                    </View>
                    <Text style={styles.subtitleText}>
                      An immersive shopping experience
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={24} color="#003031" />
                </HapticButton>
              </Animated.View>
            );
          }

          return (
            <Animated.View
              key={item.id}
              style={[styles.card, { transform: [{ scale }], opacity }]}
            >
              <HapticButton
                activeOpacity={0.9}
                style={styles.cardInner}
                onPress={() => router.push("/tryOn")}
              >
                <View style={styles.imageWrapper}>
                  <Image
                    source={require("../assets/images/yellowSareeModel.png")}
                    style={styles.modelImage}
                  />
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>
                    Replace Model's face with yours
                  </Text>
                  <Text style={styles.subtitleText}>
                    Your photo across products
                  </Text>
                </View>
              </HapticButton>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      {/* PAGINATION DOTS */}
      <View style={styles.paginationRow}>
        {cards.map((_, i) => {
          const inputRange = [
            (i - 1) * SNAP_INTERVAL,
            i * SNAP_INTERVAL,
            (i + 1) * SNAP_INTERVAL,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: "clamp",
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 20, backgroundColor: "#fff" },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING,
    // Note: Shadow/Elevation moved to cardInner to prevent scaling artifacts
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  // --- UI Elements ---
  iconContainerGold: {
    width: 60,
    height: 60,
    backgroundColor: "#D4B982",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeIcon: { transform: [{ rotate: "135deg" }, { translateY: -2 }] },
  imageWrapper: { width: 60, height: 60, position: "relative" },
  modelImage: { width: 60, height: 60, borderRadius: 8 },
  corner: { position: "absolute", width: 8, height: 8, borderColor: "#D4B982" },
  topLeft: { top: -3, left: -3, borderTopWidth: 2, borderLeftWidth: 2 },
  topRight: { top: -3, right: -3, borderTopWidth: 2, borderRightWidth: 2 },
  textContainer: { flex: 1, marginLeft: 14 },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  titleText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#003031",
    letterSpacing: -0.2,
  },
  badge: {
    backgroundColor: "#003031",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 3,
    textTransform: "uppercase",
  },
  subtitleText: {
    fontSize: 14,
    color: "#5A7173",
    lineHeight: 18,
    marginTop: 2,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#003031",
    marginHorizontal: 4,
  },
});

export default SwipeAndShopComponent;
