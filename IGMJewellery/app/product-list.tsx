import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CartBadge } from "@/components/cart/CardBadge";
import { FilterModal } from "@/components/products/FilterModal";
import { ProductCard } from "@/components/products/ProductCard";
import { SortModal } from "@/components/products/SortModal";
import { useProductListing } from "@/hooks/useProductListing";
import { Product } from "@/interfaces/product.interface";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../components/basic components/hapticButton";
import { COLORS, SPACING } from "../constants/theme";
import { useLuxury } from "../context/luxuryContext";
import { useGetWishlistQuery } from "../store/apis/wishlist";
import LuxuryProductListScreen from "./luxury/product-list";

type ListingScreenProps = {
  filters?: Record<string, string[]>;
};

// const FILTER_CHIPS = ["All", "Latest", "Best Sellers", "Store Pick-up"];
const FILTER_CHIPS = ["All", "Latest", "Best Sellers"];
const MENU_ITEMS = [
  { key: "Bespoke Jewellery", path: "/bespoke" },
  { key: "Our Brands", path: "/brands" },
  { key: "Call an expert", path: "/underDev" },
  { key: "Chat with Sonar", path: "/exploreAi" },
];

// Map category / product type to Ionicons icon names
const CATEGORY_ICON_MAP: Record<string, string> = {
  earring: "ear-outline",
  earrings: "ear-outline",
  ring: "ellipse-outline",
  rings: "ellipse-outline",
  necklace: "ribbon-outline",
  necklaces: "ribbon-outline",
  pendant: "diamond-outline",
  pendants: "diamond-outline",
  bracelet: "infinite-outline",
  bracelets: "infinite-outline",
  bangle: "radio-button-off-outline",
  bangles: "radio-button-off-outline",
  mangalsutra: "link-outline",
  chain: "link-outline",
  chains: "link-outline",
  anklet: "footsteps-outline",
  anklets: "footsteps-outline",
  wedding: "heart-outline",
  gift: "gift-outline",
  gold: "sunny-outline",
  diamond: "diamond-outline",
};

/**
 * Both storefronts share this route, so every existing link to the listing
 * lands on the presentation the shopper is currently browsing in. The luxury
 * listing also keeps its own route for direct links.
 */
export default function ListingScreen({ filters }: ListingScreenProps) {
  const { isLuxury } = useLuxury();

  return isLuxury ? (
    <LuxuryProductListScreen />
  ) : (
    <ClassicListingScreen filters={filters} />
  );
}

function ClassicListingScreen({ filters }: ListingScreenProps) {
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSortVisible, setIsSortVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Params, filters, sorting and the product query all live in the shared hook,
  // so this screen and the luxury one can never read a link differently.
  const {
    products,
    isLoading: areProductsLoading,
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
    selectedChip: selectedFilter,
    bannerImageUrl: BANNER_IMAGE,
  } = useProductListing(filters);

  // Get wishlist data for header heart icon
  const { data: wishlistData } = useGetWishlistQuery();
  const wishlistCount = wishlistData?.items.length || 0;

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  const handleCategoriesPress = () => {
    router.navigate("/(tabs)/categories");
  };

  const handleProductPress = (product: Product) => {
    router.navigate({
      pathname: "/product/[id]",
      params: { id: product.id },
    });
  };


  const renderHeader = () => (
    <View>
      {/* Page Header with back + actions */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <HapticButton onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </HapticButton>
          {/* <Text style={styles.headerTitle}>Explore</Text> */}
        </View>

        <View style={styles.headerActions}>
          <HapticButton
            style={styles.iconBtn}
            onPress={() => router.navigate("/searchPage")}
          >
            <Ionicons name="search-outline" size={24} color={COLORS.text} />
          </HapticButton>

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
            <CartBadge iconSize={24} iconColor={COLORS.text} />
          </View>
        </View>
      </View>

      {/* Banner & Category Icon */}
      <ImageBackground
        source={
          BANNER_IMAGE
            ? { uri: BANNER_IMAGE }
            : require("@/assets/images/product_list_banner.png")
        }
        style={styles.bannerBackground}
        imageStyle={styles.bannerImage}
      >
        <View style={styles.bannerOverlay} />
      </ImageBackground>
      {/* <Text style={styles.pageTitle}>{getPageTitle()}</Text> */}

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      ></ScrollView>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <View style={styles.activeFiltersContainer}>
          {/* <View style={styles.activeFiltersBar}>
            <HapticButton onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </HapticButton>
          </View> */}

          {/* FILTER CHIPS THIS SHOULD BE INVISIBLE FOR DEMO*/}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterTagsContainer}
          >
            {activeFilterTags.map((tag, index) => (
              <View key={index} style={styles.filterTag}>
                <Text style={styles.filterTagText}>{tag}</Text>
                <HapticButton
                  onPress={() => removeFilterValue(tag)}
                  style={styles.filterTagClose}
                >
                  <Ionicons
                    name="close"
                    size={14}
                    color={COLORS.primaryLight}
                  />
                </HapticButton>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  //intially isLoadingFInished false
  // if (!isLoadingVideoFinished || areProductsLoading) {
  //   return (
  //     <View style={[styles.container, { flex: 1, backgroundColor: "#000" }]}>
  //       <Video
  //         source={require("../assets/loaderVideo.mp4")}
  //         style={StyleSheet.absoluteFill}
  //         resizeMode={ResizeMode.COVER}
  //         shouldPlay
  //         rate={2.0}
  //         isLooping={true}
  //         isMuted={true}
  //         volume={1.0}
  //         onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
  //       />
  //     </View>
  //   );
  // }

  if (areProductsLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { flex: 1, backgroundColor: "white" }]}
      >
        <View style={styles.centerContent}>
          <Ionicons name="hourglass-outline" size={48} color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }
  // Error state
  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={COLORS.error}
          />
          <Text style={styles.errorText}>Failed to load products</Text>
          <Text style={styles.errorSubtext}>{error?.toString()}</Text>
          <HapticButton style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </HapticButton>
        </View>
      </SafeAreaView>
    );
  }

  // Empty state (after filtering)
  if (products.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.centerContent}>
          <Ionicons
            name="search-outline"
            size={64}
            color={COLORS.textSecondary}
          />
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your filters or browse different categories
          </Text>
          {(activeFilterCount > 0 || selectedFilter !== "All") && (
            <HapticButton
              style={styles.clearButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </HapticButton>
          )}
          <HapticButton
            style={[styles.clearButton, { marginTop: SPACING.m }]}
            onPress={handleCategoriesPress}
          >
            <Text style={styles.clearButtonText}>Browse Categories</Text>
          </HapticButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        key={viewMode}
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === "grid" ? 2 : 1}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            viewMode={viewMode}
            onPress={handleProductPress}
          />
        )}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={
          viewMode === "grid" ? styles.columnWrapper : undefined
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Left: View Toggle */}
      {/* <HapticButton style={styles.leftFab} onPress={toggleViewMode}>
        <Ionicons
          name={viewMode === "grid" ? "list" : "grid"}
          size={22}
          color="#053844"
        />
      </HapticButton> */}

      {/* Right: Support Menu */}
      {!isMenuOpen ? (
        <HapticButton
          style={styles.closeFab}
          onPress={() => setIsMenuOpen(true)}
        >
          <Ionicons name="sparkles" size={22} />
        </HapticButton>
      ) : (
        <HapticButton
          style={styles.closeFab}
          onPress={() => setIsMenuOpen(false)}
        >
          <Ionicons name="close" size={24} color="#053844" />
        </HapticButton>
      )}

      {/* Menu Popup */}
      {isMenuOpen && (
        <View style={styles.menuPopup}>
          {MENU_ITEMS.map((item, index) => (
            <HapticButton
              key={index}
              style={styles.menuItem}
              onPress={() => {
                setIsMenuOpen(false);
                router.navigate(item.path as string);
              }}
            >
              <Text style={styles.menuItemText}>{item.key}</Text>
            </HapticButton>
          ))}
        </View>
      )}

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <HapticButton
          style={styles.bottomBarItem}
          onPress={handleCategoriesPress}
        >
          <Ionicons
            name="grid-outline"
            size={18}
            color="#FFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.bottomBarText}>CATEGORIES</Text>
        </HapticButton>

        <View style={styles.bottomBarDivider} />

        <HapticButton
          style={styles.bottomBarItem}
          onPress={() => setIsSortVisible(true)}
        >
          <Ionicons
            name="swap-vertical"
            size={18}
            color="#FFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.bottomBarText}>SORT</Text>
          {selectedSort !== "Latest" && <View style={styles.activeDot} />}
        </HapticButton>

        <View style={styles.bottomBarDivider} />

        <HapticButton
          style={styles.bottomBarItem}
          onPress={() => setIsFilterVisible(true)}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color="#FFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.bottomBarText}>FILTER</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </HapticButton>
      </View>

      {isMenuOpen && (
        <Pressable
          style={styles.dimOverlay}
          onPress={() => setIsMenuOpen(false)}
        />
      )}

      <SortModal
        visible={isSortVisible}
        onClose={() => setIsSortVisible(false)}
        selectedSort={selectedSort}
        onSelect={setSelectedSort}
      />
      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={applyFilters}
        initialFilters={activeFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 0,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.l,
  },
  loadingText: {
    marginTop: SPACING.m,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    marginTop: SPACING.m,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  errorSubtext: {
    marginTop: SPACING.s,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    marginTop: SPACING.l,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    marginTop: SPACING.m,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  emptySubtext: {
    marginTop: SPACING.s,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  clearButton: {
    marginTop: SPACING.l,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.s,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginLeft: SPACING.m,
  },

  // Banner & category icon
  bannerBackground: {
    width: "100%",
    height: 180,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10, // half of icon circle overflows below
  },
  bannerImage: {
    borderRadius: 20,
    paddingTop: 15,
  },
  // bannerOverlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "rgba(0,0,0,0.15)",
  // },
  categoryIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EDF6F8",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -32, // half overlaps the banner
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.m,
  },
  filterContainer: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  activeFiltersContainer: {
    borderColor: "#E5E5EA",
    marginBottom: SPACING.s,
  },
  activeFiltersBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  activeFiltersText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },
  clearFiltersText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  filterTagsContainer: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.s,
  },
  filterTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  filterTagText: {
    fontSize: 12,
    color: COLORS.primaryLight,
    marginRight: 6,
  },
  filterTagClose: {
    padding: 2,
    color: COLORS.primaryLight,
  },
  listContent: {
    paddingHorizontal: SPACING.m,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftFab: {
    position: "absolute",
    bottom: 120,
    left: SPACING.m,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  closeFab: {
    position: "absolute",
    bottom: 120,
    right: SPACING.m,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
  menuPopup: {
    position: "absolute",
    bottom: 140,
    right: SPACING.m,
    width: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: SPACING.s,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 20,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.m,
  },
  menuItemText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
    textAlign: "right",
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 15,
  },
  bottomBar: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    zIndex: 10,
  },
  bottomBarItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bottomBarText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  bottomBarDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  activeDot: {
    position: "absolute",
    top: -4,
    right: "30%",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFD700",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: "25%",
    backgroundColor: "#FFD700",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "700",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});
