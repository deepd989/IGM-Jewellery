import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { HapticButton } from "../basic components/hapticButton";

type Props = {
  value: string[];
  onChange: (val: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

const OPTIONS = ["Self", "Partner", "Family", "Friend"] as const;

export default function ShopForStep({
  value,
  onChange,
  onNext,
  onBack,
}: Props) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <View>
      <Text style={styles.title}>Who are you shopping for?</Text>
      <View style={styles.row}>
        {OPTIONS.map((opt) => (
          <HapticButton
            key={opt}
            style={[styles.chip, value.includes(opt) && styles.chipSelected]}
            onPress={() => toggle(opt)}
          >
            <Text
              style={[
                styles.chipText,
                value.includes(opt) && styles.chipTextSelected,
              ]}
            >
              {opt}
            </Text>
          </HapticButton>
        ))}
      </View>
      <View style={styles.actions}>
        <HapticButton style={styles.secondary} onPress={onBack}>
          <Text style={styles.secondaryText}>Back</Text>
        </HapticButton>
        <HapticButton style={styles.primary} onPress={onNext}>
          <Text style={styles.primaryText}>Continue</Text>
        </HapticButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: "#053844" },
  chipText: { color: "#053844" },
  chipTextSelected: { color: "#fff" },
  actions: { flexDirection: "row", marginTop: 24, gap: 12 },
  primary: {
    backgroundColor: "#053844",
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  primaryText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  secondary: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  secondaryText: { textAlign: "center", fontWeight: "600" },
});
