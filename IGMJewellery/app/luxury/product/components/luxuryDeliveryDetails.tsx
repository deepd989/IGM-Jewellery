import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { getEstimatedDeliveryDate } from "@/utils/deliveryDate";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Store, Truck } from "lucide-react-native";
import { useState } from "react";
import {
  Keyboard,
  LayoutAnimation,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
  ViewStyle,
} from "react-native";
import LuxuryGlassDialog from "./luxuryGlassDialog";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** Shown until the shopper types one of their own. */
const DEFAULT_PINCODE = "400 066";
/** The express slot the catalogue promises; not yet driven by the backend. */
const DELIVERY_WINDOW = "3pm-9pm";

/** Neither service is live yet, so both actions answer with a teaser. */
const TRY_AT_HOME_MESSAGE = "Home Trials Are Coming Soon!";
const BOOK_APPOINTMENT_MESSAGE = "Store Appointments Are Coming Soon!";

/** Muted labels above each bolded value. */
const MUTED = "#7E959C";

type LuxuryDeliveryDetailsProps = {
  onCheckPincode?: (pincode: string) => void;
  onTryAtHome?: () => void;
  onBookAppointment?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Delivery, home-trial and store options for the shopper's area. The express
 * promise only appears once a pincode has been checked; every pincode reads as
 * serviceable, since the availability lookup is not wired to a backend yet.
 */
export default function LuxuryDeliveryDetails({
  onCheckPincode,
  onTryAtHome,
  onBookAppointment,
  style,
}: LuxuryDeliveryDetailsProps) {
  const [pincode, setPincode] = useState("");
  /** The last pincode the shopper checked — empty until they do. */
  const [checkedPincode, setCheckedPincode] = useState("");
  /** Copy for the popup; null while it is closed. */
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);

  const displayPincode = checkedPincode || DEFAULT_PINCODE;

  const handleCheck = () => {
    const entered = pincode.trim();
    if (!entered) return;

    Keyboard.dismiss();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCheckedPincode(entered);
    onCheckPincode?.(entered);
  };

  const handleTryAtHome = () => {
    setDialogMessage(TRY_AT_HOME_MESSAGE);
    onTryAtHome?.();
  };

  const handleBookAppointment = () => {
    setDialogMessage(BOOK_APPOINTMENT_MESSAGE);
    onBookAppointment?.();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        {/* Placeholder for the illustration until the real asset is hosted. */}
        <Text style={styles.illustration}>📦</Text>

        <View style={styles.headerText}>
          <Text style={styles.title}>Delivery Details</Text>
          <Text style={styles.subtitle}>
            Find if your locality is eligible for express delivery & look for
            stores nearby
          </Text>
        </View>
      </View>

      <View style={styles.pincodeRow}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={pincode}
            onChangeText={setPincode}
            placeholder="Enter pincode"
            placeholderTextColor={LUXURY_COLORS.textMuted}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={handleCheck}
            style={styles.input}
          />
        </View>

        <HapticButton
          style={styles.checkButton}
          activeOpacity={0.6}
          onPress={handleCheck}
        >
          <Text style={styles.checkText}>Check</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={LUXURY_COLORS.text}
          />
        </HapticButton>
      </View>

      <View style={styles.options}>
        {/* The express promise is the answer to the check, so it waits for it. */}
        {!!checkedPincode && (
          <View style={styles.expressBanner}>
            <Truck size={24} color={COLORS.primary} strokeWidth={1.8} />
            <Text style={styles.expressText}>
              Express delivery by{" "}
              <Text style={styles.expressDate}>
                {getEstimatedDeliveryDate()} {DELIVERY_WINDOW}
              </Text>
            </Text>
          </View>
        )}

        <View style={[styles.optionRow, styles.tryAtHomeRow]}>
          <Ionicons name="home" size={26} color={COLORS.primary} />

          <View style={styles.optionText}>
            <Text style={styles.optionLabel}>Try at home</Text>
            <Text style={styles.optionValue}>
              Available for {displayPincode}
            </Text>
          </View>

          <HapticButton
            style={styles.solidPill}
            activeOpacity={0.85}
            onPress={handleTryAtHome}
          >
            <Text style={styles.pillText}>Add to Try at Home</Text>
          </HapticButton>
        </View>

        <View style={[styles.optionRow, styles.visitStoreRow]}>
          <Store size={26} color={COLORS.primary} strokeWidth={1.8} />

          <View style={styles.optionText}>
            <Text style={styles.optionLabel}>Visit Store</Text>
            <Text style={styles.optionValue}>Pin Code: {displayPincode}</Text>
          </View>

          <HapticButton
            style={styles.gradientPillWrapper}
            activeOpacity={0.85}
            onPress={handleBookAppointment}
          >
            <LinearGradient
              colors={["#2E8B85", "#1A5F66"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradientPill}
            >
              <Text style={styles.pillText}>Book Appointment</Text>
            </LinearGradient>
          </HapticButton>
        </View>
      </View>

      <LuxuryGlassDialog
        visible={!!dialogMessage}
        title={dialogMessage || ""}
        onClose={() => setDialogMessage(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  illustration: {
    fontSize: 44,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: LUXURY_COLORS.textMuted,
  },
  pincodeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: LUXURY_SPACING / 2,
  },
  // Same frosted field the storefront's search box uses, so the two read as
  // one input across the two screens.
  inputWrapper: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.surface,
  },
  input: {
    fontSize: 16,
    color: LUXURY_COLORS.text,
    // Android pads its inputs by default, which pushes the text off-centre.
    paddingVertical: 0,
  },
  checkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
  },
  checkText: {
    fontSize: 16,
    color: LUXURY_COLORS.text,
  },
  // The three availability rows read as one block, so they sit tighter to each
  // other than to the sections around them.
  options: {
    marginTop: LUXURY_SPACING / 2,
    gap: 12,
  },
  expressBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "#FBF2DC",
  },
  expressText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primary,
  },
  expressDate: {
    fontWeight: "700",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  tryAtHomeRow: {
    backgroundColor: "#E6EFEB",
  },
  visitStoreRow: {
    backgroundColor: "#DEEFF7",
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    color: MUTED,
  },
  optionValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  solidPill: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  gradientPillWrapper: {
    borderRadius: 20,
    overflow: "hidden",
  },
  gradientPill: {
    height: 40,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
