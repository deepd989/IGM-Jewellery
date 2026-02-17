import { COLORS } from "@/constants/theme";
import { useGetProductsQuery } from "@/store/apis/product";
import React, { useRef } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";
import ProductCard2 from "./productCard";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.75;
const CARD_SPACING = 20;


export default function HashtagComponent() {
  const { data: products = [], isLoading, isError, error, refetch } = useGetProductsQuery({});
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>#TheModernDiva</Text>

      <Animated.FlatList
        data={products}
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
          { useNativeDriver: true }
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
              <ProductCard2 product={item} label2Text="Add to cart"/>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      paddingBottom: 24,
    },
    heading: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 16,
      color: COLORS.text,
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
      color: COLORS.text,
    },
    brand: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
  });
  
