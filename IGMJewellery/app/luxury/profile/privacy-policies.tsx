import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { useGetPrivacyPoliciesQuery } from "@/store/apis/profile";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LuxuryScreenHeader from "../components/luxuryScreenHeader";
import LuxuryCategoryTabs from "./components/luxuryCategoryTabs";
import LuxuryContactSupport from "./components/luxuryContactSupport";
import LuxuryProfileCard from "./components/luxuryProfileCard";

const CATEGORIES = ["Payment", "Brands", "Orders", "Try At Home", "Ai Sonar"];

/**
 * The luxury storefront's policy screen. Same categories and copy as
 * app/profile/privacy-policies.tsx, set on the dark ground.
 */
export default function LuxuryPrivacyPoliciesScreen() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const { data: policy, isLoading } = useGetPrivacyPoliciesQuery(activeCategory);

  return (
    <View style={styles.screen}>
      <LuxuryScreenHeader
        title="Privacy Policies"
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

      <LuxuryCategoryTabs
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
        style={styles.tabs}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.intro}>
          Below are our Privacy Policies for the company
        </Text>

        {isLoading ? (
          <ActivityIndicator
            color={LUXURY_COLORS.accent}
            style={styles.loading}
          />
        ) : (
          <LuxuryProfileCard style={styles.body}>
            <Text style={styles.bodyText}>{policy?.content}</Text>
            <Text style={styles.bodyText}>{policy?.content}</Text>
            <Text style={styles.bodyText}>{policy?.content}</Text>
          </LuxuryProfileCard>
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
  tabs: {
    marginTop: 8,
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: LUXURY_SPACING / 3,
    paddingBottom: 60,
  },
  intro: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 16,
    color: LUXURY_COLORS.text,
  },
  loading: {
    marginTop: 40,
  },
  body: {
    padding: 16,
    gap: 16,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 22,
    color: LUXURY_COLORS.textMuted,
  },
});
