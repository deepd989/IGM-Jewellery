import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    ImageBackground,
    Platform,
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
import { Product } from "@/interfaces/product.interface";
import { useGetCategoryHierarchyQuery } from "@/store/apis/categories";
import { useGetProductsQuery } from "@/store/apis/product";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../components/basic components/hapticButton";
import { COLORS, SPACING } from "../constants/theme";
import { useGetWishlistQuery } from "../store/apis/wishlist";

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

const BANNER_IMAGE = require("@/assets/images/product_list_banner.png");

export default function ListingScreen({ filters }: ListingScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract all possible filter params from navigation
  const departmentId = params.departmentId as string | undefined;
  const categoryId = params.categoryId as string | undefined;
  const subCategoryId = params.subCategoryId as string | undefined;
  const categoryName = params.categoryName as string | undefined;
  const subCategoryName = params.subCategoryName as string | undefined;

  // Additional filter parameters
  const gender = params.gender as string | undefined;
  const occasion = params.occasion as string | undefined;
  const productType = params.productType as string | undefined;
  const brand = params.brand as string | undefined;
  const collection = params.collection as string | undefined;
  const minPrice = params.minPrice as string | undefined;
  const maxPrice = params.maxPrice as string | undefined;

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sorting State
  const [isSortVisible, setIsSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Latest");

  // Filtering State
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );

  // Get category hierarchy for breadcrumbs
  const { data: hierarchy } = useGetCategoryHierarchyQuery(
    { departmentId, categoryId, subCategoryId },
    { skip: !departmentId && !categoryId }
  );

  // Get wishlist data for header heart icon
  const { data: wishlistData } = useGetWishlistQuery();
  const wishlistCount = wishlistData?.items.length || 0;

  // Helper to parse comma-separated filter values
  const parseFilterParam = (param: string | string[] | undefined): string[] => {
    if (!param) return [];
    if (Array.isArray(param)) return param;
    return param
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  };

  // Initialize filters from navigation params, props, and chip selection
  useEffect(() => {
    const newFilters: Record<string, string[]> = {};

    // Handle category-based filters
    if (categoryId) {
      const categoryProductType = getCategoryProductType(categoryId);
      if (categoryProductType) {
        newFilters.productType = [categoryProductType];
      }
    }

    // Handle direct productType param (overrides category mapping)
    const productTypeValues = parseFilterParam(productType);
    if (productTypeValues.length > 0) {
      newFilters.productType = productTypeValues;
    }

    // Handle occasion filter
    const occasionValues = parseFilterParam(occasion);
    if (occasionValues.length > 0) {
      newFilters.occasion = occasionValues;
    }

    // Handle brand filter
    const brandValues = parseFilterParam(brand);
    if (brandValues.length > 0) {
      newFilters.brand = brandValues;
    }

    // Handle collection filter
    const collectionValues = parseFilterParam(collection);
    if (collectionValues.length > 0) {
      newFilters.collection = collectionValues;
    }

    // Handle gender filter from departmentId (categories page sends departmentId)
    if (departmentId) {
      const deptGenderMap: Record<string, string> = {
        mens: "male",
        womens: "female",
        kids: "kids",
      };
      const mappedGender = deptGenderMap[departmentId];
      if (mappedGender) {
        newFilters.gender = [mappedGender];
      }
    }

    // Handle direct gender param (overrides department mapping)
    const genderValues = parseFilterParam(gender);
    if (genderValues.length > 0) {
      newFilters.gender = genderValues;
    }

    // Handle priceRange filter (from gift categories)
    const priceRangeParam = params.priceRange as string | undefined;
    const priceRangeValues = parseFilterParam(priceRangeParam);
    if (priceRangeValues.length > 0) {
      newFilters.priceRange = priceRangeValues;
    }

    // Handle minPrice / maxPrice (from AI chat)
    if (minPrice) {
      newFilters.minPrice = [minPrice];
    }
    if (maxPrice) {
      newFilters.maxPrice = [maxPrice];
    }

    // Merge with filters passed as props
    if (filters && Object.keys(filters).length > 0) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key].length > 0) {
          newFilters[key] = [...(newFilters[key] || []), ...filters[key]];
          // Remove duplicates
          newFilters[key] = [...new Set(newFilters[key])];
        }
      });
    }

    setActiveFilters(newFilters);
  }, [
    departmentId,
    categoryId,
    productType,
    occasion,
    brand,
    collection,
    gender,
    minPrice,
    maxPrice,
    params.priceRange,
    filters,
  ]);

  // Helper to map category to product type
  const getCategoryProductType = (catId: string): string | null => {
    const lowerCatId = catId.toLowerCase();
    if (lowerCatId.includes("rings")) return "ring";
    if (lowerCatId.includes("necklace") || lowerCatId.includes("chains"))
      return "necklace";
    if (lowerCatId.includes("earring")) return "earring";
    if (lowerCatId.includes("bracelet")) return "bracelet";
    if (lowerCatId.includes("pendant")) return "pendant";
    if (lowerCatId.includes("bangle")) return "bangle";
    if (lowerCatId.includes("anklet")) return "anklet";
    if (lowerCatId.includes("mangalsutra")) return "mangalsutra";
    if (lowerCatId.includes("nose-pin")) return "nose-pin";
    return null;
  };

  // Fetch products from Redux API with filters and sorting
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery({
    sortBy: selectedSort,
    filters: activeFilters,
  });

  // Count active filters (excluding chip-based filters)
  const activeFilterCount = Object.entries(activeFilters).reduce(
    (total, [key, options]) => {
      // Don't count chip-based collection filters
      if (
        key === "collection" &&
        options.some((o) => ["new-arrival", "bestseller"].includes(o))
      ) {
        return total;
      }
      return total + options.length;
    },
    0
  );

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  const handleCategoriesPress = () => {
    router.navigate("/(tabs)/categories");
  };

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: "/product/[id]",
      params: { id: product.id },
    });
  };

  const handleApplyFilters = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
    // Reset chip selection if manual filters are applied
    setSelectedFilter("All");
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSelectedFilter("All");
  };

  const handleSortSelect = (sort: string) => {
    setSelectedSort(sort);
  };

  const handleChipPress = (chip: string) => {
    setSelectedFilter(chip);
    // Map chips to sort order since collection filter isn't supported
    switch (chip) {
      case "Latest":
        setSelectedSort("Latest");
        break;
      case "Best Sellers":
        setSelectedSort("Popularity");
        break;
      case "All":
      default:
        setSelectedSort("Latest");
        break;
    }
  };

  // Generate page title based on navigation context
  const getPageTitle = () => {
    // Priority order for title
    if (subCategoryName) return subCategoryName;
    if (categoryName) return categoryName;
    if (occasion)
      return `${
        occasion.charAt(0).toUpperCase() + occasion.slice(1)
      } Collection`;
    if (brand) return brand;
    if (collection) return `${collection} Collection`;
    if (gender)
      return `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Jewellery`;
    if (hierarchy?.category) return hierarchy.category.name;
    if (productType)
      return `${productType.charAt(0).toUpperCase() + productType.slice(1)}s`;
    return "Products";
  };

  // Generate breadcrumb
  const getBreadcrumb = () => {
    const parts = [];

    if (hierarchy?.department) parts.push(hierarchy.department.name);
    if (hierarchy?.category && !categoryName)
      parts.push(hierarchy.category.name);
    if (categoryName) parts.push(categoryName);
    if (subCategoryName) parts.push(subCategoryName);

    // Add filter-based breadcrumbs if no category hierarchy
    if (parts.length === 0) {
      if (gender) parts.push(gender.charAt(0).toUpperCase() + gender.slice(1));
      if (occasion)
        parts.push(occasion.charAt(0).toUpperCase() + occasion.slice(1));
      if (brand) parts.push(brand);
      if (collection) parts.push(collection);
    }

    return parts.join(" / ");
  };

  // Get active filter tags for display (excluding chip-based filters)
  const getActiveFilterTags = () => {
    const tags: string[] = [];

    Object.entries(activeFilters).forEach(([key, values]) => {
      // Skip chip-based collection filters
      if (key === "collection") {
        const nonChipValues = values.filter(
          (v) => !["new-arrival", "bestseller"].includes(v)
        );
        nonChipValues.forEach((value) => {
          tags.push(`${key}: ${value}`);
        });
      } else {
        values.forEach((value) => {
          tags.push(`${key}: ${value}`);
        });
      }
    });

    return tags;
  };

  const renderHeader = () => (
    <View>
      {/* Page Header with back + actions */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <HapticButton onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </HapticButton>
          {/* <Text style={styles.headerTitle}>Explore</Text> */}
        </View>

        <View style={styles.headerActions}>
          <HapticButton
            style={styles.iconBtn}
            onPress={() => router.push("/searchPage")}
          >
            <Ionicons name="search-outline" size={24} color={COLORS.text} />
          </HapticButton>

          <HapticButton
            style={styles.iconBtn}
            onPress={() => router.push("/wishlist")}
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
        source={BANNER_IMAGE}
        style={styles.bannerBackground}
        imageStyle={styles.bannerImage}
      >
        <View style={styles.bannerOverlay} />
        <View style={styles.categoryIconCircle}>
          <Ionicons
            name={
              (CATEGORY_ICON_MAP[
                (productType || categoryId || getPageTitle()).toLowerCase()
              ] as any) || "sparkles-outline"
            }
            size={28}
            color={COLORS.primary}
          />
        </View>
      </ImageBackground>
      <Text style={styles.pageTitle}>{getPageTitle()}</Text>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTER_CHIPS.map((filter) => (
          <HapticButton
            key={filter}
            style={[
              styles.chip,
              selectedFilter === filter && styles.chipActive,
            ]}
            onPress={() => handleChipPress(filter)}
          >
            <Text
              style={[
                styles.chipText,
                selectedFilter === filter && styles.chipTextActive,
              ]}
            >
              {filter}
            </Text>
          </HapticButton>
        ))}
      </ScrollView>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <View style={styles.activeFiltersContainer}>
          <View style={styles.activeFiltersBar}>
            <Text style={styles.activeFiltersText}>
              {activeFilterCount}{" "}
              {activeFilterCount === 1 ? "filter" : "filters"} applied
            </Text>
            <HapticButton onPress={handleClearFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </HapticButton>
          </View>

          {/* Active Filter Tags */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterTagsContainer}
          >
            {getActiveFilterTags().map((tag, index) => (
              <View key={index} style={styles.filterTag}>
                <Text style={styles.filterTagText}>{tag}</Text>
                <HapticButton
                  onPress={() => {
                    const [filterKey, filterValue] = tag.split(": ");
                    const newFilters = { ...activeFilters };
                    newFilters[filterKey] = newFilters[filterKey].filter(
                      (v) => v !== filterValue
                    );
                    if (newFilters[filterKey].length === 0) {
                      delete newFilters[filterKey];
                    }
                    setActiveFilters(newFilters);
                  }}
                  style={styles.filterTagClose}
                >
                  <Ionicons name="close" size={14} color={COLORS.text} />
                </HapticButton>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
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
              onPress={handleClearFilters}
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
      <HapticButton style={styles.leftFab} onPress={toggleViewMode}>
        <Ionicons
          name={viewMode === "grid" ? "list" : "grid"}
          size={22}
          color="#053844"
        />
      </HapticButton>

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
                router.push(item.path as string);
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
        onSelect={handleSortSelect}
      />
      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 30 : 0,
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
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
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
    height: 140,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30, // half of icon circle overflows below
  },
  bannerImage: {
    borderRadius: 0,
    opacity: 0.85,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
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
    backgroundColor: "#F9F9F9",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E5EA",
  },
  activeFiltersBar: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    backgroundColor: "#FFFFFF",
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
    color: COLORS.text,
    marginRight: 6,
  },
  filterTagClose: {
    padding: 2,
  },
  listContent: {
    paddingHorizontal: SPACING.m,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: "space-between",
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
