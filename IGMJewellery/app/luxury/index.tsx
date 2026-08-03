import BespokeSection from "@/components/bespokeSection";
import BottomNavBar from "@/components/bottomNavBar";
import CommunityCarousel from "@/components/communityCarousel";
import EventCard from "@/components/eventCard";
import GiftFinder from "@/components/giftFinder";
import GiftingCard from "@/components/giftingCard";
import HorizontalRuleIGM from "@/components/horizontalRuleIGM";
import OccasionCardList from "@/components/occasionsHome";
import { TopPicks } from "@/components/topPicks";
import { getUserPincode } from "@/scripts/location";
import { useGetProductsQuery } from "@/store/apis/product";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  BackHandler,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../auth/authContext";
import AnnouncementSection from "../../components/announcementSectionHome";
import CallUsComponent from "../../components/basic components/callUsComponent";
import { HapticButton } from "../../components/basic components/hapticButton";
import BrandsHorizontalScroll from "../../components/brandsHorizontalScroll";
import CategoriesHorizontalScroll from "../../components/categoriesHorizontallScroll";
import HowItLooksWrapper from "../../components/homePageCard";
import { SectionHeader } from "../../components/section";
import BrandCollectionCards from "../../components/shopByCollectionsNew";
import ShopByRegionCards from "../../components/shopByRegion";
import { TrendingProducts } from "../../components/TrendingProducts";
import TrustBar from "../../components/trustBarBanner";
import {
  COLORS,
  LUXURY_COLORS,
  LUXURY_SECTION_BACKGROUNDS,
  LUXURY_SPACING,
} from "../../constants/theme";
import { useLuxury } from "../../context/luxuryContext";
import { useWalletBalance } from "../customHooks/walletBalanceLoader";
import SearchBarLuxury from "./components/searchBarLuxury";
import GlossyHorizontalCard from "./components/luxuryHomepageGlossyCard";
import LuxuryBestSellers from "./components/luxuryBestSellers";
import LuxuryBrandsCollection from "./components/luxuryBrandsCollectionComponent";
import LuxuryBrandsGrid from "./components/luxuryBrandsGridComponent";
import LuxuryCategories from "./components/luxuryCategoriesComponent";
import LuxuryCollections from "./components/luxuryCollections";
import LuxuryCommunityCarousel from "./components/luxuryCommunityCarousel";
import LuxuryElanziaAllRights from "./components/luxuryElanziaAllRights";
import LuxuryElanziaSearch from "./components/luxuryElanziaSearch";
import LuxuryGenderVsProducts from "./components/luxuryGenderVsProducts";
import LuxuryHorizontalCollectionCarousel from "./components/luxuryHorizontalCollectionCarousel";
import LuxuryMultibrandCollection from "./components/luxuryMultibrandCollection";
import LuxuryNavBar, { LUXURY_NAV_BAR_HEIGHT } from "./components/luxuryNavBar";
import LuxurySeparator from "./components/luxurySeparator";
import LuxuryNewProducts from "./components/luxuryNewProducts";
import LuxuryRegionalFavorites from "./components/luxuryRegionalFavorites";
import LuxurySellingFast from "./components/luxurySellingFast";
import LuxurySwipeAndShop from "./components/luxurySwipeAndShop";
import LuxuryTopPicks from "./components/luxuryTopPicks";
import LuxuryTopSearch from "./components/luxuryTopSearch";
import LuxuryTryOn from "./components/luxuryTryOn";
import LuxuryLatestOffers from "./components/luxuryLatestOffers";
import OutfitTypesCarousel from "./components/outfitTypesCarousel";

/** Hero carousel height: tall enough to lead the page, short enough that the
 *  collection row below it is visible without scrolling. */
const HERO_HEIGHT = 390;

/** Gutter the page keeps around its sections. */
const PAGE_PADDING = 8;

/** How far the page scrolls before the top bar turns into the search field. */
const SEARCH_COLLAPSE_OFFSET = 40;

type StorefrontSection = {
  key: string;
  /** The ground this section paints, edge to edge, behind its content. */
  background: string;
  render: () => React.ReactNode;
};

const BG = LUXURY_SECTION_BACKGROUNDS;

/**
 * The storefront in order. Kept as data rather than one long block of JSX so
 * the list can mount each section as the shopper reaches it — rendering all of
 * them up front loads every carousel's artwork at once, which is what made the
 * page crawl and run the device out of memory.
 */
const SECTIONS: StorefrontSection[] = [
  // 1. Hero
  {
    key: "hero",
    background: BG.green,
    render: () => <GlossyHorizontalCard height={HERO_HEIGHT} />,
  },
  // 2. House of Elanzia Luxe
  {
    key: "collectionCarousel",
    background: BG.offWhite,
    render: () => <LuxuryHorizontalCollectionCarousel />,
  },
  // Not in the design's running order; grounded with the section above it.
  {
    key: "brandsCollection",
    background: BG.offWhite,
    render: () => <LuxuryBrandsCollection />,
  },
  // 3. Brands on Elanzia
  {
    key: "brandsGrid",
    background: BG.green,
    render: () => <LuxuryBrandsGrid style={styles.fullBleedSection} />,
  },
  // 4. Shop by Categories
  {
    key: "categories",
    background: BG.offWhite,
    render: () => <LuxuryCategories />,
  },
  // Not in the design's running order; artwork-led, so it takes the placeholder.
  {
    key: "tryOn",
    background: BG.imagePlaceholder,
    render: () => <LuxuryTryOn style={styles.fullBleedSection} />,
  },
  // 5. Latest Offers and Discounts
  {
    key: "latestOffers",
    background: BG.offWhite,
    render: () => <LuxuryLatestOffers style={styles.fullBleedSection} />,
  },
  // 6. Latest Collections
  {
    key: "multibrand",
    background: BG.imagePlaceholder,
    render: () => <LuxuryMultibrandCollection style={styles.fullBleedSection} />,
  },
  // 7. Our Best Sellers
  {
    key: "bestSellers",
    background: BG.offWhite,
    render: () => <LuxuryBestSellers />,
  },
  // 8. Try Swipe and Shop
  {
    key: "swipeAndShop",
    background: BG.imagePlaceholder,
    render: () => <LuxurySwipeAndShop style={styles.fullBleedSection} />,
  },
  // 9. Find Something for All
  {
    key: "gender",
    background: BG.offWhite,
    render: () => <LuxuryGenderVsProducts />,
  },
  // 10. Shop for Every You
  {
    key: "outfits",
    background: BG.offWhite,
    render: () => <OutfitTypesCarousel />,
  },
  // 11. Top Picks for You
  {
    key: "topPicks",
    background: BG.offWhite,
    render: () => <LuxuryTopPicks />,
  },
  // 12. Not Sure What to Gift
  {
    key: "elanziaSearch",
    background: BG.darkGreen,
    render: () => <LuxuryElanziaSearch style={styles.fullBleedSection} />,
  },
  // 13. Regional Favourites
  {
    key: "regional",
    background: BG.offWhite,
    render: () => <LuxuryRegionalFavorites />,
  },
  // 14. New In for You
  {
    key: "newProducts",
    background: BG.offWhite,
    render: () => <LuxuryNewProducts />,
  },
  // 15. Collections You May Like
  {
    key: "collections",
    background: BG.offWhite,
    render: () => <LuxuryCollections />,
  },
  // 16. Selling Fast
  {
    key: "sellingFast",
    background: BG.offWhite,
    render: () => <LuxurySellingFast />,
  },
  // 17. As Seen on You
  {
    key: "community",
    background: BG.offWhite,
    render: () => <LuxuryCommunityCarousel />,
  },
  // 18. Footer
  {
    key: "allRights",
    background: BG.imagePlaceholder,
    render: () => <LuxuryElanziaAllRights style={styles.fullBleedSection} />,
  },
];

const renderSection = ({ item }: { item: StorefrontSection }) => (
  <View style={[styles.sectionBand, { backgroundColor: item.background }]}>
    {item.render()}
  </View>
);

export default function HomeScreen() {
  const [expanded, setExpanded] = useState(false);

  const navigation = useNavigation();
  const [firstRowHeight, setFirstRowHeight] = useState<number | null>(68);
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery({});
  const router = useRouter();
  const [textInput, setTextInput] = useState<string>("");
  const [pincode, setPincode] = useState(null);
  /** Past this, the top bar gives up the delivery line for the search field. */
  const [isScrolled, setIsScrolled] = useState(false);
  const { userId } = useAuth();
  const { switchMode } = useLuxury();
  const { balance: walletBalance } = useWalletBalance(userId as string);

  const revolvingTexts = [
    "I want a necklace",
    "I want a ring for my mom",
    "Help me find a bracelet",
    "What should I give her on anniversary?",
    "Wedding rings",
    "Earrings like Deepika Padukone",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setPlaceholderIndex((prev) => (prev + 1) % revolvingTexts.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      const pin = await getUserPincode();
      setPincode(pin || "Mumbai 400 999");
    })();
  }, []);
  const handleSubmit = () => {
    router.navigate({
      pathname: "/exploreAi",
      params: { value: textInput },
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrolled = event.nativeEvent.contentOffset.y > SEARCH_COLLAPSE_OFFSET;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  // Disable Android hardware back button
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true
      );
      return () => backHandler.remove();
    }, [])
  );

  return (
    <SafeAreaView
      // The top bar paints under the status bar and the nav bar applies the
      // bottom inset itself, so neither edge is padded here.
      edges={["left", "right"]}
      style={{ flex: 1, backgroundColor: LUXURY_SECTION_BACKGROUNDS.green }}
    >
      <LuxuryTopSearch
        pincode={pincode}
        collapsed={isScrolled}
        onExitLuxury={() =>
          // Back to the Massy storefront, product screen included.
          switchMode(false, () => router.navigate("/home"))
        }
      />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={SECTIONS}
        keyExtractor={(section) => section.key}
        renderItem={renderSection}
        ListHeaderComponent={
          <>
            <View style={styles.searchBox}>
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder="Search for ..."
                  placeholderTextColor={LUXURY_COLORS.textMuted}
                  style={styles.inputText}
                  value={textInput}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit}
                  onChangeText={(text) => setTextInput(text)}
                />
              </View>
              <View style={styles.iconGroup}>
                <HapticButton
                  onPress={() => {
                    router.navigate({
                      pathname: "/exploreAi",
                      params: { mode: "voice" },
                    });
                  }}
                >
                  <Ionicons name="mic-outline" size={22} color={LUXURY_COLORS.text} />
                </HapticButton>
              </View>
            </View>
            {/* Halved: the first band brings the other half of the gap. */}
            <LuxurySeparator size={0.5} />
          </>
        }
        // The storefront is long and every section pulls its own artwork, so
        // only the ones near the viewport are mounted.
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
      />
      {/* <BottomNavBar></BottomNavBar> */}
      <LuxuryNavBar/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: PAGE_PADDING,
    backgroundColor: LUXURY_SECTION_BACKGROUNDS.green,
  },
  // Cancels the page gutter so a section's artwork runs to the screen edges.
  fullBleedSection: {
    marginHorizontal: -PAGE_PADDING,
    borderRadius: 0,
  },
  /**
   * A section's own ground. The page gutter is given back and then re-applied
   * inside, so the colour runs to the screen edges while the content it holds
   * stays inset — and a fullBleedSection child cancels that padding again to
   * put its artwork back on the edges.
   *
   * The vertical rhythm lives here rather than in a separator between rows, so
   * that two neighbouring bands meet with no strip of page showing through.
   */
  sectionBand: {
    marginHorizontal: -PAGE_PADDING,
    paddingHorizontal: PAGE_PADDING,
    paddingVertical: LUXURY_SPACING / 2,
  },
  // Clears the floating nav bar so the last section is never hidden behind it.
  contentContainer: { paddingBottom: LUXURY_NAV_BAR_HEIGHT + LUXURY_SPACING },
  AiContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  luxuryButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
  },
  luxuryButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  viewElanziaIsListening: {
    padding: 16,
    borderRadius: 12,
  },
  balance: {
    textAlign: "center",
    // paddingHorizontal: 20,
    paddingVertical: 4,
    backgroundColor: COLORS.primary,
    color: "white",
    borderRadius: 20,
    fontWeight: "600",
    minWidth: 60,
  },
  deliveryText: { fontSize: 14, color: COLORS.primary },
  bold: { fontWeight: "600" },

  centerBox: { alignItems: "center", marginTop: 30 },
  sparkle: { color: "#555", marginTop: 3 },

  voiceBox: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 30,
    gap: 12,
    backgroundColor: "#F8F8F8",
  },
  input: { flex: 1, backgroundColor: "white" },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 10,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  greetingBold: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  greetingLight: {
    fontSize: 14,
    fontWeight: "300",
    color: "#666",
    textAlign: "center",
  },

  chip: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  moreText: {
    paddingHorizontal: 12,
    color: "black",
    marginTop: 6,
    fontWeight: "100",
  },

  chipText: { fontSize: 12, color: "#444" },

  card: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  heartIcon: { position: "absolute", top: 20, right: 20 },

  deliveryDate: { marginTop: 8, color: "#666", fontSize: 12 },

  productName: { marginTop: 6, fontSize: 18, fontWeight: "600" },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  price: { fontSize: 18, fontWeight: "700" },
  cutPrice: { fontSize: 14, color: "#888", textDecorationLine: "line-through" },

  brand: { marginTop: 4, color: "#444" },

  tryButton: {
    marginTop: 14,
    backgroundColor: "#053844",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  tryButtonText: { color: "#fff", fontWeight: "600" },
  badgeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  aiBadge: {
    flexDirection: "row",
    backgroundColor: "#7CBFB2",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    gap: 6,
  },
  aiBadgeText: {
    color: "#003A45",
    fontSize: 14,
    fontWeight: "600",
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: LUXURY_COLORS.surface,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
  },
  inputText: {
    flex: 1,
    fontSize: 17,
    color: LUXURY_COLORS.text,
  },
  brandBold: {
    fontWeight: "800",
    fontStyle: "italic",
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  waveformCircle: {
    backgroundColor: "#4A7C87", // Muted teal
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    paddingRight: 20,
  },
  cardWrapper: {
    alignItems: "center",
    marginRight: 12,
  },
  imageCard: {
    width: 85,
    height: 100,
    backgroundColor: "#FFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  productImage: {
    width: "80%",
    height: "80%",
  },
  cardLabel: {
    fontSize: 14,
    color: "#1A3B4A",
    fontWeight: "500",
  },
  micIcon: {
    padding: 8, // Increases the touch target area
    marginRight: 5,
    color: "#1A3B4A", // Matching the dark teal theme color
  },
});
