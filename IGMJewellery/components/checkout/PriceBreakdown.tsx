import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PriceBreakdownProps {
  subtotal: number;
  savings: number;
  platformFee: number;
  total: number;
  couponApplied?: number;
  style?: any;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ 
  subtotal, 
  savings, 
  platformFee, 
  total,
  couponApplied = 0,
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>₹{subtotal.toLocaleString()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Shipping Charges</Text>
        <Text style={styles.freeText}>Free</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Platform Fee</Text>
        <Text style={styles.value}>₹{platformFee}</Text>
      </View>
      {couponApplied > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Coupon Applied</Text>
          <Text style={styles.value}>-₹{couponApplied}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.label}>You Saved</Text>
        <Text style={styles.savings}>- ₹{savings.toLocaleString()}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: 13,
    color: '#8E8E93',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
  },
  freeText: {
    fontSize: 13,
    color: '#34C759',
    fontWeight: '600',
  },
  savings: {
    fontSize: 13,
    color: '#34C759',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
  },
});