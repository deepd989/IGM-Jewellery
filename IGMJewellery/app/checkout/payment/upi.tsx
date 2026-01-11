import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";
import { CheckoutStepper } from "../../../components/checkout/CheckoutStepper";
import { SPACING } from "../../../constants/theme";

// Fixed: Removed .default() to prevent type mismatch in zodResolver
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

  // Fixed: Added defaultValues to handle initial state instead of schema defaults
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpiFormData>({
    resolver: zodResolver(upiSchema),
    defaultValues: { upiId: "", remember: true },
  });

  const onSubmit = (data: UpiFormData) => {
    console.log("UPI Data:", data);
    router.push("/checkout/confirmation");
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
          <Text style={styles.headerTitle}>UPI Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <CheckoutStepper currentStep="Payment" />

        <View style={styles.content}>
          {/* Summary Placeholder - In real app pass actual orderDetails */}
          <View style={styles.summaryStub}>
            <Text style={styles.stubText}>Show Order Summary</Text>
            <Text style={styles.stubValue}>4 items ₹20,000</Text>
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
              style={styles.submitBtn}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.submitBtnText}>Verify & Pay ₹20,000</Text>
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 12,
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
  submitBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
