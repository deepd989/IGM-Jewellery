import BottomNavBar from "@/components/bottomNavBar";
import { RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/authContext";
import { HapticButton } from "../../components/basic components/hapticButton";
import PaymentMethods from "../../components/paymentMethods";
import { COLORS } from "../../constants/theme";
import { useLuxury } from "../../context/luxuryContext";
import LuxuryProfileScreen from "../luxury/profile";

const PROFILE_STATS = [
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

const MENU_ITEMS = [
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

/**
 * Both storefronts share this route, so every existing link to the account
 * screen lands on the presentation the shopper is currently browsing in. The
 * luxury screen also keeps its own route for direct links.
 */
export default function ProfileScreen() {
  const { isLuxury } = useLuxury();

  return isLuxury ? <LuxuryProfileScreen /> : <ClassicProfileScreen />;
}

function ClassicProfileScreen() {
  const productImageLinks = [
    "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FRings%2FRing_Eternity.webp?alt=media&token=195729b9-5863-440c-b8cd-762318f7de62",
    "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Sub-Category%20Images%2FRings%2FRing_anniversary.webp?alt=media&token=9cad0037-bb91-4334-a586-d5290f309bdb",
  ];

  const router = useRouter();
  const profile = useSelector((state: RootState) => state.user.profile);
  const { userId, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {/* <HapticButton
          style={styles.pointsBadge}
          onPress={() => router.navigate("/profile/loyalty")}
        >
          <Ionicons name="trophy" size={14} color="#053844" />
          <Text style={styles.pointsText}>{profile.points} Points</Text>
        </HapticButton> */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.userSection}>
          <Image
            source={{
              uri: "https://drive.google.com/uc?export=download&id=19-d6USaW7yMEDIqEEPWx-lfilvBiNBCF",
            }}
            style={styles.avatarPlaceholder}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userPhone}>{userId}</Text>
          </View>
          <HapticButton
            style={styles.langSelector}
            onPress={() => router.navigate("/profile/language-currency")}
          >
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/255px-Flag_of_India.svg.png",
              }}
              style={styles.flag}
            />
            <Text style={styles.langText}>EN</Text>
          </HapticButton>
        </View>

        <View style={styles.statsGrid}>
          {PROFILE_STATS.map((stat, index) => (
            <HapticButton
              key={stat.id}
              style={[styles.statCard]}
              onPress={() => stat.path && router.navigate(stat.path as any)}
            >
              <Ionicons name={stat.icon as any} size={24} color="white" />
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={styles.statDesc}>{stat.desc}</Text>
            </HapticButton>
          ))}
        </View>

        <View style={styles.menuList}>
          {MENU_ITEMS.map((item) => (
            <HapticButton
              key={item.id}
              style={styles.menuItem}
              onPress={() => item.path && router.navigate(item.path as any)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </HapticButton>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderTop}>
            <ImageBackground
              style={styles.orderThumb}
              source={{ uri: productImageLinks[0] }}
            />
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Order ID #12345667</Text>
              <Text style={styles.orderDate}>Placed on Sun, 3 Nov</Text>
            </View>
            <View style={styles.orderMeta}>
              <Text style={styles.orderPrice}>₹20,000</Text>
              <Text style={styles.orderItems}>3 items</Text>
            </View>
          </View>
          <View style={styles.orderStatusRow}>
            <Text style={styles.statusText}>2 Items In Progress</Text>
            <Text style={styles.statusText}>1 item delivered</Text>
          </View>

          {[...Array(2)].map((_, i) => (
            <HapticButton
              key={i}
              style={styles.subOrderItem}
              onPress={() => router.navigate("/orders/ord1")}
            >
              <ImageBackground
                style={styles.subOrderThumb}
                source={{ uri: productImageLinks[i] }}
              />
              <View style={styles.subOrderInfo}>
                {/* Changed i === 2 to i === 1 */}
                <Text style={styles.subOrderStatus}>
                  {i === 1 ? "Delivered" : "Dispatched"} on Mon, 2 Nov
                </Text>

                <Text style={styles.subOrderTitle}>
                  Diamond {i === 1 ? "Earring" : "Ring"} 24K, Kal...
                </Text>

                <Text style={styles.subOrderPrice}>₹30,000</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </HapticButton>
          ))}
        </View>

        <View style={styles.footerLinks}>
          {[
            { title: "Privacy Policies", path: "/profile/privacy-policies" },
            { title: "Terms of Use" },
          ].map((link) => (
            <HapticButton
              key={link.title}
              style={styles.footerLinkItem}
              onPress={() => link.path && router.navigate(link.path as any)}
            >
              <Text style={styles.footerLinkText}>{link.title}</Text>
            </HapticButton>
          ))}
        </View>

        {userId && (
          <HapticButton style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </HapticButton>
        )}
        <PaymentMethods />
        <Text style={styles.version}>APP VERSION 1.2.0</Text>
      </ScrollView>
      <BottomNavBar activeTab="Profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.primary },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBEBEB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
    color: COLORS.text,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: { flex: 1, marginLeft: 16 },
  userName: { fontSize: 16, fontWeight: "700", color: COLORS.primary },
  userPhone: { fontSize: 12, color: "#666", marginTop: 2 },
  langSelector: { flexDirection: "row", alignItems: "center" },
  flag: { width: 24, height: 16, marginRight: 8 },
  langText: { fontSize: 14, fontWeight: "600", color: "#333" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", padding: 8 },
  statCard: {
    width: "46%",
    backgroundColor: COLORS.primary,
    margin: "2%",
    padding: 16,
    borderRadius: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
    color: "white",
  },
  statDesc: { fontSize: 11, color: "white", marginTop: 4 },
  menuList: { backgroundColor: "#FFF", marginTop: 12 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContent: { flex: 1, marginLeft: 16 },
  menuTitle: { fontSize: 14, fontWeight: "600", color: COLORS.primary },
  menuDesc: { fontSize: 11, color: "#666", marginTop: 2 },
  sectionHeader: { padding: 16, marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: COLORS.primary },
  orderCard: {
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  orderTop: { flexDirection: "row", alignItems: "center" },
  orderThumb: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 4,
  },
  orderInfo: { flex: 1, marginLeft: 12 },
  orderId: { fontSize: 14, fontWeight: "700", color: COLORS.primary },
  orderDate: { fontSize: 11, color: COLORS.primary },
  orderMeta: { alignItems: "flex-end" },
  orderPrice: { fontSize: 14, fontWeight: "700", color: COLORS.primary },
  orderItems: { fontSize: 11, color: COLORS.primary },
  orderStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    padding: 8,
    borderRadius: 4,
    marginVertical: 12,
  },
  statusText: { fontSize: 11, fontWeight: "600", color: COLORS.primary },
  subOrderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  subOrderThumb: {
    width: 50,
    height: 50,
    backgroundColor: "red",
    borderRadius: 4,
  },
  subOrderInfo: { flex: 1, marginLeft: 12 },
  subOrderStatus: { fontSize: 10, color: COLORS.primary },
  subOrderTitle: { fontSize: 13, fontWeight: "600", color: COLORS.primary },
  subOrderPrice: { fontSize: 12, fontWeight: "700", color: COLORS.primary },
  footerLinks: { backgroundColor: "#FFF", marginTop: 20 },
  footerLinkItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  footerLinkText: { fontSize: 14, fontWeight: "500", color: COLORS.primary },
  logoutBtn: {
    margin: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    alignItems: "center",
  },
  logoutText: { fontSize: 14, fontWeight: "600", color: "#333" },
  version: {
    textAlign: "center",
    color: "#999",
    fontSize: 10,
    marginBottom: 40,
  },
});
