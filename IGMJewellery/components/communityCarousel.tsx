import { ResizeMode, Video } from "expo-av"; // Corrected import
import { useRouter } from "expo-router";
import React, { useMemo, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { useGetProductsQuery } from "../store/apis/product";
import { HapticButton } from "./basic components/hapticButton";
import { SectionHeader } from "./section";

const { width } = Dimensions.get("window");

const swipeNShopDummyData = [
  "EA1594",
  "GER-24",
  "GER-030",
  "GER-012023",
  "GNK-026",
  "GNK-89-12",
  "GNK-NK-29",
  "KAM-NK-04",
  "Kana1",
  "Moonlight1",
  "Parampara1",
  "Shri1",
  "Swarna1",
];

const ImmersiveVideoLocalPath: Record<string, any> = {
  EA1594: require("../assets/EA1594.mp4"),
  "GER-24": require("../assets/GER-24.mp4"),
  "GER-030": require("../assets/GER-030.mp4"),
  "GER-012023": require("../assets/GER-012023.mp4"),
  "GNK-026": require("../assets/GNK-026.mp4"),
  "GNK-89-12": require("../assets/GNK-89-12.mp4"),
  "GNK-NK-29": require("../assets/GNK-NK-29.mp4"),
  "KAM-NK-04": require("../assets/KAM-NK-04.mp4"),
  Kana1: require("../assets/Kana1.mp4"),
  Moonlight1: require("../assets/Moonlight1.mp4"),
  Parampara1: require("../assets/Parampara1.mp4"),
  Shri1: require("../assets/Shri1.mp4"),
  Swarna1: require("../assets/Swarna1.mp4"),
};

const FULL_WIDTH = width;
const CARD_WIDTH = FULL_WIDTH * 0.75;
const CARD_SPACING = 10;

export default function CommunityCarousel() {
  const router = useRouter();
  const { data: products = [], isLoading, isError } = useGetProductsQuery({});
  const scrollX = useRef(new Animated.Value(0)).current;
  const SIDE_PADDING = (FULL_WIDTH - CARD_WIDTH) / 2 - CARD_SPACING;
  const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING * 2;

  let immersiveProducts = useMemo(() => {
    return products.filter((product) => {
      return (
        product.immersiveVideoUrl &&
        swipeNShopDummyData.includes(product.sku as string)
      );
    });
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
                  source={ImmersiveVideoLocalPath[item.sku as string]}
                  style={styles.video}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay
                  isLooping
                  isMuted
                />
                <View style={styles.videoCaption}>
                  {/* <LinearGradient
                    colors={["white", "black"]}
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      opacity: 0.8,
                    }}
                  > */}
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.brand}>{item.brand}</Text>
                  {/* </LinearGradient> */}
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
    height: 480, // Increased height slightly for better aspect ratio
    marginHorizontal: CARD_SPACING,
    borderRadius: 24, // Softer corners like the image
    backgroundColor: "black",
    overflow: "hidden",
  },
  video: { width: "100%", height: "100%" },
  playIconContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    opacity: 0.9,
  },
  videoCaption: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark transparent overlay
    borderRadius: 0,
    padding: 12,
  },
  productInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnailPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  brand: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginTop: 4,
  },
  arrowButton: {
    width: 32,
    height: 32,
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
