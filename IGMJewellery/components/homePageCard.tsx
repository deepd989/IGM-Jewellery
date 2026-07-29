import { ProductType } from "@/enums/productType.enum";
import { useGetProductsQuery } from "@/store/apis/product";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS } from "../constants/theme";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../store/apis/wishlist";
import { HapticButton } from "./basic components/hapticButton";
import { ProductCard } from "./products/ProductCard";
import { TryOnSelectorModal } from "./products/TryOnSelectorModal";
import EarringIcon from "./ui/earingsComponentSvg";
import { assetUrl } from "@/constants/assets";

const { width } = Dimensions.get("window");

export default function HowItLooksWrapper({
  seeHowItLooks,
}: {
  seeHowItLooks?: boolean;
  children?: React.ReactNode;
}) {
  const { data: products = [] } = useGetProductsQuery({});
  const [cardTitle, setCardTitle] = React.useState<string>(
    ProductType.Necklace
  );

  /**
   * The last product of the chosen type, or the first of any type. This used
   * to re-filter the whole catalogue once per product — the same answer,
   * computed n times, on every render of the page.
   */
  const filteredProduct = useMemo(() => {
    const ofType = products.filter((prod) => prod.productType === cardTitle);
    return ofType[ofType.length - 1] || products[0];
  }, [products, cardTitle]);

  if (!filteredProduct)
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ marginTop: 50 }}
      />
    );

  return (
    <View style={styles.outerContainer}>
      {/* Category Icons Row */}

      <View style={styles.iconRow}>
        <HapticButton onPress={() => setCardTitle(ProductType.Necklace)}>
          <View
            style={{
              alignItems: "center",
              paddingBottom: 4,
              borderBottomWidth: 2,
              borderBottomColor:
                cardTitle === ProductType.Necklace ? "#053844" : "transparent",
            }}
          >
            <MaterialCommunityIcons name="necklace" size={28} color="#053844" />
            <Text
              style={{
                marginTop: 5,
                fontSize: 10,
                color: "#053844",
                textAlign: "center",
              }}
            >
              Necklace
            </Text>
          </View>
        </HapticButton>
        <HapticButton onPress={() => setCardTitle(ProductType.Ring)}>
          <View
            style={{
              alignItems: "center",
              paddingBottom: 4,
              borderBottomWidth: 2,
              borderBottomColor:
                cardTitle === ProductType.Ring ? "#053844" : "transparent",
            }}
          >
            <MaterialCommunityIcons name="ring" size={28} color="#053844" />
            <Text
              style={{
                marginTop: 5,
                fontSize: 10,
                color: "#053844",
                textAlign: "center",
              }}
            >
              Ring
            </Text>
          </View>
        </HapticButton>
        <HapticButton onPress={() => setCardTitle("Bracelet")}>
          <View
            style={{
              alignItems: "center",
              paddingBottom: 4,
              borderBottomWidth: 2,
              borderBottomColor:
                cardTitle === "Bracelet" ? "#053844" : "transparent",
            }}
          >
            <Image
              source={{
                uri: assetUrl("home.categoryTab.icon.bracelet"),
              }}
              style={{ width: 28, height: 28 }}
              contentFit="contain"
            ></Image>
            <Text
              style={{
                marginTop: 5,
                fontSize: 10,
                color: "#053844",
                textAlign: "center",
              }}
            >
              Bracelet
            </Text>
          </View>
        </HapticButton>
        <HapticButton onPress={() => setCardTitle("Bangles")}>
          <View
            style={{
              alignItems: "center",
              paddingBottom: 4,
              borderBottomWidth: 2,
              borderBottomColor:
                cardTitle === "Bangles" ? "#053844" : "transparent",
            }}
          >
            <Image
              source={{
                uri: assetUrl("home.categoryTab.icon.bangle"),
              }}
              style={{ width: 28, height: 28 }}
              contentFit="contain"
            ></Image>
            <Text
              style={{
                marginTop: 5,
                fontSize: 10,
                color: "#053844",
                textAlign: "center",
              }}
            >
              Bangles
            </Text>
          </View>
        </HapticButton>
        <HapticButton onPress={() => setCardTitle(ProductType.Earring)}>
          <View
            style={{
              alignItems: "center",
              paddingBottom: 4,
              borderBottomWidth: 2,
              borderBottomColor:
                cardTitle === ProductType.Earring ? "#053844" : "transparent",
            }}
          >
            <EarringIcon width={32} height={32} />
            <Text
              style={{
                marginTop: 5,
                fontSize: 10,
                color: "#053844",
                textAlign: "center",
              }}
            >
              Earring
            </Text>
          </View>
        </HapticButton>
      </View>
      {seeHowItLooks && <SeeHowItLooksOnYouCard product={filteredProduct} />}
      {!seeHowItLooks && (
        <FlatList
          data={[filteredProduct]}
          renderItem={({ item }) => (
            <ProductCard product={item} viewMode="list" onPress={() => {}} />
          )}
          numColumns={1}
          keyExtractor={(item) => item?.id}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
}

export const SeeHowItLooksOnYouCard = ({ product }) => {
  const { data: wishlistData } = useGetWishlistQuery();
  // Declared with the other hooks: it used to sit below the `!product` return,
  // so the hook order changed the moment a product arrived.
  const [isTryOnSelectorVisible, setIsTryOnSelectorVisible] = useState(false);

  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] =
    useRemoveFromWishlistMutation();

  const isInWishlist = wishlistData?.items.some(
    (item) => item.product?.id === product?.id
  );
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
  const deliveryDate = useMemo(() => {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 2);
    return delivery.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }, []);

  if (!product) return null;

  return (
    <View style={necklaceCardStyle.wrapper}>
      <HapticButton
        style={necklaceCardStyle.card}
        onPress={() =>
          router.navigate({
            pathname: "/product-list",
            params: { categoryName: product.productType },
          })
        }
      >
        {/* White Product Image Area */}
        <View style={necklaceCardStyle.imageArea}>
          <HapticButton
            style={necklaceCardStyle.wishlistButton}
            onPress={handleToggleWishlist}
            disabled={isAddingToWishlist || isRemovingFromWishlist}
          >
            {isAddingToWishlist || isRemovingFromWishlist ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Ionicons
                name={isInWishlist ? "heart" : "heart-outline"}
                size={20}
                color={isInWishlist ? COLORS.primary : COLORS.text}
              />
            )}
          </HapticButton>

          <Image
            source={{
              uri: product.thumbnailUrls[0],
            }}
            style={necklaceCardStyle.image}
            contentFit="contain"
          />

          <View style={necklaceCardStyle.deliveryTag}>
            <MaterialCommunityIcons
              name="truck-delivery-outline"
              size={16}
              color="#053844"
            />
            <Text style={necklaceCardStyle.deliveryText}>{deliveryDate}</Text>
          </View>
        </View>

        {/* Text and Pricing Details */}
        <View style={necklaceCardStyle.detailsContainer}>
          <View style={necklaceCardStyle.leftCol}>
            <Text style={necklaceCardStyle.title}>{product.title}</Text>
            <Text style={necklaceCardStyle.brand}>{product.brand}</Text>
          </View>

          <View style={necklaceCardStyle.rightCol}>
            <Text style={necklaceCardStyle.price}>
              ₹{product.discountedPrice.toLocaleString()}
            </Text>
            <Text style={necklaceCardStyle.oldPrice}>
              ₹{product.givenPrice.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Pagination Dots (Placeholder) */}
        <View style={necklaceCardStyle.pagination}>
          {/* <View style={[necklaceCardStyle.dot, necklaceCardStyle.dotActive]} />
          <View style={necklaceCardStyle.dot} />
          <View style={necklaceCardStyle.dot} /> */}
        </View>

        {/* Floating Action Button */}
        <HapticButton
          style={necklaceCardStyle.tryOnButton}
          onPress={(e) => {
            e.stopPropagation();
            setIsTryOnSelectorVisible(true);
          }}
        >
          <Ionicons name="sparkles" size={18} color="#fff" />
          <Text style={necklaceCardStyle.tryOnText}>
            See how it looks on you
          </Text>
        </HapticButton>
      </HapticButton>

      <TryOnSelectorModal
        visible={isTryOnSelectorVisible}
        onClose={() => setIsTryOnSelectorVisible(false)}
        onSelectVR={() => {
          router.navigate({
            pathname: "/virtualTryOn2",
            params: {
              productId: product.id,
              productTitle: product.title,
            },
          });
        }}
        onSelectAI={() => {
          router.navigate({
            pathname: "/tryOn",
            params: {
              productId: product.id,
            },
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "white", // Light blue background from image
    padding: 16,
    paddingBottom: 0,
    borderRadius: 12,
    marginTop: 0,
    marginBottom: 0,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

const necklaceCardStyle = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    height: 430,
  },
  card: {
    backgroundColor: "#EBF2F5",
    width: "100%",
    borderRadius: 15,
    padding: 16, // creates that subtle inner border look
  },
  imageArea: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 240,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "80%",
    height: "80%",
  },
  wishlistButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  deliveryTag: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#D1E3E7",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deliveryText: {
    fontSize: 11,
    color: "#053844",
    marginLeft: 4,
    fontWeight: "500",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  brand: {
    fontSize: 14,
    color: "#6A8B92",
    marginTop: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  oldPrice: {
    fontSize: 14,
    color: "#6A8B92",
    textDecorationLine: "line-through",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: 15,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#BDCACC",
  },
  dotActive: {
    backgroundColor: "#053844",
    width: 14,
  },
  tryOnButton: {
    position: "absolute",
    bottom: -15, // Hangs off the bottom of the card
    alignSelf: "center",
    backgroundColor: "#053844",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  tryOnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});
