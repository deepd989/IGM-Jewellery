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
import { CouponCard } from '../components/cart/CouponCard';
import { COLORS, SPACING } from '../constants/theme';

const MOCK_COUPONS = [
  {
    id: '1',
    code: 'EXTRA20OFF',
    discount: '20% OFF',
    description: '20 % OFF Only on orders above 50,000 on cart value',
    validUntil: 'Jan 31, 026',
    isAvailable: true,
  },
  {
    id: '2',
    code: 'EXTRA20OFF',
    discount: '20% OFF',
    description: '20 % OFF Only on orders above 50,000 on cart value',
    validUntil: 'Jan 31, 026',
    isAvailable: false,
  },
  {
    id: '3',
    code: 'EXTRA20OFF',
    discount: '20% OFF',
    description: '20 % OFF Only on orders above 50,000 on cart value',
    validUntil: 'Jan 31, 026',
    isAvailable: false,
  },
];

export default function CouponsScreen() {
  const router = useRouter();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (code: string) => {
    console.log("Applying Coupon:", code);
    // In a real app, you'd pass this back via a global state or a callback
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply Coupon</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Input Area */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              placeholder="Enter Coupon Code"
              placeholderTextColor={COLORS.textSecondary}
              value={couponInput}
              onChangeText={setCouponInput}
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              style={styles.applyBtn}
              onPress={() => handleApplyCoupon(couponInput)}
            >
              <Text style={styles.applyBtnText}>APPLY</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* List Title */}
        <Text style={styles.listTitle}>Other offers you can avail:</Text>

        {/* Coupons List */}
        <View style={styles.list}>
          {MOCK_COUPONS.map(coupon => (
            <CouponCard 
              key={coupon.id} 
              coupon={coupon} 
              onApply={handleApplyCoupon}
            />
          ))}
        </View>
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
  scrollContent: {
    padding: SPACING.m,
  },
  inputSection: {
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    paddingHorizontal: SPACING.m,
    height: 60,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  applyBtn: {
    paddingHorizontal: 8,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  list: {
    paddingBottom: 40,
  },
});