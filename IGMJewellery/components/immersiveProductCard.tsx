import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Sparkles, Star, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS } from "../constants/theme";
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

export const ImmersiveProductCard = ({ item: product }: { item: Product }) => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTryOnSelectorVisible, setIsTryOnSelectorVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current; // For smooth transition

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const { data: wishlistData } = useGetWishlistQuery();
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] =
    useRemoveFromWishlistMutation();

  const discountedPrice = product.discountedPrice;
  const typeLabel = product.productType;

  const isInWishlist = wishlistData?.items.some(
    (item) => item.product.id === product.id
  );

  const handleAddToCart = async (e: any) => {
    e.stopPropagation();
    try {
      await addToCart({ product, quantity: 1 }).unwrap();

      // Animate out, change state, animate in
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

      // Reset after 2 seconds
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
      console.error("Failed to add to cart:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const handleToggleWishlist = async (e: any) => {
    e.stopPropagation();
    if (isInWishlist) {
      try {
        await removeFromWishlist(product.id).unwrap();
      } catch (error) {
        Alert.alert("Error", "Failed to remove from wishlist");
      }
    } else {
      try {
        await addToWishlist(product).unwrap();
      } catch (error: any) {
        if (error?.data === "Item already in wishlist") {
          Alert.alert(
            "Already in Wishlist",
            "This item is already wishlisted."
          );
        } else {
          Alert.alert("Error", "Failed to add to wishlist");
        }
      }
    }
  };

  return (
    <View style={styles.card}>
      <ImageBackground
        source={{
          uri: product.immersiveThumbnailUrl || product.thumbnailUrls[0],
        }}
        style={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.5)", "transparent"]}
          style={styles.topGradient}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.bottomGradient}
        />

        <View style={styles.header}>
          <HapticButton style={styles.iconBtn} onPress={() => router.back()}>
            <X color="white" size={24} />
          </HapticButton>
          <Text style={styles.headerText}>Swipe & Shop</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <View style={styles.leftInfo}>
              <Text style={styles.title}>{`24K ${typeLabel}`}</Text>
              <Text style={styles.brand}>Kalyan Jewellers</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} fill="white" color="white" />
                ))}
                <Text style={styles.ratingText}>(1k+)</Text>
              </View>
            </View>

            <View style={styles.rightInfo}>
              <HapticButton
                style={styles.favIcon}
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
              <Text style={styles.price}>
                ₹{discountedPrice.toLocaleString()}
              </Text>
              <Text style={styles.oldPrice}>
                ₹{product.givenPrice.toLocaleString()}
              </Text>
              <HapticButton
                onPress={() => router.push(`/product/${product.id}`)}
              >
                <Text style={styles.viewLink}>View Product</Text>
              </HapticButton>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <HapticButton
              style={styles.tryNowBtn}
              onPress={() => setIsTryOnSelectorVisible(true)}
            >
              <Sparkles size={18} color="#C5A059" fill="#C5A059" />
              <Text style={styles.tryNowText}>Try Now</Text>
            </HapticButton>

            <HapticButton
              style={[
                styles.addBagBtn,
                isAddingToCart && styles.addBagBtnDisabled,
                showSuccess && styles.addBagBtnSuccess,
              ]}
              onPress={handleAddToCart}
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
                  <Text style={styles.addBagText}>Add to Bag</Text>
                )}
              </Animated.View>
            </HapticButton>
          </View>
        </View>
      </ImageBackground>

      <TryOnSelectorModal
        visible={isTryOnSelectorVisible}
        onClose={() => setIsTryOnSelectorVisible(false)}
        onSelectVR={() => {
          router.push({
            pathname: "/virtualTryOn2",
            params: {
              productId: product.id,
              productTitle: product.title,
            },
          });
        }}
        onSelectAI={() => {
          router.push({
            pathname: "/tryOn",
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { width, height },
  image: { flex: 1, justifyContent: "space-between" },
  topGradient: { ...StyleSheet.absoluteFillObject, height: "25%" },
  bottomGradient: { ...StyleSheet.absoluteFillObject, top: "40%" },
  header: {
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginRight: 40,
  },
  content: { paddingHorizontal: 20, paddingBottom: 50 },
  mainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 25,
  },
  leftInfo: {}, // Added for layout consistency
  rightInfo: {}, // Added for layout consistency
  title: { color: "white", fontSize: 22, fontWeight: "bold" },
  brand: { color: "#ddd", fontSize: 16, marginVertical: 4 },
  ratingContainer: { flexDirection: "row", alignItems: "center", gap: 2 },
  ratingText: { color: "white", fontSize: 12, marginLeft: 4 },
  price: { color: "white", fontSize: 24, fontWeight: "bold" },
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
  buttonRow: { flexDirection: "row", gap: 12 },
  tryNowBtn: {
    flex: 1,
    backgroundColor: "rgba(197, 160, 89, 0.8)",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addBagBtnSuccess: {
    backgroundColor: "#f0fff4",
    borderWidth: 1,
    borderColor: "#27ae60",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tryNowText: { color: "white", fontWeight: "bold", fontSize: 16 },
  addBagText: { color: "black", fontWeight: "bold", fontSize: 16 },
  favIcon: {
    position: "absolute",
    top: -50,
    right: -5,
    padding: 6,
  },
  addBagBtnDisabled: {
    opacity: 0.6,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
  },
});
