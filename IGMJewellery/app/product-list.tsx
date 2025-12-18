import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { FilterModal } from '@/components/products/FilterModal';
import { ProductCard } from '@/components/products/ProductCard';
import { SortModal } from '@/components/products/SortModal';
import { Product } from '@/interfaces/product.interface';
import { COLORS, SPACING } from '../constants/theme';
import { Brand } from '../enums/brand.enum';
import { ProductType } from '../enums/productType.enum';

// --- MOCK DATA ---
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: '24K Diamond Ring',
    name: 'Solitaire Shine',
    description: 'Beautiful solitaire ring.',
    productType: ProductType.Ring,
    givenPrice: 25000,
    discountedPrice: 20000,
    brand: Brand.Kalyan,
    tags: ['new', 'diamond'],
    thumbnailUrls: ['https://images.unsplash.com/photo-1605100804763-eb2fc645a382?q=80&w=400'],
    isNew: true,
    rating: 4,
  },
  {
    id: '2',
    title: 'Gold Plated Ring',
    name: 'Daily Wear',
    description: 'Perfect for daily use.',
    productType: ProductType.Ring,
    givenPrice: 12000,
    discountedPrice: 9500,
    brand: Brand.Malabar,
    tags: ['gold', 'sale'],
    thumbnailUrls: ['https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=400'],
    isNew: true,
    rating: 5,
  },
  {
    id: '3',
    title: 'Emerald Cut Ring',
    name: 'Green Glory',
    description: 'Stunning emerald.',
    productType: ProductType.Ring,
    givenPrice: 45000,
    discountedPrice: 38000,
    brand: Brand.Tanishq,
    tags: ['gemstone'],
    thumbnailUrls: ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=400'],
    isNew: false,
    rating: 4,
  }
];

const FILTER_CHIPS = ['All', 'Latest', 'Best Sellers', 'Express Delivery', 'Store Pick-up'];
const MENU_ITEMS = ['Bespoke Jewellery', 'Our Brands', 'Call an expert', 'Chat with Sonar'];

export default function ListingScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sorting State
  const [isSortVisible, setIsSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Featured');

  // Filtering State
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

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
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/cart')}>
            <Ionicons name="bag-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Icon & Title */}
      <View style={styles.titleSection}>
        <View style={styles.categoryIconCircle}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=200' }}
            style={styles.categoryImage}
          />
        </View>
        <Text style={styles.pageTitle}>[Rings]</Text>
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        key={viewMode}
        data={MOCK_PRODUCTS}
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
          
             <Ionicons name="sparkles" size={22}  /> 
           
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
        </TouchableOpacity>

        <View style={styles.bottomBarDivider} />

        <TouchableOpacity 
          style={styles.bottomBarItem}
          onPress={() => setIsFilterVisible(true)}
        >
          <Ionicons name="options-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.bottomBarText}>FILTER</Text>
        </TouchableOpacity>
      </View>

      {isMenuOpen && (
        <Pressable style={styles.dimOverlay} onPress={() => setIsMenuOpen(false)} />
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
        onApply={handleApplyFilters}
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
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.m,
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
  rightFab: {
    position: 'absolute',
    bottom: 80, 
    right: SPACING.m,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 20,
  },
  dIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
    borderRadius: 12,
  },
  dText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
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
});