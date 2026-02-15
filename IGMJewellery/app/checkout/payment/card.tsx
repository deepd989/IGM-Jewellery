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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";
import { HapticButton } from "../../../components/basic components/hapticButton";
import { CheckoutStepper } from "../../../components/checkout/CheckoutStepper";
import { COLORS, SPACING } from "../../../constants/theme";

const cardSchema = z.object({
  cardNumber: z.string().length(16, "Card number must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format"),
  cvv: z.string().length(3, "CVV must be 3 digits"),
  nameOnCard: z.string().min(2, "Name is required"),
  nickname: z.string().optional(),
  remember: z.boolean(),
});

type CardFormData = z.infer<typeof cardSchema>;

export default function CardDetailsScreen() {
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
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: "",
      expiry: "",
      cvv: "",
      nameOnCard: "",
      nickname: "",
      remember: true,
    },
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
      0
    );

    return { total, itemCount };
  }, [checkoutSession, cartData]);

  const onSubmit = async (data: CardFormData) => {
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
        paymentMethod: "credit_card",
        couponCode: checkoutSession.checkoutState.appliedCouponCode,
      };

      const orderResponse = await createOrder(orderRequest).unwrap();

      // Clear cart and checkout session after successful order creation
      await clearCart().unwrap();
      await clearCheckoutSession().unwrap();

      console.log("Card Data:", data);
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
        error?.data || "Failed to process payment. Please try again."
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <HapticButton onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#053844" />
          </HapticButton>
          <Text style={styles.headerTitle}>Card Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <CheckoutStepper currentStep="Payment" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.summaryStub}>
            <Text style={styles.stubText}>Show Order Summary</Text>
            <Text style={styles.stubValue}>
              {orderDetails.itemCount}{" "}
              {orderDetails.itemCount === 1 ? "item" : "items"} ₹
              {orderDetails.total.toLocaleString()}
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Enter Card Details</Text>

            <Controller
              control={control}
              name="cardNumber"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.cardNumber && styles.inputError]}
                  placeholder="Card Number|"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  maxLength={16}
                />
              )}
            />
            {errors.cardNumber && (
              <Text style={styles.errorText}>{errors.cardNumber.message}</Text>
            )}

            <View style={styles.row}>
              <View style={{ flex: 2 }}>
                <Controller
                  control={control}
                  name="expiry"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.expiry && styles.inputError]}
                      placeholder="Valid Through (MM/YY)"
                      value={value}
                      onChangeText={onChange}
                      maxLength={5}
                    />
                  )}
                />
                {errors.expiry && (
                  <Text style={styles.errorText}>{errors.expiry.message}</Text>
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Controller
                  control={control}
                  name="cvv"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.cvv && styles.inputError]}
                      placeholder="CVV"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      maxLength={3}
                      secureTextEntry
                    />
                  )}
                />
                {errors.cvv && (
                  <Text style={styles.errorText}>{errors.cvv.message}</Text>
                )}
              </View>
            </View>

            <Controller
              control={control}
              name="nameOnCard"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.nameOnCard && styles.inputError]}
                  placeholder="Name on the Card"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.nameOnCard && (
              <Text style={styles.errorText}>{errors.nameOnCard.message}</Text>
            )}

            <Controller
              control={control}
              name="nickname"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Nickname (optional)"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="remember"
              render={({ field: { onChange, value } }) => (
                <HapticButton
                  style={styles.checkboxRow}
                  onPress={() => onChange(!value)}
                >
                  <Ionicons
                    name={value ? "checkbox" : "square-outline"}
                    size={20}
                    color="#053844"
                  />
                  <Text style={styles.checkboxText}>
                    Remember for future transactions
                  </Text>
                </HapticButton>
              )}
            />

            <HapticButton
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
            </HapticButton>
          </View>
        </ScrollView>
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
    marginBottom: 16,
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
  row: {
    flexDirection: "row",
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
    backgroundColor: "#053844",
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
