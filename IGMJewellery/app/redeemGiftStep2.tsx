import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Clipboard,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../components/basic components/hapticButton";
import { COLORS } from "../constants/theme";
import { useDeleteGiftMutation } from "../store/apis/giftApi";

// Simple Icon Components using text/unicode
const ChevronLeft = () => (
  <Text style={{ fontSize: 24, fontWeight: "300" }}>‹</Text>
);

const CopyIcon = () => <Text style={{ fontSize: 14 }}>📋</Text>;

const HeartIcon = () => <Text style={{ fontSize: 20 }}>❤️</Text>;

const UserIcon = () => <Text style={{ fontSize: 20 }}>👤</Text>;

const CheckIcon = () => <Text style={{ fontSize: 40, color: "#fff" }}>✓</Text>;

const CloseIcon = () => <Text style={{ fontSize: 24 }}>✕</Text>;

export default function RedeemGiftStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  // Extract params with defaults
  const cardId = params.id as string;
  const senderName = params.senderid as string;
  const giftMessage = params.giftMessage as string;
  const date = params.date as string;
  const amount = params.amount as string;
  const title = params.title as string;
  const senderPhone = params.senderid as string;
  const [deleteGift] = useDeleteGiftMutation();

  const handleCopyCardNumber = () => {
    Clipboard.setString(cardId);
    Alert.alert("Copied", "Card number copied to clipboard");
  };

  const handleClaimGiftCard = async (cardId: string) => {
    try {
      await deleteGift(Number(cardId)).unwrap();
      setIsClaimed(true);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete gift", error);
    }
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    // Navigate to shopping or back
    router.push("/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <HapticButton style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.text} />
        </HapticButton>
        <Text style={styles.headerTitle}>Collect Gift Card</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            {senderName} has sent you Gift Card!
          </Text>
          <Text style={styles.subtitle}>
            Your loved one has sent a special card for youGift
          </Text>

          {/* Card Number */}
          <View style={styles.cardNumberContainer}>
            <Text style={styles.cardNumberText}>Card No. #{cardId}</Text>
            <HapticButton onPress={handleCopyCardNumber}>
              <CopyIcon />
            </HapticButton>
          </View>
        </View>

        {/* Gift Card Display */}
        <View style={styles.giftCardContainer}>
          <View style={styles.giftCard}>
            {/* Ribbon */}
            <View style={styles.ribbon}></View>

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardDate}>{date}</Text>
                <View style={styles.cardBrand}>
                  <View style={styles.brandIcon} />
                  <Text style={styles.brandText}>IGM Gift Card</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardMessage}>
                Hope this brings a smile on your fac..
              </Text>
              <Text style={styles.cardAmount}>₹ {amount}</Text>
            </View>
          </View>
        </View>

        {/* Message Section */}
        <View style={styles.messageSection}>
          <View style={styles.messageCard}>
            <HeartIcon />
            <Text style={styles.messageText}>{giftMessage}</Text>
          </View>
        </View>

        {/* Sender Info */}
        <View style={styles.senderSection}>
          <View style={styles.senderCard}>
            <UserIcon />
            <View style={styles.senderInfo}>
              <Text style={styles.senderName}>From {senderName} </Text>
              <Text style={styles.senderPhone}>{senderPhone}</Text>
            </View>
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Please Note:</Text>
          <View style={styles.notesList}>
            <Text style={styles.noteItem}>• Gift Card is valid for 4 year</Text>
            <Text style={styles.noteItem}>
              • Can be redeemed during your payment process
            </Text>
            <Text style={styles.noteItem}>
              • You can find the code in Coupons
            </Text>
            <Text style={styles.noteItem}>
              • Gift cards can't be transfered
            </Text>
          </View>
        </View>

        {/* Claim Button */}
        <View style={styles.buttonContainer}>
          <HapticButton
            style={[
              styles.claimButton,
              isClaimed && styles.claimButtonDisabled,
            ]}
            onPress={() => handleClaimGiftCard(cardId)}
            disabled={isClaimed}
            activeOpacity={0.8}
          >
            <Text style={styles.claimButtonText}>Claim Gift Card</Text>
          </HapticButton>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <HapticButton
              style={styles.closeButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <CloseIcon />
            </HapticButton>

            <View style={styles.successIcon}>
              <CheckIcon />
            </View>

            <Text style={styles.successTitle}>Congratulations!</Text>
            <Text style={styles.successMessage}>
              You gift card has been claimed. You can redeem it from your coupon
              during checkout
            </Text>

            <View style={styles.successCardNumber}>
              <Text style={styles.successCardNumberText}>
                Gift Card No. #{cardId}
              </Text>
              <HapticButton onPress={handleCopyCardNumber}>
                <CopyIcon />
              </HapticButton>
            </View>

            <HapticButton
              style={styles.continueButton}
              onPress={handleContinueShopping}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue Shopping</Text>
            </HapticButton>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginLeft: 8,
    color: "#000",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  cardNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  cardNumberText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  giftCardContainer: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  giftCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ribbon: {
    height: 40,
    backgroundColor: "#F3F4F6",
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
  },
  ribbonCircleLeft: {
    position: "absolute",
    left: 20,
    top: -10,
    width: 50,
    height: 50,
    backgroundColor: "#E5E7EB",
    borderRadius: 25,
  },
  ribbonCircleRight: {
    position: "absolute",
    right: 20,
    top: -10,
    width: 50,
    height: 50,
    backgroundColor: "#E5E7EB",
    borderRadius: 25,
  },
  cardContent: {
    padding: 20,
    paddingTop: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  cardBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  brandIcon: {
    width: 12,
    height: 12,
    backgroundColor: "#000",
    transform: [{ rotate: "45deg" }],
  },
  brandText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  cardMessage: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 24,
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  messageSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  messageCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  senderSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  senderCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  senderInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
    color: "#000",
  },
  senderPhone: {
    fontSize: 14,
    color: "#6B7280",
  },
  notesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  notesList: {
    gap: 8,
  },
  noteItem: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 4,
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
  claimButton: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  claimButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  claimButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#000",
  },
  successMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  successCardNumber: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  successCardNumberText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  continueButton: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
