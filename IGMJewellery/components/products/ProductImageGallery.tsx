import { Product } from "@/interfaces/product.interface";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/apis/wishlist";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, SPACING } from "../../constants/theme";

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
  const [activeSlide, setActiveSlide] = useState(0);

  // Wishlist functionality
  const { data: wishlistData } = useGetWishlistQuery();
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] =
    useRemoveFromWishlistMutation();

  const isInWishlist = wishlistData?.items.some(
    (item) => item.id === product.id,
  );

  const onScroll = (event: any) => {
    const slide = Math.ceil(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width,
    );
    if (slide !== activeSlide) {
      setActiveSlide(slide);
    }
  };

  const handleToggleWishlist = async () => {
    if (isInWishlist) {
      // Remove from wishlist
      try {
        await removeFromWishlist(product.id).unwrap();
      } catch (error) {
        Alert.alert("Error", "Failed to remove from wishlist");
      }
    } else {
      // Add to wishlist
      try {
        await addToWishlist(product).unwrap();
      } catch (error: any) {
        if (error?.data === "Item already in wishlist") {
          Alert.alert(
            "Already in Wishlist",
            "This item is already wishlisted.",
          );
        } else {
          Alert.alert("Error", "Failed to add to wishlist");
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Actions (Share/Fav) Overlay */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons
            name="share-social-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {images.map((img, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: img }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>

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
          <TouchableOpacity style={styles.mediaIcon}>
            <Ionicons
              name="videocam-outline"
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          {/* Wishlist Heart Icon */}
          <TouchableOpacity
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
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    padding: SPACING.l,
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
});
