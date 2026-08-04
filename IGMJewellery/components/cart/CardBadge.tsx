import { COLORS } from "@/constants/theme";

import { useGetCartQuery } from "@/store/apis/cart";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { HapticButton } from "../basic components/hapticButton";

interface CartBadgeProps {
  iconSize?: number;
  iconColor?: string;
  /** Fill behind the count. Defaults to the app's primary. */
  badgeColor?: string;
  /** Ink for the count. Has to follow the fill — dark over a light badge. */
  badgeTextColor?: string;
  showLabel?: boolean;
}

export const CartBadge: React.FC<CartBadgeProps> = ({
  iconSize = 22,
  iconColor = COLORS.text,
  badgeColor = COLORS.primary,
  badgeTextColor = "#FFFFFF",
  showLabel = false,
}) => {
  const router = useRouter();
  const { data: cartData } = useGetCartQuery();

  const totalItems =
    cartData?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handlePress = () => {
    router.navigate("/cart");
  };

  return (
    <HapticButton
      // style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="bag-outline" size={iconSize} color={iconColor} />
        {totalItems > 0 && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              {totalItems > 99 ? "99+" : totalItems}
            </Text>
          </View>
        )}
      </View>
      {showLabel && <Text style={styles.label}>Cart</Text>}
    </HapticButton>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  iconContainer: {
    position: "relative",
  },
  // Fill and ink come from the props, so the badge can follow whatever header
  // it is sitting in rather than carrying one colour everywhere.
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  label: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
