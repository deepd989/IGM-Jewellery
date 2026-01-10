import { PriceBreakdown } from "@/components/checkout/PriceBreakdown";
import { DUMMY_CART_ITEMS } from "@/dummyData/cart-item";
import { OrderDetails } from "@/interfaces/order-details.interface";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckoutStepper } from "../../components/checkout/CheckoutStepper";
import { CheckoutSummary } from "../../components/checkout/CheckoutSummary";
import { SPACING } from "../../constants/theme";

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
    subtitle: "Save and Pay via credit cards",
    icon: "card-outline",
  },
  {
    id: "net_banking",
    title: "Net Banking",
    subtitle: "Save and Pay via credit cards",
    icon: "globe-outline",
  },
];

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("google_pay");

  const orderDetails = useMemo<OrderDetails>(() => {
    const sellingPrice = DUMMY_CART_ITEMS.reduce(
      (acc, item) => acc + item.product.discountedPrice * item.quantity,
      0
    );
    const subtotal = DUMMY_CART_ITEMS.reduce(
      (acc, item) => acc + item.product.givenPrice * item.quantity,
      0
    );
    const platformFee = 220;
    const couponDiscount = 20;
    const total = sellingPrice + platformFee - couponDiscount;

    return {
      items: DUMMY_CART_ITEMS,
      subtotal,
      savings: subtotal - sellingPrice + couponDiscount,
      platformFee,
      total,
    };
  }, []);

  const handlePaymentNavigation = () => {
    if (selectedMethod === "google_pay") {
      router.push("/checkout/payment/upi");
    } else if (
      selectedMethod === "credit_card" ||
      selectedMethod === "debit_card"
    ) {
      router.push("/checkout/payment/card");
    } else {
      // Mock success for other methods
      router.push("/checkout/confirmation");
    }
  };

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
              onPress={() => setSelectedMethod(opt.id)}
            >
              <View style={styles.smallSquare} />
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
          <View style={styles.squarePlaceholder} />
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Pay on delivery</Text>
            <Text style={styles.methodSubtitle}>Pay via cash on delivery</Text>
          </View>
          <View style={styles.checkboxOutline} />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gift Cards</Text>
          <TouchableOpacity style={styles.giftCardBox}>
            <View style={styles.squarePlaceholder} />
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Have a gift Card?</Text>
              <Text style={styles.methodSubtitle}>
                Avail Additional discounts with gift cards
              </Text>
            </View>
            <View style={styles.checkboxOutline} />
          </TouchableOpacity>
        </View>

        {/* Static breakdown at the bottom of scroll */}
        <View style={styles.finalSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <PriceBreakdown
            subtotal={orderDetails.subtotal}
            savings={orderDetails.savings}
            platformFee={orderDetails.platformFee}
            couponApplied={20}
            total={orderDetails.total}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handlePaymentNavigation}
        >
          <Text style={styles.payBtnText}>
            Proceed to Pay ₹{orderDetails.total.toLocaleString()}
          </Text>
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
  },
  smallSquare: {
    width: 40,
    height: 40,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    marginRight: 12,
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
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#8E8E93",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  freeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  savingsValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "800",
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
  payBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
