import { CartItem } from '@/interfaces/order-details.interface';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';


interface OrderItemCardProps {
  item: CartItem;
  style?: any;
}

export const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, style }) => {
  return (
    <View style={[styles.itemCard, style]}>
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
  );
};

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFF',
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
});