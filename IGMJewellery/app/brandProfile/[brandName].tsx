import BrandProfile from "@/components/brands/brandSite";
import { CartBadge } from "@/components/cart/CardBadge";
import { COLORS, LUXURY_COLORS, SPACING } from "@/constants/theme";
import { useGetBrandByNameQuery } from "@/store/apis/brandsApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../../components/basic components/hapticButton";
import BottomNavBar from "../../components/bottomNavBar";
import { useLuxury } from "../../context/luxuryContext";
import { useGetWishlistQuery } from "../../store/apis/wishlist";
import MicrositeScreen from "../luxury/microsite";

/**
 * Both storefronts share this route, so every existing link to a brand — the
 * grids, the carousels, a product's brand story — lands on the presentation
 * the shopper is currently browsing in. In luxury that is the brand's own
 * microsite.
 */
export default function BrandDetailPage() {
  const { isLuxury } = useLuxury();

  return isLuxury ? <LuxuryBrandDetailPage /> : <ClassicBrandDetailPage />;
}

/**
 * Brand links carry the brand's name key, while the microsite is keyed by its
 * id, so the name is resolved here rather than at each of the links.
 */
function LuxuryBrandDetailPage() {
  const { brandName } = useLocalSearchParams<{ brandName: string }>();
  const { data: brand, isLoading } = useGetBrandByNameQuery(brandName);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.luxuryLoading}>
        <ActivityIndicator size="large" color={LUXURY_COLORS.accent} />
      </SafeAreaView>
    );
  }

  // No brand for that name: the microsite says so itself.
  return <MicrositeScreen brandId={brand?.id} />;
}

function ClassicBrandDetailPage() {
  const router = useRouter();
  const { brandName } = useLocalSearchParams<{ brandName: string }>();
  console.log("BrandDetailPage rendered", brandName);
  const { data: brand, isLoading, error } = useGetBrandByNameQuery(brandName);
  console.log("Brand data:", brand, brandName);
  const { data: wishlistData } = useGetWishlistQuery();
  const wishlistCount = wishlistData?.items.length || 0;
  if (error || !brand) return <></>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <HapticButton onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </HapticButton>
        <View />
        <View style={styles.headerIcons}>
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
          <View style={styles.iconBtn}>
            <CartBadge iconSize={24} iconColor={COLORS.primary} />
          </View>
        </View>
      </View>

      <BrandProfile
        header={{
          brandNameKey: brand.businessNameKey,
          profileImageUri: brand.profileImageUri,
          businessName: brand.businessName,
          tagline: brand.tagline,
          ratingText: brand.ratingText,
          storeButtonLabel: brand.storeButtonLabel,
          onEnterStore: () => console.log("Enter Store"),
        }}
        tabs={["About", "Products"]}
        initialActiveTab="Products"
        aboutSections={brand.aboutSections}
      />
      <BottomNavBar activeTab="Categories"></BottomNavBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  luxuryLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LUXURY_COLORS.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    backgroundColor: COLORS.background,
    paddingTop: SPACING.l,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconBtn: {
    marginLeft: SPACING.m,
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
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
  },
});
