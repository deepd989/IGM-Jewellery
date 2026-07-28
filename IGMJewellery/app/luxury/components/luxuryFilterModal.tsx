import { HapticButton } from "@/components/basic components/hapticButton";
import { useFilterCategories } from "@/hooks/useFilterCategories";
import { ListingFilters } from "@/hooks/useProductListing";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LuxuryFilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: ListingFilters) => void;
  initialFilters?: ListingFilters;
};

/**
 * The luxury listing's filter sheet: the same categories and options the
 * classic sheet offers — both read useFilterCategories — as a dark panel with
 * the categories down the side.
 */
export default function LuxuryFilterModal({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}: LuxuryFilterModalProps) {
  const insets = useSafeAreaInsets();
  const filterCategories = useFilterCategories();

  const [activeCategoryId, setActiveCategoryId] = useState("productType");
  const [selections, setSelections] = useState<ListingFilters>(initialFilters);

  // Re-open on whatever is currently applied rather than the last edit.
  useEffect(() => {
    if (visible) {
      setSelections(initialFilters);
    }
  }, [visible, initialFilters]);

  const activeCategory =
    filterCategories.find((c) => c.id === activeCategoryId) ||
    filterCategories[0];

  const selectedCount = Object.values(selections).reduce(
    (total, options) => total + options.length,
    0
  );

  const toggleSelection = (categoryId: string, optionId: string) => {
    setSelections((prev) => {
      const current = prev[categoryId] || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];

      return { ...prev, [categoryId]: updated };
    });
  };

  const handleApply = () => {
    onApply(selections);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            {
              paddingTop: insets.top + 12,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <HapticButton
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </HapticButton>
          </View>

          <View style={styles.body}>
            <View style={styles.sidebar}>
              <FlatList
                data={filterCategories}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isActive = item.id === activeCategoryId;
                  const count = selections[item.id]?.length || 0;

                  return (
                    <HapticButton
                      style={[
                        styles.sidebarItem,
                        isActive && styles.sidebarItemActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setActiveCategoryId(item.id)}
                    >
                      <Text
                        style={[
                          styles.sidebarText,
                          isActive && styles.sidebarTextActive,
                        ]}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                      {count > 0 && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{count}</Text>
                        </View>
                      )}
                    </HapticButton>
                  );
                }}
              />
            </View>

            <View style={styles.options}>
              <FlatList
                data={activeCategory?.options || []}
                keyExtractor={(item) => item.id}
                extraData={selections}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  // Params arrive in mixed case, so match case-insensitively.
                  const isSelected = (selections[activeCategoryId] || [])
                    .map((value) => value.toLowerCase())
                    .includes(item.id.toLowerCase());

                  return (
                    <HapticButton
                      style={styles.optionRow}
                      activeOpacity={0.8}
                      onPress={() => toggleSelection(activeCategoryId, item.id)}
                    >
                      <Text style={styles.optionText}>{item.label}</Text>
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={15}
                            color="#04333E"
                          />
                        )}
                      </View>
                    </HapticButton>
                  );
                }}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <HapticButton
              style={styles.clearButton}
              activeOpacity={0.8}
              onPress={() => setSelections({})}
            >
              <Text style={styles.clearText}>Clear All</Text>
            </HapticButton>

            <HapticButton
              style={styles.applyWrapper}
              activeOpacity={0.85}
              onPress={handleApply}
            >
              <LinearGradient
                colors={["#175E63", "#053844"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.applyButton}
              >
                <Text style={styles.applyText}>
                  Apply{selectedCount > 0 ? ` (${selectedCount})` : ""}
                </Text>
              </LinearGradient>
            </HapticButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(6, 18, 22, 0.5)",
  },
  sheet: {
    height: "92%",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: "hidden",
    backgroundColor: "#0E2A31",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: "38%",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  sidebarItemActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  sidebarText: {
    flexShrink: 1,
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
  },
  sidebarTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8C391",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#04333E",
  },
  options: {
    flex: 1,
    paddingHorizontal: 18,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 18,
  },
  optionText: {
    flexShrink: 1,
    fontSize: 15,
    color: "#FFFFFF",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    borderColor: "#D8C391",
    backgroundColor: "#D8C391",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  clearButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  applyWrapper: {
    flex: 1.4,
    borderRadius: 25,
    overflow: "hidden",
  },
  applyButton: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
