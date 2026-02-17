import { RootState } from "@/store/store";
import { removePaymentMethod } from "@/store/userSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { HapticButton } from "../../components/basic components/hapticButton";
import { COLORS } from "../../constants/theme";

export default function BankDetailsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const methods = useSelector((state: RootState) => state.user.paymentMethods);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#053844" />
        </HapticButton>
        <Text style={styles.headerTitle}>Bank/UPI Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Here are your registered Bank Details</Text>
        <Text style={styles.subtitle}>
          You can edit or add new details below
        </Text>

        <View style={styles.list}>
          {methods.map((method) => (
            <View key={method.id} style={styles.card}>
              <View style={styles.iconBox} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  {method.provider}{" "}
                  {method.category ? `- ${method.category} Card` : ""}
                </Text>
                <Text style={styles.cardId}>{method.identifier}</Text>
              </View>
              <View style={styles.actions}>
                <HapticButton style={styles.actionBtn}>
                  <Ionicons name="pencil-outline" size={20} color="#053844" />
                </HapticButton>
                <HapticButton
                  style={[styles.actionBtn, { marginLeft: 16 }]}
                  onPress={() => dispatch(removePaymentMethod(method.id))}
                >
                  <Ionicons name="trash-outline" size={20} color="#053844" />
                </HapticButton>
              </View>
            </View>
          ))}
        </View>

        <HapticButton style={styles.addBtn}>
          <Ionicons name="add" size={24} color="#053844" />
          <Text style={styles.addText}>Add payment method</Text>
        </HapticButton>
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
  content: { padding: 24 },
  title: { fontSize: 16, fontWeight: "700", textAlign: "center", color: COLORS.text },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 32,
  },
  list: { gap: 16 },
  card: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
  },
  cardContent: { flex: 1, marginLeft: 16 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  cardId: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  actions: { flexDirection: "row" },
  actionBtn: { padding: 4 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    marginTop: 40,
  },
  addText: { fontSize: 14, fontWeight: "600", marginLeft: 12, color: COLORS.text },
});
