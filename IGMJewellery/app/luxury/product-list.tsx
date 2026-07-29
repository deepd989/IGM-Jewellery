import { HapticButton } from "@/components/basic components/hapticButton";
import { CartBadge } from "@/components/cart/CardBadge";
import { COLORS } from "@/constants/theme";
import { useProductListing } from "@/hooks/useProductListing";
import { Product } from "@/interfaces/product.interface";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LuxuryExploreAiCard from "./components/luxuryExploreAiCard";
import LuxuryFilterModal from "./components/luxuryFilterModal";
import LuxuryProductCard from "./components/luxuryProductCard";
import LuxuryScreenHeader from "./components/luxuryScreenHeader";
import LuxurySortModal from "./components/luxurySortModal";
import LuxuryWishlistButton from "./components/luxuryWishlistButton";

const SIDE_PADDING = 16;
const CARD_GAP = 12;
/** Height of the row itself, before the bar adds its safe-area padding. */
const BOTTOM_BAR_HEIGHT = 52;

/** Backdrop behind the grid, blurred so the cards stay legible over it. */
const BACKDROP_BLUR = 22;

/** Magnifier with a sparkle — the app's mark for AI-assisted search. */
const SearchGlyph = () => (
  <View>
    <Ionicons name="search" size={21} color={COLORS.primary} />
    <Ionicons
      name="sparkles"
      size={9}
      color={COLORS.primary}
      style={styles.searchSparkle}
    />
  </View>
);

/**
 * The luxury storefront's product listing. Reads exactly the same navigation
 * params, filters and sorting as app/product-list.tsx — both render from
 * useProductListing — over the category's own artwork.
 */
export default function LuxuryProductListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isSortVisible, setIsSortVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const {
    products,
    isLoading,
    isError,
    error,
    refetch,
    activeFilters,
    activeFilterCount,
    activeFilterTags,
    removeFilterValue,
    applyFilters,
    clearFilters,
    selectedSort,
    setSelectedSort,
    pageTitle,
    bannerImageUrl,
  } = useProductListing();

  const handleProductPress = (product: Product) => {
    router.navigate({
      pathname: "/luxury/product/[id]",
      params: { id: product.id },
    });
  };

  const headerActions = (
    <View style={styles.actionPill}>
      <HapticButton
        style={styles.actionIcon}
        activeOpacity={0.6}
        onPress={() => router.navigate("/searchPage")}
      >
        <SearchGlyph />
      </HapticButton>

      <LuxuryWishlistButton size={22} style={styles.actionIcon} />

      <View style={styles.actionIcon}>
        <CartBadge iconSize={22} iconColor={COLORS.primary} />
      </View>
    </View>
  );

  /**
   * The filters actually in play, each removable — the same set the classic
   * listing shows above its grid, rather than a fixed row of labels.
   */
  const renderChips = () => {
    if (activeFilterTags.length === 0) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}
      >
        {activeFilterTags.map((tag, index) => (
          <View key={`${tag}-${index}`} style={styles.chip}>
            <Text style={styles.chipText}>{tag}</Text>

            <HapticButton
              style={styles.chipClose}
              activeOpacity={0.7}
              onPress={() => removeFilterValue(tag)}
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </HapticButton>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.stateText}>Loading products…</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={48} color="#FFFFFF" />
          <Text style={styles.stateText}>Failed to load products</Text>
          <Text style={styles.stateSubtext}>{error?.toString()}</Text>
          <HapticButton style={styles.stateButton} onPress={() => refetch()}>
            <Text style={styles.stateButtonText}>Retry</Text>
          </HapticButton>
        </View>
      );
    }

    if (products.length === 0) {
      return (
        <View style={styles.centerContent}>
          <Ionicons name="search-outline" size={56} color="#FFFFFF" />
          <Text style={styles.stateText}>No products found</Text>
          <Text style={styles.stateSubtext}>
            Try adjusting your filters or browse different categories
          </Text>
          {activeFilterCount > 0 && (
            <HapticButton style={styles.stateButton} onPress={clearFilters}>
              <Text style={styles.stateButtonText}>Clear Filters</Text>
            </HapticButton>
          )}
        </View>
      );
    }

    return (
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.gridRow}
        // The bar is a sibling below the grid rather than an overlay, so the
        // list only needs a little room at its end.
        contentContainerStyle={styles.gridContent}
        ListFooterComponent={
          <LuxuryExploreAiCard
            imageUri={products[0]?.thumbnailUrls?.[0]}
            titleColor="#FFFFFF"
          />
        }
        renderItem={({ item }) => (
          <LuxuryProductCard
            product={item}
            style={styles.card}
            onPress={handleProductPress}
          />
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      {!!bannerImageUrl && (
        <Image
          source={{ uri: decodeURIComponent(bannerImageUrl) }}
          style={styles.backdrop}
          resizeMode="cover"
          blurRadius={BACKDROP_BLUR}
        />
      )}
      <View style={styles.backdropScrim} pointerEvents="none" />

      <LuxuryScreenHeader
        title={pageTitle}
        showBack
        variant="glass"
        right={headerActions}
      />

      {renderChips()}

      <View style={styles.body}>{renderBody()}</View>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <HapticButton
          style={styles.bottomBarItem}
          onPress={() => router.navigate("/luxury/categories")}
        >
          <Ionicons name="grid-outline" size={18} color="#FFFFFF" />
          <Text style={styles.bottomBarText}>CATEGORIES</Text>
        </HapticButton>

        <View style={styles.bottomBarDivider} />

        <HapticButton
          style={styles.bottomBarItem}
          onPress={() => setIsSortVisible(true)}
        >
          <Ionicons name="swap-vertical" size={18} color="#FFFFFF" />
          <Text style={styles.bottomBarText}>SORT</Text>
        </HapticButton>

        <View style={styles.bottomBarDivider} />

        <HapticButton
          style={styles.bottomBarItem}
          onPress={() => setIsFilterVisible(true)}
        >
          <Ionicons name="options-outline" size={18} color="#FFFFFF" />
          <Text style={styles.bottomBarText}>FILTER</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </HapticButton>
      </View>

      <LuxurySortModal
        visible={isSortVisible}
        onClose={() => setIsSortVisible(false)}
        selectedSort={selectedSort}
        onSelect={setSelectedSort}
      />

      <LuxuryFilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={applyFilters}
        initialFilters={activeFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1A1F",
  },
  backdrop: StyleSheet.absoluteFillObject,
  backdropScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 22, 26, 0.45)",
  },

  // ── Header actions ──
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    shadowColor: "#052A33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  actionIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  searchSparkle: {
    position: "absolute",
    top: -2,
    right: -4,
  },

  // ── Chips ──
  // A horizontal ScrollView is flexGrow: 1 by default, so in this column it
  // would claim half the free height and push the grid down the screen.
  chipScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  chipRow: {
    gap: 8,
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: 14,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 34,
    paddingLeft: 16,
    paddingRight: 10,
    borderRadius: 17,
    backgroundColor: "rgba(9, 32, 38, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  chipText: {
    fontSize: 14,
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  chipClose: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Grid ──
  body: {
    flex: 1,
  },
  gridContent: {
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: 16,
  },
  gridRow: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  card: {
    flex: 1,
    padding: 10,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.92)",
  },

  // ── States ──
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  stateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  stateSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
  },
  stateButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
  },
  stateButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // ── Bottom bar ──
  // No fixed height here: RN counts padding inside a height, so the safe-area
  // inset would eat into the row and crop it. The row sets its own height and
  // the padding adds to it.
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    backgroundColor: "#08222A",
  },
  bottomBarItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: BOTTOM_BAR_HEIGHT,
  },
  bottomBarText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
  bottomBarDivider: {
    width: 1,
    height: 22,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  filterBadge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8C391",
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#04333E",
  },
});
