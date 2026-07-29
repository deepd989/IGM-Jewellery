import { useGetCartQuery } from "@/store/apis/cart";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../../components/basic components/hapticButton";
import { OrderItemCard } from "../../components/checkout/OrderItemCard";
import { COLORS, SPACING } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const orderDisplayId =
    (params.orderDisplayId as string) ||
    `#${Math.floor(10000 + Math.random() * 90000)}`;

  const { data: cartData } = useGetCartQuery();

  const orderInfo = useMemo(() => {
    if (!cartData?.items) {
      return {
        totalItems: 0,
        finalTotal: 0,
        items: [],
      };
    }

    const totalItems = cartData.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    const sellingPrice = cartData.items.reduce(
      (acc, item) => acc + item.product.discountedPrice * item.quantity,
      0
    );

    const platformFee = 220;
    const giftAddonsCost =
      cartData.giftAddons
        ?.filter((addon) => addon.isChecked)
        .reduce((sum, addon) => sum + addon.price, 0) || 0;

    return {
      totalItems,
      finalTotal: sellingPrice + platformFee + giftAddonsCost,
      items: cartData.items,
    };
  }, [cartData]);

  // Carousel state
  const [activeIndex, setActiveIndex] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / (width - SPACING.m * 2)
    );
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HapticButton
          onPress={() => router.replace("/(tabs)/categories")}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </HapticButton>
        <Text style={styles.headerTitle}>Order Confirmation</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Top Section */}
        <View style={styles.topSection}>
          {/* Success */}
          <View style={styles.successBox}>
            <View style={styles.iconContainer}>
              {orderInfo.items.length > 0 ? (
                <>
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{
                        uri: orderInfo.items[0].product.thumbnailUrls[0],
                      }}
                      style={styles.successImage}
                    />
                  </View>
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={16} color="#FFF" />
                  </View>
                </>
              ) : (
                <View
                  style={[styles.checkCircle, styles.checkCircleStandalone]}
                >
                  <Ionicons name="checkmark" size={22} color="#FFF" />
                </View>
              )}
            </View>

            <Text style={styles.congrats}>Congratulations!</Text>
            <Text style={styles.subtext}>
              Your order has been placed. Please wait{"\n"}for our further
              updates.
            </Text>

            <View style={styles.orderIdRow}>
              <Text style={styles.orderId}>Order ID: {orderDisplayId}</Text>
              <HapticButton>
                <Ionicons name="copy-outline" size={16} color={COLORS.text} />
              </HapticButton>
            </View>
          </View>

          {/* Order Summary */}
          {orderInfo.items.length > 0 && (
            <View style={styles.summarySection}>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryHeader}>
                <View style={styles.summaryLeft}>
                  <Text style={styles.summaryTitle}>Order Summary</Text>
                  <Text style={styles.summaryAmount}>
                    {" "}
                    ₹{orderInfo.finalTotal.toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.summaryItems}>
                  {orderInfo.totalItems}{" "}
                  {orderInfo.totalItems === 1 ? "Item" : "Items"}
                </Text>
              </View>

              {orderInfo.items.length === 1 ? (
                <OrderItemCard item={orderInfo.items[0]} />
              ) : (
                <>
                  <FlatList
                    data={orderInfo.items}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    keyExtractor={(_, idx) => idx.toString()}
                    snapToInterval={width - SPACING.m * 2}
                    decelerationRate="fast"
                    renderItem={({ item }) => (
                      <View style={{ width: width - SPACING.m * 2 }}>
                        <OrderItemCard item={item} />
                      </View>
                    )}
                  />
                  {/* Carousel Dots */}
                  <View style={styles.dotsRow}>
                    {orderInfo.items.map((_, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.dot,
                          idx === activeIndex
                            ? styles.dotActive
                            : styles.dotInactive,
                        ]}
                      />
                    ))}
                  </View>
                </>
              )}
            </View>
          )}
        </View>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>Delivery in 3–5 days</Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.infoText}>Secure Payment</Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons
              name="return-up-back-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.infoText}>15-day returns</Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <HapticButton
            style={styles.primaryBtn}
            onPress={() => router.replace("/(tabs)/categories")}
          >
            <Text style={styles.primaryBtnText}>Continue Shopping</Text>
          </HapticButton>

          <HapticButton
            style={styles.secondaryBtn}
            onPress={() => router.navigate("/orders")}
          >
            <Text style={styles.secondaryBtnText}>Review your order</Text>
          </HapticButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.m,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
  },

  topSection: {
    flex: 1,
  },

  successBox: {
    alignItems: "center",
    paddingVertical: 24,
  },

  iconContainer: {
    width: 100,
    height: 100,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  imageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#F5F0E8",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  successImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
    opacity: 0.8,
  },

  checkCircle: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },

  checkCircleStandalone: {
    position: "relative",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 0,
  },

  congrats: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
    color: COLORS.text,
  },

  subtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 20,
  },

  orderIdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  orderId: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },

  summarySection: {
    paddingHorizontal: SPACING.m,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 12,
  },

  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  summaryAmount: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },

  summaryItems: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  dotActive: {
    backgroundColor: COLORS.primary,
  },

  dotInactive: {
    backgroundColor: "#D9D9D9",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
  },

  infoCard: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },

  infoText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  bottomSection: {
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  primaryBtn: {
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  primaryBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryBtn: {
    alignItems: "center",
  },

  secondaryBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
});
