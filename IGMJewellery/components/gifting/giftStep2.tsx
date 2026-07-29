import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { OCCASIONS } from "../../constants/occasions";
import { HapticButton } from "../basic components/hapticButton";
import RibbonGiftCard from "./ribbonGiftCard";
import { assetUrl } from "@/constants/assets";

interface GiftCardScreenProps {
  onNext: () => void;
  onDataChange: (data: {
    occasion: string;
    selectedAmount: number;
    message: string;
    phoneNumber: string;
    selectedDate: string;
  }) => void;
  initialData?: {
    occasion?: string;
    selectedAmount?: number;
    message?: string;
    phoneNumber?: string;
    selectedDate?: string;
  };
}

export default function GiftCardScreen({
  onNext,
  onDataChange,
  initialData,
}: GiftCardScreenProps) {
  const [occasion, setOccasion] = useState(initialData?.occasion || "Birthday");
  const [selectedAmount, setSelectedAmount] = useState(
    initialData?.selectedAmount || 10000
  );
  const [message, setMessage] = useState(initialData?.message || "");
  const [phoneNumber, setPhoneNumber] = useState(
    initialData?.phoneNumber || ""
  );
  const [selectedDate, setSelectedDate] = useState(
    initialData?.selectedDate || "30"
  );
  const [error, setError] = useState<string>("");
  const occaisions = OCCASIONS;
  const amounts = [1000, 2000, 5000, 10000, 15000, 20000];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = Array.from({ length: 10 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      day: date.getDate().toString().padStart(2, "0"), // e.g. "05"
      label: daysOfWeek[date.getDay()], // e.g. "Mon"
    };
  });

  // Helper function to notify parent of changes
  const notifyParent = (
    updates: Partial<{
      occasion: string;
      selectedAmount: number;
      message: string;
      phoneNumber: string;
      selectedDate: string;
    }>
  ) => {
    const currentData = {
      occasion,
      selectedAmount,
      message,
      phoneNumber,
      selectedDate,
      ...updates,
    };
    onDataChange?.(currentData);
  };

  const handleDateSelect = (day: string) => {
    // 1. Clean the phone number (remove any spaces)
    const cleanedPhone = phoneNumber.replace(/\s+/g, "");

    // 2. Check if empty
    if (!cleanedPhone) {
      setError("Recipient's phone number is required");
      return;
    }

    // 3. Check for exactly 10 characters AND ensure they are all digits
    const isAllDigits = /^\d+$/.test(cleanedPhone);

    if (cleanedPhone.length !== 10 || !isAllDigits) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    // If validation passes:
    setError("");
    setSelectedDate(day);
    notifyParent({ selectedDate: day });

    if (onNext) onNext();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Send a Gift Card</Text>
        <Text style={styles.subtitle}>
          Show that you value your loved ones with a gift card
        </Text>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {occaisions.map((cat) => (
          <HapticButton
            key={cat}
            style={[
              styles.categoryButton,
              occasion === cat && styles.categoryButtonActive,
            ]}
            onPress={() => {
              setOccasion(cat);
              notifyParent({ occasion: cat });
            }}
          >
            <Text
              style={[
                styles.categoryText,
                occasion === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </HapticButton>
        ))}
      </ScrollView>

      {/* Gift Card Preview */}
      <RibbonGiftCard
        imgUrl={assetUrl("gifting.banner")}
        heading={"Happy " + occasion + "!"}
        caption={message}
        amount={selectedAmount}
      />

      {/* Amount Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose an amount</Text>
        <View style={styles.amountGrid}>
          {amounts.map((amt) => (
            <HapticButton
              key={amt}
              style={[
                styles.amountButton,
                selectedAmount === amt && styles.amountButtonActive,
              ]}
              onPress={() => {
                setSelectedAmount(amt);
                notifyParent({ selectedAmount: amt });
              }}
            >
              <Text
                style={[
                  styles.amountText,
                  selectedAmount === amt && styles.amountTextActive,
                ]}
              >
                {amt.toLocaleString("en-IN")}
              </Text>
            </HapticButton>
          ))}
        </View>
      </View>

      {/* Personal Message */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Add a personal message</Text>
          <Text style={styles.optionalText}>Optional</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Start writing here"
          placeholderTextColor="#999"
          value={message}
          onChangeText={(text) => {
            setMessage(text);
            notifyParent({ message: text });
          }}
          multiline
        />
      </View>

      {/* Phone Number */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Receipient's Phone Number</Text>
        <View style={styles.phoneContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            maxLength={10}
            placeholder="00000 00000"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              notifyParent({ phoneNumber: text });
            }}
            keyboardType="phone-pad"
          />
        </View>
        {error && <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>}
      </View>

      {/* Schedule */}
      <View style={styles.section}>
        <Text style={styles.scheduleQuestion}>
          Do you wish to schedule the Gift Card?
        </Text>
        <Text style={styles.sectionTitle}>Select a date</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateContainer}
        >
          {dates.map((date) => (
            <HapticButton
              key={date.day}
              style={[
                styles.dateButton,
                selectedDate === date.day && styles.dateButtonActive,
              ]}
              onPress={() => {
                handleDateSelect(date.day);
                notifyParent({ selectedDate: date.day });
              }}
            >
              <Text
                style={[
                  styles.dateLabel,
                  selectedDate === date.day && styles.dateLabelActive,
                ]}
              >
                {date.label}
              </Text>
              <Text
                style={[
                  styles.dateDay,
                  selectedDate === date.day && styles.dateDayActive,
                ]}
              >
                {date.day}
              </Text>
            </HapticButton>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#053844",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 12,
    backgroundColor: "#fff",
  },
  categoryButtonActive: {
    backgroundColor: "#053844",
    borderColor: "#053844",
  },
  categoryText: {
    fontSize: 14,
    color: "#053844",
  },
  categoryTextActive: {
    color: "#fff",
  },
  cardPreview: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  cardBadge: {
    fontSize: 12,
    color: "#666",
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#053844",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 16,
  },
  cardAmount: {
    fontSize: 18,
    color: "#053844",
    fontWeight: "500",
  },
  cardDecoration: {
    position: "absolute",
    left: 24,
    bottom: 24,
  },
  ribbon: {
    width: 40,
    height: 40,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#053844",
    marginBottom: 12,
  },
  optionalText: {
    fontSize: 14,
    color: "#999",
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  amountButton: {
    width: "30%",
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  amountButtonActive: {
    backgroundColor: "#053844",
    borderColor: "#053844",
  },
  amountText: {
    fontSize: 16,
    color: "#053844",
    fontWeight: "500",
  },
  amountTextActive: {
    color: "#fff",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f9f9f9",
  },
  countryCodeText: {
    fontSize: 16,
    color: "#053844",
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  scheduleQuestion: {
    fontSize: 14,
    color: "#053844",
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: "row",
    gap: 12,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  dateButtonActive: {
    backgroundColor: "#fff",
    borderColor: "#053844",
    borderWidth: 2,
  },
  dateLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dateLabelActive: {
    color: "#053844",
  },
  dateDay: {
    fontSize: 20,
    fontWeight: "600",
    color: "#053844",
  },
  dateDayActive: {
    color: "#053844",
  },
});
