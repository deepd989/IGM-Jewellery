import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  value: string[];
  onChange: (val: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

const PREFS = ["Rings", "Necklaces", "Bracelets", "Earrings"] as const;

export default function PreferenceStep({ value, onChange, onNext, onBack }: Props) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <View>
      <Text style={styles.title}>Choose your preferences</Text>
      <View style={styles.row}>
        {PREFS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, value.includes(opt) && styles.chipSelected]}
            onPress={() => toggle(opt)}
          >
            <Text style={[styles.chipText, value.includes(opt) && styles.chipTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondary} onPress={onBack}>
          <Text style={styles.secondaryText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primary} onPress={onNext}>
          <Text style={styles.primaryText}>Continue</Text>
        </TouchableOpacity>
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
  chipSelected: { backgroundColor: "#000" },
  chipText: { color: "#000" },
  chipTextSelected: { color: "#fff" },
  actions: { flexDirection: "row", marginTop: 24, gap: 12 },
  primary: { backgroundColor: "#000", paddingVertical: 12, borderRadius: 8, flex: 1 },
  primaryText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  secondary: { borderWidth: 1, borderColor: "#ddd", paddingVertical: 12, borderRadius: 8, flex: 1 },
  secondaryText: { textAlign: "center", fontWeight: "600" },
});
