import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { useGetFAQsQuery } from "@/store/apis/profile";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import LuxuryScreenHeader from "../components/luxuryScreenHeader";
import LuxuryCategoryTabs from "./components/luxuryCategoryTabs";
import LuxuryContactSupport from "./components/luxuryContactSupport";
import LuxuryProfileCard from "./components/luxuryProfileCard";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CATEGORIES = ["Payment", "Brands", "Orders", "Try At Home", "Ai Sonar"];

/**
 * The luxury storefront's help screen. Same categories and accordion as
 * app/profile/faqs.tsx, with the answers on frosted panels.
 */
export default function LuxuryFAQScreen() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: faqs, isLoading } = useGetFAQsQuery(activeCategory);

  const toggleAccordion = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.screen}>
      <LuxuryScreenHeader
        title="FAQs"
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

      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={20}
          color={LUXURY_COLORS.textMuted}
        />
        <TextInput
          placeholder="Search your queries"
          placeholderTextColor={LUXURY_COLORS.textMuted}
          style={styles.searchInput}
        />
        <Ionicons name="mic-outline" size={20} color={LUXURY_COLORS.accent} />
      </View>

      <LuxuryCategoryTabs
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelect={(category) => {
          // The open answer belongs to the category being left.
          setExpandedId(null);
          setActiveCategory(category);
        }}
        style={styles.tabs}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {isLoading ? (
          <ActivityIndicator
            color={LUXURY_COLORS.accent}
            style={styles.loading}
          />
        ) : (
          faqs?.map((faq) => {
            const isExpanded = expandedId === faq.id;

            return (
              <LuxuryProfileCard key={faq.id} style={styles.faqCard}>
                <HapticButton
                  style={styles.faqHeader}
                  activeOpacity={0.85}
                  onPress={() => toggleAccordion(faq.id)}
                >
                  <Text style={styles.question}>{faq.question}</Text>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={LUXURY_COLORS.accent}
                  />
                </HapticButton>

                {isExpanded && (
                  <View style={styles.answerWrapper}>
                    <Text style={styles.answer}>{faq.answer}</Text>
                  </View>
                )}
              </LuxuryProfileCard>
            );
          })
        )}

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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 52,
    marginHorizontal: 20,
    paddingHorizontal: 18,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.surface,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: LUXURY_COLORS.text,
    // Android pads its inputs by default, which pushes the text off-centre.
    paddingVertical: 0,
  },
  tabs: {
    // The strip carries the screen's gutters in its own content padding, so
    // the pills can scroll clear of them.
    marginTop: 16,
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: LUXURY_SPACING / 3,
    paddingBottom: 60,
    gap: 12,
  },
  loading: {
    marginTop: 40,
  },
  faqCard: {
    overflow: "hidden",
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  question: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    color: LUXURY_COLORS.text,
  },
  answerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  answer: {
    fontSize: 13,
    lineHeight: 20,
    color: LUXURY_COLORS.textMuted,
  },
});
