import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { CartBadge } from '@/components/cart/CardBadge';
import { FilterModal } from '@/components/products/FilterModal';
import { ProductCard } from '@/components/products/ProductCard';
import { SortModal } from '@/components/products/SortModal';
import { RouteParam } from '@/constants/routeNavigationConstants';
import { Product } from '@/interfaces/product.interface';
import { useGetCategoryHierarchyQuery } from '@/store/apis/categories';
import { useGetProductsQuery } from '@/store/apis/product';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';

type ListingScreenProps = {
  filters?: Record<string, string[]>;
  route?: RouteProp<RouteParam, 'product-list'>;
};

const FILTER_CHIPS = ['All', 'Latest', 'Best Sellers', 'Express Delivery', 'Store Pick-up'];
const MENU_ITEMS = ['Bespoke Jewellery', 'Our Brands', 'Call an expert', 'Chat with Sonar'];



export default function ListingScreen({ filters,route }: ListingScreenProps) {
  console.log("FILTERS",route);
  const router = useRouter(); 
  const params = useLocalSearchParams();
  
  // Extract category params from navigation
  const departmentId = params.departmentId as string | undefined;
  const categoryId = params.categoryId as string | undefined;
  const subCategoryId = params.subCategoryId as string | undefined;
  const categoryName = params.categoryName as string | undefined;
  const subCategoryName = params.subCategoryName as string | undefined;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sorting State
  const [isSortVisible, setIsSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Featured');

  // Filtering State
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Get category hierarchy for breadcrumbs
  const { data: hierarchy } = useGetCategoryHierarchyQuery(
    { departmentId, categoryId, subCategoryId },
    { skip: !departmentId && !categoryId }
  );

  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) return;

    setActiveFilters(prev => ({
      ...prev,
      ...filters,
    }));
}, []);

  // Initialize filters based on category navigation
  useEffect(() => {
    const newFilters: Record<string, string[]> = { ...activeFilters };

    // If coming from categories, set the product type filter
    if (categoryId) {
      const categoryProductType = getCategoryProductType(categoryId);
      if (categoryProductType) {
        newFilters.productType = [categoryProductType];
      }
    }

    // Update filters if they changed
    if (JSON.stringify(newFilters) !== JSON.stringify(activeFilters)) {
      setActiveFilters(newFilters);
    }
  }, [categoryId]);

  // Helper to map category to product type
  const getCategoryProductType = (catId: string): string | null => {
    if (catId.includes('rings')) return 'ring';
    if (catId.includes('necklace') || catId.includes('chains')) return 'necklace';
    if (catId.includes('earring')) return 'earring';
    if (catId.includes('bracelet')) return 'bracelet';
    if (catId.includes('pendant')) return 'pendant';
    return null;
  };

  // Fetch products from Redux API with filters and sorting
  const { data: products = [], isLoading, isError, error, refetch } = useGetProductsQuery({
    sortBy: selectedSort,
    filters: activeFilters,
  });

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).reduce(
    (total, options) => total + options.length, 
    0
  );

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const handleCategoriesPress = () => {
    router.navigate('/(tabs)/categories');
  };

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product.id }
    });
  };

  const handleApplyFilters = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  const handleSortSelect = (sort: string) => {
    setSelectedSort(sort);
  };

  // Generate page title based on navigation
  const getPageTitle = () => {
    if (subCategoryName) return subCategoryName;
    if (categoryName) return categoryName;
    if (hierarchy?.category) return hierarchy.category.name;
    return 'Products';
  };

  // Generate breadcrumb
  const getBreadcrumb = () => {
    const parts = [];
    if (hierarchy?.department) parts.push(hierarchy.department.name);
    if (hierarchy?.category && !categoryName) parts.push(hierarchy.category.name);
    if (categoryName) parts.push(categoryName);
    if (subCategoryName) parts.push(subCategoryName);
    return parts.join(' / ');
  };

  const renderHeader = () => (
    <View>
      {/* Page Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="heart-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.iconBtn}>
            <CartBadge iconSize={22} iconColor={COLORS.text} />
          </View>
        </View>
      </View>

      {/* Breadcrumb */}
      {(departmentId || categoryId) && (
        <View style={styles.breadcrumbContainer}>
          <Text style={styles.breadcrumbText}>{getBreadcrumb()}</Text>
        </View>
      )}

      {/* Category Icon & Title */}
      <View style={styles.titleSection}>
        <View style={styles.categoryIconCircle}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=200' }}
            style={styles.categoryImage}
          />
        </View>
        <Text style={styles.pageTitle}>{getPageTitle()}</Text>
        <Text style={styles.resultsCount}>
          {products.length} {products.length === 1 ? 'Product' : 'Products'}
        </Text>
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterContainer}
      >
        {FILTER_CHIPS.map((filter) => (
          <TouchableOpacity 
            key={filter} 
            style={[styles.chip, selectedFilter === filter && styles.chipActive]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.chipText, selectedFilter === filter && styles.chipTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <View style={styles.activeFiltersBar}>
          <Text style={styles.activeFiltersText}>
            {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} applied
          </Text>
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
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
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>Failed to load products</Text>
          <Text style={styles.errorSubtext}>{error?.toString()}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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
          <Ionicons name="search-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your filters or browse different categories
          </Text>
          {activeFilterCount > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.clearButton, { marginTop: SPACING.m }]} 
            onPress={handleCategoriesPress}
          >
            <Text style={styles.clearButtonText}>Browse Categories</Text>
          </TouchableOpacity>
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
        numColumns={viewMode === 'grid' ? 2 : 1}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            viewMode={viewMode} 
            onPress={handleProductPress} 
          />
        )}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Left: View Toggle */}
      <TouchableOpacity style={styles.leftFab} onPress={toggleViewMode}>
        <Ionicons 
          name={viewMode === 'grid' ? 'list' : 'grid'} 
          size={22} 
          color="#000" 
        />
      </TouchableOpacity>

      {/* Right: Support Menu */}
      {!isMenuOpen ? (
        <TouchableOpacity style={styles.closeFab} onPress={() => setIsMenuOpen(true)}>
          <Ionicons name="sparkles" size={22} /> 
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.closeFab} onPress={() => setIsMenuOpen(false)}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      )}

      {/* Menu Popup */}
      {isMenuOpen && (
        <View style={styles.menuPopup}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Text style={styles.menuItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.bottomBarItem}
          onPress={handleCategoriesPress}
        >
          <Ionicons name="grid-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.bottomBarText}>CATEGORIES</Text>
        </TouchableOpacity>
        
        <View style={styles.bottomBarDivider} />
        
        <TouchableOpacity 
          style={styles.bottomBarItem}
          onPress={() => setIsSortVisible(true)}
        >
          <Ionicons name="swap-vertical" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.bottomBarText}>SORT</Text>
          {selectedSort !== 'Featured' && (
            <View style={styles.activeDot} />
          )}
        </TouchableOpacity>

        <View style={styles.bottomBarDivider} />

        <TouchableOpacity 
          style={styles.bottomBarItem}
          onPress={() => setIsFilterVisible(true)}
        >
          <Ionicons name="options-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.bottomBarText}>FILTER</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {isMenuOpen && (
        <Pressable style={styles.dimOverlay} onPress={() => setIsMenuOpen(false)} />
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
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: '600',
    color: COLORS.text,
  },
  errorSubtext: {
    marginTop: SPACING.s,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.l,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: SPACING.m,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptySubtext: {
    marginTop: SPACING.s,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  clearButton: {
    marginTop: SPACING.l,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 4,
    marginLeft: 12,
  },
  breadcrumbContainer: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    backgroundColor: '#F9F9F9',
  },
  breadcrumbText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.m,
    marginTop: SPACING.s,
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
    opacity: 0.6,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  resultsCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
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
    borderColor: '#E5E5EA',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
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
    color: '#FFFFFF',
    fontWeight: '600',
  },
  activeFiltersBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    backgroundColor: '#F9F9F9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeFiltersText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  clearFiltersText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: SPACING.m,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  leftFab: {
    position: 'absolute',
    bottom: 80, 
    left: SPACING.m,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F0F0F0', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  closeFab: {
    position: 'absolute',
    bottom: 80,
    right: SPACING.m,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
  menuPopup: {
    position: 'absolute',
    bottom: 140,
    right: SPACING.m,
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: SPACING.s,
    shadowColor: '#000',
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
    fontWeight: '500',
    textAlign: 'right', 
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 15,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    zIndex: 10,
  },
  bottomBarItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bottomBarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bottomBarDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeDot: {
    position: 'absolute',
    top: -4,
    right: '30%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: '25%',
    backgroundColor: '#FFD700',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '700',
  },
});