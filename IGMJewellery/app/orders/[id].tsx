import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useGetOrderByIdQuery } from "@/store/apis/profile";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../../components/basic components/hapticButton";
import { PriceBreakdown } from "../../components/checkout/PriceBreakdown";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: order, isLoading } = useGetOrderByIdQuery(id as string);
  const [payExpanded, setPayExpanded] = useState(true);

  if (isLoading)
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  if (!order) return null;

  const item = order.items[2];
  const isDelivered = item.status === "Delivered";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </HapticButton>
        <Text style={styles.headerTitle}>Order Details</Text>
        <HapticButton style={styles.helpRow}>
          <Text style={styles.helpText}>Help?</Text>
          <Ionicons name="call-outline" size={20} color="#000" />
        </HapticButton>
      </View>

      {/* Status Bar */}
      <View style={styles.statusHeader}>
        <Text style={styles.statusId}>
          Order ID <Text style={{ fontWeight: "800" }}>{order.displayId}</Text>
        </Text>
        <Text style={styles.statusBadge}>
          {item.status === "Delivered"
            ? "Order Delivered"
            : order.statusSummary}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Product Info Section */}
        <View style={styles.productSection}>
          <View style={styles.productThumbBox}>
            <View style={styles.brandLogo} />
            <View style={styles.mainThumb} />
          </View>
          <View style={styles.productInfo}>
            <View style={styles.infoTop}>
              <View>
                <Text style={styles.prodTitle}>{item.product.title}</Text>
                <Text style={styles.prodBrand}>{item.product.brand}</Text>
              </View>
              <View style={styles.priceCol}>
                <Text style={styles.prodPrice}>
                  ₹{item.price.toLocaleString()}
                </Text>
                <Text style={styles.amtPaid}>Amount Paid</Text>
              </View>
            </View>
            <Text style={styles.prodSpecs}>{item.product.description}</Text>
          </View>
        </View>

        {/* Status Specific Tracking Box */}
        <View style={styles.trackingBox}>
          <View style={styles.statusIconBox}>
            <Ionicons
              name={isDelivered ? "cube-outline" : "bus-outline"}
              size={22}
              color="#000"
            />
          </View>
          <View style={styles.trackingInfo}>
            <Text style={styles.trackTitle}>
              {isDelivered ? "Delivered on" : "Delivery by"}{" "}
              <Text style={{ fontWeight: "800" }}>{item.statusDate}</Text>
            </Text>
            <Text style={styles.trackId}>Order ID #00100010001</Text>
            {!isDelivered && (
              <HapticButton>
                <Text style={styles.trackLink}>Track here</Text>
              </HapticButton>
            )}
          </View>
          <HapticButton>
            <Ionicons name="copy-outline" size={18} color="#000" />
          </HapticButton>
        </View>

        {/* Return/Replace or Cancel logic */}
        {isDelivered ? (
          <View style={styles.deliveredActionsSection}>
            <View style={styles.policyInfoRow}>
              <Text style={styles.policyInfoText}>
                You can replace or return this item by 17th December.
              </Text>
              <HapticButton>
                <Text style={styles.readPolicyInline}>Read Policy</Text>
              </HapticButton>
            </View>

            <View style={styles.actionBtnRow}>
              <HapticButton style={styles.outlineActionBtn}>
                <Ionicons name="refresh-outline" size={20} color="#000" />
                <Text style={styles.actionBtnText}>Replace</Text>
              </HapticButton>
              <HapticButton style={styles.outlineActionBtn}>
                <Ionicons
                  name="return-up-back-outline"
                  size={20}
                  color="#000"
                />
                <Text style={styles.actionBtnText}>Return</Text>
              </HapticButton>
            </View>

            <View style={styles.reviewSection}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewTitle}>Rate & Review</Text>
                <View style={styles.pointsBadge}>
                  <Text style={styles.pointsBadgeText}>
                    Earn <Text style={{ fontWeight: "800" }}>IGM points!</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.reviewInputRow}>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons
                      key={i}
                      name="star-outline"
                      size={24}
                      color="#BBB"
                      style={{ marginRight: 6 }}
                    />
                  ))}
                </View>
                <HapticButton>
                  <Text style={styles.writeReviewLink}>Write Review</Text>
                </HapticButton>
              </View>
            </View>
          </View>
        ) : (
          <>
            <HapticButton style={styles.policyBox}>
              <Text style={styles.policyText}>
                Exchange and replacement available for this order.
              </Text>
              <Text style={styles.policyLink}>Read Policy</Text>
            </HapticButton>

            <View style={styles.cancelBox}>
              <Text style={styles.cancelPrompt}>
                Wish to request for a cancellation of your order?
              </Text>
              <HapticButton style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </HapticButton>
            </View>
          </>
        )}

        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Delivery Details</Text>
          <View style={styles.addressCard}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#000"
              style={styles.addrIcon}
            />
            <View style={styles.addrContent}>
              <Text style={styles.addrName}>{order.deliveryAddress?.name}</Text>
              <Text style={styles.addrText}>
                {order.deliveryAddress?.line1}
              </Text>
              <Text style={styles.addrText}>
                {order.deliveryAddress?.line2}
              </Text>
              <Text style={styles.addrPhone}>
                {order.deliveryAddress?.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <HapticButton
            style={styles.payHeader}
            onPress={() => setPayExpanded(!payExpanded)}
          >
            <Text style={styles.sectionHeader}>Payment Details</Text>
            <View style={styles.payHeaderRight}>
              <Text style={styles.paidMethod}>{order.paymentMethod}</Text>
              <Text style={styles.totalPaid}>
                ₹{order.totalAmount.toLocaleString()}
              </Text>
              <Ionicons
                name={payExpanded ? "chevron-up" : "chevron-down"}
                size={20}
              />
            </View>
          </HapticButton>

          {payExpanded && (
            <View style={styles.priceContainer}>
              <PriceBreakdown
                subtotal={290000}
                savings={2220}
                platformFee={220}
                total={220000}
              />
            </View>
          )}
        </View>

        {/* Loyalty Points Banner */}
        <View style={styles.pointsBanner}>
          <Text style={styles.pointsTitle}>
            +{order.pointsEarned} IGM Points earned!
          </Text>
          <Text style={styles.pointsDesc}>
            Congratulations! you have earned points on this order
          </Text>
        </View>

        {/* Invoice Download */}
        <HapticButton style={styles.invoiceBtn}>
          <Text style={styles.invoiceText}>Get invoice for this shipment</Text>
          <Text style={styles.downloadText}>Download</Text>
        </HapticButton>

        <HapticButton style={styles.bottomHelp}>
          <Text style={styles.bottomHelpText}>Help?</Text>
          <Ionicons name="call-outline" size={20} />
        </HapticButton>
      </ScrollView>
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
  headerTitle: { fontSize: 17, fontWeight: "700" },
  helpRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  helpText: { fontSize: 13 },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  statusId: { fontSize: 13 },
  statusBadge: { fontSize: 13, fontWeight: "600" },
  scroll: { paddingBottom: 60 },
  productSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  productThumbBox: {
    height: 200,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 16,
  },
  brandLogo: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    backgroundColor: "#F0F0F0",
  },
  mainThumb: {
    width: 140,
    height: 140,
    backgroundColor: "#EBEBEB",
    borderRadius: 70,
  },
  productInfo: {},
  infoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  prodTitle: { fontSize: 16, fontWeight: "700" },
  prodBrand: { fontSize: 13, color: "#888" },
  priceCol: { alignItems: "flex-end" },
  prodPrice: { fontSize: 18, fontWeight: "700" },
  amtPaid: { fontSize: 11, color: "#888" },
  prodSpecs: { fontSize: 12, color: "#666", lineHeight: 18 },
  trackingBox: {
    flexDirection: "row",
    margin: 16,
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    alignItems: "flex-start",
  },
  statusIconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  trackingInfo: { flex: 1 },
  trackTitle: { fontSize: 14, marginBottom: 2 },
  trackId: { fontSize: 12, color: "#888", marginBottom: 8 },
  trackLink: {
    fontSize: 13,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  policyBox: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  policyText: { fontSize: 13, color: "#333" },
  policyLink: {
    fontSize: 13,
    fontWeight: "700",
    textDecorationLine: "underline",
    marginTop: 4,
  },
  cancelBox: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    gap: 12,
  },
  cancelPrompt: { flex: 1, fontSize: 12, color: "#666" },
  cancelBtn: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  cancelBtnText: { fontSize: 13, fontWeight: "700" },

  // Delivered Specific styles
  deliveredActionsSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  policyInfoRow: {
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  policyInfoText: { fontSize: 13, color: "#333", textAlign: "center" },
  readPolicyInline: {
    fontSize: 13,
    fontWeight: "700",
    textDecorationLine: "underline",
    marginTop: 4,
  },
  actionBtnRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  outlineActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 4,
    backgroundColor: "#F5F5F5",
    gap: 8,
  },
  actionBtnText: { fontSize: 14, fontWeight: "600" },
  reviewSection: { padding: 16, borderTopWidth: 1, borderTopColor: "#F9F9F9" },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewTitle: { fontSize: 14, fontWeight: "700" },
  pointsBadge: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pointsBadgeText: { fontSize: 10 },
  reviewInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  starsRow: { flexDirection: "row" },
  writeReviewLink: {
    fontSize: 12,
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  sectionHeader: { fontSize: 15, fontWeight: "700" },
  addressCard: { flexDirection: "row", marginTop: 16 },
  addrIcon: { marginTop: 2 },
  addrContent: { marginLeft: 12 },
  addrName: { fontSize: 14, fontWeight: "700", marginBottom: 4 },
  addrText: { fontSize: 13, color: "#666", lineHeight: 20 },
  addrPhone: { fontSize: 14, fontWeight: "700", marginTop: 12 },
  payHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  payHeaderRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  paidMethod: { fontSize: 12, color: "#888" },
  totalPaid: { fontSize: 15, fontWeight: "800" },
  priceContainer: { marginTop: 16 },
  pointsBanner: { alignItems: "center", padding: 24 },
  pointsTitle: { fontSize: 15, fontWeight: "800", marginBottom: 6 },
  pointsDesc: { fontSize: 12, color: "#888", textAlign: "center" },
  invoiceBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
  },
  invoiceText: { fontSize: 13, color: "#333" },
  downloadText: { fontSize: 13, fontWeight: "700" },
  bottomHelp: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    padding: 16,
    gap: 8,
  },
  bottomHelpText: { fontSize: 13 },
  loading: { textAlign: "center", marginTop: 40 },
});
