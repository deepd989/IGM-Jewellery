import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { HapticButton } from "../basic components/hapticButton";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack?: () => void;
};

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "HI", label: "Hindi" },
  { code: "MR", label: "Marathi" },
  { code: "GU", label: "Gujarati" },
  { code: "DE", label: "German" },
  { code: "ES", label: "Spanish" },
];

const STEP_WIDTH = Dimensions.get("window").width / 5;

export default function LanguageStep({
  value,
  onChange,
  onNext,
  onBack,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      LANGUAGES.filter((l) =>
        l.label.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <View style={styles.safe}>
      {/* Title */}
      <Text style={styles.title}>Choose language</Text>
      <Text style={styles.subtitle}>
        We curate your experience in the language you understand
      </Text>

      {/* Search */}
      {/* <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          placeholder="Search"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View> */}

      {/* Language List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        contentContainerStyle={{ paddingBottom: 140 }}
        renderItem={({ item }) => {
          const selected = value === item.label;
          return (
            <HapticButton
              onPress={() => onChange(item.label)}
              style={[styles.langRow, selected && styles.langRowSelected]}
            >
              <Text style={styles.langText}>
                {item.code ? `(${item.code}) ` : ""}
                {item.label}
              </Text>

              {selected && (
                <View style={styles.check}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </HapticButton>
          );
        }}
      />

      {/* Bottom CTA */}
      <View style={styles.bottom}>
        <HapticButton style={styles.primary} onPress={onNext}>
          <Text style={styles.primaryText}>Continue</Text>
        </HapticButton>

        {/* <HapticButton>
          <Text style={styles.skip}>Skip</Text>
        </HapticButton> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  header: {
    height: 48,
    justifyContent: "center",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 12,
  },
  subtitle: {
    color: "#666",
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 20,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },

  langRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  langRowSelected: {
    backgroundColor: "#f6f6f6",
  },
  langText: {
    fontSize: 16,
  },

  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#053844",
    alignItems: "center",
    justifyContent: "center",
  },

  bottom: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
  },
  primary: {
    backgroundColor: "#053844",
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  skip: {
    textAlign: "center",
    marginTop: 12,
    color: "#053844",
  },
});
