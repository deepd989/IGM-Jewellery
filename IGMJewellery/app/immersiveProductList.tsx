import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ImmersiveProductCard } from "../components/immersiveProductCard";
import { useGetProductsQuery } from "../store/apis/product";

const { height } = Dimensions.get("window");

const ImmersiveProductList = () => {
  const { data: products = [], isLoading, isError } = useGetProductsQuery({});
  const [showHint, setShowHint] = useState(true);

  // Swoosh arrow animation (pulsing up)
  const arrowTranslateY = useRef(new Animated.Value(0)).current;
  const arrowOpacity = useRef(new Animated.Value(1)).current;

  // Card nudge animation (slight lift and return)
  const flatListRef = useRef<FlatList>(null);
  const cardNudge = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!showHint) return;

    // Arrow swoosh: repeating up-motion with fade
    const arrowLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(arrowTranslateY, {
            toValue: -40,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(arrowOpacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(arrowTranslateY, {
            toValue: 0,
            duration: 500,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(arrowOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(300),
      ])
    );

    // Card nudge: slight lift up and back
    const nudgeSequence = Animated.sequence([
      Animated.delay(400),
      Animated.timing(cardNudge, {
        toValue: -30,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardNudge, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    arrowLoop.start();
    nudgeSequence.start();

    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(arrowOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        arrowLoop.stop();
        setShowHint(false);
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
      arrowLoop.stop();
    };
  }, [showHint]);

  const immersiveProducts = useMemo(() => {
    return products.filter((product) => {
      return product.immersiveVideoUrl || product.isImmersiveProduct;
    });
  }, [products]);

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (isError) return <Text>Error loading products</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Animated.View
        style={{ flex: 1, transform: [{ translateY: cardNudge }] }}
      >
        <FlatList
          ref={flatListRef}
          data={immersiveProducts}
          renderItem={({ item }) => <ImmersiveProductCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
          onScrollBeginDrag={() => setShowHint(false)}
        />
      </Animated.View>

      {showHint && (
        <View style={hintStyles.overlay} pointerEvents="none">
          <Animated.View
            style={[
              hintStyles.hintContainer,
              {
                transform: [{ translateY: arrowTranslateY }],
                opacity: arrowOpacity,
              },
            ]}
          >
            <Ionicons name="chevron-up" size={32} color="white" />
            <Ionicons
              name="chevron-up"
              size={32}
              color="white"
              style={{ marginTop: -18 }}
            />
            <Text style={hintStyles.hintText}>Swipe up to explore</Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const hintStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 250,
  },
  hintContainer: {
    alignItems: "center",
  },
  hintText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default ImmersiveProductList;
