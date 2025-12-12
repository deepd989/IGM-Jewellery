import { Department, SidebarCategory, SubCategory } from '@/interfaces/category.interface';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { useCategories } from '../../hooks/useCategories';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// --- COMPONENTS ---

// 1. Top Department Tab (Men's, Women's, Kid's)
const DepartmentTab = ({ item, isActive, onPress }: { item: Department, isActive: boolean, onPress: () => void }) => (
  <TouchableOpacity 
    style={styles.deptTab} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.deptImageContainer}>
       <Image 
         source={item.imageUrl} 
         style={[styles.deptImage, isActive ? styles.deptImageActive : styles.deptImageInactive]}
         resizeMode="contain"
       />
    </View>
    <Text style={[styles.deptText, isActive && styles.deptTextActive]}>{item.name}</Text>
    {isActive && (
      <View style={styles.activeIndicatorContainer}>
        <View style={styles.activeLine} />
        <View style={styles.activeDiamond} />
        <View style={styles.activeLine} />
      </View>
    )}
  </TouchableOpacity>
);

// 2. Sidebar Item (Left List)
const SidebarItem = ({ item, isActive, onPress }: { item: SidebarCategory, isActive: boolean, onPress: () => void }) => (
  <TouchableOpacity 
    style={[styles.sidebarItem, isActive && styles.sidebarItemActive]} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    {isActive && (
      <View style={styles.sidebarIndicator}>
        <View style={styles.diamondDot} />
      </View>
    )}
    <Text style={[styles.sidebarText, isActive && styles.sidebarTextActive]}>
      {item.name}
    </Text>
  </TouchableOpacity>
);

// 3. Grid Item (Right Content)
const GridItem = ({ item }: { item: SubCategory }) => (
  <View style={styles.gridItemContainer}>
    <View style={styles.gridItemBox}>
      {item.imageUrl ? (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.gridImage} 
          resizeMode="cover" 
        />
      ) : (
        <View style={styles.placeholderBox} />
      )}
    </View>
    <Text style={styles.gridItemText}>{item.name}</Text>
  </View>
);

export default function CategoriesScreen() {
  const { 
    departments, 
    activeDepartment, 
    setActiveDepartmentId, 
    activeCategory, 
    setActiveCategoryId,
    subCategories 
  } = useCategories();

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="heart-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="bag-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- TOP TABS (DEPARTMENTS) --- */}
      <View style={styles.tabsContainer}>
        {departments.map((dept) => (
          <DepartmentTab 
            key={dept.id} 
            item={dept} 
            isActive={dept.id === activeDepartment.id}
            onPress={() => {
              setActiveDepartmentId(dept.id);
              // Reset category to first in new dept
              if (dept.categories.length > 0) {
                setActiveCategoryId(dept.categories[0].id);
              }
            }}
          />
        ))}
      </View>

      <View style={styles.divider} />

      {/* --- MAIN SPLIT CONTENT --- */}
      <View style={styles.contentContainer}>
        
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          <FlatList
            data={activeDepartment.categories}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <SidebarItem 
                item={item} 
                isActive={item.id === activeCategory?.id} 
                onPress={() => setActiveCategoryId(item.id)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>

        {/* Right Grid Content */}
        <View style={styles.mainContent}>
          {/* Header for the selected category inside the grid view if needed */}
          <View style={styles.gridHeader}>
             {/* Optional: Add a breadcrumb or title here if desired, e.g. <Text>Rings</Text> */}
          </View>

          <FlatList
            data={subCategories}
            keyExtractor={(item) => item.id}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContainer}
            renderItem={({ item }) => <GridItem item={item} />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No subcategories found</Text>
              </View>
            }
          />
        </View>

      </View>

      {/* --- BOTTOM SEARCH BAR --- */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={COLORS.primary} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    marginLeft: SPACING.m,
  },

  // Top Tabs
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.s,
    backgroundColor: COLORS.background,
  },
  deptTab: {
    alignItems: 'center',
    width: width / 3,
    paddingBottom: SPACING.xs,
  },
  deptImageContainer: {
    marginBottom: 8,
    height: 50, // Fixed height for image area
    justifyContent: 'center',
    alignItems: 'center',
  },
  deptImage: {
    width: 60,
    height: 40,
  },
  deptImageActive: {
    opacity: 1,
  },
  deptImageInactive: {
    opacity: 0.5,
  },
  deptText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  deptTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  activeIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    justifyContent: 'center',
  },
  activeLine: {
    height: 1,
    backgroundColor: COLORS.primary,
    flex: 1,
  },
  activeDiamond: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: -3, // Overlap slightly
    zIndex: 1,
  },

  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
  },

  // Content Layout
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  // Sidebar
  sidebar: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  sidebarItem: {
    paddingVertical: SPACING.l,
    paddingHorizontal: SPACING.s,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sidebarItemActive: {
    backgroundColor: '#F3F3F3',
  },
  sidebarIndicator: {
    marginRight: 6,
  },
  diamondDot: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.primary,
    transform: [{ rotate: '45deg' }],
  },
  sidebarText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  sidebarTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  // Grid
  mainContent: {
    width: '70%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.s,
  },
  gridHeader: {
    marginTop: SPACING.s,
  },
  gridContainer: {
    paddingTop: SPACING.m,
    paddingBottom: 100, // Space for search bar
  },
  gridRow: {
    justifyContent: 'flex-start',
    marginBottom: SPACING.m,
  },
  gridItemContainer: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  gridItemBox: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: SPACING.xs,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  gridItemText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    padding: SPACING.m,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
  },

  // Search Bar
  searchWrapper: {
    position: 'absolute',
    bottom: SPACING.m,
    left: SPACING.m,
    right: SPACING.m,
    backgroundColor: 'transparent',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.m,
    height: 50,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.s,
    fontSize: 14,
    color: COLORS.text,
  },
});