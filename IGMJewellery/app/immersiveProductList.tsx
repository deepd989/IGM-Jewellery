import { Ionicons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImmersiveProductCard } from "../components/immersiveProductCard";
import { Product } from "../interfaces/product.interface";
import { useGetProductsQuery } from "../store/apis/product";

const { height } = Dimensions.get("window");

const swipeNShopDummyData = new Set([
  "EA1594",
  "GER-24",
  "GER-030",
  "GER-012023",
  "GNK-026",
  "GNK-89-12",
  "GNK-NK-29",
  "KAM-NK-04",
  "Kana1",
  "Moonlight1",
  "Parampara1",
  "Shri1",
  "Swarna1",
]);

/**
 * Shared empty array for the pre-fetch render. A fresh `[]` default would hand
 * the filter memo a new identity on every render before the data lands.
 */
const NO_PRODUCTS: Product[] = [];

// Hoisted out of the component: none of these close over props or state, so
// re-creating them per render only served to churn the FlatList's props.
const keyExtractor = (item: Product) => item.id.toString();

const getItemLayout = (_: unknown, index: number) => ({
  length: height,
  offset: height * index,
  index,
});

const ImmersiveProductList = () => {
  const {
    data: products = NO_PRODUCTS,
    isLoading,
    isError,
  } = useGetProductsQuery({});
  const [showHint, setShowHint] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

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
      return (
        product.immersiveVideoUrl &&
        swipeNShopDummyData.has(product.sku as string)
      );
    });
  }, [products]);

  const hideHint = useCallback(() => setShowHint(false), []);

  /**
   * Only the two cards whose `isActive` flips get new props here; the rest keep
   * the same `item` reference and the same `false`, so the memoised card bails
   * out instead of rebuilding its gradients, icons and query subscriptions
   * mid-swipe.
   */
  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <ImmersiveProductCard item={item} isActive={index === activeIndex} />
    ),
    [activeIndex]
  );

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (isError) return <Text>Error loading products</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <Animated.View
        style={{ flex: 1, transform: [{ translateY: cardNudge }] }}
      >
        <FlatList
          ref={flatListRef}
          data={immersiveProducts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          // 2. Core Paging Props
          pagingEnabled={true}
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum={true} // Prevents accidental double-scrolling
          showsVerticalScrollIndicator={false}
          // 3. Performance & Layout (Crucial for "cutting" issues)
          getItemLayout={getItemLayout}
          // This ensures the list fills the whole screen space
          contentContainerStyle={hintStyles.listContent}
          onScrollBeginDrag={hideHint}
          // 4. Video memory management — only render nearby items
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          windowSize={3}
          maxToRenderPerBatch={2}
          removeClippedSubviews={true}
          initialNumToRender={1}
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
    </SafeAreaView>
  );
};

const hintStyles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
  },
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
