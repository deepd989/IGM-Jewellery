import { useGetCartQuery } from "@/store/apis/cart";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";
import { HapticButton } from "../../components/basic components/hapticButton";
import { SPACING } from "../../constants/theme";

const scheduleSchema = z.object({
  date: z.string().min(1, "Please select a date"),
  timeSlot: z.string().min(1, "Please select a time slot"),
});

type ScheduleData = z.infer<typeof scheduleSchema>;

const DATES = [
  { day: "Sat", date: "29", label: "Sat, 29 Nov" },
  { day: "Sun", date: "30", label: "Sun, 30 Nov" },
  { day: "Mon", date: "31", label: "Mon, 31 Nov" },
  { day: "Tue", date: "01", label: "Tue, 01 Dec" },
  { day: "Wed", date: "02", label: "Wed, 02 Dec" },
];

const SLOTS = [
  "12:00 PM",
  "1:30 PM",
  "3:00 PM",
  "4:00 PM",
  "5:30 PM",
  "6:00 PM",
];

export default function ScheduleTrialScreen() {
  const router = useRouter();
  const { data: cartData } = useGetCartQuery();

  const { handleSubmit, watch, setValue } = useForm<ScheduleData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { date: "Sun, 30 Nov", timeSlot: "4:00 PM" },
  });

  const trialList = cartData?.trialItems || [];
  const selectedDate = watch("date");
  const selectedSlot = watch("timeSlot");

  // Get brand name from first item (all items should be from same brand)
  const brandName =
    trialList.length > 0 ? trialList[0].product.brand : "Unknown";

  const onNext = (data: ScheduleData) => {
    if (trialList.length === 0) {
      Alert.alert("No Items", "Please add items to your trial list first");
      router.back();
      return;
    }

    // Navigate to address page with the selected data
    router.push({
      pathname: "/trial/address",
      params: {
        date: data.date,
        timeSlot: data.timeSlot,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#053844" />
        </HapticButton>
        <View style={styles.pincodeHeader}>
          <Text style={styles.pinLabel}>Pincode</Text>
          <HapticButton style={styles.pinRow}>
            <Text style={styles.pinValue}>400 066</Text>
            <Ionicons name="chevron-down" size={16} color="#053844" />
          </HapticButton>
        </View>
        <View style={styles.helpRow}>
          <Text style={styles.helpText}>Help?</Text>
          <Ionicons name="call-outline" size={20} color="#053844" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroBox}>
          <View style={styles.homeIcon}>
            <Ionicons name="home" size={24} color="#053844" />
          </View>
          <Text style={styles.heroTitle}>Try at home service</Text>
          <Text style={styles.heroDesc}>
            Our Try at Home consultant will visit your location to show you the
            designs according to your time & place
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Your designs ({trialList.length})
            </Text>
            <HapticButton onPress={() => router.back()}>
              <Text style={styles.viewCart}>View Trial Cart</Text>
            </HapticButton>
          </View>
          <View style={styles.designGrid}>
            {trialList.slice(0, 5).map((item, i) => (
              <View key={item.product.id} style={styles.designPlaceholder}>
                <HapticButton
                  style={styles.removeDesign}
                  onPress={() => {
                    Alert.alert(
                      "Remove Item",
                      "Go back to cart to remove items",
                      [{ text: "OK" }]
                    );
                  }}
                >
                  <Ionicons name="close" size={14} color="#053844" />
                </HapticButton>
              </View>
            ))}
          </View>
          <Text style={styles.locationInfo}>
            {brandName}{" "}
            <Text style={{ color: "#8E8E93" }}>400 066, Mumbai</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {DATES.map((d) => (
              <HapticButton
                key={d.label}
                style={[
                  styles.dateCard,
                  selectedDate === d.label && styles.activeCard,
                ]}
                onPress={() => setValue("date", d.label)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDate === d.label && styles.activeText,
                  ]}
                >
                  {d.day}
                </Text>
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === d.label && styles.activeText,
                  ]}
                >
                  {d.date}
                </Text>
              </HapticButton>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select time slot</Text>
          <View style={styles.slotsGrid}>
            {SLOTS.map((s) => (
              <HapticButton
                key={s}
                style={[
                  styles.slotItem,
                  selectedSlot === s && styles.activeCard,
                ]}
                onPress={() => setValue("timeSlot", s)}
              >
                <Text
                  style={[
                    styles.slotText,
                    selectedSlot === s && styles.activeText,
                  ]}
                >
                  {s}
                </Text>
              </HapticButton>
            ))}
          </View>
        </View>
      </ScrollView>

      <HapticButton style={styles.footerBtn} onPress={handleSubmit(onNext)}>
        <Text style={styles.footerBtnText}>Next: Enter Address</Text>
      </HapticButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.m,
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
  pincodeHeader: { flex: 1, marginLeft: 16 },
  pinLabel: { fontSize: 10, color: "#8E8E93" },
  pinRow: { flexDirection: "row", alignItems: "center" },
  pinValue: { fontSize: 14, fontWeight: "700", marginRight: 4 },
  helpRow: { flexDirection: "row", alignItems: "center" },
  helpText: { fontSize: 12, marginRight: 8 },
  heroBox: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 8,
    borderBottomColor: "#F9F9F9",
  },
  homeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  heroTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  heroDesc: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 18,
  },
  section: {
    padding: SPACING.m,
    borderBottomWidth: 8,
    borderBottomColor: "#F9F9F9",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 16 },
  viewCart: { fontSize: 12, color: "#8E8E93", textDecorationLine: "underline" },
  designGrid: { flexDirection: "row", gap: 12, marginBottom: 16 },
  designPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    position: "relative",
  },
  removeDesign: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FFF",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  locationInfo: { fontSize: 12, fontWeight: "700" },
  horizontalScroll: { flexDirection: "row" },
  dateCard: {
    width: 64,
    height: 72,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#F9F9F9",
  },
  dayText: { fontSize: 11, color: "#8E8E93", marginBottom: 4 },
  dateText: { fontSize: 18, fontWeight: "700" },
  slotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  slotItem: {
    width: "30%",
    height: 44,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  slotText: { fontSize: 13, color: "#333" },
  activeCard: {
    borderColor: "#053844",
    borderWidth: 1.5,
    backgroundColor: "#FFF",
  },
  activeText: { color: "#053844", fontWeight: "800" },
  footerBtn: {
    backgroundColor: "#053844",
    margin: 16,
    height: 54,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  footerBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
