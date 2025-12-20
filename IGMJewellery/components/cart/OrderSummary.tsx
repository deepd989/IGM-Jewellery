import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

interface OrderSummaryProps {
  subtotal: number;
  savings: number;
  platformFee: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, savings, platformFee }) => {
  const total = subtotal + platformFee - savings;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>VIEW ORDER SUMMARY</Text>
      
      <View style={styles.summaryBox}>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>₹{subtotal.toLocaleString()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Shipping Charges</Text>
          <Text style={[styles.value, { color: COLORS.success, fontWeight: '600' }]}>Free</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Platform Fee</Text>
          <Text style={styles.value}>₹{platformFee}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>You Saved</Text>
          <Text style={[styles.value, { color: COLORS.success }]}>- ₹{savings.toLocaleString()}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.l,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
});