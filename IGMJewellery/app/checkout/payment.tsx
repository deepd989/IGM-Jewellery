import { PriceBreakdown } from "@/components/checkout/PriceBreakdown";
import { useClearCartMutation } from "@/store/apis/cart";
import {
  useClearCheckoutSessionMutation,
  useCreateOrderMutation,
  useGetCheckoutSessionQuery,
  useUpdatePaymentMethodMutation,
} from "@/store/apis/checkout";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [updatePaymentMethod] = useUpdatePaymentMethodMutation();
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [clearCheckoutSession] = useClearCheckoutSessionMutation();
  const [clearCart] = useClearCartMutation();

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

    try {
      const orderRequest = {
        deliveryAddress: checkoutSession.checkoutState.deliveryAddress,
        billingAddress: checkoutSession.checkoutState.billingAddress,
        giftingOptions: checkoutSession.checkoutState.giftingOptions,
        paymentMethod: selectedMethod,
        couponCode: checkoutSession.checkoutState.appliedCouponCode,
      };

      const orderResponse = await createOrder(orderRequest).unwrap();

      // Clear cart and checkout session
      await clearCart().unwrap();
      await clearCheckoutSession().unwrap();

      // Navigate based on payment method
      if (selectedMethod === "google_pay") {
        router.push({
          pathname: "/checkout/payment/upi",
          params: { orderId: orderResponse.orderId },
        });
      } else if (
        selectedMethod === "credit_card" ||
        selectedMethod === "debit_card"
      ) {
        router.push({
          pathname: "/checkout/payment/card",
          params: { orderId: orderResponse.orderId },
        });
      } else {
        // For COD and Net Banking, go directly to confirmation
        router.push({
          pathname: "/checkout/confirmation",
          params: {
            orderId: orderResponse.orderId,
            orderDisplayId: orderResponse.orderDisplayId,
          },
        });
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.data || "Failed to create order. Please try again."
      );
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
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.replace("/cart")}
          >
            <Text style={styles.retryButtonText}>Back to Cart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { orderDetails, checkoutState } = checkoutSession;
  const appliedDiscount = checkoutState.appliedCouponDiscount || 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <CheckoutStepper currentStep="Payment" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CheckoutSummary order={orderDetails} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Payment Options</Text>

          <TouchableOpacity style={styles.payOnlinePrimary}>
            <View style={styles.squarePlaceholder} />
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Pay Online</Text>
              <Text style={styles.methodSubtitle}>
                Credit, Debit, Net Banking, UPI & More
              </Text>
            </View>
          </TouchableOpacity>

          {PAYMENT_OPTIONS.map((opt) => (
            <TouchableOpacity
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
                color="#000"
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.codBox}>
          <View style={styles.squarePlaceholder}>
            <Ionicons name="cash-outline" size={24} color="#666" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Pay on delivery</Text>
            <Text style={styles.methodSubtitle}>Pay via cash on delivery</Text>
          </View>
          <View style={styles.checkboxOutline} />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gift Cards</Text>
          <TouchableOpacity
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
          </TouchableOpacity>
        </View>

        <View style={styles.finalSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <PriceBreakdown
            subtotal={orderDetails.subtotal}
            savings={orderDetails.savings}
            platformFee={orderDetails.platformFee}
            couponApplied={appliedDiscount}
            total={orderDetails.total}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payBtn, isCreatingOrder && styles.payBtnDisabled]}
          onPress={handleProceedToPay}
          disabled={isCreatingOrder}
        >
          {isCreatingOrder ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.payBtnText}>
              Proceed to Pay ₹{orderDetails.total.toLocaleString()}
            </Text>
          )}
        </TouchableOpacity>
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
    borderColor: "#000",
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
    borderColor: "#000",
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
    backgroundColor: "#000",
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
