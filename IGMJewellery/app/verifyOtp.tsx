import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

const OTP_LENGTH = 5;
const TIMER_SECONDS = 60;

export default function OtpScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber?: string }>();
  const inputs = useRef<TextInput[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  
  useEffect(() => {
    if (timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  /* ---------------- OTP Handling ---------------- */
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    // If OTP complete
    if (newOtp.every((digit) => digit !== "")) {
      Keyboard.dismiss();
      verifyOtp(newOtp.join(""));
    }
  };

  const handleBackspace = (index: number) => {
    if (otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  /* ---------------- OTP Validation ---------------- */
  const verifyOtp = (code: string) => {
    // 🔴 Replace with API call
    const isValid = code === "12345";

    if (isValid) {
      router.replace("/home");
    }
  };

  /* ---------------- Resend ---------------- */
  const resendCode = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimeLeft(TIMER_SECONDS);
    inputs.current[0]?.focus();
    // Call resend OTP API here
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={{ paddingVertical: 8 }}>
        <Text style={{ color: "#000", fontSize: 16 }}>←</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.title}>Enter code</Text>
      <Text style={styles.subtitle}>
        We’ve sent an SMS with an activation code to your phone {phoneNumber ?? ""}
      </Text>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref!)}
            style={[
              styles.input,
              digit && styles.inputFilled,
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

      {/* Timer / Resend */}
      <TouchableOpacity
        disabled={timeLeft > 0}
        onPress={resendCode}
      >
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

/* ---------------- Styles ---------------- */
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
    justifyContent: "space-evenly",
  },
  input: {
    width: 60   ,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  inputFilled: {
    borderColor: "#000",
  },
  timerText: {
    marginTop: 40,
    textAlign: "center",
    color: "#444",
    fontSize: 14,
  },
});
