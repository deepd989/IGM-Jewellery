import { Plus } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { HapticButton } from "../../components/basic components/hapticButton";
import { COLORS } from "../../constants/theme";

const BespokePage3 = ({ nextStepFn }: { nextStepFn: () => void }) => {
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [metal, setMetal] = useState("");
  const [stone, setStone] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Upload your unique masterpiece reference
          </Text>
          <Text style={styles.subtitle}>
            Upload an image of your sketch or an existing product reference
          </Text>
        </View>

        {/* Upload Box */}
        <HapticButton style={styles.uploadBox} activeOpacity={0.7}>
          <Plus color="#053844" size={32} strokeWidth={1.5} />
          <Text style={styles.uploadText}>Upload reference</Text>
        </HapticButton>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Tell us more about your custom jewellery
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write here"
              placeholderTextColor="#A0A0A0"
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Who is it for</Text>
            <TextInput
              style={styles.input}
              placeholder="Wife / Husband / Daughter / Son etc"
              placeholderTextColor="#A0A0A0"
              value={recipient}
              onChangeText={setRecipient}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Metal preference</Text>
            <TextInput
              style={styles.input}
              placeholder="Eg: 14KT yellow gold, silver, platinum etc"
              placeholderTextColor="#A0A0A0"
              value={metal}
              onChangeText={setMetal}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stone preference</Text>
            <TextInput
              style={styles.input}
              placeholder="Eg: Diamond"
              placeholderTextColor="#A0A0A0"
              value={stone}
              onChangeText={setStone}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <HapticButton style={styles.confirmButton} onPress={nextStepFn}>
          <Text style={styles.confirmButtonText}>
            Confirm Customisation request
          </Text>
        </HapticButton>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  uploadBox: {
    height: 160,
    width: "70%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#053844",
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android Shadow
    elevation: 3,
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: COLORS.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DEDEDE",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    fontSize: 14,
    color: COLORS.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 0,
    borderTopColor: "#EEE",
  },
  confirmButton: {
    backgroundColor: "#053844",
    borderRadius: 8,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BespokePage3;
