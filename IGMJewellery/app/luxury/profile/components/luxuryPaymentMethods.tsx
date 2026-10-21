import { assetUrl } from "@/constants/assets";
import { COLORS, LUXURY_COLORS } from "@/constants/theme";
import React, { useState } from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

/** The same rails components/paymentMethods.tsx advertises. */
const PAYMENT_ICONS = [
  {
    name: "PhonePe",
    uri: assetUrl("payment.icon.phonePe"),
  },
  {
    name: "GPay",
    uri: assetUrl("payment.icon.gPay"),
  },
  {
    name: "Paytm",
    uri: assetUrl("payment.icon.paytm"),
  },
  {
    name: "Amex",
    uri: assetUrl("payment.icon.amex"),
  },
  {
    name: "Mastercard",
    uri: assetUrl("payment.icon.mastercard"),
  },
];

type LuxuryPaymentMethodsProps = {
  style?: StyleProp<ViewStyle>;
};

/**
 * The payment rails the storefront accepts. The logos are supplied on white,
 * so each keeps a light tile of its own rather than sitting on the dark ground.
 */
export default function LuxuryPaymentMethods({
  style,
}: LuxuryPaymentMethodsProps) {
  /** Providers whose logo failed to load; they fall back to their name. */
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Secure & Easy Payments</Text>

      <View style={styles.logoRow}>
        {PAYMENT_ICONS.map((item) => (
          <View key={item.name} style={styles.logoBox}>
            {failed[item.name] ? (
              // A blank tile reads as a broken screen; the name still tells
              // the shopper the rail is accepted.
              <Text style={styles.fallback} numberOfLines={1}>
                {item.name}
              </Text>
            ) : (
              <Image
                source={{ uri: item.uri }}
                style={styles.icon}
                onError={() =>
                  setFailed((current) => ({ ...current, [item.name]: true }))
                }
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: "500",
    color: LUXURY_COLORS.textMuted,
    marginBottom: 16,
  },
  logoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  logoBox: {
    width: 55,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: "#FFFFFF",
  },
  icon: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  // The tile stays white, so the name grounds to it rather than the storefront.
  fallback: {
    paddingHorizontal: 4,
    fontSize: 9,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
