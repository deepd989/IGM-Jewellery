import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import LuxuryScreenHeader from "../components/luxuryScreenHeader";
import LuxuryContactSupport from "./components/luxuryContactSupport";

/**
 * The luxury storefront's locale preferences. Same stored language and
 * currency as app/profile/language-currency.tsx, on the dark ground.
 */
export default function LuxuryLanguageCurrencyScreen() {
  const prefs = useSelector((state: RootState) => state.user.preferences);

  return (
    <View style={styles.screen}>
      <LuxuryScreenHeader
        title="Language & Currency"
        showBack
        variant="glass"
        right={
          <HapticButton style={styles.help} activeOpacity={0.8}>
            <Text style={styles.helpText}>Help?</Text>
            <Ionicons
              name="call-outline"
              size={18}
              color={LUXURY_COLORS.accent}
            />
          </HapticButton>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.group}>
          <Text style={styles.label}>Select Language</Text>
          <HapticButton style={styles.picker} activeOpacity={0.85}>
            <Text style={styles.pickerValue}>(EN) {prefs.language}</Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={LUXURY_COLORS.textMuted}
            />
          </HapticButton>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Choose Currency</Text>
          <HapticButton style={styles.picker} activeOpacity={0.85}>
            <Text style={styles.pickerValue}>(₹) {prefs.currency}</Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={LUXURY_COLORS.textMuted}
            />
          </HapticButton>
        </View>

        <LuxuryContactSupport />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: LUXURY_COLORS.primary,
  },
  help: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  helpText: {
    fontSize: 13,
    color: LUXURY_COLORS.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  group: {
    marginBottom: LUXURY_SPACING / 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    color: LUXURY_COLORS.text,
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.surface,
  },
  pickerValue: {
    fontSize: 14,
    fontWeight: "500",
    color: LUXURY_COLORS.text,
  },
});
