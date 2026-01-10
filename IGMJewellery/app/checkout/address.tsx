import { CartItem, OrderDetails } from "@/interfaces/order-details.interface";
import {
  AddressFormData,
  addressSchema,
} from "@/validation-schema/address-schema";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
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
import { COLORS } from "../../constants/theme";
import { Brand } from "../../enums/brand.enum";

const DUMMY_CART_ITEMS: CartItem[] = [
  {
    product: {
      id: "1",
      title: "24K Diamond Ring",
      discountedPrice: 20000,
      givenPrice: 25000,
      brand: Brand.Kalyan,
      thumbnailUrls: [
        "https://images.unsplash.com/photo-1605100804763-eb2fc645a382?q=80&w=400",
      ],
    } as any,
    quantity: 1,
  },
];

export default function AddressScreen() {
  const router = useRouter();
  const [useSaved, setUseSaved] = useState(true);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const orderDetails = useMemo<OrderDetails>(
    () => ({
      items: DUMMY_CART_ITEMS,
      subtotal: 25000,
      savings: 5000,
      platformFee: 220,
      total: 20220,
    }),
    []
  );

  const shippingForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      city: "Mumbai",
      pincode: "400066",
      state: "Maharashtra",
      country: "India",
    },
  });

  const billingForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      city: "Mumbai",
      pincode: "400066",
      state: "Maharashtra",
      country: "India",
    },
  });

  const onSubmit = () => {
    // If not using saved, validate shipping form
    // In real app, we handle nested validations
    router.push("/checkout/gifting");
  };

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
          <CheckoutSummary order={orderDetails} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>

            <AddressCard
              style={{ marginTop: 12 }}
              title="Deliver to Saved Address"
              address="Shop Number 201, Avon Enclave, Andheri East, Mumbai 400 066"
              contact="+91 9870951994    emailid@gmail.com"
              isSelected={useSaved}
              onSelect={() => setUseSaved(true)}
            />

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

            {/* BILLING ADDRESS SECTION */}
            <View style={styles.billingHeader}>
              <Text style={styles.sectionTitle}>Billing Address</Text>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setSameAsBilling(!sameAsBilling)}
              >
                <Ionicons
                  name={sameAsBilling ? "checkbox" : "square-outline"}
                  size={22}
                  color={sameAsBilling ? COLORS.primary : "#999"}
                />
                <Text style={styles.checkboxText}>
                  Same as delivery address
                </Text>
              </TouchableOpacity>
            </View>

            {!sameAsBilling && (
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
            <Text style={styles.footerPrice}>₹20,220</Text>
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
});
