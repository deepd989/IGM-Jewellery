import { Brand } from "@/store/apis/brandsApi";
import { useStorefrontBrands } from "@/hooks/useStorefrontBrands";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../basic components/hapticButton";

const SPACING = 16;
const CARD_GAP = 12;

/**
 * Cards in view at once: one brand fills the row, so the row reads as a pager
 * rather than as a shelf. Nothing peeks in from the edge to say it scrolls, so
 * the snap does that job — a card is always parked square in the row, and a
 * swipe moves exactly one.
 */
const CARDS_PER_VIEW = 1;
/**
 * Tile height as a share of its width: 16:9, so the card reads landscape
 * rather than as the near-square it was when three sat side by side.
 */
const TILE_RATIO = 9 / 16;

const BrandCard = ({ brand, width }: { brand: Brand; width: number }) => {
  const router = useRouter();
  return (
    <HapticButton
      style={[
        styles.cardContainer,
        { width, height: Math.round(width * TILE_RATIO) },
      ]}
      onPress={() => {
        router.navigate(`/brandProfile/${brand.businessNameKey}`);
      }}
    >
      <Image
        source={{ uri: brand?.profileImageUri }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      {/* Optional: Add business name text under image if desired */}
      {/* <Text numberOfLines={1} style={styles.brandNameText}>{brand.businessName}</Text> */}
    </HapticButton>
  );
};

export const BrandCarousel = ({ data }: { data: Brand[] }) => {
  const [rowWidth, setRowWidth] = useState(0);

  /**
   * Measured from the row itself rather than from `Dimensions.get("window")`.
   * The window and the row disagree on split screen, on foldables and after a
   * rotation, and a card sized for the window overflows the row by a hair —
   * enough to leave the snap offsets disagreeing with where the cards actually
   * sit, which parks the row between two cards.
   *
   * Rounding down keeps the card plus its gap inside the interval the row
   * snaps by, so those two can never drift apart.
   *
   * At one card per view this is just the row's own width — the subtraction is
   * left general so the row can be widened back out to several cards by the
   * constant alone.
   */
  const cardWidth = useMemo(() => {
    if (!rowWidth) return 0;
    const available = rowWidth - CARD_GAP * (CARDS_PER_VIEW - 1);
    return Math.floor(available / CARDS_PER_VIEW);
  }, [rowWidth]);

  /**
   * The gutter rides in the interval rather than in the card, so a card fills
   * the row exactly and the gap is only ever seen mid-swipe. It is also why
   * this snaps by interval instead of `pagingEnabled`: paging steps by the
   * viewport, which is a gap short of where each card actually starts, and the
   * two drift further apart with every card.
   */
  const snapInterval = cardWidth + CARD_GAP;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setRowWidth((current) => (current === width ? current : width));
  };

  return (
    <View onLayout={handleLayout}>
      {/* Held back until the width is known, so the row lays out once: sizing
          cards against a guessed width and re-measuring leaves getItemLayout's
          offsets disagreeing with the real ones. */}
      {cardWidth > 0 && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id || item.businessName}
          renderItem={({ item }) => (
            <BrandCard brand={item} width={cardWidth} />
          )}
          // Cards are sized from the measured row, so they have to re-render
          // when it changes.
          extraData={cardWidth}
          horizontal
          showsHorizontalScrollIndicator={false}
          // Settles on a card rather than between two.
          snapToInterval={snapInterval}
          snapToAlignment="start"
          disableIntervalMomentum // Never fling past a single card
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContent}
          // Only the cards near the viewport are mounted, so a brand scrolled
          // past holds no decoded artwork. Held tighter than a shelf of small
          // tiles would be: each card is now a full row of artwork.
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={5}
          getItemLayout={(_, index) => ({
            length: snapInterval,
            offset: snapInterval * index,
            index,
          })}
        />
      )}
    </View>
  );
};

export const BrandSection = ({
  title,
  data,
}: {
  title: string;
  data: Brand[];
}) => {
  if (data.length === 0) return null; // Hide section if no results match

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <BrandCarousel data={data} />
    </View>
  );
};

export default function BrandList() {
  const router = useRouter();
  const { data: brandsData = [], isLoading } = useStorefrontBrands({});

  // State for search
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered Data based on businessName
  const filteredBrands = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return brandsData;

    return brandsData.filter((brand) =>
      brand.businessName?.toLowerCase().includes(query)
    );
  }, [searchQuery, brandsData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <HapticButton style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft color="#053844" size={24} />
        </HapticButton>
        <Text style={styles.headerTitle}>Brands</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color="#053844"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search by business name"
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <HapticButton onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#ccc" />
              </HapticButton>
            )}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredBrands.length > 0 ? (
            <>
              <BrandSection title="All Brands" data={filteredBrands} />
              {/* <BrandSection
                title="Ethnic Jewellery Brands"
                data={filteredBrands}
              />
              <BrandSection
                title="Modern Jewellery Brands"
                data={filteredBrands}
              /> */}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={50} color="#eee" />
              <Text style={styles.emptyText}>
                No brands found matching "{searchQuery}"
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 60,
  },
  backButton: {
    padding: 8,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  searchContainer: {
    paddingHorizontal: SPACING,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#053844",
  },
  sectionContainer: {
    marginBottom: 25,
    paddingHorizontal: SPACING,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#053844",
    marginRight: 2,
  },
  carouselContent: {
    gap: CARD_GAP,
  },
  cardContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
    fontSize: 14,
  },
});
