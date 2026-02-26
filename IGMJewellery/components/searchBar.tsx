import { COLORS, SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { useGetWishlistQuery } from "../store/apis/wishlist";
import { HapticButton } from "./basic components/hapticButton";
import { CartBadge } from "./cart/CardBadge";

export default function searchBar() {
  const router = useRouter();
  const { data: wishlistData } = useGetWishlistQuery();
  const wishlistCount = wishlistData?.items.length || 0;

  return (
    <View style={styles.searchRow}>
      <HapticButton>
        <View style={{ flexDirection: "row" }}>
          {/* <Ionicons name="search" size={22} color={COLORS.primary} /> */}
          <Image
            source={require("../assets/images/elanziaPng.png")}
            style={{
              height: 150,
              width: 150,
              position: "relative",
              left: -20,
            }}
          />
        </View>
      </HapticButton>

      <View style={{ flexDirection: "row", marginLeft: "auto", gap: 20 }}>
        <View style={styles.headerActions}>
          <HapticButton
            style={styles.iconBtn}
            onPress={() => router.navigate("/wishlist")}
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
    top: -6,
    right: -8,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
};
