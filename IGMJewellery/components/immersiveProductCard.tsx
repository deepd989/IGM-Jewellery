import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Sparkles, Star, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Critical for responsiveness

import { ImageBackground } from "expo-image";
import { COLORS } from "../constants/theme";
import { useCartStatus } from "../hooks/useCartStatus";
import { Product } from "../interfaces/product.interface";
import { useAddToCartMutation } from "../store/apis/cart";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../store/apis/wishlist";
import { HapticButton } from "./basic components/hapticButton";
import { TryOnSelectorModal } from "./products/TryOnSelectorModal";

const { width, height } = Dimensions.get("window");

const ImmersiveVideoLocalPath: Record<string, any> = {
  EA1594: require("../assets/EA1594.mp4"),
  "GER-24": require("../assets/GER-24.mp4"),
  "GER-030": require("../assets/GER-030.mp4"),
  "GER-012023": require("../assets/GER-012023.mp4"),
  "GNK-026": require("../assets/GNK-026.mp4"),
  "GNK-89-12": require("../assets/GNK-89-12.mp4"),
  "GNK-NK-29": require("../assets/GNK-NK-29.mp4"),
  "KAM-NK-04": require("../assets/KAM-NK-04.mp4"),
  Kana1: require("../assets/Kana1.mp4"),
  Moonlight1: require("../assets/Moonlight1.mp4"),
  Parampara1: require("../assets/Parampara1.mp4"),
  Shri1: require("../assets/Shri1.mp4"),
  Swarna1: require("../assets/Swarna1.mp4"),
};

const ImmersiveProductCardComponent = ({
  item: product,
  isActive = true,
}: {
  item: Product;
  isActive?: boolean;
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Dynamically gets notch and bottom bar heights
  const videoRef = useRef(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [isTryOnSelectorVisible, setIsTryOnSelectorVisible] = useState(false);
  // The try-on sheet is a whole second screen of views. Building it for every
  // card in the window costs on each swipe, so it only mounts once the shopper
  // has actually reached for it — and stays mounted after, so closing keeps its
  // slide-out animation.
  const [hasOpenedTryOn, setHasOpenedTryOn] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const { isInCart, goToCart } = useCartStatus(product.id);
  // Narrowed the same way `useCartStatus` is: without this every card re-renders
  // whenever any other piece is wishlisted.
  const { isInWishlist } = useGetWishlistQuery(undefined, {
    selectFromResult: ({ data }) => ({
      isInWishlist: !!data?.items.some(
        (item) => item.product.id === product.id
      ),
    }),
  });
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] =
    useRemoveFromWishlistMutation();

  const discountedPrice = product.discountedPrice;

  /** Adds the piece, or opens the bag once it is already in there. */
  const handleBagPress = async (e: any) => {
    e.stopPropagation();

    if (isInCart) {
      goToCart();
      return;
    }

    try {
      await addToCart({ product, quantity: 1 }).unwrap();
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setShowSuccess(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccess(false);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
      }, 2000);
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const handleToggleWishlist = async (e: any) => {
    e.stopPropagation();
    if (isInWishlist) {
      try {
        await removeFromWishlist(product.id).unwrap();
      } catch (error) {
        Alert.alert("Error", "Failed to remove");
      }
    } else {
      try {
        await addToWishlist(product).unwrap();
      } catch (error: any) {
        Alert.alert("Error", "Failed to add");
      }
    }
  };

  const renderBackground = () => {
    const posterUri = product.immersiveThumbnailUrl || product.thumbnailUrls[0];

    if (product.immersiveVideoUrl) {
      // Always show poster image as base layer
      // Only mount the Video component when this card is active
      return (
        <View style={styles.videoContainer}>
          <ImageBackground
            source={{ uri: posterUri }}
            style={styles.videoFill}
            resizeMode="cover"
          />
          {isActive && (
            <Video
              ref={videoRef}
              style={styles.videoFill}
              source={ImmersiveVideoLocalPath[product.sku as string]}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted
            />
          )}
        </View>
      );
    }
    return (
      <ImageBackground
        source={{ uri: posterUri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
    );
  };

  return (
    <View style={styles.card}>
      {renderBackground()}

      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "transparent"]}
        style={styles.topGradient}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      {/* Main UI Container using Safe Area Insets */}
      <View
        style={[
          styles.uiContainer,
          { paddingTop: 8, paddingBottom: insets.bottom + 15 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <HapticButton style={styles.iconBtn} onPress={() => router.back()}>
            <X color="white" size={24} />
          </HapticButton>
          <Text style={styles.headerText}>Swipe & Shop</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          <View style={styles.mainInfo}>
            {/* Left Column: Title & Brand */}
            <View style={styles.leftInfo}>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {product.name}
              </Text>
              <Text style={styles.brand}>{product.brand}</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} fill="white" color="white" />
                ))}
                <Text style={styles.ratingText}>(1k+)</Text>
              </View>
            </View>

            {/* Right Column: Wishlist & Price */}
            <View style={styles.rightInfo}>
              <HapticButton
                style={styles.favIconWrapper}
                onPress={handleToggleWishlist}
                disabled={isAddingToWishlist || isRemovingFromWishlist}
              >
                {isAddingToWishlist || isRemovingFromWishlist ? (
                  <ActivityIndicator size="small" color={"white"} />
                ) : (
                  <Ionicons
                    name={isInWishlist ? "heart" : "heart-outline"}
                    size={30}
                    color={"white"}
                  />
                )}
              </HapticButton>

              <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit>
                ₹{discountedPrice.toLocaleString()}
              </Text>
              <Text style={styles.oldPrice}>
                ₹{product.givenPrice.toLocaleString()}
              </Text>
              <HapticButton
                onPress={() => router.navigate(`/product/${product.id}`)}
              >
                <Text style={styles.viewLink}>View Product</Text>
              </HapticButton>
            </View>
          </View>

          {/* Buttons Row */}
          <View style={styles.buttonRow}>
            <HapticButton
              style={styles.tryNowBtn}
              onPress={() => {
                setHasOpenedTryOn(true);
                setIsTryOnSelectorVisible(true);
              }}
            >
              <Sparkles size={18} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.tryNowText}>Try Now</Text>
            </HapticButton>

            <HapticButton
              style={[
                styles.addBagBtn,
                isAddingToCart && styles.addBagBtnDisabled,
                showSuccess && styles.addBagBtnSuccess,
              ]}
              onPress={handleBagPress}
              disabled={isAddingToCart || showSuccess}
            >
              <Animated.View
                style={[styles.buttonContent, { opacity: fadeAnim }]}
              >
                {isAddingToCart ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.primary || "#000"}
                  />
                ) : showSuccess ? (
                  <>
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#27ae60"
                    />
                    <Text style={[styles.addBagText, { color: "#27ae60" }]}>
                      Added
                    </Text>
                  </>
                ) : (
                  <Text style={styles.addBagText}>
                    {isInCart ? "Go to Bag" : "Add to Bag"}
                  </Text>
                )}
              </Animated.View>
            </HapticButton>
          </View>
        </View>
      </View>

      {hasOpenedTryOn && (
        <TryOnSelectorModal
          visible={isTryOnSelectorVisible}
          onClose={() => setIsTryOnSelectorVisible(false)}
          onSelectVR={() =>
            router.navigate({
              pathname: "/virtualTryOn2",
              params: { productId: product.id, productTitle: product.title },
            })
          }
          onSelectAI={() =>
            router.navigate({
              pathname: "/tryOn",
              params: { productId: product.id },
            })
          }
        />
      )}
    </View>
  );
};

/**
 * Memoised: the list re-renders on every swipe to move `isActive`, and without
 * this each of those rebuilt every card in the window — gradients, five rating
 * icons, the poster layer and all of its query subscriptions — during the one
 * moment the frames matter.
 */
export const ImmersiveProductCard = React.memo(ImmersiveProductCardComponent);

const styles = StyleSheet.create({
  card: {
    width: width,
    height: height,
    backgroundColor: "black",
    overflow: "hidden",
  },
  videoContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: -width * 0.1,
    width: width * 1.2,
  },
  videoFill: {
    ...StyleSheet.absoluteFillObject,
  },
  uiContainer: {
    ...StyleSheet.absoluteFillObject,
    // Ensure content is spread across the FULL height
    justifyContent: "space-between",
    zIndex: 10, // Ensure UI is above gradients and video/image
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "25%",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "45%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  content: { paddingHorizontal: 20, position: "relative", bottom: 50 },
  mainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
    gap: 15, // Prevents text from colliding
  },
  leftInfo: { flex: 2 }, // Title gets more horizontal space
  rightInfo: { flex: 1.2, alignItems: "flex-end" }, // Price gets enough space to avoid cut-off
  title: { color: "white", fontSize: 22, fontWeight: "bold" },
  brand: { color: "#ddd", fontSize: 16, marginVertical: 4 },
  ratingContainer: { flexDirection: "row", alignItems: "center", gap: 2 },
  ratingText: { color: "white", fontSize: 12, marginLeft: 4 },
  favIconWrapper: { marginBottom: 12 }, // Spacing between heart and price
  price: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
  },
  oldPrice: {
    color: "#bbb",
    textDecorationLine: "line-through",
    textAlign: "right",
  },
  viewLink: {
    color: "white",
    textDecorationLine: "underline",
    marginTop: 8,
    textAlign: "right",
  },
  buttonRow: { flexDirection: "row", gap: 12, width: "100%" },
  tryNowBtn: {
    flex: 1,
    backgroundColor: "#003A45",
    flexDirection: "row",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addBagBtn: {
    flex: 1,
    backgroundColor: "white",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addBagBtnSuccess: {
    backgroundColor: "#f0fff4",
    borderWidth: 1,
    borderColor: "#27ae60",
  },
  buttonContent: { flexDirection: "row", alignItems: "center", gap: 6 },
  tryNowText: { color: "white", fontWeight: "bold", fontSize: 16 },
  addBagText: { color: "black", fontWeight: "bold", fontSize: 16 },
  addBagBtnDisabled: { opacity: 0.6 },
  iconBtn: { padding: 8, backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 20 },
});
