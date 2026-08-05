import { getUserPincode } from "@/scripts/location";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  BackHandler,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../../components/basic components/hapticButton";
import ShopByRegionCards from "../../components/shopByRegion";
import { LUXURY_COLORS, LUXURY_SPACING } from "../../constants/theme";
import { useLuxury } from "../../context/luxuryContext";
import GlossyHorizontalCard from "./components/luxuryHomepageGlossyCard";
import LuxuryBestSellers from "./components/luxuryBestSellers";
import LuxuryBrandsCollection from "./components/luxuryBrandsCollectionComponent";
import LuxuryCategories from "./components/luxuryCategoriesComponent";
import LuxuryCommunityCarousel from "./components/luxuryCommunityCarousel";
import LuxuryElanziaAllRights from "./components/luxuryElanziaAllRights";
import LuxuryElanziaSearch from "./components/luxuryElanziaSearch";
import LuxuryMultibrandCollection from "./components/luxuryMultibrandCollection";
import LuxuryNavBar from "./components/luxuryNavBar";
import LuxurySeparator from "./components/luxurySeparator";
import LuxurySwipeAndShop from "./components/luxurySwipeAndShop";
import LuxuryTopSearch from "./components/luxuryTopSearch";
import LuxuryTrustBadges from "./components/luxuryTrustBadges";
import LuxuryTryOn from "./components/luxuryTryOn";
import OutfitTypesCarousel from "./components/outfitTypesCarousel";

/**
 * Only the sections the storefront actually renders are imported. The ones
 * commented out of SECTIONS below need their import added back with them —
 * Metro does not tree-shake, so an import that is only mentioned in a comment
 * still runs that module, and every one of its own imports, before this screen
 * can paint.
 */

/** Hero carousel height: tall enough to lead the page, short enough that the
 *  collection row below it is visible without scrolling. */
const HERO_HEIGHT = 390;

/** Gutter the page keeps around its sections. */
const PAGE_PADDING = 8;

/** How far the page scrolls before the top bar turns into the search field. */
const SEARCH_COLLAPSE_OFFSET = 40;

/**
 * The one ground the whole storefront sits on. The page used to alternate
 * bands of green, dark green and off-white; it is a single dark ground now, so
 * every section's type is set in LUXURY_COLORS' light ink rather than each
 * section reaching for the ink its own band called for.
 */
const PAGE_BACKGROUND = LUXURY_COLORS.primary;

type StorefrontSection = {
  key: string;
  /**
   * Ends the page on this section's own artwork: no band padding beneath it,
   * and the list adds none after it either. Set on the last section so the
   * storefront finishes exactly where it does.
   */
  flush?: boolean;
  render: () => React.ReactNode;
};

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
    render: () => <GlossyHorizontalCard height={HERO_HEIGHT} />,
  },
  // 2. House of Elanzia Luxe
  // {
  //   key: "collectionCarousel",
  //   render: () => <LuxuryHorizontalCollectionCarousel />,
  // },

  {
    key: "multibrand",
    render: () => <LuxuryMultibrandCollection style={styles.fullBleedSection} />,
  },

  // Not in the design's running order; grounded with the section above it.
  {
    key: "brandsCollection",
    render: () => <LuxuryBrandsCollection />,
  },
  // 3. Brands on Elanzia
  // {
  //   key: "brandsGrid",
  //   render: () => <LuxuryBrandsGrid style={styles.fullBleedSection} />,
  // },
  // 4. Shop by Categories
  {
    key: "tryOn",
    render: () => <LuxuryTryOn style={styles.fullBleedSection} />,
  },
  {
    key: "swipeAndShop",
    render: () => <LuxurySwipeAndShop style={styles.fullBleedSection} />,
  },
  {
    key: "categories",
    render: () => <LuxuryCategories />,
  },
  // Not in the design's running order.

  {
    key: "regional",
    // render: () => <LuxuryRegionalFavorites />,
   
    render: () => (
      <ShopByRegionCards
        primaryColor={PAGE_BACKGROUND}
        secondaryColor={LUXURY_COLORS.text}
      />
    ),
  },
  // 7. Our Best Sellers
  {
    key: "bestSellers",
    render: () => <LuxuryBestSellers />,
  },
  // 8. Try Swipe and Shop
  // 9. Find Something for All
  // {
  //   key: "gender",
  //   render: () => <LuxuryGenderVsProducts />,
  // },
  // 10. Shop for Every You
  {
    key: "outfits",
    // Full bleed: the peeking cards on either side have to run to the screen
    // edges, so the section gives back the page gutter.
    render: () => <OutfitTypesCarousel style={styles.fullBleedSection} />,
  },
  // 11. Top Picks for You
  // {
  //   key: "topPicks",
  //   render: () => <LuxuryTopPicks />,
  // },
  // 12. Not Sure What to Gift
  {
    key: "elanziaSearch",
    render: () => <LuxuryElanziaSearch style={styles.fullBleedSection} />,
  },
  // 13. Regional Favourites
  // 14. New In for You
  // {
  //   key: "newProducts",
  //   render: () => <LuxuryNewProducts />,
  // },
  // 15. Collections You May Like
  // {
  //   key: "collections",
  //   render: () => <LuxuryCollections />,
  // },
  // 16. Selling Fast
  // {
  //   key: "sellingFast",
  //   render: () => <LuxurySellingFast />,
  // },
  // 17. As Seen on You
  {
    key: "community",
    render: () => <LuxuryCommunityCarousel />,
  },
  // The assurances, on the page's own ground rather than over the footer's
  // artwork below them.
  {
    key: "trustBadges",
    render: () => <LuxuryTrustBadges />,
  },
  // 18. Footer
  {
    key: "allRights",
    flush: true,
    render: () => <LuxuryElanziaAllRights style={styles.fullBleedSection} />,
  },
];

/**
 * One section's slot on the page.
 *
 * Memoised on the section object, which is one of SECTIONS' own entries and so
 * keeps its identity for the life of the module. Without this, anything that
 * re-renders the screen — the top bar collapsing, the pincode arriving — walks
 * back through `render()` for every mounted section, and a mounted section is a
 * whole carousel with its own list and players.
 */
const SectionRow = memo(function SectionRow({
  section,
}: {
  section: StorefrontSection;
}) {
  return (
    <View
      style={[styles.sectionBand, section.flush && styles.sectionBandFlush]}
    >
      {section.render()}
    </View>
  );
});

const renderSection = ({ item }: { item: StorefrontSection }) => (
  <SectionRow section={item} />
);

/**
 * The page's own search field, above the first section.
 *
 * Its own component because it owns the text being typed. Held on the screen,
 * that state re-rendered the whole storefront on every keystroke; held here,
 * a keystroke stops at this box.
 */
const SearchBox = memo(function SearchBox() {
  const router = useRouter();
  const [textInput, setTextInput] = useState("");

  return (
    <>
      <View style={styles.searchBox}>
        <View style={{ flex: 1 }}>
          <TextInput
            placeholder="Search for ..."
            placeholderTextColor={LUXURY_COLORS.textMuted}
            style={styles.inputText}
            value={textInput}
            returnKeyType="send"
            onSubmitEditing={() =>
              router.navigate({
                pathname: "/exploreAi",
                params: { value: textInput },
              })
            }
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
            <Ionicons
              name="mic-outline"
              size={22}
              color={LUXURY_COLORS.text}
            />
          </HapticButton>
        </View>
      </View>
      {/* Halved: the first band brings the other half of the gap. */}
      <LuxurySeparator size={0.5} />
    </>
  );
});

/**
 * The luxury storefront.
 *
 * Deliberately holds as little state as it can: everything here re-renders the
 * list, so anything only one part of the page cares about belongs to that part.
 * The catalogue is not read here either — the sections that show products query
 * it themselves, and RTK Query serves them all from one request.
 */
export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [pincode, setPincode] = useState<string | null>(null);
  /** Past this, the top bar gives up the delivery line for the search field. */
  const [isScrolled, setIsScrolled] = useState(false);
  const { switchMode } = useLuxury();

  useEffect(() => {
    (async () => {
      const pin = await getUserPincode();
      setPincode(pin || "Mumbai 400 999");
    })();
  }, []);

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
      style={{ flex: 1, backgroundColor: PAGE_BACKGROUND }}
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
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={SECTIONS}
        keyExtractor={(section) => section.key}
        renderItem={renderSection}
        // The component itself rather than an element, so the header is not
        // rebuilt every time the screen re-renders.
        ListHeaderComponent={SearchBox}
        // The storefront is long and every section pulls its own artwork, so
        // only the ones near the viewport are mounted.
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        // Detaches the views of sections scrolled out of the window. Worth a
        // lot here, where a section is a whole carousel — but Android only:
        // on iOS it is known to blank out content in nested scrollers, which
        // is exactly what these sections are.
        removeClippedSubviews={Platform.OS === "android"}
      />
      {/* <BottomNavBar></BottomNavBar> */}
      <LuxuryNavBar/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: PAGE_PADDING,
    paddingTop: PAGE_PADDING,
    // No bottom gutter: it insets the scroller's frame, so it showed as a
    // strip of page under the closing section however far the shopper scrolled.
    backgroundColor: PAGE_BACKGROUND,
  },
  // Cancels the page gutter so a section's artwork runs to the screen edges.
  fullBleedSection: {
    marginHorizontal: -PAGE_PADDING,
    borderRadius: 0,
  },
  /**
   * A section's slot on the page. The page gutter is given back and then
   * re-applied inside, so a fullBleedSection child can cancel that padding
   * again and put its artwork on the screen edges, while everything else
   * stays inset.
   *
   * The band paints no ground of its own — the page's runs through it — so the
   * vertical rhythm lives here rather than in a separator between rows.
   *
   * Half a gap each side, so neighbouring bands meet at a full LUXURY_SPACING.
   * That only holds while the sections themselves carry no vertical padding:
   * back when each painted a ground of its own, its inset read as part of that
   * card, but on one shared ground it simply adds to this. A section that needs
   * space above or below it should be given it here.
   */
  sectionBand: {
    marginHorizontal: -PAGE_PADDING,
    paddingHorizontal: PAGE_PADDING,
    paddingVertical: LUXURY_SPACING / 2,
  },
  /**
   * The closing band keeps its top gap but gives up its bottom one, so the page
   * ends on the section's artwork.
   *
   * The list used to reserve LUXURY_NAV_BAR_HEIGHT + LUXURY_SPACING under it to
   * clear the floating nav pill; that reserve is what the closing section's own
   * trailing artwork now provides, so the pill rides over the artwork rather
   * than over a strip of page.
   */
  sectionBandFlush: {
    paddingBottom: 0,
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
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
});
