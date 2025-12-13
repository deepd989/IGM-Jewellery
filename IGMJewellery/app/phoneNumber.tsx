import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

export default function PhoneLoginScreen() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isValidIndianPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return /^\d{10}$/.test(digits);
  };

  const handleGetOtp = () => {
    if (!isValidIndianPhone(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError(null);
    const digits = phone.replace(/\D/g, "");
    router.push({
      pathname: "/verifyOtp",
      params: { phoneNumber: `+91 ${digits}` },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Sparkle Icon */}
        <Ionicons name="sparkles" size={24} color="black" style={styles.sparkle} />

        {/* Header */}
        <Text style={styles.title}>
          Hi, Welcome! <Text>👋</Text>
        </Text>
        <Text style={styles.subtitle}>
          Please confirm your phone number.
        </Text>

        {/* Country Selector */}
        <View style={styles.row}>
          <Text style={styles.flag}>🇮🇳</Text>
          <Text style={styles.country}>India</Text>
        </View>

        <View style={styles.divider} />

        {/* Phone Input */}
        <View style={styles.phoneRow}>
          <Text style={styles.code}>+91</Text>
          <View style={styles.verticalDivider} />
          <TextInput
            placeholder="00000 00000"
            keyboardType="number-pad"
            style={[styles.input, error ? styles.inputError : null]}
            placeholderTextColor="#999"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              if (error) setError(null);
            }}
            maxLength={10} // allows "00000 00000" format; validation strips non-digits
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Bottom Section */}
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.button} onPress={handleGetOtp}>
            <Text style={styles.buttonText}>Get OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.guest}>Browse as guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: "#fff",
    },
    container: {
      flex: 1,
      padding: 24,
    },
    sparkle: {
      alignSelf: "flex-end",
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      marginTop: 40,
    },
    subtitle: {
      marginTop: 8,
      color: "#666",
      fontSize: 14,
      lineHeight: 20,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 32,
    },
    flag: {
      fontSize: 20,
      marginRight: 12,
    },
    country: {
      fontSize: 16,
      fontWeight: "500",
    },
    divider: {
      height: 1,
      backgroundColor: "#E5E5E5",
      marginVertical: 16,
    },
    phoneRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    code: {
      fontSize: 16,
      fontWeight: "500",
    },
    verticalDivider: {
      width: 1,
      height: 24,
      backgroundColor: "#E5E5E5",
      marginHorizontal: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
    },
    inputError: {
      borderBottomWidth: 1,
      borderColor: "#E53935",
      paddingBottom: 2,
    },
    error: {
      color: "#E53935",
      marginTop: 8,
      fontSize: 13,
    },
    bottom: {
      position: "absolute",
      bottom: 40,
      left: 24,
      right: 24,
    },
    button: {
      backgroundColor: "#000",
      paddingVertical: 16,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    guest: {
      textAlign: "center",
      marginTop: 16,
      color: "#444",
      fontSize: 14,
    },
  });
