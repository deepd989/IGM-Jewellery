import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { RootState } from "@/store/store";
import { removePaymentMethod } from "@/store/userSlice";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LuxuryScreenHeader from "../components/luxuryScreenHeader";
import LuxuryActionButton from "./components/luxuryActionButton";
import LuxuryProfileCard from "./components/luxuryProfileCard";

/**
 * The luxury storefront's saved payment methods. Same store slice and remove
 * action as app/profile/bank-details.tsx, listed on the dark ground.
 */
export default function LuxuryBankDetailsScreen() {
  const dispatch = useDispatch();
  const methods = useSelector((state: RootState) => state.user.paymentMethods);

  return (
    <View style={styles.screen}>
      <LuxuryScreenHeader title="Bank/UPI Details" showBack variant="glass" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.intro}>
          Here are your registered Bank Details
        </Text>
        <Text style={styles.introSub}>
          You can edit or add new details below
        </Text>

        <LuxuryProfileCard style={styles.list}>
          {methods.map((method, index) => (
            <View
              key={method.id}
              style={[styles.row, index > 0 && styles.divided]}
            >
              <View style={styles.iconBadge}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={LUXURY_COLORS.accent}
                />
              </View>

              <View style={styles.rowText}>
                <Text style={styles.provider}>
                  {method.provider}
                  {method.category ? ` - ${method.category} Card` : ""}
                </Text>
                <Text style={styles.identifier}>{method.identifier}</Text>
              </View>

              <View style={styles.actions}>
                <HapticButton activeOpacity={0.7}>
                  <Ionicons
                    name="pencil-outline"
                    size={20}
                    color={LUXURY_COLORS.accent}
                  />
                </HapticButton>
                <HapticButton
                  activeOpacity={0.7}
                  onPress={() => dispatch(removePaymentMethod(method.id))}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={LUXURY_COLORS.accent}
                  />
                </HapticButton>
              </View>
            </View>
          ))}
        </LuxuryProfileCard>

        <LuxuryActionButton
          label="Add payment method"
          variant="outline"
          style={styles.addButton}
          icon={<Ionicons name="add" size={22} color={LUXURY_COLORS.accent} />}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: LUXURY_COLORS.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  intro: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: LUXURY_COLORS.text,
  },
  introSub: {
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
    color: LUXURY_COLORS.textMuted,
  },
  list: {
    marginTop: LUXURY_SPACING / 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  divided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LUXURY_COLORS.border,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  rowText: {
    flex: 1,
  },
  provider: {
    fontSize: 14,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  identifier: {
    marginTop: 2,
    fontSize: 12,
    color: LUXURY_COLORS.textMuted,
  },
  actions: {
    flexDirection: "row",
    gap: 18,
  },
  addButton: {
    marginTop: LUXURY_SPACING / 2,
  },
});
