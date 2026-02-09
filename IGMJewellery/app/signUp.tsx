import SignUpUserSteppers from "@/components/signUpSteppers";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SignUpUserSteppers />;
    </SafeAreaView>
  );
}
