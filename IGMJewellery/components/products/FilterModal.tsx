import { FILTER_CATEGORIES } from "@/dummyData/filters";
import { BACKEND_BASE_URL } from "@/store/newApis/apiUrl.const";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
    Dimensions,
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { HapticButton } from "../basic components/hapticButton";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, string[]>) => void;
  initialFilters?: Record<string, string[]>;
}

const { width, height } = Dimensions.get("window");

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState("productType");
  const [selections, setSelections] =
    useState<Record<string, string[]>>(initialFilters);
  const [brandOptions, setBrandOptions] = useState<
    { id: string; label: string }[]
  >([]);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/getSellers`);
        if (response.ok) {
          const sellers = await response.json();
          const options = sellers.map(
            (s: { brandid: string; brandName: string }) => ({
              id: s.brandName,
              label: s.brandName,
            })
          );
          setBrandOptions(options);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  // Merge dynamic brand options into filter categories
  const filterCategories = useMemo(() => {
    return FILTER_CATEGORIES.map((cat) => {
      if (cat.id === "brand" && brandOptions.length > 0) {
        return { ...cat, options: brandOptions };
      }
      return cat;
    });
  }, [brandOptions]);

  // Update selections when modal opens with new initial filters
  useEffect(() => {
    if (visible) {
      setSelections(initialFilters);
    }
  }, [visible, initialFilters]);

  const activeCategory =
    filterCategories.find((c) => c.id === activeCategoryId) ||
    filterCategories[0];

  const toggleSelection = (categoryId: string, optionId: string) => {
    setSelections((prev) => {
      const current = prev[categoryId] || [];
      const exists = current.includes(optionId);
      let updated;
      if (exists) {
        updated = current.filter((id) => id !== optionId);
      } else {
        updated = [...current, optionId];
      }
      return { ...prev, [categoryId]: updated };
    });
  };

  const clearAll = () => {
    setSelections({});
  };

  const handleApply = () => {
    onApply(selections);
    onClose();
  };

  const getTotalSelectedCount = () => {
    return Object.values(selections).reduce(
      (total, options) => total + options.length,
      0
    );
  };

  const renderSidebarItem = ({
    item,
  }: {
    item: (typeof FILTER_CATEGORIES)[0];
  }) => {
    const isActive = item.id === activeCategoryId;
    const count = selections[item.id]?.length || 0;

    return (
      <HapticButton
        style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
        onPress={() => setActiveCategoryId(item.id)}
      >
        <View style={styles.sidebarLabelContainer}>
          <Text
            style={[styles.sidebarText, isActive && styles.sidebarTextActive]}
          >
            {item.label}
          </Text>
          {count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          )}
        </View>
      </HapticButton>
    );
  };

  const renderGridOption = ({
    item,
  }: {
    item: { id: string; label: string };
  }) => {
    const isSelected = (selections[activeCategoryId] || []).includes(item.id);
    return (
      <HapticButton
        style={styles.gridItemContainer}
        onPress={() => toggleSelection(activeCategoryId, item.id)}
      >
        <View
          style={[styles.gridItemBox, isSelected && styles.gridItemBoxSelected]}
        >
          {isSelected && (
            <Ionicons
              name="checkmark"
              size={24}
              color={COLORS.text}
              style={styles.checkIconCenter}
            />
          )}
        </View>
        <Text
          style={[
            styles.gridItemText,
            isSelected && styles.gridItemTextSelected,
          ]}
        >
          {item.label}
        </Text>
      </HapticButton>
    );
  };

  const renderListOption = ({
    item,
  }: {
    item: { id: string; label: string };
  }) => {
    const isSelected = (selections[activeCategoryId] || []).includes(item.id);
    return (
      <HapticButton
        style={styles.listItem}
        onPress={() => toggleSelection(activeCategoryId, item.id)}
      >
        <Text
          style={[
            styles.listItemText,
            isSelected && styles.listItemTextSelected,
          ]}
        >
          {item.label}
        </Text>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Ionicons name="checkmark" size={14} color="#FFF" />}
        </View>
      </HapticButton>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="options-outline" size={24} color={COLORS.text} />
            <Text style={styles.headerTitle}>Filters</Text>
            {getTotalSelectedCount() > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>
                  {getTotalSelectedCount()}
                </Text>
              </View>
            )}
          </View>
          <HapticButton onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </HapticButton>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <FlatList
              data={filterCategories}
              keyExtractor={(item) => item.id}
              renderItem={renderSidebarItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sidebarContent}
            />
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {activeCategory.type === "grid" ? (
              <FlatList
                key={`grid-${activeCategoryId}`}
                data={activeCategory.options}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={renderGridOption}
                contentContainerStyle={styles.gridContent}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <FlatList
                key={`list-${activeCategoryId}`}
                data={activeCategory.options}
                keyExtractor={(item) => item.id}
                renderItem={renderListOption}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <HapticButton
            style={styles.clearBtn}
            onPress={clearAll}
            disabled={getTotalSelectedCount() === 0}
          >
            <Text
              style={[
                styles.clearBtnText,
                getTotalSelectedCount() === 0 && styles.clearBtnTextDisabled,
              ]}
            >
              CLEAR ALL
            </Text>
          </HapticButton>
          <View style={styles.verticalDivider} />
          <HapticButton style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>
              APPLY
              {getTotalSelectedCount() > 0
                ? ` (${getTotalSelectedCount()})`
                : ""}
            </Text>
          </HapticButton>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: SPACING.s,
  },
  headerBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  headerBadgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  body: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: "35%",
    backgroundColor: "#F9F9F9",
  },
  sidebarContent: {
    paddingBottom: SPACING.xl,
  },
  sidebarItem: {
    paddingVertical: 20,
    paddingHorizontal: SPACING.m,
  },
  sidebarItemActive: {
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  sidebarLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sidebarText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  sidebarTextActive: {
    color: COLORS.text,
    fontWeight: "600",
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  content: {
    width: "65%",
    backgroundColor: "#FFFFFF",
  },
  gridContent: {
    padding: SPACING.m,
  },
  gridItemContainer: {
    width: "33.3%",
    alignItems: "center",
    marginBottom: SPACING.l,
    paddingHorizontal: 4,
  },
  gridItemBox: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  gridItemBoxSelected: {
    backgroundColor: "#EAEAEA",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  checkIconCenter: {
    opacity: 0.5,
  },
  gridItemText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  gridItemTextSelected: {
    color: COLORS.text,
    fontWeight: "600",
  },
  listContent: {
    padding: SPACING.m,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FAFAFA",
  },
  listItemText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  listItemTextSelected: {
    color: COLORS.text,
    fontWeight: "500",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    height: 60,
  },
  clearBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  clearBtnText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 14,
  },
  clearBtnTextDisabled: {
    color: COLORS.textSecondary,
    opacity: 0.5,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#F0F0F0",
    height: "100%",
  },
  applyBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  applyBtnText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 14,
  },
});
