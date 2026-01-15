import {
  useGetCheckoutSessionQuery,
  useGetSavedAddressesQuery,
  useInitializeCheckoutMutation,
  useUpdateBillingAddressMutation,
  useUpdateDeliveryAddressMutation,
} from "@/store/apis/checkout";
import {
  AddressFormData,
  addressSchema,
} from "@/validation-schema/address-schema";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckoutStepper } from "../../components/checkout/CheckoutStepper";
import { CheckoutSummary } from "../../components/checkout/CheckoutSummary";
import { AddressCard } from "../../components/shared/AddressCard";
import { AddressFields } from "../../components/shared/AddressFields";
import { COLORS, SPACING } from "../../constants/theme";
import {
  BillingAddress,
  DeliveryAddress,
} from "../../interfaces/address.interface";

export default function AddressScreen() {
  const router = useRouter();
  const [useSaved, setUseSaved] = useState(true);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingMode, setBillingMode] = useState<"same" | "different">("same");

  // Initialize checkout session
  const [initializeCheckout, { isLoading: isInitializing }] =
    useInitializeCheckoutMutation();
  const {
    data: checkoutSession,
    isLoading: isLoadingSession,
    refetch,
  } = useGetCheckoutSessionQuery();
  const { data: savedAddresses = [], isLoading: isLoadingAddresses } =
    useGetSavedAddressesQuery();

  const [updateDeliveryAddress] = useUpdateDeliveryAddressMutation();
  const [updateBillingAddress] = useUpdateBillingAddressMutation();

  const defaultAddress = savedAddresses.find((addr) => addr.isDefault);

  useEffect(() => {
    if (defaultAddress) {
      shippingForm.reset({
        firstName: defaultAddress.firstName,
        lastName: defaultAddress.lastName,
        street: defaultAddress.street,
        landmark: defaultAddress.landmark || "",
        city: defaultAddress.city,
        pincode: defaultAddress.pincode,
        state: defaultAddress.state,
        country: defaultAddress.country,
        phone: defaultAddress.phone,
        email: defaultAddress.email,
      });
    }
  }, [defaultAddress]);

  // Initialize checkout on mount if no session exists
  useEffect(() => {
    const initSession = async () => {
      if (!checkoutSession && !isLoadingSession) {
        try {
          await initializeCheckout().unwrap();
        } catch (error: any) {
          Alert.alert(
            "Error",
            error?.data || "Failed to initialize checkout. Please try again.",
            [
              {
                text: "Go to Cart",
                onPress: () => router.replace("/cart"),
              },
            ]
          );
        }
      }
    };

    initSession();
  }, []);

  const shippingForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      street: "",
      landmark: "",
      city: "Mumbai",
      pincode: "400066",
      state: "Maharashtra",
      country: "India",
      phone: "",
      email: "",
    },
  });

  const billingForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      street: "",
      landmark: "",
      city: "Mumbai",
      pincode: "400066",
      state: "Maharashtra",
      country: "India",
      phone: "",
      email: "",
    },
  });

  const onSubmit = async () => {
    try {
      let deliveryAddress: DeliveryAddress;

      if (useSaved && defaultAddress) {
        deliveryAddress = defaultAddress;
      } else {
        const valid = await shippingForm.trigger();
        if (!valid) return;

        deliveryAddress = shippingForm.getValues();
      }

      await updateDeliveryAddress(deliveryAddress).unwrap();

      let billingAddress: BillingAddress;

      if (billingMode === "same") {
        billingAddress = {
          ...deliveryAddress,
          sameAsDelivery: true,
        };
      } else {
        const valid = await billingForm.trigger();
        if (!valid) return;

        billingAddress = {
          ...billingForm.getValues(),
          sameAsDelivery: false,
        };
      }

      await updateBillingAddress(billingAddress).unwrap();
      router.push("/checkout/gifting");
    } catch {
      Alert.alert("Error", "Failed to save address");
    }
  };

  if (isInitializing || isLoadingSession || isLoadingAddresses) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading checkout...</Text>
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
          <Text style={styles.errorText}>Unable to load checkout</Text>
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
          <Text style={styles.headerTitle}>Address</Text>
          <View style={{ width: 40 }} />
        </View>

        <CheckoutStepper currentStep="Address" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <CheckoutSummary order={checkoutSession.orderDetails} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>

            {defaultAddress && (
              <AddressCard
                style={{ marginTop: 12 }}
                title="Deliver to Saved Address"
                address={`${defaultAddress.street}, ${
                  defaultAddress.landmark || ""
                }, ${defaultAddress.city} ${defaultAddress.pincode}`}
                contact={`${defaultAddress.phone}    ${defaultAddress.email}`}
                isSelected={useSaved}
                onSelect={() => setUseSaved(true)}
              />
            )}

            <TouchableOpacity
              style={[styles.addNewRow, !useSaved && styles.addNewRowActive]}
              onPress={() => setUseSaved(false)}
            >
              <Text style={styles.sectionTitle}>Add New Address</Text>
              <Ionicons
                name={!useSaved ? "radio-button-on" : "radio-button-off"}
                size={20}
              />
            </TouchableOpacity>

            {!useSaved && (
              <View style={styles.form}>
                <AddressFields
                  control={shippingForm.control}
                  errors={shippingForm.formState.errors}
                />
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.billingHeader}>
              <Text style={styles.sectionTitle}>Billing Address</Text>

              {/* Same as Shipping */}
              <TouchableOpacity
                style={styles.radioRow}
                onPress={() => setBillingMode("same")}
              >
                <Text style={styles.radioText}>Same as Shipping Address</Text>
                <Ionicons
                  name={
                    billingMode === "same"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={22}
                  color="#000"
                />
              </TouchableOpacity>

              {/* Different Billing Address */}
              <TouchableOpacity
                style={styles.radioRow}
                onPress={() => setBillingMode("different")}
              >
                <Text style={styles.radioText}>
                  Use a different billing address
                </Text>
                <Ionicons
                  name={
                    billingMode === "different"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={22}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

            {billingMode === "different" && (
              <View style={styles.form}>
                <AddressFields
                  control={billingForm.control}
                  errors={billingForm.formState.errors}
                  showContactInfo={false}
                />
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerPrice}>
              ₹{checkoutSession.orderDetails.total.toLocaleString()}
            </Text>
            <Text style={styles.summaryLink}>VIEW ORDER SUMMARY</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={onSubmit}>
            <Text style={styles.btnText}>Save & Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
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
    padding: 16,
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
  headerTitle: { fontSize: 18, fontWeight: "700" },
  scroll: { paddingBottom: 100 },
  section: { padding: 16 },
  addNewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 12,
  },
  addNewRowActive: { borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  sectionTitle: { fontSize: 14, fontWeight: "700" },
  form: { marginTop: 16 },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 24 },
  billingHeader: { marginBottom: 16 },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  checkboxText: { fontSize: 13, marginLeft: 8, color: "#333" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  footerPrice: { fontSize: 18, fontWeight: "800" },
  summaryLink: {
    fontSize: 10,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  btn: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 6,
    minWidth: 160,
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontWeight: "700" },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginTop: 12,
  },

  radioText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
});
