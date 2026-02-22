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
}

export default function GradientHorizontalScroll({
  data,
}: GradientHorizontalScroll) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContainer}
    >
      {data.map((item, index) => (
        <HapticButton onPress={item.onpress}>
          <View key={index} style={styles.cardWrapper}>
            <View
              style={[
                styles.imageCard,
                !item.gradient && styles.whiteBackground,
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
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </LinearGradient>
              ) : (
                <Image
                  source={item.img}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              )}
            </View>
            <Text style={styles.cardLabel}>{item.name}</Text>
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
    width: 100,
    height: 100,
    borderRadius: 50,
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
  cardLabel: {
    fontSize: 14,
    color: "#1A3B4A",
    fontWeight: "500",
    maxWidth: 100,
    flexWrap: "wrap",
    textAlign: "center",
  },
});
