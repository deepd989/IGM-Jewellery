import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../basic components/hapticButton";
import GiftStepA from "./giftStep1";
import GiftCardScreen from "./giftStep2";
import EGiftCardScreen from "./giftStep3";

export default function GiftStepper() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  // Data collected from Step 2
  const [giftData, setGiftData] = useState<{
    selectedCategory: string;
    selectedAmount: number;
    occasion: string;
    message: string;
    phoneNumber: string;
    selectedDate: string;
  }>({
    selectedCategory: "Birthday",
    selectedAmount: 0,
    occasion: "Birthday",
    message: "",
    phoneNumber: "",
    selectedDate: Date.now().toString(),
  });

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () =>
    setStep((s) => {
      if (s === 0) {
        router.back();
        return 0;
      }
      return Math.max(0, s - 1);
    });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: "#faf7f7" }}>
        <HapticButton onPress={back} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} />
        </HapticButton>
      </View>

      <View style={styles.container}>
        {step === 0 && (
          <View style={{ flex: 1 }}>
            <GiftStepA nextStepFn={next} />
            {/* <HapticButton
              style={[styles.secondaryBtn, styles.backMain]}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" color="black" size={16} />
            </HapticButton>
            <HapticButton style={styles.nextBtn} onPress={next}>
              <Ionicons name="chevron-forward" color="#fff" size={16} />
            </HapticButton> */}
          </View>
        )}

        {step === 1 && (
          <View style={{ flex: 1 }}>
            <GiftCardScreen
              onNext={next}
              onDataChange={(data) => {
                setGiftData(data);
              }}
              initialData={giftData}
            />
          </View>
        )}

        {step === 2 && (
          <View style={{ flex: 1 }}>
            <EGiftCardScreen
              phoneNumber={giftData.phoneNumber}
              amount={giftData.selectedAmount}
              occasion={giftData.occasion}
              message={giftData.message}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf7f7", padding: 8 },
  backBtn: {
    marginLeft: 16,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  backMain: {
    marginBottom: 14,
    marginLeft: 16,
  },

  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  nextBtn: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#053844",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  secondaryBtn: {
    width: 48,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
