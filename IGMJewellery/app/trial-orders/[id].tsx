
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING } from '../../constants/theme';
import { useGetTrialRequestByIdQuery } from '@/store/apis/profile';

export default function TrialDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: trial, isLoading } = useGetTrialRequestByIdQuery(id as string);

  if (isLoading) return <SafeAreaView style={styles.container}><Text style={styles.loading}>Loading...</Text></SafeAreaView>;
  if (!trial) return null;

  const isDelivered = trial.status === 'Delivered';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Try at Home</Text>
        <TouchableOpacity style={styles.helpRow}>
           <Text style={styles.helpText}>Help?</Text>
           <Ionicons name="call-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.statusHeader}>
         <Text style={styles.requestId}>Request ID <Text style={{fontWeight:'800'}}>{trial.displayId}</Text></Text>
         <View style={styles.statusBadge}>
            {isDelivered && <Ionicons name="checkmark-circle" size={14} color="#000" style={{marginRight: 4}} />}
            <Text style={styles.statusBadgeText}>{id === 'tr_delivered' ? 'Delivered' : 'In Transit'}</Text>
         </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
         <View style={styles.brandRow}>
            <Text style={styles.brandName}>Kalyan Jewellers</Text>
            <Text style={styles.itemCount}>{trial.items.length} Items</Text>
         </View>

         {trial.items.map((item, idx) => (
           <View key={idx} style={styles.productCard}>
              <View style={styles.productThumb} />
              <View style={styles.productInfo}>
                 <Text style={styles.productTitle}>{item.title}</Text>
                 <Text style={styles.productSpecs}>{item.description}</Text>
                 {!isDelivered && <Text style={styles.availableLabel}>Available</Text>}
              </View>
              {isDelivered && (
                <TouchableOpacity style={styles.addBagBtn}>
                   <Ionicons name="add" size={20} />
                   <Text style={styles.addBagText}>Add to Bag</Text>
                </TouchableOpacity>
              )}
           </View>
         ))}

         <View style={styles.timelineSection}>
            <View style={styles.timelineHeader}>
               <Text style={styles.sectionTitle}>Status</Text>
               <View style={styles.timelineStatusLabel}>
                  <Ionicons name="checkmark-circle" size={16} color="#000" />
                  <Text style={styles.timelineLabelText}>{trial.statusLabel}</Text>
               </View>
            </View>
            
            <View style={styles.progressContainer}>
               <View style={styles.progressDot} />
               <View style={[styles.progressLine, { width: '90%' }]} />
               <View style={styles.activeProgressDot} />
            </View>

            <View style={styles.timelineDates}>
               <View>
                  <Text style={styles.dateLabel}>Requested On</Text>
                  <Text style={styles.dateValue}>{trial.requestedDate}</Text>
               </View>
               <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.dateLabel}>{isDelivered ? 'Delivery Date' : 'Appointment Date'}</Text>
                  <Text style={styles.dateValue}>{trial.appointmentDate}</Text>
               </View>
            </View>
         </View>

         {isDelivered ? (
           <View style={styles.deliveredMsgBox}>
              <Text style={styles.msgText}>Your return is automatically scheduled for <Text style={{fontWeight:'700'}}>Fri, 23 April, 2025</Text></Text>
           </View>
         ) : (
           <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>
                Please note: A replica of the original product will be sent to you. The return of the products will be automatically scheduled for 2 days after the delivery date
              </Text>
           </View>
         )}

         {isDelivered && (
            <Text style={styles.deliveredSubMsg}>
              Please ensure all items are neatly packed and handed over to pur delivery partner
            </Text>
         )}

         <View style={styles.bookingSection}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <View style={styles.bookingList}>
               <View style={styles.bookingItem}>
                  <Ionicons name="calendar-outline" size={20} color="#000" />
                  <Text style={styles.bookingText}>Date: Sunday, November 30, 2025</Text>
               </View>
               <View style={styles.bookingItem}>
                  <Ionicons name="time-outline" size={20} color="#000" />
                  <Text style={styles.bookingText}>Time: 12:00 PM</Text>
               </View>
               <View style={styles.bookingItem}>
                  <Ionicons name="home-outline" size={20} color="#000" />
                  <Text style={styles.bookingText}>Address: Andheri West, Mumbai</Text>
               </View>
               <View style={styles.bookingItem}>
                  <Ionicons name="storefront-outline" size={20} color="#000" />
                  <Text style={styles.bookingText}>Nearest Store: {trial.nearestStore}</Text>
               </View>
            </View>
         </View>

         <View style={styles.footerInfo}>
            <Text style={styles.footerMsg}>
              {isDelivered 
                ? 'Our delivery partner will reach out to you via your registered mobile number at the time of pick up'
                : 'Our delivery partner will reach out to you via your registered mobile number when the items are ready'
              }
            </Text>
         </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  backBtn: { width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  helpRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  helpText: { fontSize: 13 },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#F5F5F5' },
  requestId: { fontSize: 13 },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  statusBadgeText: { fontSize: 13, fontWeight: '600' },
  scroll: { paddingBottom: 60 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  brandName: { fontSize: 15, fontWeight: '700' },
  itemCount: { fontSize: 13, color: '#888' },
  productCard: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', alignItems: 'center' },
  productThumb: { width: 70, height: 80, backgroundColor: '#F9F9F9', borderRadius: 4, marginRight: 16 },
  productInfo: { flex: 1 },
  productTitle: { fontSize: 14, fontWeight: '700' },
  productSpecs: { fontSize: 11, color: '#666', marginTop: 4, lineHeight: 16 },
  availableLabel: { fontSize: 11, color: '#888', marginTop: 8 },
  addBagBtn: { alignItems: 'center' },
  addBagText: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  timelineSection: { padding: 16 },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  timelineStatusLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timelineLabelText: { fontSize: 13, fontWeight: '600' },
  progressContainer: { height: 3, backgroundColor: '#F0F0F0', width: '100%', marginBottom: 16, position: 'relative', marginTop: 8 },
  progressDot: { position: 'absolute', left: 0, top: -4, width: 10, height: 10, borderRadius: 5, backgroundColor: '#000', borderWidth: 1, borderColor: '#000' },
  activeProgressDot: { position: 'absolute', right: 0, top: -4, width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#000' },
  progressLine: { height: 3, backgroundColor: '#000' },
  timelineDates: { flexDirection: 'row', justifyContent: 'space-between' },
  dateLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  dateValue: { fontSize: 13, fontWeight: '700' },
  noticeBox: { padding: 16 },
  noticeText: { fontSize: 12, color: '#888', lineHeight: 18 },
  deliveredMsgBox: { backgroundColor: '#F5F5F5', padding: 16, marginHorizontal: 16, borderRadius: 4 },
  msgText: { fontSize: 12, textAlign: 'center' },
  deliveredSubMsg: { fontSize: 12, color: '#888', padding: 16, textAlign: 'center', lineHeight: 18 },
  bookingSection: { padding: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0', marginTop: 12 },
  bookingList: { marginTop: 16, gap: 16 },
  bookingItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bookingText: { fontSize: 13 },
  footerInfo: { padding: 32, alignItems: 'center' },
  footerMsg: { fontSize: 12, color: '#888', textAlign: 'center', lineHeight: 18 },
  loading: { textAlign: 'center', marginTop: 40 },
});
