import { CouponCard } from "@/components/cart/CouponCard";
import {
  useApplyCouponMutation,
  useGetCheckoutSessionQuery,
  useGetCouponsQuery,
  useRemoveCouponMutation,
} from "@/store/apis/checkout";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../components/basic components/hapticButton";
import { COLORS, SPACING } from "../constants/theme";

export default function CouponsScreen() {
  const router = useRouter();

  const { data: coupons = [], isLoading: isLoadingCoupons } =
    useGetCouponsQuery();
  const { data: checkoutSession } = useGetCheckoutSessionQuery();
  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation();
  const [removeCoupon, { isLoading: isRemoving }] = useRemoveCouponMutation();

  const appliedCouponCode = checkoutSession?.checkoutState.appliedCouponCode;

  const handleApplyCoupon = async (code: string) => {
    try {
      await applyCoupon(code).unwrap();
      Alert.alert("Success", `Coupon ${code} applied successfully!`, [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error?.data || "Failed to apply coupon");
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon().unwrap();
      Alert.alert("Success", "Coupon removed");
    } catch (error: any) {
      Alert.alert("Error", error?.data || "Failed to remove coupon");
    }
  };

  if (isLoadingCoupons) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading coupons...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </HapticButton>
        <Text style={styles.headerTitle}>Apply Coupon</Text>
        <View style={{ width: 40 }} />
      </View>

      {appliedCouponCode && (
        <View style={styles.appliedBanner}>
          <View style={styles.appliedContent}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.success}
            />
            <Text style={styles.appliedText}>
              Coupon <Text style={styles.appliedCode}>{appliedCouponCode}</Text>{" "}
              applied
            </Text>
          </View>
          <HapticButton onPress={handleRemoveCoupon} disabled={isRemoving}>
            {isRemoving ? (
              <ActivityIndicator size="small" color={COLORS.error} />
            ) : (
              <Text style={styles.removeText}>Remove</Text>
            )}
          </HapticButton>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Available Coupons</Text>

        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onApply={handleApplyCoupon}
          />
        ))}

        {coupons.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="pricetag-outline"
              size={64}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No coupons available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new offers
            </Text>
          </View>
        )}
      </ScrollView>

      {isApplying && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingOverlayText}>Applying coupon...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    backgroundColor: "#FFFFFF",
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
    color: COLORS.text,
  },
  appliedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E8F5E9",
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: "#C8E6C9",
  },
  appliedContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  appliedText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SPACING.s,
  },
  appliedCode: {
    fontWeight: "700",
  },
  removeText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: "600",
  },
  scrollContent: {
    padding: SPACING.m,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.xl * 3,
  },
  emptyText: {
    marginTop: SPACING.m,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  emptySubtext: {
    marginTop: SPACING.s,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlayText: {
    marginTop: SPACING.m,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
