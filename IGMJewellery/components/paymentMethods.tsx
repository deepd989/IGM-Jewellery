import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

export default function PaymentMethods() {
  const paymentIcons = [
    {
      name: "PhonePe",
      uri: "https://drive.google.com/uc?export=view&id=1sTBoePSN7S_U_PE3s1Ehely4MjOQnI7M",
    },
    {
      name: "GPay",
      uri: "https://drive.google.com/uc?export=view&id=1dos8DTWR05FAc0nPeVIlNmvIlhy2UowR",
    },
    {
      name: "Paytm",
      uri: "https://drive.google.com/uc?export=view&id=1jCi1WkNc6ck_wA8Kd0gI_Q2tVB_i2JG2",
    },
    {
      name: "Amex",
      uri: "https://drive.google.com/uc?export=view&id=1Jbrdq-W5JhrqDMlfMj-qqDU20Ybxaudi",
    },
    {
      name: "Mastercard",
      uri: "https://drive.google.com/uc?export=view&id=1z0ugQX0ewzKCXubMooUS_eGEe4Ug41v2",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure & Easy Payments</Text>

      <View style={styles.logoRow}>
        {paymentIcons.map((item, index) => (
          <View key={index} style={styles.logoBox}>
            <Image source={{ uri: item.uri }} style={styles.icon} />
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
});
