import { ResizeMode, Video } from "expo-av"; // Corrected import
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { useGetProductsQuery } from "../store/apis/product";
import { HapticButton } from "./basic components/hapticButton";
import { SectionHeader } from "./section";

const { width } = Dimensions.get("window");

const PARENT_PADDING = 16;
const FULL_WIDTH = width;
const CARD_WIDTH = FULL_WIDTH * 0.75;
const CARD_SPACING = 10;

const DATA = [
  {
    id: "1",
    title: "24K Diamond Ring",
    brand: "Kalyan Jewellers",
    video:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Swipe%20%26%20Shop%20Videos%2FDER-ER03.mp4?alt=media&token=3d9a5c46-295c-4edb-8063-5e05ceaf095f",
  },
  {
    id: "2",
    title: "Gold Necklace",
    brand: "Tanishq",
    video:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Swipe%20%26%20Shop%20Videos%2FDER-ER04.mp4?alt=media&token=ea0772fe-c0d3-4bd6-9d10-9fb5a86accd4",
  },
  {
    id: "3",
    title: "Wedding Set",
    brand: "Malabar",
    video:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Swipe%20%26%20Shop%20Videos%2FDER-ER05.mp4?alt=media&token=a92ba75e-c216-4d0e-ab69-b7ec1b0e4658",
  },
];

export default function CommunityCarousel() {
  const router = useRouter();
  const { data: products = [], isLoading, isError } = useGetProductsQuery({});
  const scrollX = useRef(new Animated.Value(0)).current;
  const SIDE_PADDING = (FULL_WIDTH - CARD_WIDTH) / 2 - CARD_SPACING;
  const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING * 2;

  let immersiveProducts = useMemo(() => {
    const arr = products
      .filter((product) => {
        return product.immersiveVideoUrl; // Only include products that have an immersive video URL
      })
      .slice(0, 5); // Limits the array to a maximum of 5 item
    return arr;
  }, [products]);
  return (
    <View style={styles.container}>
      <SectionHeader value="From the Community" />
      <Animated.FlatList
        data={immersiveProducts} // Limit to 5 items for better performance
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * SNAP_INTERVAL,
            index * SNAP_INTERVAL,
            (index + 1) * SNAP_INTERVAL,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: "clamp",
          });

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [20, 0, 20],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              style={[styles.card, { transform: [{ scale }, { translateY }] }]}
            >
              {/* This now uses expo-av Video */}
              <HapticButton
                onPress={() => {
                  // Debug log to check the product ID
                  router.navigate({
                    pathname: "/product/[id]",
                    params: { id: item.id },
                  });
                }}
              >
                <Video
                  source={{ uri: item.immersiveVideoUrl }}
                  style={styles.video}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay
                  isLooping
                  isMuted
                />
                <View style={styles.videoCaption}>
                  <LinearGradient
                    colors={["white", "black"]}
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      opacity: 0.8,
                    }}
                  >
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.brand}>{item.brand}</Text>
                  </LinearGradient>
                </View>
              </HapticButton>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const PARENT_PADDING_STYLE = 16;

const styles = StyleSheet.create({
  container: { marginHorizontal: -PARENT_PADDING_STYLE },
  card: {
    width: CARD_WIDTH,
    height: 420,
    marginHorizontal: CARD_SPACING,
    borderRadius: 16,
    backgroundColor: "white",
    overflow: "hidden",
  },
  video: { width: "100%", height: "100%" },
  videoCaption: {
    position: "relative",
    top: -100,
    height: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    paddingHorizontal: 10,
  },
  brand: {
    fontSize: 16,
    paddingHorizontal: 10,
    fontWeight: "500",
    color: "white",
    paddingBottom: 8,
  },
});
