import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal, Text } from "react-native";
import LanguageStep from "./signUp/LanguageStep";
import GenderStep from "./signUp/GenderStep";
import ShopForStep from "./signUp/ShopForStep";
import PreferenceStep from "./signUp/PreferenceStep";
import WelcomeStep from "./signUp/WelcomeStep";
import { SignUpProgressBar } from "./signUpProgressBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Container } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function SignUpUserStepper() {
  const [step, setStep] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const router = useRouter();

  const [formData, setFormData] = useState({
    language: "English",
    gender: "",
    shopFor: [] as string[],
    preferences: [] as string[],
  });

  const updateData = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => setStep((s) =>{ 
    console.log("Current Step:", s);
    s= s + 1
    console.log("Next Step:", s);
    return s

  });
  const back = () => setStep((s) => {
    if(s==0){
      router.back();

    }
    return Math.max(0, s - 1)
  });

  return (
    <View style={styles.container}>
      {/* Welcome Modal */}
      <Modal
        visible={showWelcomeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWelcomeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome!</Text>
            <Text style={styles.modalText}>
              Let's get you started. Please provide your details to personalize your experience.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowWelcomeModal(false)}
            >
              <Text style={styles.modalButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View>
        <TouchableOpacity onPress={back} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} />
        </TouchableOpacity>
      </View>
      <SignUpProgressBar step={step} />

      <View style={styles.container}>
        {step === 0 && (
          <LanguageStep
            value={formData.language}
            onNext={next}
            onChange={(v: any) => updateData("language", v)}
          />
        )}

        {step === 1 && (
          <GenderStep
            value={formData.gender}
            onNext={next}
            onBack={back}
            onChange={(v: any) => updateData("gender", v)}
          />
        )}

        {step === 2 && (
          <ShopForStep
            value={formData.shopFor}
            onNext={next}
            onBack={back}
            onChange={(v: any) => updateData("shopFor", v)}
          />
        )}

        {step === 3 && (
          <PreferenceStep
            value={formData.preferences}
            onNext={next}
            onBack={back}
            onChange={(v: any) => updateData("preferences", v)}
          />
        )}

        {step === 4 && <WelcomeStep />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 8 },
  backBtn: {
    marginLeft: 16,
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
