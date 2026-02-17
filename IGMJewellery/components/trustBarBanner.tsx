import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const TrustBar = () => {
  const trustItems = [
    { id: 1, icon: "shield-check", text: "5000+ Brands" },
    { id: 2, icon: "shield-check", text: "100% Refund" },
    { id: 3, icon: "shield-check", text: "Lifetime Exchange" },
  ];

  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    // Only start animation once we know how wide the content is
    if (contentWidth > 0) {
      const startAnimation = () => {
        scrollX.setValue(0);
        Animated.loop(
          Animated.timing(scrollX, {
            toValue: -contentWidth, // Move by exactly one full set width
            duration: 10000, // Adjust for speed (higher = slower)
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
      };
      startAnimation();
    }
  }, [contentWidth]);

  const RenderItems = () => (
    <View
      style={styles.row}
      onLayout={(e) => {
        // Measure the width of exactly one set of items
        if (contentWidth === 0) setContentWidth(e.nativeEvent.layout.width);
      }}
    >
      {trustItems.map((item) => (
        <View key={item.id} style={styles.item}>
          <MaterialCommunityIcons name={item.icon} size={20} color="#1a3a3a" />
          <Text style={styles.text}>{item.text}</Text>
          <View style={styles.divider} />
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.tickerWrapper, { transform: [{ translateX: scrollX }] }]}
      >
        <RenderItems />
        {/* The "Clone" that fills the gap */}
        <RenderItems />
        {/* A third one is often added for extra wide screens to prevent flickering */}
        <RenderItems />
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
    overflow: "hidden", // This clips the content so it doesn't overlap your margins
    marginTop: 60,
    marginBottom: 40,
  },
  tickerWrapper: {
    flexDirection: "row",
    width: 5000, // Ensure the container is wide enough to hold multiple sets
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
