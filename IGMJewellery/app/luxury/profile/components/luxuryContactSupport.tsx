import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Linking,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const PHONE_NUMBER = "+919920919899";
const WHATSAPP_NUMBER = "+919920919899";
const DEFAULT_MESSAGE = "Hello! I have a query regarding your services.";

type LuxuryContactSupportProps = {
  style?: StyleProp<ViewStyle>;
};

/**
 * The luxury storefront's way to reach a person — the same two numbers
 * components/basic components/callUsComponent.tsx dials, on the dark ground.
 */
export default function LuxuryContactSupport({
  style,
}: LuxuryContactSupportProps) {
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

  const handleWhatsApp = async () => {
    const encodedMsg = encodeURIComponent(DEFAULT_MESSAGE);
    const appUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodedMsg}`;
    const webUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

    try {
      const supported = await Linking.canOpenURL(appUrl);
      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        // Falls back to the browser when the app is not installed.
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error("WhatsApp Error:", error);
      Linking.openURL(webUrl);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>
        For any queries, feel free to contact us:
      </Text>

      <View style={styles.row}>
        <HapticButton
          style={styles.button}
          activeOpacity={0.85}
          onPress={handleCall}
        >
          <Ionicons
            name="call-outline"
            size={18}
            color={LUXURY_COLORS.accent}
          />
          <Text style={styles.buttonText}>Call Us</Text>
        </HapticButton>

        <HapticButton
          style={styles.button}
          activeOpacity={0.85}
          onPress={handleWhatsApp}
        >
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={LUXURY_COLORS.accent}
          />
          <Text style={styles.buttonText}>Chat With Us</Text>
        </HapticButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
  },
  title: {
    fontSize: 13,
    color: LUXURY_COLORS.textMuted,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    alignSelf: "stretch",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.surface,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: LUXURY_COLORS.text,
  },
});
