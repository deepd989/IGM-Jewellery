import { ImageBackground } from "expo-image";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 320;
const CARD_RADIUS = 16;

type RibbonGiftCardProps = {
  imgUrl?: string;
  cardBackgroundColor?: string; // default: '#F7F7F7'
  ribbonColor?: string;
  petalColor?: string; // default: '#D9D9D9'
  heading?: string;
  caption?: string;
  amount?: string | number;
};

const RibbonGiftCard: React.FC<RibbonGiftCardProps> = ({
  imgUrl,
  cardBackgroundColor = COLORS.primaryLight,
  ribbonColor = "red",
  petalColor = "lightpink",
  amount,
  heading,
  caption,
}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={imgUrl ? { uri: imgUrl } : undefined}
        style={[styles.card, { backgroundColor: cardBackgroundColor }]}
      >
        {/* Vertical ribbon */}
        <View
          style={[styles.verticalRibbon, { backgroundColor: ribbonColor }]}
        />

        {/* Horizontal ribbon */}
        <View
          style={[styles.horizontalRibbon, { backgroundColor: ribbonColor }]}
        />

        {/* Ribbon knot */}
        <View style={styles.knot}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.knotPetal,
                { backgroundColor: petalColor },
                {
                  transform: [
                    { translateX: 28 }, // Move to center (56/2)
                    { translateY: 28 }, // Move to center (56/2)
                    { rotate: `${i * 45}deg` },
                    { translateY: -20 },
                  ],
                },
              ]}
            />
          ))}
        </View>

        {/* Positioned Image (Replacing the Red Box) */}
        {/* {imgUrl && (
          <Image
            source={{ uri: imgUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        )} */}

        {/* Centered heading and caption */}
        <View style={styles.textOverlay}>
          {heading ? (
            <Text style={[styles.heading, { color: cardBackgroundColor }]}>
              {heading}
            </Text>
          ) : null}
          {caption ? (
            <Text style={[styles.caption, { color: cardBackgroundColor }]}>
              {caption}
            </Text>
          ) : null}
          {amount ? (
            <Text style={[styles.amount, { color: cardBackgroundColor }]}>
              {"₹" + amount}
            </Text>
          ) : null}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    margin: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    backgroundColor: "#F7F7F7",
    overflow: "hidden",
    position: "relative",
  },
  verticalRibbon: {
    position: "absolute",
    left: 32,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: COLORS.primary,
    zIndex: 2,
    opacity: 0,
  },
  horizontalRibbon: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 56,
    height: 24,
    backgroundColor: "#D9D9D9",
    zIndex: 2,
    opacity: 0,
  },
  cardImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 265,
    borderRadius: 0,
    zIndex: 2,
  },
  knot: {
    position: "absolute",
    left: 8,
    bottom: 56,
    width: 56,
    height: 56,
    zIndex: 5, // Ensures knot stays on top of ribbons
    opacity: 0,
  },
  knotPetal: {
    position: "absolute",
    width: 18,
    height: 28,
    borderRadius: 4,
    left: 0,
    top: 0,
  },
  textOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 3,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#053844",
    textAlign: "center",
  },
  caption: {
    marginTop: 8,
    fontSize: 14,
    color: "#5A5A5A",
    textAlign: "center",
  },
  amount: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: "800",
    color: "#053844",
    textAlign: "center",
  },
});

export default RibbonGiftCard;
