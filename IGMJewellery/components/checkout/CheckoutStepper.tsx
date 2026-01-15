import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SPACING } from "../../constants/theme";

interface CheckoutStepperProps {
  currentStep: "Address" | "Gifting" | "Payment";
}

const STEPS = ["Address", "Gifting", "Payment"];

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {STEPS.map((step, index) => {
          const isActive = step === currentStep;
          const isLast = index === STEPS.length - 1;

          return (
            <React.Fragment key={step}>
              <View style={styles.stepItem}>
                <View
                  style={[styles.line, index === 0 && styles.lineTransparent]}
                />
                <View
                  style={[
                    styles.diamond,
                    isActive ? styles.diamondActive : styles.diamondInactive,
                  ]}
                >
                  {isActive && <View style={styles.innerDiamond} />}
                </View>
                <View style={[styles.line, isLast && styles.lineTransparent]} />
                <Text
                  style={[styles.stepText, isActive && styles.stepTextActive]}
                >
                  {step}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING.m,
    paddingBottom: SPACING.xl, // 👈 VERY IMPORTANT
    backgroundColor: "#FFFFFF",
  },

  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    flex: 1,
    justifyContent: "center",
  },
  line: {
    height: 1.5,
    backgroundColor: "#E0E0E0",
    flex: 1,
  },
  lineTransparent: {
    backgroundColor: "transparent",
  },
  diamond: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    transform: [{ rotate: "45deg" }],
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  diamondActive: {
    borderColor: "#000",
  },
  diamondInactive: {
    borderColor: "#E0E0E0",
  },
  innerDiamond: {
    width: 6,
    height: 6,
    backgroundColor: "#000",
  },
  stepText: {
    position: "absolute",
    bottom: -24,
    fontSize: 11,
    color: "#8E8E93",
    fontWeight: "500",
  },
  stepTextActive: {
    color: "#000",
    fontWeight: "700",
  },
});
