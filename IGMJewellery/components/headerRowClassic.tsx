import { useLuxury } from "@/context/luxuryContext";
import { useGetWishlistQuery } from "@/store/apis/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { STOREFRONT, type Storefront } from "../constants/storefront";
import { COLORS } from "../constants/theme";
import { HapticButton } from "./basic components/hapticButton";
import { CartBadge } from "./cart/CardBadge";
import StoreToggle from "./storeToggle";

type HeaderRowClassicProps = {
  /** Overrides the switch into the luxury storefront. */
  onSwitchToLuxury?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The classic storefront's header row: the storefront switch on the left, the
 * shopper's own shortcuts on the right. Self-contained, so any classic screen
 * can drop it in without wiring.
 */
export default function HeaderRowClassic({
  onSwitchToLuxury,
  style,
}: HeaderRowClassicProps) {
  const router = useRouter();
  const { switchMode } = useLuxury();

  const { data: wishlistData } = useGetWishlistQuery();
  const wishlistCount = wishlistData?.items.length || 0;

  const handleSelectStore = (store: Storefront) => {
    // Already here; only the other side navigates.
    if (store === STOREFRONT.massy) return;

    if (onSwitchToLuxury) {
      onSwitchToLuxury();
      return;
    }
    // Every product link renders the luxury screen from here on.
    switchMode(true, () => router.navigate("/luxury"));
  };

  return (
    <View style={[styles.row, style]}>
      <StoreToggle active={STOREFRONT.massy} onSelect={handleSelectStore} />

      <View style={styles.actions}>
        <HapticButton
          style={styles.icon}
          activeOpacity={0.6}
          onPress={() => router.navigate("/underDev")}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLORS.primary}
          />
        </HapticButton>

        <HapticButton
          style={styles.icon}
          activeOpacity={0.6}
          onPress={() => router.navigate("/wishlist")}
        >
          <Ionicons
            name={wishlistCount > 0 ? "heart" : "heart-outline"}
            size={24}
            color={COLORS.primary}
          />
          {wishlistCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </Text>
            </View>
          )}
        </HapticButton>

        <View style={styles.icon}>
          <CartBadge iconSize={24} iconColor={COLORS.primary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  // Fixed box so the badge anchors inside it — a badge hanging past its
  // parent's bounds is dropped on Android.
  icon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
