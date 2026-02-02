import React, { useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

// Account for parent container padding (16px on each side in home.tsx)
const PARENT_PADDING = 16;
const FULL_WIDTH = width;

const CARD_WIDTH = FULL_WIDTH * 0.75;
const CARD_SPACING = 10;

const DATA = [
  {
    id: "1",
    title: "24K Diamond Ring",
    brand: "Kalyan Jewellers",
    video: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
  },
  {
    id: "2",
    title: "Gold Necklace",
    brand: "Tanishq",
    video: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
  },
  {
    id: "3",
    title: "Wedding Set",
    brand: "Malabar",
    video: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
  },
];

export default function CommunityCarousel() {
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // Calculate padding to center the card, accounting for parent padding
  const SIDE_PADDING = (FULL_WIDTH - CARD_WIDTH) / 2 - CARD_SPACING;
  
  // Total item width including margins on both sides
  const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING * 2;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Meet our community</Text>

      <Animated.FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: SIDE_PADDING,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
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
              style={[
                styles.card,
                {
                  transform: [{ scale }, { translateY }],
                },
              ]}
            >
              {/* Video */}
              {/* <Video
                source={{ uri: item.video }}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                isMuted
              /> */}
              <View style={styles.videoPlaceholder}>
                <Text style={styles.placeholderText}>Video Placeholder</Text>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <View style={styles.dot} />
                <View>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.brand}>{item.brand}</Text>
                </View>
              </View>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const PARENT_PADDING_STYLE = 16;

const styles = StyleSheet.create({
  container: {
    // Offset the parent's 16px padding to make carousel full-width
    marginHorizontal: -PARENT_PADDING_STYLE,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: 420,
    marginHorizontal: CARD_SPACING,
    borderRadius: 16,
    backgroundColor: "#E5E5E5",
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "85%",
  },
  videoPlaceholder: {
    width: "100%",
    height: "85%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
  },
  placeholderText: {
    color: "#999",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#999",
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  brand: {
    fontSize: 12,
    color: "#777",
  },
});
