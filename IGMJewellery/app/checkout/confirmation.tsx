import { useGetCartQuery } from "@/store/apis/cart";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OrderItemCard } from "../../components/checkout/OrderItemCard";
import { COLORS, SPACING } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const orderId = params.orderId as string;
  const orderDisplayId =
    (params.orderDisplayId as string) ||
    `#${Math.floor(10000 + Math.random() * 90000)}`;

  // Get cart data for order items (in production, this would come from order API)
  const { data: cartData } = useGetCartQuery();

  const orderInfo = useMemo(() => {
    if (!cartData?.items) {
      return {
        totalItems: 0,
        finalTotal: 0,
        orderId: orderDisplayId,
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

    const finalTotal = sellingPrice + platformFee + giftAddonsCost;

    return {
      totalItems,
      finalTotal,
      orderId: orderDisplayId,
      items: cartData.items,
    };
  }, [cartData, orderDisplayId]);

  // In production, you might want to clear the cart here or in the payment screen
  useEffect(() => {
    // Optional: Show a success toast or animation
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/categories")}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Confirmation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Banner */}
        <View style={styles.successBox}>
          <View style={styles.iconContainer}>
            {orderInfo.items.length > 0 ? (
              <>
                <Image
                  source={{ uri: orderInfo.items[0].product.thumbnailUrls[0] }}
                  style={styles.successImage}
                />
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={24} color="#FFF" />
                </View>
              </>
            ) : (
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={24} color="#FFF" />
              </View>
            )}
          </View>

          <Text style={styles.congrats}>Congratulations!</Text>
          <Text style={styles.subtext}>
            Your order has been placed successfully. You'll receive updates via
            email and SMS.
          </Text>

          <View style={styles.orderIdRow}>
            <Text style={styles.orderId}>Order ID: {orderInfo.orderId}</Text>
            <TouchableOpacity style={styles.copyBtn}>
              <Ionicons name="copy-outline" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary Section */}
        {orderInfo.items.length > 0 && (
          <View style={styles.summarySection}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>
                Order Summary{" "}
                <Text style={{ fontWeight: "800" }}>
                  ₹{orderInfo.finalTotal.toLocaleString()}
                </Text>
              </Text>
              <Text style={styles.itemsCount}>
                {orderInfo.totalItems}{" "}
                {orderInfo.totalItems === 1 ? "item" : "items"}
              </Text>
            </View>

            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.carousel}
              snapToInterval={width - 32}
              decelerationRate="fast"
            >
              {orderInfo.items.map((item) => (
                <OrderItemCard
                  key={item.product.id}
                  item={item}
                  style={styles.productCard}
                />
              ))}
            </ScrollView>

            {/* Pagination Dots */}
            {orderInfo.items.length > 1 && (
              <View style={styles.paginationDots}>
                {orderInfo.items.map((_, index) => (
                  <View
                    key={index}
                    style={index === 0 ? styles.dotActive : styles.dotInactive}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.replace("/(tabs)/categories")}
          >
            <Text style={styles.primaryBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push("/orders")}
          >
            <Text style={styles.secondaryBtnText}>View your orders</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={24} color={COLORS.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Estimated Delivery</Text>
              <Text style={styles.infoText}>3-5 business days</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={COLORS.primary}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Secure Payment</Text>
              <Text style={styles.infoText}>Your transaction is secure</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons
              name="return-up-back-outline"
              size={24}
              color={COLORS.primary}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Easy Returns</Text>
              <Text style={styles.infoText}>15-day return policy</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
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
  scrollContent: {
    paddingBottom: 40,
  },
  successBox: {
    alignItems: "center",
    padding: 40,
  },
  iconContainer: {
    width: 150,
    height: 150,
    position: "relative",
    marginBottom: 30,
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
    right: -10,
    backgroundColor: "#000",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  congrats: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
    marginBottom: 20,
  },
  orderIdRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  copyBtn: {
    padding: 4,
  },
  summarySection: {
    padding: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    color: COLORS.text,
  },
  itemsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  carousel: {
    width: width - 32,
  },
  productCard: {
    width: width - 32,
    marginRight: 16,
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#000",
    marginHorizontal: 4,
  },
  dotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  actionSection: {
    padding: 16,
    marginTop: 20,
  },
  primaryBtn: {
    backgroundColor: "#000",
    height: 54,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  primaryBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryBtn: {
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  infoSection: {
    padding: SPACING.m,
    gap: SPACING.m,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.m,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
  },
  infoTextContainer: {
    marginLeft: SPACING.m,
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
