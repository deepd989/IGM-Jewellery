import BespokeSection from "@/components/bespokeSection";
import BestSellersSection from "@/components/bestSellers";
import BottomNavBar from "@/components/bottomNavBar";
import BrandGridTileView from "@/components/brandGrid";
import CommunityCarousel from "@/components/communityCarousel";
import EventCard from "@/components/eventCard";
import GiftFinder from "@/components/giftFinder";
import GiftingCard from "@/components/giftingCard";
import HashtagComponent from "@/components/hashtagComponent";
import HorizontalRuleIGM from "@/components/horizontalRuleIGM";
import OccasionCardList from "@/components/occaisionsHome";
import PaymentMethods from "@/components/paymentMethods";
import SearchBar from "@/components/searchBar";
import { TopPicks } from "@/components/topPicks";
import { getUserPincode } from "@/scripts/location";
import { useGetProductsQuery } from "@/store/apis/product";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnnouncementSection from "../components/announcementSectionHome";
import { HapticButton } from "../components/basic components/hapticButton";
import BrandsHorizontalScroll from "../components/brandsHorizontalScroll";
import CategoriesHorizontalScroll from "../components/categoriesHorizontallScroll";
import HomePageCard from "../components/homePageCard";
import BrandCollectionCards from "../components/shopByCollectionsNew";
import TrustBar from "../components/trustBarBanner";
import { COLORS } from "../constants/theme";

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
        () => true
      );
      return () => backHandler.remove();
    }, [])
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
      </View>
      <SearchBar />
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={["#EDF6F8", "#C2E2EA"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.container}
        >
          <View style={(styles.centerBox, styles.viewZeywarIsListening)}>
            <View style={styles.badgeContainer}>
              <View style={styles.aiBadge}>
                <Sparkles size={16} color="#FFF" fill="#FFF" />
                <Text style={styles.aiBadgeText}>Ai powered</Text>
              </View>
            </View>

            {/* 2. Main Title */}
            <Text style={styles.mainTitle}>
              What sparkle are we looking for today?
            </Text>

            {/* 3. Enhanced Search Bar */}
            <View style={styles.searchBox}>
              <TextInput
                placeholder="Zeywar Ai is listening"
                placeholderTextColor="#1A3B4A"
                style={styles.inputText}
                value={textInput}
                returnKeyType="send" // or "done", "go", "search"
                onSubmitEditing={handleSubmit}
                onChangeText={(text) => setTextInput(text)}
              />
              <View style={styles.iconGroup}>
                <HapticButton
                  onPress={() => {
                    router.push({
                      pathname: "/exploreAi",
                      params: { mode: "voice" },
                    });
                  }}
                >
                  <Ionicons name="mic-outline" size={22} />
                </HapticButton>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
            >
              {[
                {
                  name: "Necklace",
                  img: require("../assets/images/dummyImages/dummyNecklace.png"),
                },
                {
                  name: "Bracelets",
                  img: require("../assets/images/dummyImages/dummyBracelete.png"),
                },
                {
                  name: "Earrings",
                  img: require("../assets/images/dummyImages/dummyEarring.png"),
                },
                {
                  name: "Rings",
                  img: require("../assets/images/dummyImages/dummyRing.png"),
                },
                {
                  name: "Diamonds",
                  img: require("../assets/images/dummyImages/dummyDiamond.png"),
                },
              ].map((item, index) => (
                <View key={index} style={styles.cardWrapper}>
                  <View style={styles.imageCard}>
                    <Image
                      source={item.img}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.cardLabel}>{item.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </LinearGradient>
        <AnnouncementSection />
        <HorizontalRuleIGM />
        <BrandCollectionCards />
        <HorizontalRuleIGM />
        <CategoriesHorizontalScroll />
        <TrustBar />
        <BrandsHorizontalScroll />
        <HorizontalRuleIGM />
        <TopPicks products={products} />
        <HorizontalRuleIGM />
        <HomePageCard />
        <HorizontalRuleIGM />
        <BrandGridTileView />
        <HorizontalRuleIGM />
        <GiftFinder />
        <HorizontalRuleIGM />
        <OccasionCardList />
        {/* <HorizontalRuleIGM /> */}
        {/* <TryAtHomeCard /> */}
        <HorizontalRuleIGM />
        <GiftingCard showExploreButton={true} />
        <HorizontalRuleIGM />
        <BestSellersSection />
        <HorizontalRuleIGM />
        <CommunityCarousel />
        <HorizontalRuleIGM />
        <BespokeSection />
        <HorizontalRuleIGM />
        <EventCard />
        <HorizontalRuleIGM />
        <HashtagComponent />
        <HorizontalRuleIGM />
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>
            For any queries, feel free to contact us:
          </Text>
          <View style={styles.contactRow}>
            <HapticButton style={styles.contactBtn}>
              <Ionicons name="call-outline" size={20} />
              <Text style={styles.contactBtnText}>Call Us</Text>
            </HapticButton>
            <HapticButton style={styles.contactBtn}>
              <Ionicons name="chatbubble-outline" size={20} />
              <Text style={styles.contactBtnText}>Chat With Us</Text>
            </HapticButton>
          </View>
        </View>
        <PaymentMethods />

        {/* Necklace Section */}
      </ScrollView>
      <BottomNavBar></BottomNavBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, backgroundColor: "white" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  viewZeywarIsListening: {
    padding: 16,
    borderRadius: 12,
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
  contactSection: { alignItems: "center", padding: 16 },
  contactTitle: { fontSize: 13, color: "#333", marginBottom: 20 },
  contactRow: { flexDirection: "row", gap: 12 },
  contactBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    minWidth: 150,
    backgroundColor: "#FFF",
  },
  contactBtnText: { marginLeft: 8, fontWeight: "600" },
  badgeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  aiBadge: {
    flexDirection: "row",
    backgroundColor: "#1A3B4A", // Dark navy/teal
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    gap: 6,
  },
  aiBadgeText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A3B4A",
    textAlign: "center",
    marginBottom: 30,
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    height: 70,
    borderRadius: 12, // More rectangular than before
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 30,
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
