import GiftingCard from "@/components/giftingCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth/authContext";
import { HapticButton } from "../components/basic components/hapticButton";
import { COLORS } from "../constants/theme";
import { GiftCardData, useGetAllGiftsQuery } from "../store/apis/giftApi";

// Placeholder component for RibbonCard
const RibbonCard = ({ children }) => <View>{children}</View>;

const GiftCardRedeemStep1 = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const { userId } = useAuth();
  console.log("User ID from auth context:", userId);
  const { data, isLoading } = useGetAllGiftsQuery(userId as string);
  const giftCards = data;

  // 2. You can now use giftCards directly in your JSX
  if (isLoading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  const tabs = [
    { id: "all", label: "All Gift Cards" },
    { id: "unclaimed", label: "Unclaimed" },
    { id: "claimed", label: "Claimed" },
    { id: "redeemed", label: "Redeemed" },
    { id: "expired", label: "Expired" },
  ];

  const filteredCards =
    activeTab === "all"
      ? giftCards
      : giftCards.filter((card) => card.status === activeTab);

  const renderBackIcon = () => (
    <HapticButton style={styles.backIcon} onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={20} color={COLORS.text} />
    </HapticButton>
  );

  const claimCard = (card: GiftCardData) => {
    const navigationData = {};
    router.push({
      pathname: "/redeemGiftStep2",
      params: card,
    });
  };

  const renderChevronRight = () => <Text style={styles.chevronText}>→</Text>;

  const renderCheckIcon = () => <Text style={styles.checkIcon}>✓</Text>;

  const renderDiamond = () => <View style={styles.diamond} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <HapticButton style={styles.backButton}>
          {renderBackIcon()}
        </HapticButton>
        <Text style={styles.headerTitle}>Redeem Gift Card</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Here are your gift cards</Text>
          <Text style={styles.subtitle}>
            Your loved ones have issued gift cards for you.{"\n"}
            Find them below
          </Text>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <HapticButton
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tab,
                activeTab === tab.id ? styles.tabActive : styles.tabInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id
                    ? styles.tabTextActive
                    : styles.tabTextInactive,
                ]}
              >
                {tab.label}
              </Text>
            </HapticButton>
          ))}
        </ScrollView>

        {/* Gift Cards */}
        <View style={styles.cardsContainer}>
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <RibbonCard key={card.id}>
                <View style={styles.card}>
                  <GiftingCard
                    showExploreButton={false}
                    amount={card.amount}
                    description={card.title}
                  />
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardDate}>{card.date}</Text>
                    <View style={styles.cardTypeContainer}>
                      {renderDiamond()}
                      <Text style={styles.cardType}>{card.type}</Text>
                    </View>
                  </View>

                  {/* Message */}
                  {/* <Text style={styles.cardMessage}>{card.message}</Text> */}

                  {/* Amount */}
                  <Text style={styles.cardAmount}>
                    ₹ {card.amount.toLocaleString("en-IN")}
                  </Text>

                  {/* Action Button */}
                  {card.status === "unclaimed" ? (
                    <HapticButton
                      style={styles.claimButton}
                      onPress={() => {
                        claimCard(card);
                      }}
                    >
                      <Text style={styles.claimButtonText}>Claim Now</Text>
                      {renderChevronRight()}
                    </HapticButton>
                  ) : card.status === "claimed" ? (
                    <View style={styles.claimedButton}>
                      {renderCheckIcon()}
                      <Text style={styles.claimedButtonText}>Claimed</Text>
                    </View>
                  ) : card.status === "redeemed" ? (
                    <View style={styles.claimedButton}>
                      {renderCheckIcon()}
                      <Text style={styles.claimedButtonText}>Redeemed</Text>
                    </View>
                  ) : (
                    <View style={styles.expiredButton}>
                      <Text style={styles.expiredButtonText}>Expired</Text>
                    </View>
                  )}
                </View>
              </RibbonCard>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No gift cards found in this category. Tell your loved ones to
                gift you some! 🎁
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
  },
  backIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backIconText: {
    fontSize: 20,
    color: "#000000",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginLeft: 12,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  tabsContainer: {
    marginBottom: 24,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: "#000000",
  },
  tabInactive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  tabTextInactive: {
    color: "#374151",
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  cardTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  diamond: {
    width: 8,
    height: 8,
    backgroundColor: "#000000",
    transform: [{ rotate: "45deg" }],
  },
  cardType: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardMessage: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },
  claimButton: {
    backgroundColor: "#000000",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  claimButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  chevronText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  claimedButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  claimedButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  checkIcon: {
    color: "#374151",
    fontSize: 18,
    fontWeight: "700",
  },
  expiredButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  expiredButtonText: {
    color: "#991B1B",
    fontSize: 16,
    fontWeight: "500",
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
  },
});

export default GiftCardRedeemStep1;
