import { useGetFAQsQuery } from "@/store/apis/profile";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CallUsComponent from "../../components/basic components/callUsComponent";
import { HapticButton } from "../../components/basic components/hapticButton";
import { COLORS } from "../../constants/theme";

const CATEGORIES = ["Payment", "Brands", "Orders", "Try At Home", "Ai Sonar"];

export default function FAQScreen() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState("Payment");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: faqs, isLoading } = useGetFAQsQuery(activeCat);

  const toggleAccordion = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#053844" />
        </HapticButton>
        <Text style={styles.headerTitle}>FAQs</Text>
        <HapticButton>
          <View style={styles.helpBadge}>
            <Text style={styles.helpText}>Help?</Text>
            <Ionicons name="call-outline" size={18} color="#053844" />
          </View>
        </HapticButton>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#888" />
          <TextInput
            placeholder="Search your queries"
            style={styles.searchInput}
          />
          <Ionicons name="mic-outline" size={20} color="#053844" />
        </View>
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
        {isLoading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          faqs?.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <HapticButton
                style={styles.faqHeader}
                onPress={() => toggleAccordion(faq.id)}
              >
                <Text style={styles.question}>{faq.question}</Text>
                <Ionicons
                  name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#053844"
                />
              </HapticButton>
              {expandedId === faq.id && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))
        )}
        '
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
  searchSection: { padding: 16 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
  tabContainer: { borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  tab: { paddingHorizontal: 16, paddingVertical: 12, marginRight: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#053844" },
  tabText: { color: "#888", fontWeight: "600" },
  activeTabText: { color: "#053844" },
  scroll: { paddingBottom: 100 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: "#F9F9F9" },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  question: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    color: COLORS.text,
  },
  answerContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  answer: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  loading: { textAlign: "center", marginTop: 20 },
  contactBtnText: { marginLeft: 8, fontWeight: "600", color: COLORS.text },
});
