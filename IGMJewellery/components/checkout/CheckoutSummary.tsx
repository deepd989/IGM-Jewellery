import { OrderDetails } from '@/interfaces/order-details.interface';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SPACING } from '../../constants/theme';


interface CheckoutSummaryProps {
  order: OrderDetails;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>
            {isExpanded ? 'Hide Order Summary' : 'Show Order Summary'}
          </Text>
          <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#000" />
        </View>
        <Text style={styles.itemSummary}>
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}   ₹{order.total.toLocaleString()}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemsScroll}>
            {order.items.map((item) => (
              <View key={item.product.id} style={styles.itemCard}>
                <View style={styles.imageBox}>
                   <Image 
                     source={{ uri: item.product.thumbnailUrls[0] }} 
                     style={styles.itemImg} 
                   />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.brand}>{item.product.brand}</Text>
                  <Text style={styles.title} numberOfLines={1}>{item.product.title}</Text>
                  <Text style={styles.specs}>
                    Size: {item.selectedSize || '12'}   Qty: {item.quantity}
                  </Text>
                  <View style={styles.deliveryTag}>
                    <Ionicons name="bus-outline" size={12} color="#000" />
                    <Text style={styles.deliveryText}>Delivery by 19th Nov</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.oldPrice}>₹{item.product.givenPrice.toLocaleString()}</Text>
                    <Text style={styles.newPrice}>₹{item.product.discountedPrice.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.breakdown}>
            <View style={styles.row}>
              <Text style={styles.label}>Subtotal</Text>
              <Text style={styles.value}>₹{order.subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Shipping Charges</Text>
              <Text style={styles.freeText}>Free</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Platform Fee</Text>
              <Text style={styles.value}>₹{order.platformFee}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>You Saved</Text>
              <Text style={styles.savings}>- ₹{order.savings.toLocaleString()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{order.total.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginRight: 4,
  },
  itemSummary: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  content: {
    padding: SPACING.m,
    paddingTop: 0,
  },
  itemsScroll: {
    marginBottom: SPACING.m,
  },
  itemCard: {
    flexDirection: 'row',
    width: 280,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    marginRight: 12,
  },
  imageBox: {
    width: 70,
    height: 70,
    backgroundColor: '#F9F9F9',
    borderRadius: 4,
    marginRight: 12,
  },
  itemImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  itemInfo: {
    flex: 1,
  },
  brand: {
    fontSize: 10,
    color: '#8E8E93',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  specs: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 4,
  },
  deliveryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  deliveryText: {
    fontSize: 9,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oldPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
    color: '#8E8E93',
    marginRight: 8,
  },
  newPrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  breakdown: {
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