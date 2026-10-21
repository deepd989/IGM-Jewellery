import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../auth/authContext";
import { useSendGiftMutation } from "../../store/apis/giftApi";
import { HapticButton } from "../basic components/hapticButton";
import RibbonGiftCard from "./ribbonGiftCard";
import { assetUrl } from "@/constants/assets";

const { width } = Dimensions.get("window");

interface EGiftCardScreenProps {
  phoneNumber: string;
  amount: number;
  occasion: string;
  message: string;
}

export default function EGiftCardScreen({
  phoneNumber,
  amount,
  occasion,
  message,
}: EGiftCardScreenProps) {
  const { userId } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("Pay using");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sendGiftMethod] = useSendGiftMutation();
  const router = useRouter();
  console.log("EGiftCardScreen Props:", {
    phoneNumber,
    amount,
    occasion,
    message,
  });

  const handleBuyGift = async () => {
    try {
      await sendGiftMethod({
        userid: userId as string,
        amount,
        message,
        receiverId: phoneNumber,
        title: `Happy ${occasion}!`,
      }).unwrap();

      setShowSuccessModal(true);
      //Todo: fetch user instance again to get the latest balance
    } catch (error: any) {
      // RTK Query errors usually follow a specific structure:
      // { data: { error: "message" }, status: 404 }
      const errorMessage =
        error?.data?.error || "Something went wrong while sending the gift.";

      Alert.alert("Gift Failed", errorMessage, [{ text: "OK" }]);
      console.error("Send Gift Error:", error);
    }
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    // Navigate to shopping or reset form
    router.replace("/categories");
  };

  const handleReviewOrder = () => {
    setShowSuccessModal(false);
    // Navigate to order review
  };

  const formattedAmount = `${amount.toLocaleString("en-IN")}`;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <RibbonGiftCard
          imgUrl={assetUrl("gifting.banner")}
          heading={"Happy " + occasion + "!"}
          cardBackgroundColor="white"
          caption={message}
          amount={formattedAmount}
        />

        {/* Order Summary */}
        <View style={styles.orderSection}>
          <Text style={styles.sectionTitle}>VIEW ORDER SUMMARY</Text>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Recipient's number</Text>
            <Text style={styles.summaryValue}>{phoneNumber}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formattedAmount}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{formattedAmount}</Text>
          </View>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            All gift cards are issued by Razorpay and have an expiry of 4 years.{" "}
            <Text style={styles.termsLink}>Read T&C</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSection}>
          <Text style={styles.bottomPrice}>{formattedAmount}</Text>
          <HapticButton style={styles.paymentSelector}>
            <Text style={styles.paymentText}>{paymentMethod}</Text>
            <Text style={styles.chevron}>›</Text>
          </HapticButton>
        </View>

        <HapticButton style={styles.buyButton} onPress={handleBuyGift}>
          <Text style={styles.buyButtonText}>Buy E-Gift</Text>
        </HapticButton>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <HapticButton
              style={styles.closeButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </HapticButton>

            {/* Success Icon */}
            <View style={styles.successIcon}>
              <Text style={styles.checkmark}>✓</Text>
            </View>

            {/* Congratulations Text */}
            <Text style={styles.congratsTitle}>Congratulations!</Text>
            <Text style={styles.congratsMessage}>
              Your gift card of{" "}
              <Text style={styles.boldAmount}>{formattedAmount}</Text> has been
              issued
            </Text>
            <Text style={styles.congratsMessage}>
              to +91 {phoneNumber} via SMS.
            </Text>

            {/* Gift Card Number */}
            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumberText}>Gift Card No. #12345</Text>
              <HapticButton style={styles.copyButton}>
                <Text style={styles.copyIcon}>⎘</Text>
              </HapticButton>
            </View>

            {/* Share Text */}
            <Text style={styles.shareText}>
              Share it with them to let them know
            </Text>

            {/* Social Share Buttons */}
            <View style={styles.socialButtons}>
              <HapticButton style={styles.socialButton}>
                <Text style={styles.socialIcon}>💬</Text>
              </HapticButton>
              <HapticButton style={styles.socialButton}>
                <Text style={styles.socialIcon}>💬</Text>
              </HapticButton>
              <HapticButton style={styles.socialButton}>
                <Text style={styles.socialIcon}>f</Text>
              </HapticButton>
            </View>

            {/* Continue Shopping Button */}
            <HapticButton
              style={styles.continueButton}
              onPress={handleContinueShopping}
            >
              <Text style={styles.continueButtonText}>Continue Shopping</Text>
            </HapticButton>

            {/* Review Order Link */}
            {/* <HapticButton onPress={handleReviewOrder}>
              <Text style={styles.reviewLink}>Review your order</Text>
            </HapticButton> */}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  giftCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  giftCardHeader: {
    padding: 16,
    alignItems: "flex-end",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logo: {
    width: 16,
    height: 16,
    backgroundColor: "#333",
    borderRadius: 8,
    marginRight: 6,
  },
  logoText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  giftCardContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#053844",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 24,
  },
  amount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#053844",
  },
  loadingBar: {
    backgroundColor: "#e0e0e0",
    height: 60,
    justifyContent: "center",
    paddingLeft: 20,
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#d0d0d0",
    borderTopColor: "#999",
  },
  orderSection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#053844",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#666",
  },
  summaryValue: {
    fontSize: 15,
    color: "#053844",
    fontWeight: "500",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#053844",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#053844",
  },
  termsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  termsText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
  termsLink: {
    color: "#053844",
    fontWeight: "600",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  priceSection: {
    flex: 1,
    marginRight: 12,
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#053844",
    marginBottom: 4,
  },
  paymentSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  chevron: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
  },
  buyButton: {
    backgroundColor: "#053844",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 160,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  closeIcon: {
    fontSize: 24,
    color: "#053844",
    fontWeight: "300",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#053844",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#053844",
    marginBottom: 12,
  },
  congratsMessage: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  boldAmount: {
    fontWeight: "bold",
    color: "#053844",
  },
  cardNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 16,
  },
  cardNumberText: {
    fontSize: 15,
    color: "#666",
    marginRight: 8,
  },
  copyButton: {
    padding: 4,
  },
  copyIcon: {
    fontSize: 18,
    color: "#053844",
  },
  shareText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    fontSize: 24,
  },
  continueButton: {
    backgroundColor: "#053844",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  reviewLink: {
    fontSize: 15,
    color: "#666",
    textDecorationLine: "underline",
  },
});
