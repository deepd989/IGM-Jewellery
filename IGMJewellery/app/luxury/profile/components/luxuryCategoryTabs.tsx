import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS } from "@/constants/theme";
import React from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

type LuxuryCategoryTabsProps = {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The horizontal category strip the help screens filter by. The active tab is
 * a filled pill rather than an underline — on the dark ground a hairline rule
 * all but disappears.
 */
export default function LuxuryCategoryTabs({
  categories,
  activeCategory,
  onSelect,
  style,
}: LuxuryCategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => {
        const isActive = category === activeCategory;

        return (
          <HapticButton
            key={category}
            style={[styles.tab, isActive && styles.activeTab]}
            activeOpacity={0.85}
            onPress={() => onSelect(category)}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {category}
            </Text>
          </HapticButton>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  tab: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.surface,
  },
  activeTab: {
    borderColor: LUXURY_COLORS.accent,
    backgroundColor: LUXURY_COLORS.accent,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: LUXURY_COLORS.textMuted,
  },
  // The active pill is gold, so its label grounds to the storefront.
  activeTabText: {
    color: LUXURY_COLORS.primary,
  },
});
