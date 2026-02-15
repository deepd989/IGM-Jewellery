import { useGetCartQuery } from "@/store/apis/cart";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HapticButton
          onPress={() => router.replace("/(tabs)/categories")}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color="#053844" />
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
                  <Image
                    source={{
                      uri: orderInfo.items[0].product.thumbnailUrls[0],
                    }}
                    style={styles.successImage}
                  />
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={22} color="#FFF" />
                  </View>
                </>
              ) : (
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={22} color="#FFF" />
                </View>
              )}
            </View>

            <Text style={styles.congrats}>Congratulations!</Text>
            <Text style={styles.subtext}>
              Your order has been placed successfully.
            </Text>

            <View style={styles.orderIdRow}>
              <Text style={styles.orderId}>Order ID: {orderDisplayId}</Text>
              <HapticButton>
                <Ionicons name="copy-outline" size={16} />
              </HapticButton>
            </View>
          </View>

          {/* Order Summary */}
          {orderInfo.items.length > 0 && (
            <View style={styles.summarySection}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                <Text style={styles.summaryAmount}>
                  ₹{orderInfo.finalTotal.toLocaleString()}
                </Text>
              </View>

              <OrderItemCard
                item={orderInfo.items[0]}
                style={styles.productCard}
              />
            </View>
          )}

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
            onPress={() => router.push("/orders")}
          >
            <Text style={styles.secondaryBtnText}>View your orders</Text>
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
  },

  content: {
    flex: 1,
  },

  topSection: {
    flex: 1,
    justifyContent: "space-between",
  },

  successBox: {
    alignItems: "center",
    paddingVertical: 24,
  },

  iconContainer: {
    width: 110,
    height: 110,
    marginBottom: 12,
  },

  successImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    opacity: 0.15,
  },

  checkCircle: {
    position: "absolute",
    top: 0,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#053844",
    justifyContent: "center",
    alignItems: "center",
  },

  congrats: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtext: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 12,
  },

  orderIdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  orderId: {
    fontSize: 14,
    fontWeight: "600",
  },

  summarySection: {
    paddingHorizontal: SPACING.m,
  },

  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  summaryTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  summaryAmount: {
    fontSize: 14,
    fontWeight: "800",
  },

  productCard: {
    width: width - SPACING.m * 2,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACING.m,
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
    backgroundColor: "#053844",
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
    color: "#8E8E93",
  },
});
