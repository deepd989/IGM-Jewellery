import { COLORS, SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useGetWishlistQuery } from "../store/apis/wishlist";
import { HapticButton } from "./basic components/hapticButton";
import { CartBadge } from "./cart/CardBadge";

export default function searchBar() {
  const router = useRouter();
  const { data: wishlistData } = useGetWishlistQuery();
  const wishlistCount = wishlistData?.items.length || 0;

  return (
    <View style={styles.searchRow}>
      <HapticButton onPress={() => router.push("/searchPage")}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons name="search" size={22} color={COLORS.primary} />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
      </HapticButton>

      <View style={{ flexDirection: "row", marginLeft: "auto", gap: 20 }}>
        <View style={styles.headerActions}>
          <HapticButton
            style={styles.iconBtn}
            onPress={() => router.push("/wishlist")}
          >
            <Ionicons
              name={wishlistCount > 0 ? "heart" : "heart-outline"}
              size={26}
              color={wishlistCount > 0 ? COLORS.primary : COLORS.text}
            />
            {wishlistCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{wishlistCount}</Text>
              </View>
            )}
          </HapticButton>

          <View style={styles.iconBtn}>
            <CartBadge iconSize={26} iconColor={COLORS.text} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = {
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
    height: 50,
    paddingHorizontal: 20,
  },
  searchPlaceholder: { marginLeft: 8, color: COLORS.primary, fontSize: 16 },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginLeft: SPACING.m,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
};
