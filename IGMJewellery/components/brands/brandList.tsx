import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView,  
  TouchableOpacity, 
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Dynamic Responsiveness Logic ---
const { width } = Dimensions.get('window');
const SPACING = 16;
const GRID_GAP = 12;

// 1. Decide number of columns based on screen width
// If screen is smaller than 380px (Small Androids / iPhone SE), use 2 cols. Otherwise 3.
const NUM_COLUMNS = width < 380 ? 2 : 3;

// 2. Calculate item width based on the dynamic column count
// Total Width - Side Padding - Total Gaps (gap count is cols - 1)
const TOTAL_GAP_SPACE = (NUM_COLUMNS - 1) * GRID_GAP;
const AVAILABLE_WIDTH = width - (SPACING * 2) - TOTAL_GAP_SPACE;
const ITEM_WIDTH = AVAILABLE_WIDTH / NUM_COLUMNS;


// --- Mock Data ---
const TOP_BRANDS = [1, 2, 3, 4, 5, 6];
const ETHNIC_BRANDS = [1, 2, 3, 4, 5, 6];
const MODERN_BRANDS = [1, 2, 3, 4, 5, 6];

const BrandCard = () => {
  return (
    <View style={styles.cardContainer} />
  );
};

export const BrandGrid =({data})=>{
    return (<View style={styles.gridContainer}>
    {data.map((item, index) => (
      <BrandCard key={index} />
    ))}
  </View>)

}

export const BrandSection = ({ title, data }) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#000" />
        </TouchableOpacity>
      </View>
      <BrandGrid data={data} />
    </View>
  );
};



export default function BrandList() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Brands on IGM Jewellery</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
              <TextInput 
                placeholder="Search" 
                placeholderTextColor="#999"
                style={styles.searchInput}
              />
            </View>
          </View>

          <BrandSection title="Top Brands" data={TOP_BRANDS} />
          <BrandSection title="Ethnic Jewellery Brands" data={ETHNIC_BRANDS} />
          <BrandSection title="Modern Jewellery Brands" data={MODERN_BRANDS} />
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    paddingHorizontal: SPACING,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    color: '#000',
  },
  sectionContainer: {
    marginBottom: 25,
    paddingHorizontal: SPACING,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#000',
    marginRight: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // We use standard margins/padding math above, but flex gap is cleaner
    // if you are on React Native 0.71+
    gap: GRID_GAP, 
  },
  cardContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.85, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 8,
  },
});