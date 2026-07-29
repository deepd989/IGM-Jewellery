import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../../components/basic components/hapticButton";
import BespokePage1 from "./bespokePage1";
import BespokePage2 from "./bespokePage2";
import BespokePage3 from "./bespokePage3";
import BespokePage4 from "./bespokePage4";
import { useLuxury } from "../../context/luxuryContext";
import LuxuryBespokeStepper from "../luxury/bespoke";

/**
 * Both storefronts share this route, so every existing link to the bespoke
 * flow lands on the presentation the shopper is currently browsing in. The
 * luxury shell also keeps its own route for direct links.
 */
export default function BespokeStepperPage() {
  const { isLuxury } = useLuxury();

  return isLuxury ? <LuxuryBespokeStepper /> : <ClassicBespokeStepper />;
}

function ClassicBespokeStepper() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const back = () =>
    setStep((s) => {
      if (s === 0) {
        router.back();
        return 0;
      }
      return Math.max(0, s - 1);
    });

  // here 2 is the last step index
  const next = () => setStep((s) => Math.min(3, s + 1));
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <HapticButton onPress={back} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={22} />
      </HapticButton>
      <View style={{ marginTop: 5, flex: 1 }}>
        {step === 0 && <BespokePage1 nextStepFn={next}></BespokePage1>}

        {step === 1 && <BespokePage2 nextStepFn={next}></BespokePage2>}

        {step === 2 && <BespokePage3 nextStepFn={next}></BespokePage3>}

        {step === 3 && <BespokePage4></BespokePage4>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    marginLeft: 16,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
