import BottomNavBar from "@/components/bottomNavBar";
import GiftExplore from "@/components/giftExplore";
import GiftingCard from "@/components/giftingCard";
import HashtagComponent from "@/components/hashtagComponent";
import HorizontalRuleIGM from "@/components/horizontalRuleIGM";
import LatestCollections from "@/components/latestCollections";
import { TopPicks } from "@/components/topPicks";
import { COLORS, SPACING } from "@/constants/theme";
import { useGetProductsQuery } from "@/store/apis/product";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Gift() {
  const giftOptions = [
    { id: 1, icon: "gift", label: "Send a gift", route: "/giftStepperPage" },
    { id: 2, icon: "gift", label: "Redeem a gift", route: "/redeemGiftStep1" },
  ];
  const router = useRouter();
  const { data: products = [], isLoading, error } = useGetProductsQuery({});
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
        <Ionicons name="chevron-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <ScrollView>
        <GiftExplore />
        <HorizontalRuleIGM />
        <TopPicks products={products} />
        <HorizontalRuleIGM />
        <GiftingCard sendAGiftButton={true} />
        <HorizontalRuleIGM />
        <LatestCollections />
        <HorizontalRuleIGM />
        <HashtagComponent />
      </ScrollView>

      <BottomNavBar activeTab="Gifting"></BottomNavBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  iconBtn: {
    paddingTop: SPACING.s,
    marginLeft: SPACING.m,
    paddingLeft: SPACING.m,
  },
  backButton: {
    position: "absolute",
    top: 50, // adjust for notch/status bar as needed
    left: 16,
    zIndex: 100,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backText: {
    fontSize: 26,
    fontWeight: "600",
    color: "black",
  },
});
