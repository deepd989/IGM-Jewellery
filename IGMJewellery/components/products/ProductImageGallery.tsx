import { useCartStatus } from "@/hooks/useCartStatus";
import { Product } from "@/interfaces/product.interface";
import { useAddToCartMutation } from "@/store/apis/cart";
import { useGetProductsQuery } from "@/store/apis/product";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/apis/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { COLORS, SPACING } from "../../constants/theme";
import { HapticButton } from "../basic components/hapticButton";

interface ProductImageGalleryProps {
  images: string[];
  product: Product;
}

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = 380;

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  product,
}) => {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [showSimilarModal, setShowSimilarModal] = useState(false);
  const imageUrls = useMemo(() => images.map((img) => ({ url: img })), [images]);
  /**
   * ImageViewer measures its shots once, in componentDidMount, and never again.
   * The try-on shot arrives after mount and takes the lead slot, so without a
   * remount it would be drawn at whatever ratio the thumbnail it displaced had.
   */
  const viewerKey = useMemo(() => images.join("|"), [images]);

  // Wishlist functionality
  const { data: wishlistData } = useGetWishlistQuery();
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] =
    useRemoveFromWishlistMutation();

  // Fetch similar products (same brand or product type)
  const { data: allProducts = [] } = useGetProductsQuery();
  const similarProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.brand === product.brand || p.productType === product.productType)
    )
    .slice(0, 10);

  const isInWishlist = wishlistData?.items.some(
    (item) => item.product.id === product.id
  );

  const onScroll = (event: any) => {
    const slide = Math.ceil(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width
    );
    if (slide !== activeSlide) {
      setActiveSlide(slide);
    }
  };

  const handleToggleWishlist = async () => {
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
    <View style={styles.container}>
      {/* Header Actions (Share) Overlay */}
      <View style={styles.headerOverlay}>
        <HapticButton style={styles.iconBtn}>
          <Ionicons
            name="share-social-outline"
            size={24}
            color={COLORS.primary}
          />
        </HapticButton>
      </View>

      <View style={{ width, height: IMAGE_HEIGHT }}>
        <ImageViewer
          key={viewerKey}
          imageUrls={imageUrls}
          resizeMode="cover"
          index={activeSlide}
          onChange={(index) => setActiveSlide(index || 0)}
          enableSwipeDown={false}
          saveToLocalByLongPress={false}
          renderIndicator={() => {}}
        />
      </View>

      {/* Pagination Indicators */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeSlide ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* Rating & Icons Row */}
      <View style={styles.floatingMeta}>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>
            {product.rating?.toFixed(1) || "5.0"}
          </Text>
          <Ionicons
            name="star"
            size={10}
            color={COLORS.primary}
            style={{ marginLeft: 2 }}
          />
          <Text style={styles.ratingCount}>(11)</Text>
        </View>

        <View style={styles.mediaIcons}>
          {/* View Similar Icon */}
          <HapticButton
            style={styles.mediaIcon}
            onPress={() => setShowSimilarModal(true)}
          >
            <Ionicons name="albums-outline" size={20} color={COLORS.primary} />
          </HapticButton>

          {/* Wishlist Heart Icon */}
          <HapticButton
            style={styles.mediaIcon}
            onPress={handleToggleWishlist}
            disabled={isAddingToWishlist || isRemovingFromWishlist}
          >
            {isAddingToWishlist || isRemovingFromWishlist ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Ionicons
                name={isInWishlist ? "heart" : "heart-outline"}
                size={20}
                color={COLORS.primary}
              />
            )}
          </HapticButton>
        </View>
      </View>

      {/* Similar Products Modal */}
      <Modal
        visible={showSimilarModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSimilarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <HapticButton
            style={styles.modalOverlayTouch}
            activeOpacity={1}
            onPress={() => setShowSimilarModal(false)}
          />
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                View similar products across brands
              </Text>
              <HapticButton
                onPress={() => setShowSimilarModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </HapticButton>
            </View>

            {/* Similar Products List */}
            <FlatList
              data={similarProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.similarProductsList}
              renderItem={({ item }) => (
                <SimilarProductCard
                  product={item}
                  onPress={() => {
                    setShowSimilarModal(false);
                    router.navigate({
                      pathname: "/product/[id]",
                      params: { id: item.id },
                    });
                  }}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No similar products found
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Similar Product Card Component
const SimilarProductCard = ({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) => {
  const { data: wishlistData } = useGetWishlistQuery();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();
  const { isInCart, goToCart } = useCartStatus(product.id);

  const isInWishlist = wishlistData?.items.some(
    (item) => item.product.id === product.id
  );

  const handleToggleWishlist = async (e: any) => {
    e.stopPropagation();
    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id).unwrap();
      } else {
        await addToWishlist(product).unwrap();
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  /** Adds the piece, or opens the cart once it is already in there. */
  const handleCartPress = async (e: any) => {
    e.stopPropagation();

    if (isInCart) {
      goToCart();
      return;
    }

    try {
      await addToCart({ product, quantity: 1 }).unwrap();
      Alert.alert("Success", "Added to cart");
    } catch (error) {
      Alert.alert("Error", "Failed to add to cart");
    }
  };

  const handleTryNow = (e: any) => {
    e.stopPropagation();
    onPress();
  };

  return (
    <HapticButton
      style={styles.similarCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Product Image */}
      <View style={styles.similarImageWrapper}>
        <Image
          source={{ uri: product.thumbnailUrls[0] }}
          style={styles.similarImage}
          resizeMode="cover"
        />

        {/* Wishlist Heart */}
        <HapticButton
          style={styles.similarHeartIcon}
          onPress={handleToggleWishlist}
        >
          <Ionicons
            name={isInWishlist ? "heart" : "heart-outline"}
            size={18}
            color={isInWishlist ? COLORS.primary : COLORS.text}
          />
        </HapticButton>
      </View>

      {/* Product Details */}
      <View style={styles.similarDetails}>
        <Text style={styles.similarPrice}>
          ₹{product.discountedPrice.toLocaleString()}
        </Text>
        {product.givenPrice && (
          <Text style={styles.similarOriginalPrice}>
            ₹{product.givenPrice.toLocaleString()}
          </Text>
        )}
      </View>

      <Text style={styles.similarTitle} numberOfLines={1}>
        {product.title}
      </Text>
      <Text style={styles.similarBrand}>{product.brand}</Text>

      {/* Action Buttons */}
      <View style={styles.similarActions}>
        <HapticButton style={styles.compareBtn} onPress={handleTryNow}>
          <Ionicons
            name="sparkles-outline"
            size={12}
            color={COLORS.primary}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.compareBtnText}>Try Now</Text>
        </HapticButton>
        <HapticButton
          style={styles.addToCartBtnSmall}
          onPress={handleCartPress}
        >
          <Text style={styles.addToCartBtnText}>
            {isInCart ? "Go to cart" : "Add to cart"}
          </Text>
        </HapticButton>
      </View>
    </HapticButton>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    position: "relative",
    marginBottom: SPACING.m,
  },
  headerOverlay: {
    position: "absolute",
    top: 10,
    right: SPACING.m,
    zIndex: 10,
  },
  iconBtn: {
    padding: 8,
  },
  scrollView: {
    width: width,
    height: IMAGE_HEIGHT,
  },
  imageContainer: {
    width: width,
    height: IMAGE_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  dot: {
    width: 30,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    backgroundColor: "#E0E0E0",
  },
  floatingMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.s,
    marginTop: -30,
  },
  ratingBadge: {
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  ratingCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  mediaIcons: {
    flexDirection: "row",
    gap: 12,
  },
  mediaIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalOverlayTouch: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  similarProductsList: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  // Similar Product Card Styles
  similarCard: {
    width: 200,
    backgroundColor: "#FFFFFF",
    marginRight: SPACING.m,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 8,
    overflow: "hidden",
  },
  similarImageWrapper: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#FAFAFA",
    position: "relative",
  },
  similarImage: {
    width: "100%",
    height: "100%",
  },
  similarHeartIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  similarDetails: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingHorizontal: SPACING.s,
    paddingTop: SPACING.s,
  },
  similarPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginRight: 6,
  },
  similarOriginalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: COLORS.textSecondary,
  },
  similarTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.text,
    paddingHorizontal: SPACING.s,
    marginTop: 4,
  },
  similarBrand: {
    fontSize: 11,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.s,
    marginTop: 2,
  },
  similarActions: {
    flexDirection: "row",
    gap: 8,
    padding: SPACING.s,
    paddingTop: SPACING.m,
  },
  compareBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
  },
  compareBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  addToCartBtnSmall: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 4,
  },
  addToCartBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
