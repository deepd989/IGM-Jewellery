import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const OTP_LENGTH = 5;
const TIMER_SECONDS = 60;

export default function OtpScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber?: string }>();
  const inputs = useRef<TextInput[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
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

  const verifyOtp = (code: string) => {

    if (code === "12345") {
      setError(null);
      router.replace("/home");
    }else if(code === "00000"){
      router.replace("/signUp");
    } else {
      setError("The OTP provided is invalid. Please try again.");
      Keyboard.dismiss();
    }
  };

  const resendCode = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimeLeft(TIMER_SECONDS);
    setError(null);
    inputs.current[0]?.focus();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={{ paddingVertical: 8 }}>
          <Text style={{ color: "#000", fontSize: 16 }}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Enter code</Text>
        <Text style={styles.subtitle}>
          We’ve sent an SMS with an activation code to your phone {phoneNumber ?? ""}
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
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

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