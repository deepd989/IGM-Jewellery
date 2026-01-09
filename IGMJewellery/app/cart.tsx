import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

import { Brand } from '../enums/brand.enum';

import { TrialTabContent } from '@/components/trial/TrailTabContent';
import { Product } from '@/interfaces/product.interface';
import { BagTabContent } from '../components/cart/BagTabContent';
import { RemoveConfirmationModal } from '../components/cart/RemoveConfirmationModal';


const INITIAL_CART = [
  {
    product: {
      id: '1',
      title: '24K Diamond Ring',
      discountedPrice: 20000,
      givenPrice: 25000,
      brand: Brand.Kalyan,
      thumbnailUrls: ['https://images.unsplash.com/photo-1605100804763-eb2fc645a382?q=80&w=400'],
    } as Product,
    quantity: 1
  },
  {
    product: {
      id: '2',
      title: '24K Diamond Ring',
      discountedPrice: 20000,
      givenPrice: 25000,
      brand: Brand.Kalyan,
      thumbnailUrls: ['https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=400'],
    } as Product,
    quantity: 1
  }
];

const INITIAL_TRIAL = [
  {
    product: {
      id: 't1',
      title: '24K Diamond Ring',
      discountedPrice: 20000,
      brand: Brand.Kalyan,
      thumbnailUrls: ['https://images.unsplash.com/photo-1605100804763-eb2fc645a382?q=80&w=400'],
    } as Product,
  }
];

const GIFT_ADDONS = [
  { id: '1', title: 'Write a Note (Card)', price: 100, isChecked: true },
  { id: '2', title: 'Premium Gift Wrap', price: 100, isChecked: false },
  { id: '3', title: 'Record a message', price: 100, isChecked: true },
  { id: '4', title: 'Premium Gift Wrap', price: 100, isChecked: false },
];

export default function CartScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'bag' | 'trial'>('bag');
  const [cart, setCart] = useState(INITIAL_CART);
  const [trialList, setTrialList] = useState(INITIAL_TRIAL);
  const [giftAddons, setGiftAddons] = useState(GIFT_ADDONS);
  const [removingItem, setRemovingItem] = useState<Product | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const toggleGiftAddon = (id: string) => {
    setGiftAddons(prev => prev.map(a => a.id === id ? { ...a, isChecked: !a.isChecked } : a));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((acc, item) => acc + (item.product.discountedPrice * item.quantity), 0);
    const savings = cart.reduce((acc, item) => acc + ((item.product.givenPrice - item.product.discountedPrice) * item.quantity), 0);
    const addons = giftAddons.reduce((acc, item) => item.isChecked ? acc + item.price : acc, 0);
    return { subtotal, savings, addons };
  };

  const removeItem = () => {
    if (removingItem) {
      if (activeTab === 'bag') setCart(prev => prev.filter(i => i.product.id !== removingItem.id));
      else setTrialList(prev => prev.filter(i => i.product.id !== removingItem.id));
      setRemovingItem(null);
    }
  };

  const isBag = activeTab === 'bag';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isBag ? 'Shopping Bag' : 'Home Trial'}</Text>
        <TouchableOpacity><Ionicons name="heart-outline" size={24} color={COLORS.text} /></TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab]} onPress={() => setActiveTab('bag')}>
          <Text style={[styles.tabText, isBag && styles.activeTabText]}>Shopping Bag</Text>
          {isBag && <View style={styles.activeDiamond} />}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab]} onPress={() => setActiveTab('trial')}>
          <Text style={[styles.tabText, !isBag && styles.activeTabText]}>Home trial ({trialList.length})</Text>
          {!isBag && <View style={styles.activeDiamond} />}
        </TouchableOpacity>
      </View>

      {isBag ? (
        <BagTabContent 
          cart={cart} 
          updateQuantity={updateQuantity} 
          onRemove={setRemovingItem} 
          giftAddons={giftAddons} 
          toggleGiftAddon={toggleGiftAddon} 
          calculateTotals={calculateTotals}
        />
      ) : (
        <TrialTabContent trialList={trialList} onRemove={setRemovingItem} />
      )}

      <View style={styles.stickyFooter}>
        <View style={styles.footerInfo}>
          {isBag ? (
            <>
              <Text style={styles.footerPrice}>₹{(calculateTotals().subtotal + calculateTotals().addons + 220).toLocaleString()}</Text>
              <Text style={styles.footerLink}>View details</Text>
            </>
          ) : (
            <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/product-list')}>
               <Text style={styles.browseText}>Browse trial designs</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.mainBtn} 
          onPress={() => isBag ? router.push('/checkout/address') : router.push('/trial/schedule')}
        >
          <Text style={styles.mainBtnText}>{isBag ? 'CHECKOUT' : 'Schedule trial'}</Text>
        </TouchableOpacity>
      </View>

      <RemoveConfirmationModal 
        visible={!!removingItem} product={removingItem} onClose={() => setRemovingItem(null)}
        onRemove={removeItem} onWishlist={() => setRemovingItem(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.m, paddingVertical: SPACING.s, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  backBtn: { width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  activeTabText: { color: COLORS.text, fontWeight: '700' },
  activeDiamond: { position: 'absolute', bottom: -3, width: 6, height: 6, backgroundColor: '#FFF', borderWidth: 1, borderColor: COLORS.text, transform: [{ rotate: '45deg' }] },
  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: SPACING.m, borderTopWidth: 1, borderTopColor: '#F0F0F0', flexDirection: 'row', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 30 : 20 },
  footerInfo: { flex: 1 },
  footerPrice: { fontSize: 18, fontWeight: '800' },
  footerLink: { fontSize: 11, color: '#000', fontWeight: '600', textDecorationLine: 'underline' },
  browseBtn: { paddingVertical: 8 },
  browseText: { fontSize: 14, fontWeight: '700', color: '#000' },
  mainBtn: { backgroundColor: '#000', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 4, minWidth: 140, alignItems: 'center' },
  mainBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14, letterSpacing: 1 },
});