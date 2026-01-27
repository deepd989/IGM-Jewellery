import { Diamond } from "lucide-react-native"; // Install: npm install lucide-react-native
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const categories = [
  { id: "1", title: "N E C K L A C E", hasIcon: false },
  { id: "2", title: "R I N G S", hasIcon: false },
  { id: "3", title: "B A N G L E S", hasIcon: false },
  { id: "4", title: "P E N D A N T S", hasIcon: false },
  { id: "5", title: "J E W E L L E R Y  S E T", hasIcon: false },
];

export default function BespokePage2({
  nextStepFn,
}: {
  nextStepFn: () => void;
}) {
  const [selected, setSelected] = useState("1");

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>What do you wish to customize</Text>
        <Text style={styles.subtitle}>Upload an image of your outfit</Text>
      </View>

      {/* Options List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((item) => {
          const isSelected = selected === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => setSelected(item.id)}
              style={[styles.optionCard, isSelected && styles.selectedCard]}
            >
              <Text style={styles.optionText}>{item.title}</Text>
              {item.hasIcon && (
                <View style={styles.iconContainer}>
                  <Diamond size={20} color="black" strokeWidth={1.5} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={nextStepFn}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  optionCard: {
    height: 100,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCard: {
    backgroundColor: "#E5E5E5", // Slightly darker like your image
    borderColor: "#000",
    borderWidth: 2,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 4, // Replicates the wide spacing in your screenshot
    color: "#000",
  },
  iconContainer: {
    position: "absolute",
    right: 20,
    top: 15,
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 100,
    padding: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 30, // Extra padding for iOS home bar
    backgroundColor: "#FFFFFF",
  },
  nextButton: {
    backgroundColor: "#000",
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
