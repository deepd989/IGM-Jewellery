import BespokeSection from "@/components/bespokeSection";
import BottomNavBar from "@/components/bottomNavBar";
import CommunityCarousel from "@/components/communityCarousel";
import EventCard from "@/components/eventCard";
import GiftFinder from "@/components/giftFinder";
import GiftingCard from "@/components/giftingCard";
import HorizontalRuleIGM from "@/components/horizontalRuleIGM";
import OccasionCardList from "@/components/occasionsHome";
import SearchBar from "@/components/searchBar";
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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth/authContext";
import AnnouncementSection from "../components/announcementSectionHome";
import CallUsComponent from "../components/basic components/callUsComponent";
import { HapticButton } from "../components/basic components/hapticButton";
import BrandsHorizontalScroll from "../components/brandsHorizontalScroll";
import CategoriesHorizontalScroll from "../components/categoriesHorizontallScroll";
import HowItLooksWrapper from "../components/homePageCard";
import LatestCollections from "../components/latestCollections";
import { SectionHeader } from "../components/section";
import BrandCollectionCards from "../components/shopByCollectionsNew";
import ShopByRegionCards from "../components/shopByRegion";
import { TrendingProducts } from "../components/TrendingProducts";
import TrustBar from "../components/trustBarBanner";
import { COLORS } from "../constants/theme";
import { useWalletBalance } from "./customHooks/walletBalanceLoader";

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
  const { userId } = useAuth();
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
    router.push({
      pathname: "/exploreAi",
      params: { value: textInput },
    });
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
        () => true,
      );
      return () => backHandler.remove();
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        <Text style={styles.deliveryText}>
          Deliver to{" "}
          <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
            {pincode || "Fetching..."}
          </Text>
        </Text>
        {/* Wallet balance pill hidden for now */}
      </View>
      <SearchBar />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.AiContainer}>
          <View style={(styles.centerBox, styles.viewElanziaIsListening)}>
            <View style={styles.badgeContainer}>
              <View style={styles.aiBadge}>
                <Sparkles size={16} color="#FFF" fill="#FFF" />
                <Text style={styles.aiBadgeText}>Ai powered</Text>
              </View>
            </View>

            {/* 2. Main Title */}
            <Text style={styles.mainTitle}>
              Tell us what you are looking for
            </Text>

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
                  onChangeText={(text) => setTextInput(text)}
                />
                {/* {!textInput && (
                  <Animated.Text
                    style={[
                      styles.inputText,
                      {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        textAlignVertical: "center",
                        color: "#FFFFFF",
                        opacity: fadeAnim,
                      },
                    ]}
                    pointerEvents="none"
                  >
                    {revolvingTexts[placeholderIndex]}
                  </Animated.Text>
                )} */}
              </View>
              <View style={styles.iconGroup}>
                <HapticButton
                  onPress={() => {
                    router.push({
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
        <AnnouncementSection />
        <HorizontalRuleIGM />
        <ShopByRegionCards />
        <HorizontalRuleIGM />
        <BrandCollectionCards />
        <HorizontalRuleIGM />
        <CategoriesHorizontalScroll />
        <TrustBar />
        <BrandsHorizontalScroll />
        <HorizontalRuleIGM />
        <TopPicks products={products} />
        <HorizontalRuleIGM />
        <>
          <SectionHeader value="Explore AI Try On"></SectionHeader>
          <HowItLooksWrapper seeHowItLooks={true}></HowItLooksWrapper>
        </>
        {/* <HorizontalRuleIGM /> */}
        <GiftFinder />

        <OccasionCardList />
        <HorizontalRuleIGM />
        <TrendingProducts products={products} />
        <HorizontalRuleIGM />
        <LatestCollections />
        {/* <HorizontalRuleIGM /> */}

        {/* <HorizontalRuleIGM /> */}
        {/* <TryAtHomeCard /> */}
        <GiftingCard
          showExploreButton={true}
          imgUrl="https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Gifting%20Banner%2FGifting_banner-05.webp?alt=media&token=5b1e9a31-d5c7-47ee-bf47-8abcca8b5475"
        />
        <HorizontalRuleIGM />
        <>
          <SectionHeader value="Trending Products"></SectionHeader>
          <HowItLooksWrapper seeHowItLooks={false}></HowItLooksWrapper>
        </>
        <HorizontalRuleIGM />
        <CommunityCarousel />

        {/* <BestSellersSection /> */}
        <HorizontalRuleIGM />
        <BespokeSection />
        <HorizontalRuleIGM />
        <EventCard />
        <TrustBar />
        <CallUsComponent></CallUsComponent>

        {/* Necklace Section */}
      </ScrollView>
      <BottomNavBar></BottomNavBar>
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
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    paddingHorizontal: 20,
    marginBottom: 5,
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
