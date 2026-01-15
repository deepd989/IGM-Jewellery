import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { getEstimatedDeliveryDate } from "../../utils/deliveryDate";

export const DeliveryCheck: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <View style={styles.truckIcon}>
          <Ionicons name="bus-outline" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>Delivery Details</Text>
          <Text style={styles.subtitle}>
            Check delivery availability & look for stores nearby
          </Text>
        </View>
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter pincode"
          style={styles.input}
          keyboardType="numeric"
          placeholderTextColor={COLORS.textSecondary}
        />
        <TouchableOpacity>
          <Text style={styles.checkText}>Check</Text>
        </TouchableOpacity>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={COLORS.textSecondary}
        />
      </View>

      {/* Highlights */}
      <View style={styles.highlightRow}>
        <View style={styles.highlightIcon}>
          <Ionicons name="time-outline" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.highlightTextCol}>
          <Text style={styles.highlightTitle}>
            Delivery by{" "}
            <Text style={{ fontWeight: "700" }}>
              {getEstimatedDeliveryDate()}
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.highlightRow}>
        <View style={styles.highlightIcon}>
          <Ionicons name="home-outline" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.highlightTextCol}>
          <Text style={styles.highlightTitle}>Try at home</Text>
          <Text style={styles.highlightSubtitle}>Available for 400 066</Text>
        </View>
        <TouchableOpacity style={styles.tryBtn}>
          <Text style={styles.tryBtnText}>Add to Try at Home</Text>
        </TouchableOpacity>
      </View>

      {/* Offer Coupon */}
      <TouchableOpacity style={styles.couponContainer}>
        <View style={styles.couponIcon}>
          <Ionicons name="pricetag-outline" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.couponContent}>
          <Text style={styles.couponTitle}>Check Available Offers</Text>
          <Text style={styles.couponSubtitle}>
            Save extra with coupons - check now!
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
      </TouchableOpacity>

      {/* Live Call */}
      <View style={styles.liveCallContainer}>
        <View style={styles.videoIcon}>
          <Ionicons name="videocam" size={24} color={COLORS.primary} />
        </View>
        <Text style={styles.liveCallTitle}>WISH TO SEE THE PRODUCT LIVE?</Text>
        <Text style={styles.liveCallDesc}>
          Celebrate every day in style with the subtle grace of these drop
          earrings crafted in 22 Karat Yellow Gold in a leaf design.
        </Text>
        <TouchableOpacity style={styles.scheduleBtn}>
          <Ionicons
            name="videocam-outline"
            size={18}
            color="#FFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.scheduleBtnText}>Schedule call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.m,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 8,
    borderTopColor: "#F9F9F9", // Section separator
  },
  header: {
    flexDirection: "row",
    marginBottom: SPACING.m,
  },
  truckIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.m,
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: SPACING.m,
    height: 48,
    marginBottom: SPACING.l,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  checkText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 4,
  },

  // Highlights
  highlightRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: SPACING.m,
    borderRadius: 8,
    marginBottom: SPACING.s,
  },
  highlightIcon: {
    marginRight: SPACING.m,
  },
  highlightTextCol: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },
  highlightSubtitle: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "700",
    marginTop: 2,
  },
  tryBtn: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  tryBtnText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "500",
  },

  // Coupon
  couponContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 8,
    padding: SPACING.m,
    marginTop: SPACING.m,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  couponIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.m,
  },
  couponContent: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  couponSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Live Call
  liveCallContainer: {
    marginTop: SPACING.xl,
    alignItems: "center",
  },
  videoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.m,
  },
  liveCallTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    textTransform: "uppercase",
    marginBottom: SPACING.s,
  },
  liveCallDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: SPACING.m,
  },
  scheduleBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  scheduleBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
