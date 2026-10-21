import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";
import { assetUrl } from "@/constants/assets";

export default function PaymentMethods() {
  /** Providers whose logo failed to load; they fall back to their name. */
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const paymentIcons = [
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure & Easy Payments</Text>

      <View style={styles.logoRow}>
        {paymentIcons.map((item, index) => (
          <View key={index} style={styles.logoBox}>
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 13,
    color: COLORS.primary,
    marginBottom: 16,
    fontWeight: "500",
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
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    overflow: "hidden",
  },
  icon: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  fallback: {
    paddingHorizontal: 4,
    fontSize: 9,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
