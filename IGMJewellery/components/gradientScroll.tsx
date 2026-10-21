import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { HapticButton } from "./basic components/hapticButton";

export interface ScrollGradientItem {
  name: string;
  img: ImageSourcePropType;
  onpress: () => void;
  gradient?: {
    gradientStartColor: string;
    gradientEndColor: string;
  };
}

interface GradientHorizontalScroll {
  data: ScrollGradientItem[];
  cardWidth?: number;
  cardHeight?: number;
}

export default function GradientHorizontalScroll({
  data,
  cardWidth,
  cardHeight,
}: GradientHorizontalScroll) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContainer}
    >
      {data.map((item, index) => (
        // The key belongs on the outermost element of the iteration; on the
        // inner view it left every card keyless, so a re-render rebuilt the
        // whole row instead of matching cards up.
        <HapticButton key={item.name ?? index} onPress={item.onpress}>
          <View style={styles.cardWrapper}>
            <View
              style={[
                styles.imageCard,
                !item.gradient && styles.whiteBackground,
                cardWidth ? { width: cardWidth } : null,
                cardHeight ? { height: cardHeight } : null,
              ]}
            >
              {item.gradient ? (
                <LinearGradient
                  colors={[
                    item.gradient.gradientStartColor,
                    item.gradient.gradientEndColor,
                  ]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.gradient}
                >
                  <Image
                    source={item.img}
                    style={styles.brandImage}
                    resizeMode="contain"
                  />
                </LinearGradient>
              ) : (
                <Image
                  source={item.img}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              )}
            </View>
            <Text
              style={[
                styles.cardLabel,
                cardWidth ? { maxWidth: cardWidth } : null,
              ]}
            >
              {item.name}
            </Text>
          </View>
        </HapticButton>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    paddingRight: 20,
    paddingLeft: 10,
  },
  cardWrapper: {
    alignItems: "center",
    marginRight: 12,
  },
  imageCard: {
    width: 120,
    height: 150,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  whiteBackground: {
    backgroundColor: "#FFFFFF",
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  brandImage: {
    width: "80%",
    height: "80%",
  },
  cardLabel: {
    fontSize: 14,
    color: "#1A3B4A",
    fontWeight: "500",
    maxWidth: 120,
    flexWrap: "wrap",
    textAlign: "center",
  },
});
