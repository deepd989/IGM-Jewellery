import BottomNavBar from "@/components/bottomNavBar";
import { RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/authContext";

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
    path: "/profile/details",
  },
  {
    id: "bank",
    title: "Add Bank/UPI details",
    desc: "Bank Account details, PAN",
    path: "/profile/bank-details",
  },
  {
    id: "issue-gift",
    title: "Issue IGM E-Gift Card",
    desc: "Issue gift cards",
    path: "/giftStepperPage",
  },
  {
    id: "redeem-gift",
    title: "Redeem E-Gift Card",
    desc: "redeem gift cards",
    path: "/redeemGiftStep1",
  },
  { id: "wishlist", title: "Wishlist", desc: "Your most loved jewellery" },
  {
    id: "loyalty",
    title: "Loyalty Points",
    desc: "Your most loved jewellery",
    path: "/profile/loyalty",
  },
  {
    id: "language",
    title: "Language & Currency",
    desc: "Your most loved jewellery",
    path: "/profile/language-currency",
  },
  { id: "support", title: "Customer Support", desc: "Need Help? Contact us" },
  {
    id: "faqs",
    title: "FAQs",
    desc: "Frequently Asked Questions",
    path: "/profile/faqs",
  },
];

export default function ProfileScreen() {
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
        <TouchableOpacity
          style={styles.pointsBadge}
          onPress={() => router.push("/profile/loyalty")}
        >
          <Ionicons name="trophy" size={14} color="#000" />
          <Text style={styles.pointsText}>{profile.points} Points</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.userSection}>
          <View />
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
          <TouchableOpacity
            style={styles.langSelector}
            onPress={() => router.push("/profile/language-currency")}
          >
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/255px-Flag_of_India.svg.png",
              }}
              style={styles.flag}
            />
            <Text style={styles.langText}>EN</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          {PROFILE_STATS.map((stat) => (
            <TouchableOpacity
              key={stat.id}
              style={styles.statCard}
              onPress={() => stat.path && router.push(stat.path as any)}
            >
              <Ionicons name={stat.icon as any} size={24} color="#000" />
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={styles.statDesc}>{stat.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.menuList}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => item.path && router.push(item.path as any)}
            >
              <View style={styles.menuIconPlaceholder} />
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderTop}>
            <View style={styles.orderThumb} />
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

          {[1, 2, 3].map((_, i) => (
            <TouchableOpacity
              key={i}
              style={styles.subOrderItem}
              onPress={() => router.push("/orders/ord1")}
            >
              <View style={styles.subOrderThumb} />
              <View style={styles.subOrderInfo}>
                <Text style={styles.subOrderStatus}>
                  {i === 2 ? "Delivered" : "Dispatched"} on Mon, 2 Nov
                </Text>
                <Text style={styles.subOrderTitle}>
                  Diamond Ring 24K, Kal...
                </Text>
                <Text style={styles.subOrderPrice}>₹3,000</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerLinks}>
          {[
            { title: "Change Password" },
            { title: "Privacy Policies", path: "/profile/privacy-policies" },
            { title: "Terms of Use" },
            { title: "Delete Account" },
          ].map((link) => (
            <TouchableOpacity
              key={link.title}
              style={styles.footerLinkItem}
              onPress={() => link.path && router.push(link.path as any)}
            >
              <Text style={styles.footerLinkText}>{link.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.version}>APP VERSION 1.1.0</Text>
      </ScrollView>
      <BottomNavBar activeTab="Profile"></BottomNavBar>
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
  headerTitle: { fontSize: 18, fontWeight: "700" },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBEBEB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: { fontSize: 12, fontWeight: "700", marginLeft: 4 },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
  },
  avatarPlaceholder: { width: 50, height: 50 },
  userInfo: { flex: 1, marginLeft: 16 },
  userName: { fontSize: 16, fontWeight: "700" },
  userPhone: { fontSize: 12, color: "#888", marginTop: 2 },
  langSelector: { flexDirection: "row", alignItems: "center" },
  flag: { width: 24, height: 16, marginRight: 8 },
  langText: { fontSize: 14, fontWeight: "600" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", padding: 8 },
  statCard: {
    width: "46%",
    backgroundColor: "#FFF",
    margin: "2%",
    padding: 16,
    borderRadius: 8,
  },
  statTitle: { fontSize: 14, fontWeight: "700", marginTop: 8 },
  statDesc: { fontSize: 11, color: "#888", marginTop: 4 },
  menuList: { backgroundColor: "#FFF", marginTop: 12 },
  menuItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIconPlaceholder: {
    width: 36,
    height: 36,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
  },
  menuContent: { flex: 1, marginLeft: 16 },
  menuTitle: { fontSize: 14, fontWeight: "600" },
  menuDesc: { fontSize: 11, color: "#888", marginTop: 2 },
  sectionHeader: { padding: 16, marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
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
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
  },
  orderInfo: { flex: 1, marginLeft: 12 },
  orderId: { fontSize: 14, fontWeight: "700" },
  orderDate: { fontSize: 11, color: "#888" },
  orderMeta: { alignItems: "flex-end" },
  orderPrice: { fontSize: 14, fontWeight: "700" },
  orderItems: { fontSize: 11, color: "#888" },
  orderStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    padding: 8,
    borderRadius: 4,
    marginVertical: 12,
  },
  statusText: { fontSize: 11, fontWeight: "600" },
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
    backgroundColor: "#F9F9F9",
    borderRadius: 4,
  },
  subOrderInfo: { flex: 1, marginLeft: 12 },
  subOrderStatus: { fontSize: 10, color: "#888" },
  subOrderTitle: { fontSize: 13, fontWeight: "600" },
  subOrderPrice: { fontSize: 12, fontWeight: "700" },
  footerLinks: { backgroundColor: "#FFF", marginTop: 20 },
  footerLinkItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  footerLinkText: { fontSize: 14, fontWeight: "500" },
  logoutBtn: {
    margin: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    alignItems: "center",
  },
  logoutText: { fontSize: 14, fontWeight: "600" },
  version: {
    textAlign: "center",
    color: "#999",
    fontSize: 10,
    marginBottom: 40,
  },
});
