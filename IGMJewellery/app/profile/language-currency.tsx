import { RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import CallUsComponent from "../../components/basic components/callUsComponent";
import { HapticButton } from "../../components/basic components/hapticButton";
import { COLORS } from "../../constants/theme";
import { useLuxury } from "../../context/luxuryContext";
import LuxuryLanguageCurrencyScreen from "../luxury/profile/language-currency";

/**
 * Both storefronts share this route, so every existing link to the locale
 * preferences lands on the presentation the shopper is browsing in.
 */
export default function LanguageCurrencyScreen() {
  const { isLuxury } = useLuxury();

  return isLuxury ? (
    <LuxuryLanguageCurrencyScreen />
  ) : (
    <ClassicLanguageCurrencyScreen />
  );
}

function ClassicLanguageCurrencyScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const prefs = useSelector((state: RootState) => state.user.preferences);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#053844" />
        </HapticButton>
        <Text style={styles.headerTitle}>Language & Currency</Text>
        <HapticButton style={styles.helpBadge}>
          <Text style={styles.helpText}>Help?</Text>
          <Ionicons name="call-outline" size={18} color="#053844" />
        </HapticButton>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.group}>
          <Text style={styles.label}>Select Language</Text>
          <HapticButton style={styles.picker}>
            <Text style={styles.pickerVal}>(EN) {prefs.language}</Text>
          </HapticButton>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Choose Currency</Text>
          <HapticButton style={styles.picker}>
            <Text style={styles.pickerVal}>(₹) {prefs.currency}</Text>
          </HapticButton>
        </View>

        <CallUsComponent />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  helpBadge: { flexDirection: "row", alignItems: "center" },
  helpText: { fontSize: 13, marginRight: 8, color: COLORS.text },
  content: { padding: 24 },
  group: { marginBottom: 32 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.text,
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    height: 54,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  pickerVal: { fontSize: 14, fontWeight: "500", color: COLORS.text },
});
