import { AddressFields } from "@/components/shared/AddressFields";
import {
  AddressFormData,
  addressSchema,
} from "@/validation-schema/address-schema";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../../components/basic components/hapticButton";
import { useClearTrialMutation } from "../../store/apis/cart";

export default function TrialAddressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [clearTrial] = useClearTrialMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      city: "Mumbai",
      pincode: "400066",
      state: "Maharashtra",
      country: "India",
      firstName: "",
      lastName: "",
      street: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = async (data: AddressFormData) => {
    // Generate a clean summary address
    const locationStr = `${data.street}, ${data.city}, ${data.pincode}`;
    await clearTrial().unwrap();

    router.push({
      pathname: "/trial/confirmation",
      params: {
        requestId: "#TR-" + Math.floor(10000 + Math.random() * 90000),
        date: params.date || "Sunday, Nov 30",
        time: params.timeSlot || "12:00 PM",
        location: locationStr,
      },
    });
  };

  const onInvalid = (formErrors: any) => {
    console.log("FORM ERRORS:", formErrors);
    Alert.alert(
      "Incomplete Form",
      "Please fill in all required fields marked in red."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <HapticButton onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </HapticButton>
          <View style={styles.pinHeader}>
            <Text style={styles.pinLabel}>Pincode</Text>
            <Text style={styles.pinValue}>400 066</Text>
          </View>
          <HapticButton>
            <Ionicons name="call-outline" size={24} color="#000" />
          </HapticButton>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.bookingBox}>
            <Text style={styles.boxTitle}>Booking Information</Text>
            <View style={styles.row}>
              <View style={styles.infoBadge}>
                <Ionicons name="calendar-outline" size={16} color="#333" />
                <Text style={styles.infoText}>
                  {params.date || "Sun, 30 Nov"}
                </Text>
              </View>
              <View style={styles.infoBadge}>
                <Ionicons name="time-outline" size={16} color="#333" />
                <Text style={styles.infoText}>
                  {params.timeSlot || "12:00 PM"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <AddressFields control={control} errors={errors} />
          </View>
        </ScrollView>

        <HapticButton
          style={styles.footerBtn}
          onPress={handleSubmit(onSubmit, onInvalid)}
          activeOpacity={0.8}
        >
          <Text style={styles.footerBtnText}>CONFIRM BOOKING</Text>
        </HapticButton>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  pinHeader: { flex: 1, marginLeft: 16 },
  pinLabel: { fontSize: 10, color: "#999" },
  pinValue: { fontSize: 14, fontWeight: "700" },
  scroll: { paddingBottom: 80 },
  bookingBox: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: "#F9F9F9",
  },
  boxTitle: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", gap: 8 },
  infoBadge: {
    flex: 1,
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  infoText: { marginLeft: 8, fontWeight: "600", fontSize: 13 },
  formContainer: { padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 16 },
  footerBtn: {
    backgroundColor: "#000",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  footerBtnText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
});
