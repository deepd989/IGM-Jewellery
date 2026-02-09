import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth/authContext";
import {
  useSendLoginOtpMutation,
  useSendRegistrationOtpMutation,
  useVerifyLoginOtpMutation,
  useVerifyRegistrationOtpMutation,
} from "../store/newApis/sendOtp.magento.api";

const OTP_LENGTH = 5;
const TIMER_SECONDS = 60;

export default function OtpScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const { phoneNumber, isLogin } = useLocalSearchParams<{
    phoneNumber: string;
    isLogin: string;
  }>();
  const inputs = useRef<TextInput[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [verifyLoginOtp] = useVerifyLoginOtpMutation();
  const [verifyRegistrationOtp] = useVerifyRegistrationOtpMutation();
  const [sendLoginOtp] = useSendLoginOtpMutation();
  const [sendRegistrationOtp] = useSendRegistrationOtpMutation();
  // --- New Error State ---
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    // Clear error when user starts typing again
    if (error) setError(null);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleBackspace = (index: number) => {
    if (otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (code: string) => {
    if (isLogin === "1") {
      const loginResult: any = await verifyLoginOtp({
        mobileNumber: phoneNumber,
        otp: code,
      }).unwrap();
      if (loginResult.success) {
        await login({
          token: loginResult.token,
          userObject: {
            customer_email: loginResult.customer_email,
            customer_id: loginResult.customer_id,
            customer_name: loginResult.customer_name,
          },
          phoneNumber: phoneNumber,
        });
        router.replace("/home");
        return;
      }
    } else if (isLogin === "0") {
      const newUserResult: { verification_token: string; success: boolean } =
        await verifyRegistrationOtp({
          mobileNumber: phoneNumber,
          otp: code,
        }).unwrap();
      if (newUserResult.success) {
        await login({
          token: newUserResult.verification_token,
          userObject: null,
          phoneNumber: phoneNumber,
        });
        router.replace("/signUp");
        return;
      }
    } else {
      setError("Invalid login type. Please try again.");
      return;
    }
    setError("Invalid OTP. Please try again.");
  };

  const resendCode = async () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimeLeft(TIMER_SECONDS);
    setError(null);
    inputs.current[0]?.focus();
    await sendLoginOtp({
      mobileNumber: phoneNumber,
    }).unwrap();
    await sendRegistrationOtp({
      mobileNumber: phoneNumber,
    }).unwrap();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ paddingVertical: 8 }}
        >
          <Text style={{ color: "#000", fontSize: 16 }}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Enter code</Text>
        <Text style={styles.subtitle}>
          We’ve sent an SMS with an activation code to your phone{" "}
          {phoneNumber ?? ""}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref!)}
              style={[
                styles.input,
                digit && styles.inputFilled,
                error && styles.inputError, // --- Red border on error ---
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(v) => handleChange(v, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  handleBackspace(index);
                }
              }}
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* --- Error Message Display --- */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity disabled={timeLeft > 0} onPress={resendCode}>
          <Text style={styles.timerText}>
            {timeLeft > 0
              ? `Send code again 00:${String(timeLeft).padStart(2, "0")}`
              : "Send Again"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 40,
  },
  subtitle: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: "row",
    marginTop: 40,
    justifyContent: "space-between",
  },
  input: {
    width: 55,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  inputFilled: {
    borderColor: "#000",
  },
  inputError: {
    borderColor: "#FF3B30", // Red border
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 13,
    marginTop: 15,
    textAlign: "center",
  },
  timerText: {
    marginTop: 25,
    textAlign: "center",
    color: "#444",
    fontSize: 14,
  },
});
