import { COLORS, SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, View, StyleSheet } from "react-native";
import { useGetWishlistQuery } from "@/store/apis/wishlist";
import { HapticButton } from "@/components/basic components/hapticButton";
import { CartBadge } from "@/components/cart/CardBadge";

export default function SearchBarLuxury() {
  const router = useRouter();
  const { data: wishlistData } = useGetWishlistQuery();
  const wishlistCount = wishlistData?.items.length || 0;

  return (
    <View style={styles.headerContainer}>
      {/* Brand Logo */}
      <HapticButton onPress={() => router.push("/")}>
        <Image
          source={require("@/assets/images/elanziaS.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </HapticButton>

      {/* Action Icons Right Side */}
      <View style={styles.headerActions}>
        {/* Notification Icon */}
        <HapticButton
          style={styles.iconBtn}
          onPress={() => router.navigate("/notifications")}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLORS.text}
          />
        </HapticButton>

        {/* Wishlist Icon */}
        <HapticButton
          style={styles.iconBtn}
          onPress={() => router.navigate("/wishlist")}
        >
          <Ionicons
            name={wishlistCount > 0 ? "heart" : "heart-outline"}
            size={24}
            color={wishlistCount > 0 ? COLORS.primary : COLORS.text}
          />
          {wishlistCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{wishlistCount}</Text>
            </View>
          )}
        </HapticButton>

        {/* Cart Icon */}
        <View style={styles.iconBtn}>
          <CartBadge iconSize={24} iconColor={COLORS.text} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 56,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 130,
    height: 32,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBtn: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "700",
  },
});