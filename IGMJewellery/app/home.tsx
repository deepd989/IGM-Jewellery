import BespokeSection from "@/components/bespokeSection";
import BottomNavBar from "@/components/bottomNavBar";
import CommunityCarousel from "@/components/communityCarousel";
import EventCard from "@/components/eventCard";
import GiftFinder from "@/components/giftFinder";
import GiftingCard from "@/components/giftingCard";
import HeaderRowClassic from "@/components/headerRowClassic";
import HorizontalRuleIGM from "@/components/horizontalRuleIGM";
import OccasionCardList from "@/components/occasionsHome";
import { TopPicks } from "@/components/topPicks";
import { Product } from "@/interfaces/product.interface";
import { getUserPincode } from "@/scripts/location";
import { useGetProductsQuery } from "@/store/apis/product";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnnouncementSection from "../components/announcementSectionHome";
import CallUsComponent from "../components/basic components/callUsComponent";
import { HapticButton } from "../components/basic components/hapticButton";
import BrandsHorizontalScroll from "../components/brandsHorizontalScroll";
import CategoriesHorizontalScroll from "../components/categoriesHorizontallScroll";
import HowItLooksWrapper from "../components/homePageCard";
import { SectionHeader } from "../components/section";
import BrandCollectionCards from "../components/shopByCollectionsNew";
import ShopByRegionCards from "../components/shopByRegion";
import { TrendingProducts } from "../components/TrendingProducts";
import TrustBar from "../components/trustBarBanner";
import { COLORS } from "../constants/theme";
import { assetUrl } from "@/constants/assets";

const GIFTING_BANNER_URL = assetUrl("gifting.banner");

type HomeSection = { key: string; render: () => React.ReactNode };

/**
 * The assistant prompt at the top of the page. It owns the field's text so a
 * keystroke re-renders this box alone — held on the screen, every character
 * typed re-rendered all twenty sections below it.
 */
const HomeAiSearch = React.memo(function HomeAiSearch() {
  const router = useRouter();
  const [textInput, setTextInput] = useState("");

  const handleSubmit = () => {
    router.navigate({
      pathname: "/exploreAi",
      params: { value: textInput },
    });
  };

  return (
    <View style={styles.AiContainer}>
      <View style={styles.viewElanziaIsListening}>
        <View style={styles.badgeContainer}>
          <View style={styles.aiBadge}>
            <Sparkles size={16} color="#FFF" fill="#FFF" />
            <Text style={styles.aiBadgeText}>Ai powered</Text>
          </View>
        </View>

        {/* 2. Main Title */}
        <Text style={styles.mainTitle}>Tell us what you are looking for</Text>

        {/* 3. Enhanced Search Bar */}
        <View style={styles.searchBox}>
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Search for ..."
              placeholderTextColor="#999"
              style={styles.inputText}
              value={textInput}
              returnKeyType="send"
              onSubmitEditing={handleSubmit}
              onChangeText={setTextInput}
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
              <Ionicons name="mic-outline" size={22} color="#003A45" />
            </HapticButton>
          </View>
        </View>
      </View>
    </View>
  );
});

/**
 * The storefront in order. Kept as data rather than one long block of JSX so
 * the list can mount each section as the shopper reaches it — rendering all of
 * them up front loads every carousel's artwork, and starts every video, before
 * the page has even been scrolled.
 */
const buildSections = (products: Product[]): HomeSection[] => [
  {
    key: "categories",
    render: () => (
      <View style={{ marginTop: 40 }}>
        <CategoriesHorizontalScroll />
      </View>
    ),
  },
  { key: "trustBarTop", render: () => <TrustBar /> },
  {
    key: "bespoke",
    render: () => (
      <>
        <BespokeSection />
        <HorizontalRuleIGM />
      </>
    ),
  },
  {
    key: "brands",
    render: () => (
      <>
        <BrandsHorizontalScroll />
        <HorizontalRuleIGM />
      </>
    ),
  },
  {
    key: "regions",
    render: () => (
      <>
        <ShopByRegionCards />
        <HorizontalRuleIGM />
      </>
    ),
  },
  {
    key: "community",
    render: () => (
      <>
        <CommunityCarousel />
        <HorizontalRuleIGM />
      </>
    ),
  },
  {
    key: "announcements",
    render: () => (
      <>
        <AnnouncementSection />
        <HorizontalRuleIGM />
      </>
    ),
  },
  {
    key: "events",
    render: () => (
      <>
        <EventCard />
        <HorizontalRuleIGM />
      </>
    ),
  },
  {
    key: "collections",
    render: () => (
      <>
        <BrandCollectionCards />
        <HorizontalRuleIGM />
      </>
    ),
  },
  {
    key: "topPicks",
    render: () => (
      <>
        <TopPicks products={products} />
        <View style={{ marginTop: 30 }}>
          <HorizontalRuleIGM />
        </View>
      </>
    ),
  },
  {
    key: "giftFinder",
    render: () => (
      <>
        <GiftFinder />
        <HorizontalRuleIGM />
      </>
    ),
  },
  {
    key: "tryOn",
    render: () => (
      <>
        <SectionHeader value="Explore AI Try On" />
        <HowItLooksWrapper seeHowItLooks={true} />
        <HorizontalRuleIGM />
      </>
    ),
  },
  {
    key: "occasions",
    render: () => (
      <>
        <OccasionCardList />
        <HorizontalRuleIGM />
      </>
    ),
  },
  {
    key: "trending",
    render: () => (
      <>
        <TrendingProducts products={products} />
        <HorizontalRuleIGM />
      </>
    ),
  },
  {
    key: "gifting",
    render: () => (
      <GiftingCard showExploreButton={true} imgUrl={GIFTING_BANNER_URL} />
    ),
  },
  { key: "trustBarBottom", render: () => <TrustBar /> },
  { key: "callUs", render: () => <CallUsComponent /> },
];

const renderSection = ({ item }: { item: HomeSection }) => <>{item.render()}</>;

const keyExtractor = (section: HomeSection) => section.key;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { data: products = [] } = useGetProductsQuery({});
  const [pincode, setPincode] = useState<string | null>(null);

  const sections = useMemo(() => buildSections(products), [products]);

  useEffect(() => {
    (async () => {
      const pin = await getUserPincode();
      setPincode(pin || "Mumbai 400 999");
    })();
  }, []);

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
        () => true,
      );
      return () => backHandler.remove();
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        <HapticButton style={styles.deliveryButton} activeOpacity={0.7}>
          <Text style={styles.deliveryText}>
            <Text style={styles.deliveryStrong}>Deliver</Text> to{" "}
            {pincode || "Fetching..."}
          </Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
        </HapticButton>

        <HeaderRowClassic />
      </View>

      <FlatList
        style={styles.container}
        data={sections}
        keyExtractor={keyExtractor}
        renderItem={renderSection}
        ListHeaderComponent={HomeAiSearch}
        showsVerticalScrollIndicator={false}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
      />

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, backgroundColor: "white" },
  AiContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  header: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  deliveryButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deliveryStrong: {
    fontWeight: "700",
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
    backgroundColor: "white",
    height: 50,
    borderRadius: 15, // More rectangular than before
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
    // Subtle shadow
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  inputText: {
    flex: 1,
    fontSize: 18,
    color: "#1A3B4A",
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
