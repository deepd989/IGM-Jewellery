
import { COLORS } from '@/constants/theme';

import { useGetCartQuery } from '@/store/apis/cart';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface CartBadgeProps {
  iconSize?: number;
  iconColor?: string;
  showLabel?: boolean;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ 
  iconSize = 22, 
  iconColor = COLORS.text,
  showLabel = false 
}) => {
  const router = useRouter();
  const { data: cartData } = useGetCartQuery();

  const totalItems = cartData?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handlePress = () => {
    router.push('/cart');
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="bag-outline" size={iconSize} color={iconColor} />
        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {totalItems > 99 ? '99+' : totalItems}
            </Text>
          </View>
        )}
      </View>
      {showLabel && (
        <Text style={styles.label}>Cart</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: COLORS.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  label: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});