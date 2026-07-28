import { SORT_OPTIONS } from "@/hooks/useProductListing";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { HapticButton } from "../basic components/hapticButton";

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: string;
  onSelect: (sort: string) => void;
}

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  selectedSort,
  onSelect,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons
                name="filter"
                size={18}
                color={COLORS.text}
                style={styles.headerIcon}
              />
              <Text style={styles.headerTitle}>Sort Designs by</Text>
            </View>
          </View>

          {/* Options */}
          <View style={styles.content}>
            {SORT_OPTIONS.map((option) => {
              const isSelected = selectedSort === option;
              return (
                <HapticButton
                  key={option}
                  style={styles.optionRow}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </HapticButton>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: SPACING.m,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  content: {
    paddingHorizontal: SPACING.m,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "400",
  },
  optionTextActive: {
    color: COLORS.text,
    fontWeight: "600",
  },
});
