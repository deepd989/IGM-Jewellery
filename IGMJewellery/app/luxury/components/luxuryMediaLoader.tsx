import { LUXURY_COLORS } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

/** How much of the panel's width the sweep covers. */
const BAND_SHARE = 0.6;
/** One pass of the sweep, edge to edge. */
const SWEEP_MS = 1400;

/**
 * The gold catching the panel as it passes. Kept faint: this reads as light
 * moving over the card's own surface, not as a band drawn on top of it.
 */
const BAND_COLORS = [
  "rgba(216,195,145,0)",
  "rgba(216,195,145,0.16)",
  "rgba(216,195,145,0)",
] as const;

type LuxuryMediaLoaderProps = {
  /** Usually StyleSheet.absoluteFill, to sit the loader in a media frame. */
  style?: StyleProp<ViewStyle>;
  /** Match the surrounding artwork's size. */
  spinnerSize?: "small" | "large";
};

/**
 * What a video frame shows before the clip does: the luxury surface, a gold
 * sweep passing over it, and the accent spinner.
 *
 * Callers decide where this sits in the stack. A frame with a poster still
 * should render it *under* the media, so the still covers it the moment it
 * arrives; a frame that carries nothing but the clip has to overlay it, since
 * a player with no frame yet has nothing to see through.
 */
export default function LuxuryMediaLoader({
  style,
  spinnerSize = "large",
}: LuxuryMediaLoaderProps) {
  // The sweep is a real view travelling across the panel, so it needs the
  // panel's width in points before it can be placed.
  const [width, setWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (width <= 0) return;
    progress.setValue(0);
    const sweep = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: SWEEP_MS,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );
    sweep.start();
    // Stops with the loader — the sweep would otherwise keep the frame alive
    // for a card the shopper has already scrolled past.
    return () => sweep.stop();
  }, [progress, width]);

  const bandWidth = Math.max(Math.round(width * BAND_SHARE), 1);
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    // Off one edge to off the other, so the panel is clear between passes.
    outputRange: [-bandWidth, width],
  });

  return (
    <View
      style={[styles.container, style]}
      pointerEvents="none"
      onLayout={(event) => {
        const next = Math.round(event.nativeEvent.layout.width);
        if (next > 0 && next !== width) setWidth(next);
      }}
    >
      {width > 0 && (
        <Animated.View
          style={[styles.band, { width: bandWidth, transform: [{ translateX }] }]}
        >
          <LinearGradient
            colors={BAND_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}

      <ActivityIndicator size={spinnerSize} color={LUXURY_COLORS.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    // The same ground the cards are raised on, so a loading frame reads as
    // part of the card rather than as a hole in it.
    backgroundColor: LUXURY_COLORS.surface,
    overflow: "hidden",
  },
  band: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
});
