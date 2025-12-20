import { Product } from '@/interfaces/product.interface';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { Brand } from '../enums/brand.enum';

import { CartItem } from '../components/cart/CartItem';
import { OrderSummary } from '../components/cart/OrderSummary';
import { RemoveConfirmationModal } from '../components/cart/RemoveConfirmationModal';

// --- MOCK CART DATA ---
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

const GIFT_ADDONS = [
  { id: '1', title: 'Write a Note (Card)', price: 100, isChecked: true },
  { id: '2', title: 'Premium Gift Wrap', price: 100, isChecked: false },
  { id: '3', title: 'Record a message', price: 100, isChecked: true },
  { id: '4', title: 'Premium Gift Wrap', price: 100, isChecked: false },
];

export default function CartScreen() {
  const router = useRouter();
  const [cart, setCart] = useState(INITIAL_CART);
  const [activeTab, setActiveTab] = useState<'bag' | 'trial'>('bag');
  const [removingItem, setRemovingItem] = useState<Product | null>(null);
  const [giftAddons, setGiftAddons] = useState(GIFT_ADDONS);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = () => {
    if (removingItem) {
      setCart(prev => prev.filter(item => item.product.id !== removingItem.id));
      setRemovingItem(null);
    }
  };

    const toggleGiftAddon = (id: string) => {
    setGiftAddons(prev => prev.map(addon => 
      addon.id === id ? { ...addon, isChecked: !addon.isChecked } : addon
    ));
  };

  const calculateSubtotal = () => cart.reduce((acc, item) => acc + (item.product.discountedPrice * item.quantity), 0);
  const calculateSavings = () => cart.reduce((acc, item) => acc + ((item.product.givenPrice - item.product.discountedPrice) * item.quantity), 0);
  const calculateAddonsTotal = () => giftAddons.reduce((acc, item) => item.isChecked ? acc + item.price : acc, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Bag</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'bag' && styles.activeTab]} 
          onPress={() => setActiveTab('bag')}
        >
          <Text style={[styles.tabText, activeTab === 'bag' && styles.activeTabText]}>Shopping Bag</Text>
          {activeTab === 'bag' && <View style={styles.activeDiamond} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trial' && styles.activeTab]} 
          onPress={() => setActiveTab('trial')}
        >
          <Text style={[styles.tabText, activeTab === 'trial' && styles.activeTabText]}>Home trial</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.banner}>
          <Ionicons name="return-up-back" size={16} color={COLORS.textSecondary} />
          <Text style={styles.bannerText}>15 day return & money back available on all online orders</Text>
        </View>

        {/* Freebie Section */}
        <View style={styles.freebieContainer}>
           <View style={styles.freebieIconBox}>
              <Ionicons name="sparkles" size={24} color="#E0E0E0" />
           </View>
           <View style={styles.freebieInfo}>
              <Text style={styles.freebieTag}>Freebie</Text>
              <Text style={styles.freebieTitle}>Necklace Box</Text>
              <Text style={styles.freebieSubtitle}>Congratulation! Available on orders above 5,000</Text>
           </View>
           <TouchableOpacity>
              <Ionicons name="close" size={20} color={COLORS.text} />
           </TouchableOpacity>
        </View>

        {/* Cart Items */}
        {cart.map(item => (
          <CartItem 
            key={item.product.id}
            product={item.product}
            quantity={item.quantity}
            onIncrement={() => updateQuantity(item.product.id, 1)}
            onDecrement={() => updateQuantity(item.product.id, -1)}
            onRemove={() => setRemovingItem(item.product)}
          />
        ))}

        {/* Offers & Benefits */}
        <Text style={styles.sectionHeader}>OFFERS & BENEFITS</Text>
        <TouchableOpacity 
          style={styles.couponRow} 
          onPress={() => router.push('/coupons')}
        >
          <View style={styles.couponIcon}>
            <Ionicons name="pricetag-outline" size={24} color={COLORS.text} />
          </View>
          <View style={styles.couponTextCol}>
            <Text style={styles.couponTitle}>Apply coupon</Text>
            <Text style={styles.couponSubtitle}>Save extra with coupons - check now!</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
        </TouchableOpacity>

        {/* Gifting Add-ons */}
         <Text style={styles.sectionHeader}>GIFTING ADD-ONS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.giftScroll}>
          {giftAddons.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.giftCard}
              onPress={() => toggleGiftAddon(item.id)}
              activeOpacity={0.8}
            >
               <View style={styles.giftImagePlaceholder}>
                  <View style={styles.giftCheckbox}>
                    <View style={[styles.checkCircle, item.isChecked && styles.checkCircleActive]}>
                       {item.isChecked && <Ionicons name="checkmark" size={12} color="#FFF" />}
                    </View>
                  </View>
               </View>
               <Text style={styles.giftTitle} numberOfLines={2}>{item.title}</Text>
               <Text style={styles.giftPrice}>₹{item.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Detailed Gift Sections */}
        <View style={styles.giftDetailSection}>
          <View style={styles.giftDetailHeader}>
            <View style={styles.iconLabelRow}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.text} />
              <Text style={styles.giftDetailTitle}>Write a note</Text>
            </View>
            <TouchableOpacity><Ionicons name="close" size={20} color={COLORS.text} /></TouchableOpacity>
          </View>
          <TextInput 
            placeholder="Start writing here |"
            style={styles.noteInput}
            multiline
            maxLength={500}
          />
          <Text style={styles.charCount}>0/500</Text>
        </View>

        <View style={styles.giftDetailSection}>
          <View style={styles.giftDetailHeader}>
            <View style={styles.iconLabelRow}>
              <Ionicons name="mic-outline" size={20} color={COLORS.text} />
              <Text style={styles.giftDetailTitle}>Record a message</Text>
            </View>
            <TouchableOpacity><Ionicons name="close" size={20} color={COLORS.text} /></TouchableOpacity>
          </View>
          <Text style={styles.giftDetailDesc}>
            Your personalised voice message will be sent to the recipient as a QR code to be scanned.{' '}
            <Text style={{color: COLORS.textSecondary, textDecorationLine: 'underline'}}>How it works?</Text>
          </Text>
          <TouchableOpacity style={styles.recordBtn}>
            <View style={styles.recordCircle}>
               <Ionicons name="mic" size={24} color={COLORS.text} />
            </View>
            <Text style={styles.recordText}>Start recording</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <OrderSummary 
          subtotal={calculateSubtotal() + calculateAddonsTotal()} 
          savings={calculateSavings()} 
          platformFee={220} 
        />
      </ScrollView>

      {/* Remove Modal */}
      <RemoveConfirmationModal 
        visible={!!removingItem}
        product={removingItem}
        onClose={() => setRemovingItem(null)}
        onRemove={removeItem}
        onWishlist={() => setRemovingItem(null)}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    // borderBottomWidth: 2,
    // borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.text,
    fontWeight: '700',
  },
  activeDiamond: {
    position: 'absolute',
    bottom: -3,
    width: 6,
    height: 6,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.text,
    transform: [{ rotate: '45deg' }],
  },
  scrollContent: {
    padding: SPACING.m,
    paddingBottom: 100,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 8,
    marginBottom: SPACING.m,
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  freebieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  freebieIconBox: {
    width: 50,
    height: 50,
    backgroundColor: '#F9F9F9',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  freebieInfo: {
    flex: 1,
  },
  freebieTag: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  freebieTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  freebieSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    padding: SPACING.m,
    backgroundColor: '#FFF',
  },
  couponIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  couponTextCol: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  couponSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  giftScroll: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
  },
  giftCard: {
    width: 100,
    marginRight: 12,
  },
  giftImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 8,
    position: 'relative',
  },
  giftCheckbox: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  giftTitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 14,
    marginBottom: 4,
  },
  giftPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  giftDetailSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    padding: SPACING.m,
    marginTop: SPACING.m,
  },
  giftDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftDetailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  noteInput: {
    fontSize: 14,
    color: COLORS.text,
    height: 60,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  giftDetailDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.l,
  },
  recordBtn: {
    alignItems: 'center',
  },
  recordCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
});