import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SPACING } from '../../constants/theme';

const { width } = Dimensions.get('window');

const DUMMY_ITEMS = [
  { id: '1', brand: 'Kalyan Jewellers', title: '24K Diamond Ring', size: '18', qty: 1, price: 10000, oldPrice: 15000, img: 'https://images.unsplash.com/photo-1605100804763-eb2fc645a382?q=80&w=400' },
  { id: '2', brand: 'Tanishq', title: 'Gold Chain', size: 'One Size', qty: 1, price: 10000, oldPrice: 12000, img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=400' },
];

export default function ConfirmationScreen() {
  const router = useRouter();
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/categories')} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Confirmation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.successBox}>
          <View style={styles.iconContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=400' }} 
              style={styles.successImage} 
            />
            <View style={styles.checkCircle}>
               <Ionicons name="checkmark" size={24} color="#FFF" />
            </View>
          </View>

          <Text style={styles.congrats}>Congratulations!</Text>
          <Text style={styles.subtext}>Your order has been placed. Please wait for our further updates.</Text>
          
          <View style={styles.orderIdRow}>
            <Text style={styles.orderId}>Order ID: #12345</Text>
            <TouchableOpacity style={styles.copyBtn}>
              <Ionicons name="copy-outline" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
             <Text style={styles.summaryTitle}>Order Summary  <Text style={{fontWeight: '800'}}>₹20,000</Text></Text>
             <Text style={styles.itemsCount}>4 items</Text>
          </View>

          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.carousel}>
             {DUMMY_ITEMS.map((item) => (
               <View key={item.id} style={styles.productCard}>
                 <View style={styles.productContent}>
                    <Image source={{ uri: item.img }} style={styles.productImg} />
                    <View style={styles.productInfo}>
                       <Text style={styles.brand}>{item.brand}</Text>
                       <Text style={styles.title}>{item.title}</Text>
                       <Text style={styles.specs}>Size: {item.size} Qty: {item.qty}</Text>
                       <View style={styles.deliveryTag}>
                          <Ionicons name="bus-outline" size={12} color="#000" />
                          <Text style={styles.deliveryText}>Delivery by 19th Nov</Text>
                       </View>
                       <View style={styles.priceRow}>
                          <Text style={styles.oldPrice}>₹{item.oldPrice.toLocaleString()}</Text>
                          <Text style={styles.newPrice}>₹{item.price.toLocaleString()}</Text>
                       </View>
                    </View>
                 </View>
               </View>
             ))}
          </ScrollView>
          <View style={styles.paginationDots}>
             <View style={styles.dotActive} />
             <View style={styles.dotInactive} />
             <View style={styles.dotInactive} />
          </View>
        </View>

       

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(tabs)/categories')}>
            <Text style={styles.primaryBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Review your order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
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
  },
  scrollContent: {
    paddingBottom: 40,
  },
  successBox: {
    alignItems: 'center',
    padding: 40,
  },
  iconContainer: {
    width: 150,
    height: 150,
    position: 'relative',
    marginBottom: 30,
  },
  successImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    opacity: 0.3,
  },
  checkCircle: {
    position: 'absolute',
    top: 0,
    right: -10,
    backgroundColor: '#000',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  congrats: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    marginBottom: 20,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  copyBtn: {
    padding: 4,
  },
  summarySection: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
  },
  itemsCount: {
    fontSize: 14,
  },
  carousel: {
    width: width - 32,
  },
  productCard: {
    width: width - 32,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
  },
  productContent: {
    flexDirection: 'row',
  },
  productImg: {
    width: 80,
    height: 80,
    backgroundColor: '#F9F9F9',
    borderRadius: 4,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  brand: {
    fontSize: 11,
    color: '#8E8E93',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  specs: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 6,
  },
  deliveryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  deliveryText: {
    fontSize: 10,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#8E8E93',
    marginRight: 8,
  },
  newPrice: {
    fontSize: 14,
    fontWeight: '800',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
    marginHorizontal: 4,
  },
  dotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  actionSection: {
    padding: 16,
    marginTop: 20,
  },
  primaryBtn: {
    backgroundColor: '#000',
    height: 54,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryBtn: {
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  }
});