import { CartBadge } from "@/components/cart/CardBadge";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/interfaces/product.interface";
import {
  useClearCompareMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useToggleCompareMutation,
} from "@/store/apis/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../components/basic components/hapticButton";
import { COLORS, SPACING } from "../constants/theme";

export default function WishlistScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: wishlistData, isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [toggleCompare] = useToggleCompareMutation();
  const [clearCompare] = useClearCompareMutation();

  const [isLoadingVideoFinished, setIsVideoFinished] = useState(false);

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsVideoFinished(true);
    }
  };

  // Extract products from wishlist items (WishlistItem contains { product, addedAt })
  const wishlistItems = wishlistData?.items?.map((item) => item.product) || [];
  const compareList = wishlistData?.compareList || [];

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: "/product/[id]",
      params: { id: product.id },
    });
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId).unwrap();
    } catch (error) {
      Alert.alert("Error", "Failed to remove item from wishlist");
    }
  };

  const handleToggleCompare = async (product: Product) => {
    try {
      await toggleCompare(product).unwrap();
    } catch (error: any) {
      if (error?.data === "You can only compare 2 products at a time") {
        Alert.alert("Compare Limit", error.data);
      } else {
        Alert.alert("Error", "Failed to update compare list");
      }
    }
  };

  const handleStartComparing = () => {
    if (compareList.length < 2) {
      Alert.alert(
        "Select Products",
        "Please select 2 products to compare them."
      );
      return;
    }

    // Navigate to compare screen (you can implement this)
    Alert.alert(
      "Compare Products",
      `Comparing: ${compareList.map((p) => p.title).join(" vs ")}`
    );
  };

  const handleClearCompare = async () => {
    try {
      await clearCompare().unwrap();
    } catch (error) {
      Alert.alert("Error", "Failed to clear compare list");
    }
  };

  const isProductInCompare = (productId: string) => {
    return compareList.some((item) => item.id === productId);
  };

  const renderHeader = () => (
    <View>
      <View style={styles.compareSection}>
        {/* <Text style={styles.compareText}>
          You can choose 2 products to compare
        </Text> */}
        {compareList.length > 0 && (
          <HapticButton onPress={handleClearCompare}>
            <Text style={styles.clearText}>Clear ({compareList.length})</Text>
          </HapticButton>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productWrapper}>
      <ProductCard
        product={item}
        viewMode={viewMode}
        onPress={handleProductPress}
        isInWishlist={true}
        onRemoveFromWishlist={() => handleRemoveFromWishlist(item.id)}
        isInCompare={isProductInCompare(item.id)}
        onToggleCompare={() => handleToggleCompare(item)}
        loadAiPreview={true} // Disable AI preview in wishlist for faster loading
      />
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <HapticButton onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </HapticButton>
          <Text style={styles.headerTitle}>Wishlist</Text>
          <View style={styles.headerRight}>
            <HapticButton style={styles.iconBtn}>
              <Ionicons name="search-outline" size={22} color={COLORS.text} />
            </HapticButton>
            <HapticButton style={styles.iconBtn}>
              <Ionicons name="heart-outline" size={22} color={COLORS.text} />
            </HapticButton>
            <View style={styles.iconBtn}>
              <CartBadge iconSize={22} iconColor={COLORS.text} />
            </View>
          </View>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading wishlist...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <HapticButton onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </HapticButton>
          <Text style={styles.headerTitle}>Wishlist</Text>
          <View style={styles.headerRight}>
            <HapticButton style={styles.iconBtn}>
              <Ionicons name="search-outline" size={22} color={COLORS.text} />
            </HapticButton>
            <View style={styles.iconBtn}>
              <CartBadge iconSize={22} iconColor={COLORS.text} />
            </View>
          </View>
        </View>
        <View style={styles.centerContent}>
          <Ionicons
            name="heart-outline"
            size={80}
            color={COLORS.textSecondary}
          />
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySubtext}>
            Start adding products you love to your wishlist
          </Text>
          <HapticButton
            style={styles.shopNowBtn}
            onPress={() => router.push("/product-list")}
          >
            <Text style={styles.shopNowText}>Start Shopping</Text>
          </HapticButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </HapticButton>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <View style={styles.headerRight}>
          <View style={styles.iconBtn}>
            <CartBadge iconSize={22} iconColor={COLORS.text} />
          </View>
        </View>
      </View>
      <FlatList
        key={viewMode}
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === "grid" ? 2 : 1}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={
          viewMode === "grid" ? styles.columnWrapper : undefined
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {/* View Toggle FAB */}
      <HapticButton style={styles.leftFab} onPress={toggleViewMode}>
        <Ionicons
          name={viewMode === "grid" ? "list" : "grid"}
          size={22}
          color="#053844"
        />
      </HapticButton>
      {/* Compare Button */}
      {compareList.length > 0 && (
        <HapticButton
          style={styles.compareButton}
          onPress={handleStartComparing}
        >
          <Text style={styles.compareButtonText}>START COMPARING PRODUCTS</Text>
        </HapticButton>
      )}

      {!isLoadingVideoFinished && (
        <View
          style={[
            styles.videoOverlay,
            {
              flex: 1,
              backgroundColor: "black",
              height: "120%",
              width: "100%",
            },
          ]}
        >
          <Video
            source={require("../assets/loaderVideoMorphed.mp4")}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            rate={1.0}
            isLooping={false}
            isMuted={true}
            volume={1.0}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject, // This makes it cover the whole screen
    backgroundColor: "black",
    zIndex: 999, // Ensures it is above the header and tabs
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
    textAlign: "center",
    marginHorizontal: SPACING.m,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: 4,
    marginLeft: 6,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.l,
  },
  loadingText: {
    marginTop: SPACING.m,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyTitle: {
    marginTop: SPACING.l,
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  emptySubtext: {
    marginTop: SPACING.s,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  shopNowBtn: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  shopNowText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  compareSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    backgroundColor: "#F9F9F9",
  },
  compareText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  clearText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: SPACING.m,
    paddingBottom: 120,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productWrapper: {
    marginBottom: SPACING.m,
  },
  leftFab: {
    position: "absolute",
    bottom: 100,
    left: SPACING.m,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  compareButton: {
    position: "absolute",
    bottom: 20,
    left: SPACING.m,
    right: SPACING.m,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  compareButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
