import { View,StyleSheet } from "react-native";

export function SignUpProgressBar({ step }: { step: number }) {
  const currentStep =step
  return (
    <View style={styles.stepRow}>
      {[0, 1, 2, 3].map((s) => (
        <View key={s} style={s === currentStep ? styles.stepActive : styles.stepInactive} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
    stepRow: {
        flexDirection: "row",
        alignSelf: "center",        // center the whole row horizontally
        width: "90%",               // make it responsive and centered
        gap: 10,                    // 10 units between each step
        marginVertical: 16,
      },
      stepActive: {
        height: 2,
        flex: 1,                    // take the rest of the space equally
        backgroundColor: "#000",
        borderRadius: 2,
      },
      stepInactive: {
        height: 2,
        flex: 1,                    // take the rest of the space equally
        backgroundColor: "#e5e5e5",
        borderRadius: 2,
      },
})