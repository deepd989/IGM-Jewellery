import { DeliveryCheck } from '@/components/products/DeliveryCheck';
import { ProductAccordion } from '@/components/products/ProductAccordion';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { ProductInfo } from '@/components/products/ProductInfo';
import { ReviewSection } from '@/components/products/ReviewSection';
import { Product } from '@/interfaces/product.interface';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { Brand } from '../../enums/brand.enum';
import { ProductType } from '../../enums/productType.enum';


// --- FULL MOCK DATA FETCH (Simulation) ---
const getProductDetails = (id: string): Product => {
  return {
    id: id,
    title: '24K Gold Ring',
    name: 'Solitaire Shine',
    description: 'Celebrate every day in style with the subtle grace of these drop earrings crafted in 22 Karat Yellow Gold in a leaf design.',
    productType: ProductType.Ring,
    givenPrice: 25000,
    discountedPrice: 20000,
    brand: Brand.Kalyan,
    tags: ['new', 'gold'],
    thumbnailUrls: ['https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=600',
        'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=600',
        'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=600',
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600',],
   
    isNew: true,
    rating: 5.0,
    sku: 'UE399-G0000'
  };
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // In real app, fetch via useEffect or useQuery
  const product = getProductDetails(id as string);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
           <TouchableOpacity style={styles.iconBtn}>
             <Ionicons name="search-outline" size={22} color={COLORS.text} />
           </TouchableOpacity>
           <TouchableOpacity style={styles.iconBtn}>
             <Ionicons name="heart-outline" size={22} color={COLORS.text} />
           </TouchableOpacity>
           <TouchableOpacity style={styles.iconBtn}>
             <Ionicons name="bag-outline" size={22} color={COLORS.text} />
           </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Gallery */}
        <ProductImageGallery images={ product.thumbnailUrls} />

        {/* Info & Specs */}
        <ProductInfo product={product} />

        {/* Delivery & Highlights */}
        <DeliveryCheck />

        {/* Accordion */}
        <ProductAccordion product={product} />

        {/* Reviews */}
        <ReviewSection product={product} />

      </ScrollView>
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
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconBtn: {
    marginLeft: SPACING.m,
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});