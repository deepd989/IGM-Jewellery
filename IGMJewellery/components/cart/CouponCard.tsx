import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

interface Coupon {
  id: string;
  code: string;
  discount: string;
  description: string;
  validUntil: string;
  isAvailable: boolean;
}

interface CouponCardProps {
  coupon: Coupon;
  onApply: (code: string) => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, onApply }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, !coupon.isAvailable && styles.containerDisabled]}
      onPress={() => coupon.isAvailable && onApply(coupon.code)}
      activeOpacity={0.8}
      disabled={!coupon.isAvailable}
    >
      {/* Left Sidebar - Vertical Text */}
      <View style={[styles.leftPart, !coupon.isAvailable && styles.leftPartDisabled]}>
        <Text style={styles.verticalText}>{coupon.discount}</Text>
      </View>

      {/* Notch Circle */}
      <View style={styles.notchContainer}>
         <View style={styles.notch} />
      </View>

      {/* Content Area */}
      <View style={styles.rightPart}>
        <View style={styles.headerRow}>
          <Text style={[styles.code, !coupon.isAvailable && styles.textDisabled]}>{coupon.code}</Text>
          <View style={styles.statusRow}>
             {coupon.isAvailable ? (
               <>
                 <Ionicons name="sunny" size={14} color="#000" style={{ marginRight: 4 }} />
                 <Text style={styles.statusText}>Available</Text>
               </>
             ) : (
               <Text style={styles.statusTextDisabled}>Not Available</Text>
             )}
          </View>
        </View>

        <Text style={[styles.description, !coupon.isAvailable && styles.textDisabled]}>
          {coupon.description}
        </Text>

        <Text style={[styles.validity, !coupon.isAvailable && styles.textDisabled]}>
          Valid till {coupon.validUntil}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    height: 140,
  },
  containerDisabled: {
    opacity: 0.8,
  },
  leftPart: {
    width: 60,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftPartDisabled: {
    backgroundColor: '#D1D1D1',
  },
  verticalText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    transform: [{ rotate: '-90deg' }],
    width: 140,
    textAlign: 'center',
  },
  notchContainer: {
    position: 'absolute',
    left: 48, // Aligned with the border of leftPart (60 - radius)
    top: '50%',
    marginTop: -12,
    zIndex: 10,
  },
  notch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.background, // Match screen background to create cutout effect
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  rightPart: {
    flex: 1,
    padding: SPACING.m,
    paddingLeft: SPACING.l,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  code: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  statusTextDisabled: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
    maxWidth: '90%',
  },
  validity: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  textDisabled: {
    color: '#A0A0A0',
  },
});