import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS } from "@/constants/theme";
import { useGetWishlistQuery } from "@/store/apis/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type LuxuryWishlistButtonProps = {
  size?: number;
  color?: string;
  /** Badge fill; defaults to the icon's colour. */
  badgeColor?: string;
  badgeTextColor?: string;
  /** Overrides navigation to the wishlist screen. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The wishlist heart every luxury header carries: filled once something is
 * saved, with the count on it. One component so the badge cannot go missing
 * from one header and not another.
 */
export default function LuxuryWishlistButton({
  size = 24,
  color = COLORS.primary,
  badgeColor,
  badgeTextColor = "#FFFFFF",
  onPress,
  style,
}: LuxuryWishlistButtonProps) {
  const router = useRouter();
  const { data: wishlistData } = useGetWishlistQuery();
  const count = wishlistData?.items.length || 0;

  return (
    <HapticButton
      // Fixed box so the badge anchors inside it — a badge hanging past its
      // parent's bounds is dropped on Android.
      style={[styles.button, { width: size + 10, height: size + 10 }, style]}
      activeOpacity={0.6}
      onPress={onPress ?? (() => router.navigate("/wishlist"))}
    >
      <Ionicons
        name={count > 0 ? "heart" : "heart-outline"}
        size={size}
        color={color}
      />

      {count > 0 && (
        <View
          style={[styles.badge, { backgroundColor: badgeColor ?? color }]}
        >
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>
            {count > 99 ? "99+" : count}
          </Text>
        </View>
      )}
    </HapticButton>
  );
}

const styles = StyleSheet.create({
  button: {
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
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
  },
});
