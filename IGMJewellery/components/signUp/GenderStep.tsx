import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../basic components/hapticButton";

type Gender = "Female" | "Male" | "Prefer not to say" | "";

type Props = {
  value: Gender;
  onChange: (val: Gender) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function GenderStep({ value, onChange, onNext, onBack }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <HapticButton onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </HapticButton>

        <Text style={styles.sparkle}>✦</Text>
      </View> */}

      {/* <View style={styles.header}>
        <HapticButton onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} />
        </HapticButton>
        <Text style={styles.sparkle}>✦</Text>
      </View> */}
      {/* Content */}
      <Text style={styles.title}>How do you identify yourself?</Text>
      <Text style={styles.subtitle}>
        This helps us recommend jewellery that truly suits you.
      </Text>

      <View style={styles.aiTag}>
        <Text style={styles.aiText}>AI powered</Text>
      </View>

      {/* Cards */}
      <View style={styles.cardRow}>
        {["Female", "Male"].map((g) => {
          const selected = value === g;
          return (
            <HapticButton
              key={g}
              style={[styles.card, selected && styles.cardSelected]}
              onPress={() => onChange(g as Gender)}
            >
              <View style={styles.radioOuter}>
                {selected && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.cardText}>{g}</Text>
            </HapticButton>
          );
        })}
      </View>

      {/* Prefer not to say */}
      <HapticButton onPress={() => onChange("Prefer not to say")}>
        <Text
          style={[
            styles.preferText,
            value === "Prefer not to say" && styles.preferSelected,
          ]}
        >
          Prefer not to say
        </Text>
      </HapticButton>

      {/* CTA */}
      <HapticButton
        style={styles.continueBtn}
        onPress={onNext}
        disabled={!value}
      >
        <Text style={styles.continueText}>Continue</Text>
      </HapticButton>

      {/* <HapticButton>
        <Text style={styles.skipText}>Skip</Text>
      </HapticButton> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backArrow: {
    fontSize: 18,
    fontWeight: "600",
  },
  step: {
    width: 24,
    height: 3,
    backgroundColor: "#e5e5e5",
    marginRight: 6,
    borderRadius: 2,
  },
  sparkle: {
    position: "absolute",
    right: 0,
    fontSize: 44,
  },

  /* Text */
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b6b6b",
    marginBottom: 12,
  },
  aiTag: {
    alignSelf: "flex-start",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 24,
  },
  aiText: {
    fontSize: 12,
    color: "#555",
  },

  /* Cards */
  cardRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    padding: 16,
    justifyContent: "space-between",
  },
  cardSelected: {
    borderColor: "#000",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },

  /* Radio */
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },

  /* Prefer */
  preferText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 40,
  },
  preferSelected: {
    fontWeight: "700",
  },

  /* CTA */
  continueBtn: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  continueText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  skipText: {
    textAlign: "center",
    color: "#6b6b6b",
  },
});
