import { useGetPrivacyPoliciesQuery } from "@/store/apis/profile";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CallUsComponent from "../../components/basic components/callUsComponent";
import { HapticButton } from "../../components/basic components/hapticButton";
import { COLORS } from "../../constants/theme";

const CATEGORIES = ["Payment", "Brands", "Orders", "Try At Home", "Ai Sonar"];

export default function PrivacyPoliciesScreen() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState("Payment");
  const { data: policy, isLoading } = useGetPrivacyPoliciesQuery(activeCat);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#053844" />
        </HapticButton>
        <Text style={styles.headerTitle}>Privacy Policies</Text>
        <HapticButton>
          <View style={styles.helpBadge}>
            <Text style={styles.helpText}>Help?</Text>
            <Ionicons name="call-outline" size={18} color="#053844" />
          </View>
        </HapticButton>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat) => (
            <HapticButton
              key={cat}
              onPress={() => setActiveCat(cat)}
              style={[styles.tab, activeCat === cat && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeCat === cat && styles.activeTabText,
                ]}
              >
                {cat}
              </Text>
            </HapticButton>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.introTitle}>
          Below are our Privacy Policies for the company
        </Text>

        {isLoading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          <View style={styles.content}>
            <Text style={styles.bodyText}>{policy?.content}</Text>
            <Text style={styles.bodyText}>{policy?.content}</Text>
            <Text style={styles.bodyText}>{policy?.content}</Text>
          </View>
        )}

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
  tabContainer: { borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  tab: { paddingHorizontal: 16, paddingVertical: 12, marginRight: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#053844" },
  tabText: { color: "#888", fontWeight: "600" },
  activeTabText: { color: "#053844" },
  scroll: { padding: 16, paddingBottom: 100 },
  introTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 20,
    color: COLORS.text,
  },
  content: { gap: 16 },
  bodyText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 },
  loading: { textAlign: "center", marginTop: 40 },
});
