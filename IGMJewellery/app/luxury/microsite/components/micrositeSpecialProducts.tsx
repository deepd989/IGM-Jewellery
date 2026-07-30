import { HapticButton } from "@/components/basic components/hapticButton";
import { BrandMicrositeSpecialProduct } from "@/interfaces/brandMicrosite.interface";
import { useGetProductsQuery } from "@/store/apis/product";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { MICROSITE_PRIMARY, withAlpha } from "./micrositeTheme";

type MicrositeSpecialProductsProps = {
  products: BrandMicrositeSpecialProduct[];
  primaryColor?: string;
  secondaryColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * The pieces the brand leads with, one at a time. Stepped through rather than
 * swiped: each is meant to be looked at, and the arrows say there are more
 * without the shopper having to discover the gesture.
 */
export default function MicrositeSpecialProducts({
  products,
  primaryColor = MICROSITE_PRIMARY,
  secondaryColor,
  style,
}: MicrositeSpecialProductsProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  // The catalogue is already loaded for the storefront, so the name and price
  // are read from it rather than fetched per product.
  const { data: catalogue = [] } = useGetProductsQuery({});

  const current = products[index];
  const details = useMemo(
    () => catalogue.find((product) => product.id === current?.productId),
    [catalogue, current]
  );

  if (!current) return null;

  const step = (by: number) =>
    setIndex((previous) => {
      const next = previous + by;
      // Wraps, so neither arrow is ever a dead end.
      if (next < 0) return products.length - 1;
      if (next >= products.length) return 0;
      return next;
    });

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: primaryColor,
            borderColor: withAlpha(secondaryColor ?? "#FFFFFF", 0.35),
          },
        ]}
      >
        <HapticButton
          activeOpacity={0.9}
          onPress={() =>
            router.navigate({
              pathname: "/product/[id]",
              params: { id: current.productId },
            })
          }
        >
          <Image
            source={{ uri: current.productImageUrl }}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
        </HapticButton>

        {/* Sits the caption on its own ground, whatever the artwork behind. */}
        <LinearGradient
          colors={["rgba(0,0,0,0)", withAlpha(primaryColor, 0.9)]}
          style={styles.captionScrim}
          pointerEvents="none"
        />

        <View style={styles.captionRow}>
          {products.length > 1 && (
            <HapticButton
              style={styles.arrow}
              activeOpacity={0.7}
              onPress={() => step(-1)}
            >
              <ChevronLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
            </HapticButton>
          )}

          <View style={styles.caption}>
            <Text style={styles.title} numberOfLines={1}>
              {details?.title ?? "View piece"}
            </Text>
            {!!details && (
              <Text style={styles.price} numberOfLines={1}>
                ₹{details.discountedPrice.toLocaleString("en-IN")}
                {!!details.givenPrice && details.givenPrice > details.discountedPrice && (
                  <Text style={styles.strikePrice}>
                    {"  "}₹{details.givenPrice.toLocaleString("en-IN")}
                  </Text>
                )}
              </Text>
            )}
          </View>

          {products.length > 1 && (
            <HapticButton
              style={styles.arrow}
              activeOpacity={0.7}
              onPress={() => step(1)}
            >
              <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
            </HapticButton>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 28,
    overflow: "hidden",
    paddingTop: 20,
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
  captionScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 110,
  },
  captionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
  },
  arrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  caption: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  price: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  strikePrice: {
    fontSize: 11,
    fontWeight: "400",
    textDecorationLine: "line-through",
    color: "rgba(255,255,255,0.6)",
  },
});
