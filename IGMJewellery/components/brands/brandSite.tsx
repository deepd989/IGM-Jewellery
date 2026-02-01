import { COLORS, SPACING } from '@/constants/theme';
import { BrandAboutSection, BrandStat } from '@/store/apis/brandsApi';
import { useGetProductsByBrandQuery } from '@/store/apis/product';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterModal } from '../products/FilterModal';
import { ProductCard } from '../products/ProductCard';
import { SortModal } from '../products/SortModal';

type ProfileHeaderProps = {
  brandNameKey:string;
  profileImageUri: string;
  businessName: string;
  tagline: string;
  ratingText: string;
  storeButtonLabel: string;
  onEnterStore: () => void;
};

// Profile Header Component
const ProfileHeader = ({
  profileImageUri,
  businessName,
  tagline,
  ratingText,
  storeButtonLabel,
  onEnterStore,
}: ProfileHeaderProps) => (
  <View style={styles.headerContainer}>
    <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
    <Text style={styles.businessName}>{businessName}</Text>
    <Text style={styles.tagline}>{tagline}</Text>
    <View style={styles.actionRow}>
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>{ratingText}</Text>
      </View>
      <TouchableOpacity style={styles.storeButton} onPress={onEnterStore}>
        <Text style={styles.storeButtonText}>{storeButtonLabel}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

type TabNavigationProps = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

// Tab Navigation Component
const TabNavigation = ({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab} style={styles.tab} onPress={() => onTabChange(tab)}>
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          {activeTab === tab && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};


// Stats Card Component
const StatsCard = ({ label, value }: BrandStat) => (
  <View style={styles.statsCard}>
    <View style={styles.statsIcon} />
    <Text style={styles.statsLabel}>{label}</Text>
    <Text style={styles.statsValue}>{value}</Text>
  </View>
);


// Heritage Section Component
const HeritageSection = ({ title, paragraphs }: BrandAboutSection) => (
  <View style={styles.heritageSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {paragraphs.map((p, idx) => (
      <Text key={idx} style={styles.sectionText}>
        {p}
      </Text>
    ))}
  </View>
);

type StatsRowProps = {
  stats: BrandStat[];
};

// Stats Row Component
const StatsRow = ({ stats }: StatsRowProps) => (
  <View style={styles.statsRow}>
    {stats.map((s, idx) => (
      <StatsCard key={`${s.label}-${idx}`} label={s.label} value={s.value} imageUri={s.imageUri} />
    ))}
  </View>
);

type BrandProfileProps = {
  header: ProfileHeaderProps;
  tabs: string[];
  initialActiveTab: string;
  heroImageUri: string;
  aboutSections: BrandAboutSection[];
  stats: BrandStat[];
};

// Main Component
export default function BrandProfile({
  header,
  tabs,
  initialActiveTab,
  heroImageUri,
  aboutSections,
  stats,
}: BrandProfileProps) {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const router = useRouter();
  
  // Filter and Sort State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSortVisible, setIsSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Featured');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  
  // Use API with filters and sorting - same approach as product-list.tsx
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsByBrandQuery({
    brand: header.brandNameKey as string,
    sortBy: selectedSort,
    filters: activeFilters,
  });

  useEffect(() => {
    console.log('Fetched products for brand:', header.brandNameKey, products);
  }, [products]);

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).reduce(
    (total, options) => total + options.length,
    0
  );

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
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

  return (
    <>
      <ProfileHeader {...header} />
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'About' && (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Image source={{ uri: heroImageUri }} style={styles.imagePlaceholder} />
          {aboutSections.map((section, idx) => (
            <HeritageSection key={`${section.title}-${idx}`} title={section.title} paragraphs={section.paragraphs} />
          ))}
          <StatsRow stats={stats} />
        </View>
        </ScrollView>
      )}

      {activeTab === 'Products' && (
         <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={{ flex: 1 }}>
          {/* Products Count */}
          <View style={styles.productsHeader}>
            <Text style={styles.productsCount}>
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity onPress={handleClearFilters}>
                <Text style={styles.clearFiltersText}>Clear filters</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading products...</Text>
            </View>
          ) : products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No products found</Text>
              {activeFilterCount > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
                  <Text style={styles.clearButtonText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <FlatList
              key={viewMode}
              data={products}
              keyExtractor={(item) => item.id}
              numColumns={viewMode === 'grid' ? 2 : 1}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  viewMode={viewMode}
                  onPress={() => router.push({
                    pathname: "/product/[id]",
                    params: { id: item.id },
                  })}
                />
              )}
              columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : undefined}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
          
          {/* Left: View Toggle */}
          <TouchableOpacity style={styles.leftFab} onPress={toggleViewMode}>
            <Ionicons
              name={viewMode === 'grid' ? 'list' : 'grid'}
              size={22}
              color="#000"
            />
          </TouchableOpacity>
          
          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
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
              {selectedSort !== 'Featured' && <View style={styles.activeDot} />}
            </TouchableOpacity>

            <View style={styles.bottomBarDivider} />

            <TouchableOpacity
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
            </TouchableOpacity>
          </View>
          
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
        </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 120,
    height: 120,
    // borderRadius: 60,
    padding: 10,
    backgroundColor: '#d3d3d3',
    marginTop: 20,
    marginBottom: 20,
  },
  businessName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  ratingBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  storeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  storeButtonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 20,
  },
  heritageSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statsIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  productsContainer:{
    margin:10,
    alignItems:'center',
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  productsCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  clearFiltersText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.m,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
  },
  emptyText: {
    marginTop: SPACING.m,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  clearButton: {
    marginTop: SPACING.l,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: SPACING.m,
    paddingBottom: 140,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  leftFab: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: '#000',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bottomBarItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBarText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bottomBarDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    marginLeft: 6,
  },
  filterBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  filterBadgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '700',
  },
});