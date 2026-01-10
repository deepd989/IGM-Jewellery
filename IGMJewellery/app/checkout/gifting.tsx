import { GIFT_WRAPS, RECIPIENT_TAGS } from "@/dummyData/gifting";
import { useGetCartQuery } from "@/store/apis/cart";
import {
  useGetCheckoutSessionQuery,
  useUpdateGiftingOptionsMutation,
} from "@/store/apis/checkout";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";
import { CheckoutStepper } from "../../components/checkout/CheckoutStepper";
import { CheckoutSummary } from "../../components/checkout/CheckoutSummary";
import { COLORS, SPACING } from "../../constants/theme";

const giftingSchema = z.object({
  giftWrapId: z.string().optional(),
  note: z.string().max(500, "Note cannot exceed 500 characters").optional(),
  recipientType: z.string().optional(),
});

type GiftingFormData = z.infer<typeof giftingSchema>;

export default function GiftingScreen() {
  const router = useRouter();

  const { data: checkoutSession, isLoading: isLoadingSession } =
    useGetCheckoutSessionQuery();
  const { data: cartData } = useGetCartQuery();
  const [updateGiftingOptions] = useUpdateGiftingOptionsMutation();

  const { control, handleSubmit, watch, setValue } = useForm<GiftingFormData>({
    resolver: zodResolver(giftingSchema),
    defaultValues: {
      giftWrapId:
        checkoutSession?.checkoutState.giftingOptions?.giftWrapId || "",
      note: checkoutSession?.checkoutState.giftingOptions?.note || "",
      recipientType:
        checkoutSession?.checkoutState.giftingOptions?.recipientType || "",
    },
  });

  // Update form when session loads
  useEffect(() => {
    if (checkoutSession?.checkoutState.giftingOptions) {
      const { giftWrapId, note, recipientType } =
        checkoutSession.checkoutState.giftingOptions;
      if (giftWrapId) setValue("giftWrapId", giftWrapId);
      if (note) setValue("note", note);
      if (recipientType) setValue("recipientType", recipientType);
    }
  }, [checkoutSession]);

  const selectedWrapId = watch("giftWrapId");
  const selectedRecipient = watch("recipientType");
  const noteContent = watch("note") || "";

  const onSubmit = async (data: GiftingFormData) => {
    try {
      await updateGiftingOptions(data).unwrap();
      router.push("/checkout/payment");
    } catch (error: any) {
      Alert.alert("Error", error?.data || "Failed to save gifting options");
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

  // Calculate total with selected gift addons
  const giftAddonsCost =
    cartData?.giftAddons
      ?.filter((addon) => addon.isChecked)
      .reduce((sum, addon) => sum + addon.price, 0) || 0;

  const orderDetails = {
    ...checkoutSession.orderDetails,
    total: checkoutSession.orderDetails.total + giftAddonsCost,
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
          <Text style={styles.headerTitle}>Gifting</Text>
          <View style={{ width: 40 }} />
        </View>

        <CheckoutStepper currentStep="Gifting" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <CheckoutSummary order={orderDetails} />

          {/* Gift Wrap Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Select Gift Wrap</Text>
              <Text style={styles.optionalLabel}>Optional</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalList}
            >
              {GIFT_WRAPS.map((wrap) => {
                const isSelected = wrap.id === selectedWrapId;
                return (
                  <TouchableOpacity
                    key={wrap.id}
                    style={[
                      styles.wrapCard,
                      isSelected && styles.wrapCardActive,
                    ]}
                    onPress={() => setValue("giftWrapId", wrap.id)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: wrap.image }}
                      style={styles.wrapImage}
                    />
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Ionicons name="checkbox" size={20} color="#000" />
                      </View>
                    )}
                    <Text style={styles.wrapTitle}>{wrap.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Personalized Note Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Add a Personalised Note</Text>
              <Text style={styles.optionalLabel}>Optional</Text>
            </View>
            <View style={styles.noteContainer}>
              <Controller
                control={control}
                name="note"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.noteInput}
                    placeholder="You can start writing here|"
                    multiline
                    maxLength={500}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <Text style={styles.charCounter}>{noteContent.length}/500</Text>
            </View>
          </View>

          {/* Voice Message Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Record A Message</Text>
              <Text style={styles.optionalLabel}>Optional</Text>
            </View>
            <View style={styles.recordContainer}>
              <View style={styles.recordHeader}>
                <Ionicons name="mic-outline" size={22} color="#000" />
                <Text style={styles.recordDesc}>
                  Your personalised voice message will be sent to the recipient
                  as a QR code to be scanned.{" "}
                  <Text style={styles.howItWorks}>How it works?</Text>
                </Text>
              </View>
              <TouchableOpacity style={styles.recordAction}>
                <View style={styles.micCircle}>
                  <Ionicons name="mic" size={24} color="#FFF" />
                </View>
                <Text style={styles.recordText}>Start recording</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recipient Chips Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who is the gift for?</Text>
            <View style={styles.chipsRow}>
              {RECIPIENT_TAGS.map((tag, index) => {
                const isSelected = selectedRecipient === tag;
                return (
                  <TouchableOpacity
                    key={`${tag}-${index}`}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => setValue("recipientType", tag)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity style={styles.chipMore}>
                <Text style={styles.chipMoreText}>More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerPriceCol}>
            <View style={styles.footerPriceRow}>
              <Text style={styles.totalPayable}>
                ₹{orderDetails.total.toLocaleString()}
              </Text>
              <Text style={styles.oldPayable}>
                ₹{checkoutSession.orderDetails.subtotal.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewSummaryText}>VIEW ORDER SUMMARY</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.saveBtnText}>Save & Continue</Text>
          </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 150,
  },
  section: {
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  optionalLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginLeft: 8,
  },
  horizontalList: {
    flexDirection: "row",
  },
  wrapCard: {
    width: 120,
    marginRight: SPACING.m,
    position: "relative",
  },
  wrapCardActive: {},
  wrapImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginBottom: 8,
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  wrapTitle: {
    fontSize: 13,
    textAlign: "center",
    color: "#000",
    fontWeight: "500",
  },
  noteContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    height: 120,
    backgroundColor: "#FAFAFA",
  },
  noteInput: {
    flex: 1,
    fontSize: 13,
    color: "#000",
    textAlignVertical: "top",
  },
  charCounter: {
    fontSize: 11,
    color: "#8E8E93",
    textAlign: "right",
  },
  recordContainer: {
    backgroundColor: "#FFFFFF",
  },
  recordHeader: {
    flexDirection: "row",
    marginBottom: SPACING.l,
  },
  recordDesc: {
    flex: 1,
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 18,
    marginLeft: 8,
  },
  howItWorks: {
    textDecorationLine: "underline",
  },
  recordAction: {
    alignItems: "center",
  },
  micCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  recordText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  chipActive: {
    borderColor: "#000",
    backgroundColor: "#F5F5F5",
  },
  chipText: {
    fontSize: 12,
    color: "#444",
  },
  chipTextActive: {
    fontWeight: "700",
    color: "#000",
  },
  chipMore: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipMoreText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  footerPriceCol: {
    flex: 1,
  },
  footerPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  totalPayable: {
    fontSize: 18,
    fontWeight: "800",
    marginRight: 8,
  },
  oldPayable: {
    fontSize: 13,
    color: "#8E8E93",
    textDecorationLine: "line-through",
  },
  viewSummaryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000",
    textDecorationLine: "underline",
  },
  saveBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 6,
    minWidth: 160,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
