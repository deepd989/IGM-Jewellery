import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { RootState } from "@/store/store";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useAuth } from "../../../auth/authContext";
import LuxuryNavBar, {
  LUXURY_NAV_BAR_HEIGHT,
} from "../components/luxuryNavBar";
import LuxuryScreenHeader from "../components/luxuryScreenHeader";
import LuxuryActionButton from "./components/luxuryActionButton";
import LuxuryPaymentMethods from "./components/luxuryPaymentMethods";
import LuxuryProfileHero from "./components/luxuryProfileHero";
import LuxuryProfileMenuList, {
  LuxuryProfileMenuItem,
} from "./components/luxuryProfileMenuList";
import LuxuryProfileStats, {
  LuxuryProfileStat,
} from "./components/luxuryProfileStats";
import LuxuryRecentOrderCard from "./components/luxuryRecentOrderCard";
import { assetUrl } from "@/constants/assets";

/** Stand-in artwork until recent orders are served by the backend. */
const ORDER_IMAGES = [
  assetUrl("profile.recentOrder.image1"),
  assetUrl("profile.recentOrder.image2"),
];

const PROFILE_STATS: LuxuryProfileStat[] = [
  {
    id: "orders",
    title: "Orders",
    desc: "Your previous orders",
    icon: "cart-outline",
    path: "/orders",
  },
  {
    id: "trial",
    title: "Try at Home",
    desc: "Your previous orders",
    icon: "home-outline",
    path: "/trial-orders",
  },
  {
    id: "custom",
    title: "Customization",
    desc: "Your previous orders",
    icon: "diamond-outline",
  },
  {
    id: "vault",
    title: "GBST Vault",
    desc: "Your previous orders",
    icon: "shield-checkmark-outline",
  },
];

const MENU_ITEMS: LuxuryProfileMenuItem[] = [
  {
    id: "details",
    title: "Profile Details",
    desc: "Name, Phone Number, Email, Address",
    icon: "person-outline",
    path: "/profile/details",
  },
  {
    id: "bank",
    title: "Add Bank/UPI details",
    desc: "Bank Account details, PAN",
    icon: "card-outline",
    path: "/profile/bank-details",
  },
  {
    id: "issue-gift",
    title: "Issue IGM E-Gift Card",
    desc: "Issue gift cards",
    icon: "gift-outline",
    path: "/giftStepperPage",
  },
  {
    id: "redeem-gift",
    title: "Redeem E-Gift Card",
    desc: "Redeem gift cards",
    icon: "qr-code-outline",
    path: "/redeemGiftStep1",
  },
  {
    id: "wishlist",
    title: "Wishlist",
    desc: "Your most loved jewellery",
    icon: "heart-outline",
  },
  {
    id: "loyalty",
    title: "Loyalty Points",
    desc: "Your most loved jewellery",
    icon: "ribbon-outline",
    path: "/profile/loyalty",
  },
  {
    id: "language",
    title: "Language & Currency",
    desc: "Your most loved jewellery",
    icon: "globe-outline",
    path: "/profile/language-currency",
  },
  {
    id: "support",
    title: "Customer Support",
    desc: "Need Help? Contact us",
    icon: "headset-outline",
  },
  {
    id: "faqs",
    title: "FAQs",
    desc: "Frequently Asked Questions",
    icon: "help-circle-outline",
    path: "/profile/faqs",
  },
];

const FOOTER_LINKS: LuxuryProfileMenuItem[] = [
  {
    id: "privacy",
    title: "Privacy Policies",
    icon: "lock-closed-outline",
    path: "/profile/privacy-policies",
  },
  {
    id: "terms",
    title: "Terms of Use",
    icon: "document-text-outline",
  },
];

/**
 * The luxury storefront's account screen. Same shortcuts, settings and orders
 * as app/profile/index.tsx, presented on the dark ground with the floating nav
 * bar rather than the classic tab bar.
 */
export default function LuxuryProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useSelector((state: RootState) => state.user.profile);
  const { userId, logout } = useAuth();

  const openPath = (path?: string) => {
    if (path) router.navigate(path as any);
  };

  return (
    <View style={styles.screen}>
      <LuxuryScreenHeader title="Profile" variant="glass" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          // Clears the floating nav bar, which applies its own bottom inset.
          {
            paddingBottom:
              LUXURY_NAV_BAR_HEIGHT + Math.max(insets.bottom, 12) + 24,
          },
        ]}
      >
        <LuxuryProfileHero
          name={profile.name}
          phone={userId}
          onPressLanguage={() => router.navigate("/profile/language-currency")}
        />

        <LuxuryProfileStats
          items={PROFILE_STATS}
          onSelect={(item) => openPath(item.path)}
          style={styles.block}
        />

        <LuxuryProfileMenuList
          items={MENU_ITEMS}
          onSelect={(item) => openPath(item.path)}
          style={styles.block}
        />

        <Text style={styles.sectionTitle}>Recent Orders</Text>

        <LuxuryRecentOrderCard
          orderId="Order ID #12345667"
          placedOn="Placed on Sun, 3 Nov"
          total="₹20,000"
          itemCount="3 items"
          imageUrl={ORDER_IMAGES[0]}
          statuses={["2 Items In Progress", "1 item delivered"]}
          lines={[
            {
              id: "line-1",
              imageUrl: ORDER_IMAGES[0],
              status: "Dispatched on Mon, 2 Nov",
              title: "Diamond Ring 24K, Kal...",
              price: "₹30,000",
            },
            {
              id: "line-2",
              imageUrl: ORDER_IMAGES[1],
              status: "Delivered on Mon, 2 Nov",
              title: "Diamond Earring 24K, Kal...",
              price: "₹30,000",
            },
          ]}
          onPressLine={() => router.navigate("/orders/ord1")}
        />

        <LuxuryProfileMenuList
          items={FOOTER_LINKS}
          onSelect={(item) => openPath(item.path)}
          style={styles.block}
        />

        {!!userId && (
          <LuxuryActionButton
            label="Logout"
            variant="outline"
            style={styles.logout}
            onPress={() => logout()}
          />
        )}

        <LuxuryPaymentMethods style={styles.block} />

        <Text style={styles.version}>APP VERSION 2.0.2</Text>
      </ScrollView>

      <LuxuryNavBar activeKey="profile" />
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
    paddingTop: 4,
  },
  block: {
    marginTop: LUXURY_SPACING / 3,
  },
  sectionTitle: {
    marginTop: LUXURY_SPACING / 2,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  logout: {
    marginTop: LUXURY_SPACING / 2,
  },
  version: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 10,
    letterSpacing: 1,
    color: LUXURY_COLORS.textMuted,
  },
});
