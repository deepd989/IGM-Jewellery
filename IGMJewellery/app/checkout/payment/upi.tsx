import { useClearCartMutation, useGetCartQuery } from "@/store/apis/cart";
import {
  useClearCheckoutSessionMutation,
  useCreateOrderMutation,
  useGetCheckoutSessionQuery,
} from "@/store/apis/checkout";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";
import { CheckoutStepper } from "../../../components/checkout/CheckoutStepper";
import { COLORS, SPACING } from "../../../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const upiSchema = z.object({
  upiId: z
    .string()
    .min(3, "Enter a valid UPI ID")
    .regex(/^[\w.-]+@[\w.-]+$/, "Invalid format"),
  remember: z.boolean(),
});

type UpiFormData = z.infer<typeof upiSchema>;

export default function UpiDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;

  const { data: checkoutSession, isLoading: isLoadingSession } =
    useGetCheckoutSessionQuery();
  const { data: cartData } = useGetCartQuery();
  const [createOrder] = useCreateOrderMutation();
  const [clearCart] = useClearCartMutation();
  const [clearCheckoutSession] = useClearCheckoutSessionMutation();

  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpiFormData>({
    resolver: zodResolver(upiSchema),
    defaultValues: { upiId: "", remember: true },
  });

  // Calculate totals
  const orderDetails = React.useMemo(() => {
    if (!checkoutSession) {
      return { total: 0, itemCount: 0 };
    }

    const giftAddonsCost =
      cartData?.giftAddons
        ?.filter((addon) => addon.isChecked)
        .reduce((sum, addon) => sum + addon.price, 0) || 0;

    const total = checkoutSession.orderDetails.total + giftAddonsCost;
    const itemCount = checkoutSession.orderDetails.items.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );

    return { total, itemCount };
  }, [checkoutSession, cartData]);

  const onSubmit = async (data: UpiFormData) => {
    if (!checkoutSession) {
      Alert.alert("Error", "Checkout session not found");
      return;
    }

    setIsProcessing(true);

    try {
      // Create the order
      const orderRequest = {
        deliveryAddress: checkoutSession.checkoutState.deliveryAddress!,
        billingAddress: checkoutSession.checkoutState.billingAddress!,
        giftingOptions: checkoutSession.checkoutState.giftingOptions,
        paymentMethod: "google_pay",
        couponCode: checkoutSession.checkoutState.appliedCouponCode,
      };

      const orderResponse = await createOrder(orderRequest).unwrap();

      // Clear cart and checkout session after successful order creation
      await clearCart().unwrap();
      await clearCheckoutSession().unwrap();

      console.log("UPI Data:", data);
      console.log("Order Created:", orderResponse);

      // Navigate to confirmation
      router.push({
        pathname: "/checkout/confirmation",
        params: {
          orderId: orderResponse.orderId,
          orderDisplayId: orderResponse.orderDisplayId,
        },
      });
    } catch (error: any) {
      Alert.alert(
        "Payment Failed",
        error?.data || "Failed to process payment. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingSession) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading payment details...</Text>
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
          <Text style={styles.errorText}>Session expired</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>UPI Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <CheckoutStepper currentStep="Payment" />

        <View style={styles.content}>
          {/* Summary with dynamic data */}
          <View style={styles.summaryStub}>
            <Text style={styles.stubText}>Show Order Summary</Text>
            <Text style={styles.stubValue}>
              {orderDetails.itemCount}{" "}
              {orderDetails.itemCount === 1 ? "item" : "items"} ₹
              {orderDetails.total.toLocaleString()}
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Enter UPI ID</Text>
            <Controller
              control={control}
              name="upiId"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    style={[styles.input, errors.upiId && styles.inputError]}
                    placeholder="Add here|"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                  />
                  {errors.upiId && (
                    <Text style={styles.errorText}>{errors.upiId.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="remember"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => onChange(!value)}
                >
                  <Ionicons
                    name={value ? "checkbox" : "square-outline"}
                    size={20}
                    color="#000"
                  />
                  <Text style={styles.checkboxText}>
                    Remember for future transactions
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={[
                styles.submitBtn,
                isProcessing && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>
                  Verify & Pay ₹{orderDetails.total.toLocaleString()}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
  },
  summaryStub: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  stubText: {
    fontSize: 14,
    fontWeight: "600",
  },
  stubValue: {
    fontSize: 14,
  },
  formSection: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    height: 54,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 8,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "red",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  checkboxText: {
    fontSize: 14,
    marginLeft: 8,
  },
  submitBtn: {
    backgroundColor: "#000",
    height: 54,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
