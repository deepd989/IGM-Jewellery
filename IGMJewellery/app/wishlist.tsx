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
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { HapticButton } from "../components/basic components/hapticButton";
import { COLORS, SPACING } from "../constants/theme";

/** Room the floating compare bar needs above the last row of cards. */
const COMPARE_BAR_CLEARANCE = 84;

export default function WishlistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    router.navigate({
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

  /**
   * One bar for all three states. Each used to carry its own copy, and they
   * had drifted into three different sets of actions — search and heart in the
   * loading state, search and bag when empty, bag alone with the list.
   *
   * The side slots are equal-width, so the title sits optically centred
   * whatever they hold; the old fixed `paddingLeft` only lined up for one of
   * the three.
   */
  const renderTopBar = () => (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        <HapticButton onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </HapticButton>
      </View>

      <Text style={styles.headerTitle} numberOfLines={1}>
        Wishlist
      </Text>

      <View style={[styles.headerSide, styles.headerSideRight]}>
        <View style={styles.iconBtn}>
          <CartBadge iconSize={22} iconColor={COLORS.text} />
        </View>
      </View>
    </View>
  );

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
        {renderTopBar()}
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
        {renderTopBar()}
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
            onPress={() => router.navigate("/product-list")}
          >
            <Text style={styles.shopNowText}>Start Shopping</Text>
          </HapticButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderTopBar()}
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
        contentContainerStyle={[
          styles.listContent,
          {
            // Clears the home indicator, and the compare bar only when it is
            // actually up — the old flat 120 left a hole the rest of the time.
            paddingBottom:
              insets.bottom +
              (compareList.length > 0 ? COMPARE_BAR_CLEARANCE : SPACING.l),
          },
        ]}
        showsVerticalScrollIndicator={false}
      />
      {/* View Toggle FAB */}
      {/* <HapticButton style={styles.leftFab} onPress={toggleViewMode}>
        <Ionicons
          name={viewMode === "grid" ? "list" : "grid"}
          size={22}
          color="#053844"
        />
      </HapticButton> */}
      {/* Compare Button */}
      {compareList.length > 0 && (
        <HapticButton
          style={[
            styles.compareButton,
            { bottom: Math.max(insets.bottom, SPACING.m) },
          ]}
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
    // No hand-rolled Android status-bar padding: SafeAreaView already reports
    // that inset, so the flat 30 sat on top of it and pushed the bar down by a
    // different amount on every device.
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    // The icon buttons carry their own 40pt target, so half of it lands inside
    // this padding and the glyphs line up on the page's 16pt gutter.
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerSideRight: {
    justifyContent: "flex-end",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject, // This makes it cover the whole screen
    backgroundColor: "black",
    zIndex: 999, // Ensures it is above the header and tabs
  },
  headerTitle: {
    flexShrink: 1,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  /** A comfortable target whatever glyph sits in it. */
  iconBtn: {
    minWidth: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
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
    // `bottom` is set from the safe-area inset at render.
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
