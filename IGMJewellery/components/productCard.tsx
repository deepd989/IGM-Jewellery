import { Product } from "@/interfaces/product.interface";
import { useAddToCartMutation, useAddToTrialMutation } from "@/store/apis/cart";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../auth/authContext";
import { generateJewelleryImage } from "../helpers/generateJewelleryImage";
import { firstImageHelper } from "../helpers/imageUsageHelper";
import { HapticButton } from "./basic components/hapticButton";

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  width?: number;
  deliveryDate?: string;
  label1Text?: string;
  label2Text?: string;
}

const ProductCard2: React.FC<ProductCardProps> = ({
  product,
  deliveryDate,
  width,
  label1Text = "Try Now",
  label2Text = "Add to cart",
  onPress,
}) => {
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const { userId, apiUrl, imageGlobal } = useAuth();
  const [firstImageBase64State, setFirstImageBase64State] = useState("");
  const [isTryOnModalVisible, setIsTryOnModalVisible] = useState(false);

  const handleAddToCart = async (e: any) => {
    e.stopPropagation();
    try {
      alert(` ${product.title} Added to cart`);
      await addToCart({ product, quantity: 1 }).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  useEffect(() => {
    generateJewelleryImage(
      apiUrl,
      userId as string,
      product,
      "casual wear",
      "black",
      setFirstImageBase64State
    );
  }, []);

  useEffect(() => {}, [isTryOnModalVisible]);

  const [addToTrial, { isLoading: isAddingToTrial }] = useAddToTrialMutation();
  const handleTryAtHome = async (e: any) => {
    e.stopPropagation();
    console.log("Try at home clicked for:", product.title);

    try {
      await addToTrial(product).unwrap();
      console.log("Successfully added to trial");

      Alert.alert(
        "Added to Trial List",
        `${product.title} has been added to your home trial list.`,
        [
          {
            text: "Continue Shopping",
            style: "cancel",
            onPress: () => console.log("Continue shopping pressed"),
          },
          {
            text: "View Trial List",
            onPress: () => {
              console.log("Navigating to trial tab");
              router.push("/cart?tab=trial");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Failed to add to trial:", error);

      // Check if item already in trial
      if (error?.data === "Item already in trial list") {
        Alert.alert(
          "Already in Trial",
          "This item is already in your trial list.",
          [
            { text: "OK", style: "cancel" },
            {
              text: "View Trial List",
              onPress: () => router.push("/cart?tab=trial"),
            },
          ]
        );
      } else {
        Alert.alert("Error", "Failed to add item to trial. Please try again.");
      }
    }
  };

  // if (isTryOnModalVisible) {
  //   <SafeAreaView>
  //     <TryOnModal
  //       visible={isTryOnModalVisible}
  //       onClose={() => setIsTryOnModalVisible(false)}
  //       tryOnUrl="https://jeweltry.plushvie.in/igmindia/118305"
  //       productTitle={product.title}
  //     ></TryOnModal>
  //   </SafeAreaView>;
  // }

  if (!product) {
    return (
      <View style={[styles.card, { width }]}>
        <View style={styles.imagePlaceholder}>
          <Text style={{ color: "#ccc" }}>Loading...</Text>
        </View>
      </View>
    );
  }
  return (
    <HapticButton style={[styles.card, { width }]} onPress={onPress}>
      {/* Top badges */}
      <View style={styles.topRow}>
        {product && product.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>New</Text>
          </View>
        )}
        {!product.isNew && (
          <View style={{ paddingHorizontal: 6, paddingVertical: 10 }} />
        )}

        {/* <HapticButton>
          <FontAwesome name="heart-o" size={20} color="black" />
        </HapticButton> */}
      </View>

      {/* Image placeholder */}
      <View style={styles.imagePlaceholder}>
        <Image
          source={{
            uri: firstImageHelper(
              firstImageBase64State,
              product.thumbnailUrls[0],
              imageGlobal
            ),
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Delivery badge is truned off*/}
      {/* {!deliveryDate && (
        <View style={styles.deliveryBadge}>
          <MaterialIcons name="local-shipping" size={16} color="black" />
          <Text style={styles.deliveryText}>{deliveryDate}</Text>
        </View>
      )} */}

      {/* Price */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>
          ₹{product.discountedPrice.toLocaleString()}
        </Text>
        <Text style={styles.originalPrice}>
          ₹{product.givenPrice.toLocaleString()}
        </Text>
      </View>

      {/* Product info */}
      <Text style={styles.productName}>{product.title}</Text>
      <Text style={styles.brand}>{product.brand}</Text>

      {/* Rating */}
      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FontAwesome
            key={i}
            name={i < product.rating ? "star" : "star-o"}
            size={16}
            color="#f5c518"
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <HapticButton
          style={[styles.button, styles.tryNow]}
          onPress={(e) => {
            router.push({
              pathname: "/virtualTryOn2",
              params: {
                tryOnUrl: `https://jeweltry.plushvie.in/igmindia/118305`,
                productTitle: product.title,
              },
            });
          }}
        >
          <Text style={styles.tryNowText}>
            <Ionicons name="sparkles" style={{ fontSize: 14 }}></Ionicons>
            {" " + label1Text}
          </Text>
        </HapticButton>
        <HapticButton
          style={[styles.button, styles.tryAtHome]}
          onPress={(event) => {
            handleAddToCart(event);
          }}
        >
          <Text style={styles.tryAtHomeText}>{label2Text}</Text>
        </HapticButton>
      </View>
    </HapticButton>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    margin: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newBadge: {
    backgroundColor: "#eee",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  deliveryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  deliveryText: {
    marginLeft: 4,
    fontSize: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: "#888",
    marginLeft: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  brand: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 2,
  },
  tryNow: {
    borderWidth: 0,
    borderColor: "#053844",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  tryAtHome: {
    backgroundColor: "#053844",
  },
  tryNowText: {
    textAlign: "center",
  },
  tryAtHomeText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ProductCard2;
