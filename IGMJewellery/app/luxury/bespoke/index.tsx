import { LUXURY_COLORS } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import BespokePage1 from "../../bespoke/bespokePage1";
import BespokePage2 from "../../bespoke/bespokePage2";
import BespokePage3 from "../../bespoke/bespokePage3";
import BespokePage4 from "../../bespoke/bespokePage4";
import LuxuryScreenHeader from "../components/luxuryScreenHeader";

/** The last step's index. */
const LAST_STEP = 3;

/**
 * The luxury storefront's bespoke flow. The steps themselves are the ones
 * app/bespoke/index.tsx walks through — they take a tone rather than being
 * copied — so a change to the flow lands in both storefronts at once.
 */
export default function LuxuryBespokeStepper() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const back = () =>
    setStep((current) => {
      // Past the first step the chevron steps back; on it, it leaves.
      if (current === 0) {
        router.back();
        return 0;
      }
      return Math.max(0, current - 1);
    });

  const next = () => setStep((current) => Math.min(LAST_STEP, current + 1));

  return (
    <View style={styles.screen}>
      <LuxuryScreenHeader
        title="Bespoke"
        showBack
        onBack={back}
        variant="glass"
      />

      <View style={styles.body}>
        {step === 0 && <BespokePage1 nextStepFn={next} isLuxury />}
        {step === 1 && <BespokePage2 nextStepFn={next} isLuxury />}
        {step === 2 && <BespokePage3 nextStepFn={next} isLuxury />}
        {step === 3 && <BespokePage4 isLuxury />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: LUXURY_COLORS.primary,
  },
  body: {
    flex: 1,
  },
});
