import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";
import { HapticButton } from "../../components/basic components/hapticButton";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().length(10, "Enter valid phone number"),
  email: z.string().email("Invalid email").or(z.literal("")),
});

type ProfileData = z.infer<typeof profileSchema>;

export default function ProfileDetailsScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "User's Full Name",
      phone: "9870951994",
      email: "",
    },
  });

  const onSubmit = (data: ProfileData) => {
    console.log("Update Profile:", data);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#053844" />
        </HapticButton>
        <Text style={styles.headerTitle}>Profile Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subHeader}>
          Here are your default Account Details
        </Text>
        <Text style={styles.subLabel}>
          You can edit or add new details below
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Name <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.name && styles.errorInput]}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Phone Number <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.prefix}>
                <Text>+91</Text>
              </View>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        flex: 1,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      },
                      errors.phone && styles.errorInput,
                    ]}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email ID</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Add email ID"
                />
              )}
            />
          </View>

          <View style={styles.addressSection}>
            <Text style={styles.label}>
              Address <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={styles.addressCard}>
              <View style={styles.addressTop}>
                <Text style={styles.addressTag}>Default</Text>
                <View style={styles.addressActions}>
                  <HapticButton>
                    <Ionicons name="pencil-outline" size={20} color="#053844" />
                  </HapticButton>
                  <HapticButton style={{ marginLeft: 16 }}>
                    <Ionicons name="trash-outline" size={20} color="#053844" />
                  </HapticButton>
                </View>
              </View>
              <Text style={styles.addressText}>
                144, Avon Classic, Suren Road,{"\n"}Line two, Andheri East,
                {"\n"}Mumbai 400 010
              </Text>
            </View>

            <HapticButton style={styles.addAddressBtn}>
              <Ionicons name="add" size={20} color="#053844" />
              <Text style={styles.addAddressText}>Add address</Text>
            </HapticButton>
          </View>
        </View>
      </ScrollView>

      <HapticButton style={styles.saveBtn} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.saveBtnText}>Update Profile</Text>
      </HapticButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
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
  headerTitle: { fontSize: 18, fontWeight: "700" },
  content: { padding: 24 },
  subHeader: { fontSize: 15, fontWeight: "700", textAlign: "center" },
  subLabel: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 32,
  },
  form: { gap: 20 },
  inputGroup: {},
  label: { fontSize: 13, fontWeight: "700", marginBottom: 8 },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  errorInput: { borderColor: "red" },
  phoneInputRow: { flexDirection: "row" },
  prefix: {
    height: 54,
    width: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  addressSection: { marginTop: 12 },
  addressCard: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 16,
  },
  addressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addressTag: { fontSize: 14, fontWeight: "700" },
  addressActions: { flexDirection: "row" },
  addressText: { fontSize: 13, color: "#555", lineHeight: 20 },
  addAddressBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  addAddressText: { fontSize: 14, fontWeight: "600", marginLeft: 8 },
  saveBtn: {
    backgroundColor: "#053844",
    margin: 16,
    height: 54,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
});
