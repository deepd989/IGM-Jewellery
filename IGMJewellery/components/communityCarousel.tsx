import React, { useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.75;
const CARD_SPACING = 20;

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

  return (
    <View>
      <Text style={styles.heading}>Meet our community</Text>

      <Animated.FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: (width - CARD_WIDTH) / 2,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_SPACING),
            index * (CARD_WIDTH + CARD_SPACING),
            (index + 1) * (CARD_WIDTH + CARD_SPACING),
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
              <View
                style={[
                  styles.video,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Text>Video Placeholder</Text>
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

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: 420,
    marginRight: CARD_SPACING,
    borderRadius: 16,
    backgroundColor: "#E5E5E5",
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "85%",
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
