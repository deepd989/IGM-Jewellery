import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SPACING } from "../../constants/theme";
import { HapticButton } from "../basic components/hapticButton";

interface AddressCardProps {
  title: string;
  address: string;
  contact: string;
  isSelected?: boolean;
  onSelect?: () => void;
  style?: any;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  title,
  address,
  contact,
  isSelected,
  onSelect,
  style,
}) => {
  return (
    <HapticButton
      style={[styles.container, isSelected && styles.selected, style]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {isSelected !== undefined && (
          <Ionicons
            name={isSelected ? "checkbox" : "square-outline"}
            size={20}
            color="#000"
          />
        )}
      </View>
      <Text style={styles.address}>{address}</Text>
      <Text style={styles.contact}>{contact}</Text>
    </HapticButton>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  selected: {
    borderColor: "#000",
    borderWidth: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
  },
  address: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
    marginBottom: 8,
  },
  contact: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
});
