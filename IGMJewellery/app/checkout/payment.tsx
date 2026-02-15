import { PriceBreakdown } from "@/components/checkout/PriceBreakdown";
import { useGetCartQuery } from "@/store/apis/cart";
import {
  useGetCheckoutSessionQuery,
  useUpdatePaymentMethodMutation,
} from "@/store/apis/checkout";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../../components/basic components/hapticButton";
import { CheckoutStepper } from "../../components/checkout/CheckoutStepper";
import { CheckoutSummary } from "../../components/checkout/CheckoutSummary";
import { COLORS, SPACING } from "../../constants/theme";

const PAYMENT_OPTIONS = [
  {
    id: "google_pay",
    title: "Google Pay",
    subtitle: "Enter UPI ID",
    icon: "logo-google",
  },
  {
    id: "credit_card",
    title: "Credit Card",
    subtitle: "Save and Pay via credit cards",
    icon: "card-outline",
  },
  {
    id: "debit_card",
    title: "Debit Card",
    subtitle: "Save and Pay via debit cards",
    icon: "card-outline",
  },
  {
    id: "net_banking",
    title: "Net Banking",
    subtitle: "All major banks supported",
    icon: "globe-outline",
  },
];

export default function PaymentScreen() {
  const router = useRouter();

  const { data: checkoutSession, isLoading: isLoadingSession } =
    useGetCheckoutSessionQuery();
  const { data: cartData } = useGetCartQuery();
  const [updatePaymentMethod] = useUpdatePaymentMethodMutation();

  const [selectedMethod, setSelectedMethod] = useState(
    checkoutSession?.checkoutState.selectedPaymentMethod || "google_pay"
  );

  const handlePaymentMethodSelect = async (methodId: string) => {
    setSelectedMethod(methodId);
    try {
      await updatePaymentMethod(methodId).unwrap();
    } catch (error) {
      console.error("Failed to update payment method:", error);
    }
  };

  const handleProceedToPay = async () => {
    if (!checkoutSession) {
      Alert.alert("Error", "Checkout session not found");
      return;
    }

    if (!checkoutSession.checkoutState.deliveryAddress) {
      Alert.alert("Missing Information", "Please add delivery address");
      router.push("/checkout/address");
      return;
    }

    if (!checkoutSession.checkoutState.billingAddress) {
      Alert.alert("Missing Information", "Please add billing address");
      router.push("/checkout/address");
      return;
    }

    // Update payment method before proceeding
    try {
      await updatePaymentMethod(selectedMethod).unwrap();
    } catch (error) {
      console.error("Failed to update payment method:", error);
    }

    // Generate temporary order ID for the payment screens
    const tempOrderId = `temp_ord_${Date.now()}`;

    // Navigate based on payment method WITHOUT clearing session
    if (selectedMethod === "google_pay") {
      router.push({
        pathname: "/checkout/payment/upi",
        params: { orderId: tempOrderId },
      });
    } else if (
      selectedMethod === "credit_card" ||
      selectedMethod === "debit_card"
    ) {
      router.push({
        pathname: "/checkout/payment/card",
        params: { orderId: tempOrderId },
      });
    } else {
      // For COD and Net Banking, create order directly
      router.push("/checkout/confirmation");
    }
  };

  if (isLoadingSession) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!checkoutSession) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={COLORS.error}
          />
          <Text style={styles.errorText}>Checkout session not found</Text>
          <HapticButton
            style={styles.retryButton}
            onPress={() => router.replace("/cart")}
          >
            <Text style={styles.retryButtonText}>Back to Cart</Text>
          </HapticButton>
        </View>
      </SafeAreaView>
    );
  }

  const { orderDetails, checkoutState } = checkoutSession;
  const appliedDiscount = checkoutState.appliedCouponDiscount || 0;

  // Calculate total with gift addons
  const giftAddonsCost =
    cartData?.giftAddons
      ?.filter((addon) => addon.isChecked)
      .reduce((sum, addon) => sum + addon.price, 0) || 0;

  const finalOrderDetails = {
    ...orderDetails,
    total: orderDetails.total + giftAddonsCost,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#053844" />
        </HapticButton>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <CheckoutStepper currentStep="Payment" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CheckoutSummary order={finalOrderDetails} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Payment Options</Text>

          <View style={styles.payOnlinePrimary}>
            {/* Optional: Add an icon inside the placeholder to make it look nicer */}
            <View style={styles.squarePlaceholder}>
              <Ionicons name="wallet-outline" size={24} color="#666" />
            </View>

            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Pay Online</Text>
              <Text style={styles.methodSubtitle}>
                Credit, Debit, Net Banking, UPI & More
              </Text>
            </View>
          </View>

          {PAYMENT_OPTIONS.map((opt) => (
            <HapticButton
              key={opt.id}
              style={styles.methodItem}
              onPress={() => handlePaymentMethodSelect(opt.id)}
            >
              <View style={styles.smallSquare}>
                <Ionicons name={opt.icon as any} size={20} color="#666" />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{opt.title}</Text>
                <Text style={styles.methodSubtitle}>{opt.subtitle}</Text>
              </View>
              <Ionicons
                name={
                  selectedMethod === opt.id
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={22}
                color="#053844"
              />
            </HapticButton>
          ))}
        </View>

        {/* <HapticButton style={styles.codBox}>
          <View style={styles.squarePlaceholder}>
            <Ionicons name="cash-outline" size={24} color="#666" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Pay on delivery</Text>
            <Text style={styles.methodSubtitle}>Pay via cash on delivery</Text>
          </View>
          <View style={styles.checkboxOutline} />
        </HapticButton> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gift Cards</Text>
          <HapticButton
            style={styles.giftCardBox}
            onPress={() => router.push("/coupons")}
          >
            <View style={styles.squarePlaceholder}>
              <Ionicons name="gift-outline" size={24} color="#666" />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Have a gift Card?</Text>
              <Text style={styles.methodSubtitle}>
                {checkoutState.appliedCouponCode
                  ? `Applied: ${checkoutState.appliedCouponCode}`
                  : "Avail Additional discounts with gift cards"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </HapticButton>
        </View>

        <View style={styles.finalSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <PriceBreakdown
            subtotal={finalOrderDetails.subtotal}
            savings={finalOrderDetails.savings}
            platformFee={finalOrderDetails.platformFee}
            couponApplied={appliedDiscount}
            total={finalOrderDetails.total}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <HapticButton style={styles.payBtn} onPress={handleProceedToPay}>
          <Text style={styles.payBtnText}>
            Proceed to Pay ₹{finalOrderDetails.total.toLocaleString()}
          </Text>
        </HapticButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.m,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  errorText: {
    marginTop: SPACING.m,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  retryButton: {
    marginTop: SPACING.l,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
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
    paddingBottom: 100,
  },
  section: {
    padding: SPACING.m,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: SPACING.m,
  },
  payOnlinePrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#053844",
    marginBottom: 16,
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  squarePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  smallSquare: {
    width: 40,
    height: 40,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  methodSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  codBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    marginHorizontal: SPACING.m,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  giftCardBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 8,
  },
  checkboxOutline: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#053844",
    borderRadius: 4,
  },
  finalSummary: {
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  footer: {
    padding: SPACING.m,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  payBtn: {
    backgroundColor: "#053844",
    height: 54,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  payBtnDisabled: {
    opacity: 0.6,
  },
  payBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
