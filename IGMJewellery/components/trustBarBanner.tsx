import React, { memo, useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

// 1. Move the item renderer outside to prevent re-mounting flicker
const TrustItem = memo(({ item }) => (
  <View style={styles.item}>
    <Image
      source={item.icon}
      style={styles.icon}
      fadeDuration={0} // Removes the default Android fade-in flicker
    />
    <Text style={styles.text}>{item.text}</Text>
    <View style={styles.divider} />
  </View>
));

const TrustBar = () => {
  const trustItems = [
    {
      id: 1,
      icon: require("../assets/icons/ICONS_GlobalJewelleryStandards.png"),
      text: "Infinite Designs",
    },
    {
      id: 2,
      icon: require("../assets/icons/ICONS_InfiniteDesigns.png"),
      text: "Global Jewellery Standards",
    },
    {
      id: 3,
      icon: require("../assets/icons/ICONS_InsuredDelivery.png"),
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
          })
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
    backgroundColor: "#f9fbfb",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    overflow: "hidden",
    marginTop: 60,
    marginBottom: 40,
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
    fontSize: 12,
    fontWeight: "700",
    color: "#4a6767",
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
