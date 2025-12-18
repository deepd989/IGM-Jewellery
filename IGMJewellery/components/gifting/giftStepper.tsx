import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import GiftStepA from "./giftStep1";
import GiftCardScreen from "./giftStep2";
import EGiftCardScreen from "./giftStep3";

export default function GiftStepper() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  // Data collected from Step 2
  const [giftData, setGiftData] = useState<{
    selectedCategory: string;
    selectedAmount: number ;
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
  const back = () => setStep((s) => {
    if (s === 0) {
      router.back();
      return 0;
    }
    return Math.max(0, s - 1);
  });



  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={back} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {step === 0 && (
          <View style={{ flex: 1 }}>
            <GiftStepA />
            <TouchableOpacity style={styles.nextBtn} onPress={next}>
              <Ionicons name="arrow-forward" color="#fff" size={16} />
            </TouchableOpacity>
          </View>
        )}

        {step === 1 && (
          <View style={{ flex: 1 }}>
            <GiftCardScreen
              onDataChange={(data) => {
                setGiftData(data);
              }}
             initialData={giftData}
            />
            <View style={styles.navRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={back}>
                <Ionicons name="chevron-back" color="#000" size={16} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtn} onPress={next}>
                <Ionicons name="arrow-forward" color="#fff" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={{ flex: 1 }}>
            <EGiftCardScreen
              phoneNumber={giftData.phoneNumber}
              amount={giftData.selectedAmount }
             occasion={giftData.occasion}
                message={giftData.message}
            />
            <View style={styles.navRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={back}>
                <Ionicons name="chevron-back" color="#000" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  secondaryBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
});