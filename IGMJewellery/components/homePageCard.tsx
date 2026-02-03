import { ProductType } from "@/enums/productType.enum";
import { Product } from "@/interfaces/product.interface";
import { useGetProductsQuery } from "@/store/apis/product";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../auth/authContext";
import { generateJewelleryImage } from "../helpers/generateJewelleryImage";
import { firstImageHelper } from "../helpers/imageUsageHelper";
import EarringIcon from "./ui/earingsComponentSvg";

export default function HomePageCard() {
  const { userId } = useAuth();
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery({});
  const [cardTitle, setCardTitle] = React.useState<ProductType>(
    ProductType.Necklace
  );
  return (
    <View
      style={{
        backgroundColor: "#F8F8F8",
        paddingTop: 6,
        marginTop: 100,
        borderRadius: 8,
        paddingHorizontal: 12,
        borderColor: "grey",
        borderWidth: 2,
        marginBottom: 40,
      }}
    >
      {/* Category Icons (static placeholders) */}
      <View style={styles.iconRow}>
        <MaterialCommunityIcons
          name="necklace"
          size={32}
          color="#000"
          onPress={() => setCardTitle(ProductType.Necklace)}
        />
        <MaterialCommunityIcons
          name="ring"
          size={32}
          color="#000"
          onPress={() => setCardTitle(ProductType.Ring)}
        />
        <MaterialCommunityIcons
          name="diamond-stone"
          size={32}
          color="#000"
          onPress={() => setCardTitle(ProductType.DiamondStone)}
        />
        <MaterialCommunityIcons
          name="gold"
          size={32}
          color="#000"
          onPress={() => setCardTitle(ProductType.Gold)}
        />
        <MaterialCommunityIcons
          name="gift"
          size={32}
          color="#000"
          onPress={() => setCardTitle(ProductType.Gift)}
        />
        <TouchableOpacity onPress={() => setCardTitle(ProductType.Earring)}>
          <EarringIcon width={40} height={40} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 2,
          backgroundColor: "#ccc",
          width: "100%",
        }}
      />
      {/* Necklace Section */}
      {/* <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{cardTitle}</Text>
            <Ionicons name="chevron-forward" size={18} />
          </View> */}

      {/* Product Card */}
      <NecklaceCard
        productType={cardTitle}
        product={products.filter((p) => p.productType === cardTitle)[0]}
        onTryOn={() => {
          router.push({
            pathname: "/tryOn",
            params: { userId: userId },
          });
        }}
        deliveryDate="Delivery by Sep 25"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconRow: {
    marginTop: 20,
    flexGrow: 0,
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconItem: { fontSize: 22, marginRight: 20 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    alignItems: "center",
  },
  sectionTitle: { fontSize: 20, fontWeight: "600" },
});

interface Props {
  productType: ProductType;
  product: Product; // undefined in case there are no products of that type
  onTryOn: () => void;
  deliveryDate: string;
}

export const NecklaceCard: React.FC<Props> = ({
  productType,
  product,
  deliveryDate,
  onTryOn,
}) => {
  const { apiUrl, userId, imageGlobal } = useAuth();
  const [firstImageBase64State, setFirstImageBase64State] = useState("");
  console.log(product?.title, product?.id);
  useEffect(() => {
    // 1. Reset the image state so the old product's image doesn't flicker
    // while the new one is loading
    setFirstImageBase64State("");

    // 2. Only run the generator if a product actually exists
    if (product) {
      generateJewelleryImage(
        apiUrl,
        userId as string,
        product,
        "casual wear",
        "black",
        setFirstImageBase64State
      );
    }

    // ADD DEPENDENCIES HERE:
  }, [product, apiUrl, userId]);

  return (
    <View style={necklaceCardStyle.wrapper}>
      <TouchableOpacity
        style={necklaceCardStyle.card}
        activeOpacity={0.9}
        onPress={() => {
          router.push({ pathname: "/product-list" });
        }}
      >
        {/* Product Image */}

        <View style={necklaceCardStyle.imageWrapper}>
          <Image
            source={{
              uri: firstImageHelper(
                firstImageBase64State,
                product.thumbnailUrls[0],
                imageGlobal
              ),
            }}
            style={necklaceCardStyle.image}
          />
          {/* { product &&
          <TouchableOpacity style={necklaceCardStyle.wishlistButton}>
            <AntDesign name="heart" size={22} color="#000" />
          </TouchableOpacity>} */}
          {product && (
            <View style={necklaceCardStyle.deliveryTag}>
              <AntDesign name="truck" size={14} color="#555" />
              <Text style={necklaceCardStyle.deliveryText}>{deliveryDate}</Text>
            </View>
          )}
        </View>

        {/* Details */}
        {
          product &&
            product.discountedPrice != undefined &&
            product.givenPrice != undefined && (
              <View style={necklaceCardStyle.details}>
                <Text style={necklaceCardStyle.title}>
                  {product?.title || "Not Available"}
                </Text>

                <View style={necklaceCardStyle.priceRow}>
                  <Text style={necklaceCardStyle.price}>
                    ₹{product?.discountedPrice.toLocaleString()}
                  </Text>
                  <Text style={necklaceCardStyle.oldPrice}>
                    ₹{product?.givenPrice.toLocaleString()}
                  </Text>
                </View>

                <Text style={necklaceCardStyle.brand}>{product?.brand}</Text>
              </View>
            )
          // </View>
        }
      </TouchableOpacity>

      {/* Floating "See how it looks on you" Button */}
      <TouchableOpacity style={necklaceCardStyle.tryOnButton} onPress={onTryOn}>
        <Ionicons name="sparkles-outline" size={18} color="#fff" />
        <Text style={necklaceCardStyle.tryOnText}>See how it looks on you</Text>
      </TouchableOpacity>
    </View>
  );
};

const necklaceCardStyle = StyleSheet.create({
  wrapper: {},

  card: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  imageWrapper: {
    width: "100%",
    height: 160,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  wishlistButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    elevation: 3,
  },

  deliveryTag: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    elevation: 2,
  },

  deliveryText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },

  details: {
    marginTop: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },

  oldPrice: {
    fontSize: 14,
    color: "#888",
    marginLeft: 10,
    textDecorationLine: "line-through",
  },

  brand: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },

  // Floating Button
  tryOnButton: {
    position: "absolute",
    bottom: -30,
    // Center horizontally
    alignSelf: "center",
    width: 150 * 1.8,
    height: 42,
    backgroundColor: "#000",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  tryOnText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
});
