
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, SPACING } from '../../constants/theme';
import { useGetOrdersQuery } from '@/store/apis/profile';

export default function AllOrdersScreen() {
  const router = useRouter();
  const { data: orders, isLoading } = useGetOrdersQuery();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchFilterRow}>
         <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#888" />
            <TextInput placeholder="Search in order" style={styles.searchInput} />
         </View>
         <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#000" />
            <Text style={styles.filterText}>FILTER</Text>
         </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {isLoading ? (
          <Text style={styles.loading}>Loading orders...</Text>
        ) : (
          orders?.map((order) => (
            <View key={order.id} style={styles.orderCard}>
               <View style={styles.orderHeader}>
                  <View style={styles.orderIconBox}>
                     <Ionicons name={order.statusSummary.includes('Delivered') && !order.statusSummary.includes('Progress') ? "cube-outline" : "bus-outline"} size={22} color="#000" />
                  </View>
                  <View style={styles.orderMeta}>
                     <Text style={styles.orderId}>Order ID <Text style={{fontWeight: '800'}}>{order.displayId}</Text></Text>
                     <Text style={styles.orderDate}>Placed on {order.orderDate}</Text>
                  </View>
                  <View style={styles.orderPriceBox}>
                     <Text style={styles.orderPrice}>₹{order.totalAmount.toLocaleString()}</Text>
                     <Text style={styles.orderCount}>{order.itemCount} items</Text>
                  </View>
               </View>

               <View style={styles.statusBanner}>
                  <Text style={styles.statusSummaryText}>{order.statusSummary}</Text>
               </View>

               {order.items.map((item, idx) => (
                 <TouchableOpacity 
                   key={item.id} 
                   style={[styles.subItem, idx === order.items.length - 1 && { borderBottomWidth: 0 }]}
                   onPress={() => router.push(`/orders/${order.id}`)}
                  >
                    <View style={styles.subItemThumb} />
                    <View style={styles.subItemDetails}>
                       <View style={styles.statusRow}>
                          <Ionicons 
                            name={item.status === 'Delivered' ? "checkmark-circle" : "ellipse-outline"} 
                            size={14} 
                            color="#000" 
                          />
                          <Text style={styles.statusLabel}>{item.status} on {item.statusDate}</Text>
                       </View>
                       <Text style={styles.subItemTitle}>{item.product.title}</Text>
                       <Text style={styles.subItemPrice}>₹{item.price.toLocaleString()}</Text>
                       {item.status === 'Delivered' && (
                         <View style={styles.exchangeTag}>
                            <Ionicons name="refresh-outline" size={12} color="#000" />
                            <Text style={styles.exchangeText}>Exchange/replacement eligible till <Text style={{fontWeight:'700'}}>30 April, 2025</Text></Text>
                         </View>
                       )}
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#CCC" />
                 </TouchableOpacity>
               ))}

               {order.statusSummary === 'Order Delivered' && (
                 <View style={styles.ratingRow}>
                    <View style={styles.stars}>
                       {[1,2,3,4,5].map(i => <Ionicons key={i} name="star-outline" size={20} color="#BBB" />)}
                    </View>
                    <TouchableOpacity><Text style={styles.writeReview}>Write Review</Text></TouchableOpacity>
                 </View>
               )}
            </View>
          ))
        )}

        <View style={styles.paymentLogos}>
           {['logo-apple', 'card-outline', 'wallet-outline', 'card-outline', 'logo-amazon'].map((icon, i) => (
             <Ionicons key={i} name={icon as any} size={28} color="#000" style={{marginHorizontal: 10}} />
           ))}
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>For any queries, feel free to contact us:</Text>
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="call-outline" size={20} />
              <Text style={styles.contactBtnText}>Call Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="chatbubble-outline" size={20} />
              <Text style={styles.contactBtnText}>Chat With Us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF' },
  backBtn: { width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  searchFilterRow: { flexDirection: 'row', padding: 16, backgroundColor: '#FFF', gap: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 25, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#EEE' },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterText: { fontSize: 12, fontWeight: '700' },
  scroll: { paddingBottom: 60 },
  orderCard: { backgroundColor: '#FFF', margin: 16, marginTop: 8, borderRadius: 12, overflow: 'hidden' },
  orderHeader: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  orderIconBox: { width: 44, height: 44, backgroundColor: '#F5F5F5', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  orderMeta: { flex: 1, marginLeft: 12 },
  orderId: { fontSize: 13 },
  orderDate: { fontSize: 11, color: '#888', marginTop: 2 },
  orderPriceBox: { alignItems: 'flex-end' },
  orderPrice: { fontSize: 14, fontWeight: '700' },
  orderCount: { fontSize: 11, color: '#888' },
  statusBanner: { backgroundColor: '#F5F5F5', padding: 10, marginHorizontal: 16, borderRadius: 4 },
  statusSummaryText: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  subItem: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', alignItems: 'center' },
  subItemThumb: { width: 60, height: 70, backgroundColor: '#F9F9F9', borderRadius: 4 },
  subItemDetails: { flex: 1, marginLeft: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  statusLabel: { fontSize: 11, color: '#666' },
  subItemTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  subItemPrice: { fontSize: 13, fontWeight: '600' },
  exchangeTag: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  exchangeText: { fontSize: 10, color: '#444' },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  stars: { flexDirection: 'row', gap: 4 },
  writeReview: { fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },
  paymentLogos: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 32, opacity: 0.5 },
  contactSection: { alignItems: 'center', padding: 16 },
  contactTitle: { fontSize: 13, color: '#333', marginBottom: 20 },
  contactRow: { flexDirection: 'row', gap: 12 },
  contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, minWidth: 150, backgroundColor: '#FFF' },
  contactBtnText: { marginLeft: 8, fontWeight: '600' },
  loading: { textAlign: 'center', marginTop: 40 },
});
