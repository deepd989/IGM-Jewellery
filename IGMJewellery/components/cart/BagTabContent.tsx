import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { CartItem } from './CartItem';
import { OrderSummary } from './OrderSummary';

import { Product } from '@/interfaces/product.interface';
import { useRouter } from 'expo-router';

interface BagTabContentProps {
  cart: { product: Product; quantity: number }[];
  updateQuantity: (id: string, delta: number) => void;
  onRemove: (product: Product) => void;
  giftAddons: any[];
  toggleGiftAddon: (id: string) => void;
  calculateTotals: () => { subtotal: number; savings: number; addons: number };
}

export const BagTabContent: React.FC<BagTabContentProps> = ({
  cart,
  updateQuantity,
  onRemove,
  giftAddons,
  toggleGiftAddon,
  calculateTotals
}) => {
  const router = useRouter();
  const totals = calculateTotals();

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.banner}>
        <Ionicons name="return-up-back" size={16} color={COLORS.textSecondary} />
        <Text style={styles.bannerText}>15 day return & money back available on all online orders</Text>
      </View>

      <View style={styles.freebieContainer}>
        <View style={styles.freebieIconBox}>
          <Ionicons name="sparkles" size={24} color="#E0E0E0" />
        </View>
        <View style={styles.freebieInfo}>
          <Text style={styles.freebieTag}>Freebie</Text>
          <Text style={styles.freebieTitle}>Necklace Box</Text>
          <Text style={styles.freebieSubtitle}>Congratulation! Available on orders above 5,000</Text>
        </View>
        <TouchableOpacity><Ionicons name="close" size={20} color={COLORS.text} /></TouchableOpacity>
      </View>

      {cart.map(item => (
        <CartItem 
          key={item.product.id}
          product={item.product}
          quantity={item.quantity}
          onIncrement={() => updateQuantity(item.product.id, 1)}
          onDecrement={() => updateQuantity(item.product.id, -1)}
          onRemove={() => onRemove(item.product)}
        />
      ))}

      <Text style={styles.sectionHeader}>OFFERS & BENEFITS</Text>
      <TouchableOpacity style={styles.couponRow} onPress={() => router.push('/coupons')}>
        <View style={styles.couponIcon}><Ionicons name="pricetag-outline" size={24} color={COLORS.text} /></View>
        <View style={styles.couponTextCol}>
          <Text style={styles.couponTitle}>Apply coupon</Text>
          <Text style={styles.couponSubtitle}>Save extra with coupons - check now!</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>GIFTING ADD-ONS</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.giftScroll}>
        {giftAddons.map(item => (
          <TouchableOpacity key={item.id} style={styles.giftCard} onPress={() => toggleGiftAddon(item.id)}>
            <View style={styles.giftImagePlaceholder}>
              <View style={[styles.checkCircle, item.isChecked && styles.checkCircleActive]}>
                {item.isChecked && <Ionicons name="checkmark" size={12} color="#FFF" />}
              </View>
            </View>
            <Text style={styles.giftTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.giftPrice}>₹{item.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <OrderSummary 
        subtotal={totals.subtotal + totals.addons} 
        savings={totals.savings} 
        platformFee={220} 
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: SPACING.m, paddingBottom: 100 },
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAFAFA', padding: 12, borderRadius: 8, marginBottom: SPACING.m, justifyContent: 'center' },
  bannerText: { fontSize: 10, color: COLORS.textSecondary, marginLeft: 8 },
  freebieContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 8, padding: SPACING.m, marginBottom: SPACING.m },
  freebieIconBox: { width: 50, height: 50, backgroundColor: '#F9F9F9', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.m },
  freebieInfo: { flex: 1 },
  freebieTag: { fontSize: 11, color: COLORS.textSecondary },
  freebieTitle: { fontSize: 15, fontWeight: '700' },
  freebieSubtitle: { fontSize: 11, color: COLORS.textSecondary },
  sectionHeader: { fontSize: 14, fontWeight: '700', marginTop: SPACING.l, marginBottom: SPACING.m },
  couponRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 8, padding: SPACING.m },
  couponIcon: { width: 48, height: 48, backgroundColor: '#F9F9F9', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.m },
  couponTextCol: { flex: 1 },
  couponTitle: { fontSize: 15, fontWeight: '700' },
  couponSubtitle: { fontSize: 12, color: COLORS.textSecondary },
  giftScroll: { flexDirection: 'row', marginBottom: SPACING.m },
  giftCard: { width: 100, marginRight: 12 },
  giftImagePlaceholder: { width: 100, height: 100, backgroundColor: '#F9F9F9', borderRadius: 8, marginBottom: 8, position: 'relative' },
  checkCircle: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  checkCircleActive: { backgroundColor: '#000', borderColor: '#000' },
  giftTitle: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 },
  giftPrice: { fontSize: 13, fontWeight: '700' },
});