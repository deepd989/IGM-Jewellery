import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";
import LuxuryScreenHeader from "../components/luxuryScreenHeader";
import LuxuryActionButton from "./components/luxuryActionButton";
import LuxuryProfileCard from "./components/luxuryProfileCard";
import LuxuryTextField from "./components/luxuryTextField";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().length(10, "Enter valid phone number"),
  email: z.string().email("Invalid email").or(z.literal("")),
});

type ProfileData = z.infer<typeof profileSchema>;

/**
 * The luxury storefront's account form. Same schema and submit behaviour as
 * app/profile/details.tsx, drawn with the dark fields and the gradient commit.
 */
export default function LuxuryProfileDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <View style={styles.screen}>
      <LuxuryScreenHeader title="Profile Details" showBack variant="glass" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.intro}>Here are your default Account Details</Text>
        <Text style={styles.introSub}>
          You can edit or add new details below
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <LuxuryTextField
                label="Name"
                required
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <LuxuryTextField
                label="Phone Number"
                required
                prefix="+91"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                error={errors.phone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <LuxuryTextField
                label="Email ID"
                placeholder="Add email ID"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          <View>
            <Text style={styles.label}>
              Address<Text style={styles.required}> *</Text>
            </Text>

            <LuxuryProfileCard style={styles.addressCard}>
              <View style={styles.addressTop}>
                <View style={styles.defaultTag}>
                  <Text style={styles.defaultTagText}>Default</Text>
                </View>

                <View style={styles.addressActions}>
                  <HapticButton activeOpacity={0.7}>
                    <Ionicons
                      name="pencil-outline"
                      size={20}
                      color={LUXURY_COLORS.accent}
                    />
                  </HapticButton>
                  <HapticButton activeOpacity={0.7}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={LUXURY_COLORS.accent}
                    />
                  </HapticButton>
                </View>
              </View>

              <Text style={styles.addressText}>
                144, Avon Classic, Suren Road,{"\n"}Line two, Andheri East,
                {"\n"}Mumbai 400 010
              </Text>
            </LuxuryProfileCard>

            <LuxuryActionButton
              label="Add address"
              variant="outline"
              style={styles.addAddress}
              icon={
                <Ionicons name="add" size={20} color={LUXURY_COLORS.accent} />
              }
            />
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <LuxuryActionButton
          label="Update Profile"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: LUXURY_COLORS.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  intro: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    color: LUXURY_COLORS.text,
  },
  introSub: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    color: LUXURY_COLORS.textMuted,
  },
  form: {
    marginTop: LUXURY_SPACING / 2,
    gap: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    color: LUXURY_COLORS.text,
  },
  required: {
    color: "#FF6B6B",
  },
  addressCard: {
    padding: 16,
  },
  addressTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  defaultTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.accent,
  },
  defaultTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: LUXURY_COLORS.accent,
  },
  addressActions: {
    flexDirection: "row",
    gap: 18,
  },
  addressText: {
    fontSize: 13,
    lineHeight: 20,
    color: LUXURY_COLORS.textMuted,
  },
  addAddress: {
    marginTop: 16,
  },
  // The commit stays on screen while the form scrolls under it.
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.primary,
  },
});
