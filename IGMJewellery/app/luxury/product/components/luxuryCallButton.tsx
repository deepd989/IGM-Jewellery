import { HapticButton } from "@/components/basic components/hapticButton";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, Linking, StyleProp, StyleSheet, ViewStyle } from "react-native";

/** Same concierge line the rest of the app dials. */
const PHONE_NUMBER = "+919920919899";

const SIZE = 56;

type LuxuryCallButtonProps = {
  phoneNumber?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * The concierge call button that floats over the details sheet — a shopper can
 * reach a person from anywhere on the product screen.
 */
export default function LuxuryCallButton({
  phoneNumber = PHONE_NUMBER,
  style,
}: LuxuryCallButtonProps) {
  const handleCall = async () => {
    const url = `tel:${phoneNumber}`;
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

  return (
    <HapticButton style={[styles.wrapper, style]} onPress={handleCall}>
      <LinearGradient
        colors={["#1C7A72", "#04333E"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.button}
      >
        <Ionicons name="call" size={22} color="#FFFFFF" />
      </LinearGradient>
    </HapticButton>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: SIZE / 2,
    shadowColor: "#04333E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
