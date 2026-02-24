import React, { memo, useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { SvgUri } from "react-native-svg";
import { COLORS } from "../constants/theme";

// 1. Move the item renderer outside to prevent re-mounting flicker
const TrustItem = memo(({ item }) => (
  <View style={styles.item}>
    <SvgUri uri={item.icon} width={30} height={30} />
    <Text style={styles.text}>{item.text}</Text>
    <View style={styles.divider} />
  </View>
));

const TrustBar = () => {
  const trustItems = [
    {
      id: 1,
      icon: "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Icons%2FTrust%20Badges%2FICONS%20_Infinite%20Designs.svg?alt=media&token=27cf866d-d590-4d26-8d56-d1aeedbb89ac",
      text: "Infinite Designs",
    },
    {
      id: 2,
      icon: "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Icons%2FTrust%20Badges%2FICONS%20_Global%20Jewellery%20Standards.svg?alt=media&token=4990b5f0-3124-4c7e-b7c8-1d811f501dfc",
      text: "Global Jewellery Standards",
    },
    {
      id: 3,
      icon: "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Icons%2FTrust%20Badges%2FICONS%20_Insured%20Delivery.svg?alt=media&token=3858495a-afe4-4c1c-b4b5-9c24eb59fd3a",
      text: "Insured Delivery",
    },
  ];

  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (contentWidth > 0) {
      const startAnimation = () => {
        scrollX.setValue(0);
        Animated.loop(
          Animated.timing(scrollX, {
            toValue: -contentWidth,
            duration: 15000, // Slightly slower for readability
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ).start();
      };
      startAnimation();
    }
    // Clean up animation on unmount
    return () => scrollX.stopAnimation();
  }, [contentWidth]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.tickerWrapper,
          {
            transform: [{ translateX: scrollX }],
            // Use contentWidth to set a precise width instead of 5000
            width: contentWidth ? contentWidth * 3 : 5000,
          },
        ]}
      >
        <View
          style={styles.row}
          onLayout={(e) => {
            const width = e.nativeEvent.layout.width;
            if (width > 0 && contentWidth === 0) setContentWidth(width);
          }}
        >
          {trustItems.map((item) => (
            <TrustItem key={`set1-${item.id}`} item={item} />
          ))}
        </View>

        {/* Clones for seamless looping */}
        <View style={styles.row}>
          {trustItems.map((item) => (
            <TrustItem key={`set2-${item.id}`} item={item} />
          ))}
        </View>
        <View style={styles.row}>
          {trustItems.map((item) => (
            <TrustItem key={`set3-${item.id}`} item={item} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    overflow: "hidden",
    marginTop: 36,
    marginBottom: 24,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  tickerWrapper: {
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  icon: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  text: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    textTransform: "uppercase",
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#4a6767",
    opacity: 0.2,
    marginLeft: 20,
  },
});

export default TrustBar;
