import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Linking, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";
import { HapticButton } from "./hapticButton";

export default function CallUsComponent() {
  const PHONE_NUMBER = "+919920919899";
  const WHATSAPP_NUMBER = "+919920919899";
  const DEFAULT_MESSAGE = "Hello! I have a query regarding your services.";

  /**
   * Triggers the native phone dialer
   */
  const handleCall = async () => {
    const url = `tel:${PHONE_NUMBER}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Phone calls are not supported on this device.");
      }
    } catch (error) {
      console.error("Call Error:", error);
    }
  };

  /**
   * Opens WhatsApp with a pre-filled message
   * Falls back to browser (wa.me) if the app isn't installed
   */
  const handleWhatsApp = async () => {
    const encodedMsg = encodeURIComponent(DEFAULT_MESSAGE);
    const appUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodedMsg}`;
    const webUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

    try {
      const supported = await Linking.canOpenURL(appUrl);
      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        // Fallback to browser link if app is missing
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error("WhatsApp Error:", error);
      // Last resort fallback
      Linking.openURL(webUrl);
    }
  };

  return (
    <View style={styles.contactSection}>
      <Text style={styles.contactTitle}>
        For any queries, feel free to contact us:
      </Text>

      <View style={styles.contactRow}>
        <HapticButton style={styles.contactBtn} onPress={handleCall}>
          <Ionicons name="call-outline" size={20} color={COLORS.primary} />
          <Text style={styles.contactBtnText}>Call Us</Text>
        </HapticButton>

        <HapticButton style={styles.contactBtn} onPress={handleWhatsApp}>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.contactBtnText}>Chat With Us</Text>
        </HapticButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contactSection: {
    alignItems: "center",
    padding: 16,
  },
  contactTitle: {
    fontSize: 13,
    color: COLORS.primary,
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: "row",
    gap: 12,
  },
  contactBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderWidth: 0.5,
    borderColor: "#DDD",
    borderRadius: 8,
    minWidth: 150,
    backgroundColor: "#FFF",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  contactBtnText: {
    marginLeft: 8,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
