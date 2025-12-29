
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, SPACING } from '../../constants/theme';
import { TrialStatus } from '@/interfaces/trail.interface';
import { useGetTrialRequestsQuery } from '@/store/apis/profile';


export default function TrialOrdersScreen() {
  const router = useRouter();
  const { data: trials, isLoading } = useGetTrialRequestsQuery();

  const getStatusIcon = (status: TrialStatus) => {
    switch (status) {
      case 'Scheduled': return 'time-outline';
      case 'Cancelled': return 'close-circle-outline';
      case 'Executed': return 'checkmark-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Try At Home</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search & Filter */}
      <View style={styles.searchRow}>
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
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          trials?.map((trial) => (
            <TouchableOpacity 
              key={trial.id} 
              style={styles.card}
              onPress={() => router.push(`/trial-orders/${trial.status === 'Executed' ? 'tr_delivered' : trial.id}`)}
            >
               <View style={styles.cardHeader}>
                  <View style={styles.statusLabelRow}>
                    <View style={styles.statusIconBox}>
                        <Ionicons name={getStatusIcon(trial.status) as any} size={22} color="#000" />
                    </View>
                    <View style={styles.meta}>
                        <Text style={styles.statusTitle}>{trial.statusLabel}</Text>
                        <Text style={styles.requestId}>Request Number {trial.displayId}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#000" />
               </View>

               <View style={styles.itemsPreview}>
                  {trial.items.slice(0, 3).map((_, i) => (
                    <View key={i} style={styles.itemThumb} />
                  ))}
                  {trial.items.length > 3 && (
                    <View style={styles.moreOverlay}>
                      <Text style={styles.moreText}>+{trial.items.length - 3}</Text>
                    </View>
                  )}
               </View>

               {trial.status === 'Scheduled' && (
                 <Text style={styles.brandInfo}>Products dispatched from <Text style={{fontWeight:'700'}}>Kalyan Jewellers, Mum- 400 011</Text></Text>
               )}

               <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, trial.status === 'Scheduled' ? {width: '30%'} : {width: '100%'}]} />
               </View>

               <View style={styles.dateRow}>
                  <View>
                     <Text style={styles.dateLabel}>Requested On</Text>
                     <Text style={styles.dateVal}>{trial.requestedDate}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                     <Text style={styles.dateLabel}>{trial.status === 'Cancelled' ? 'Cancellation Date' : 'Appointment Date'}</Text>
                     <Text style={styles.dateVal}>{trial.status === 'Cancelled' ? trial.cancellationDate : trial.appointmentDate}</Text>
                  </View>
               </View>

               {trial.status === 'Executed' && (
                 <View style={styles.ratingSection}>
                    <View style={styles.stars}>
                       {[1,2,3,4,5].map(i => <Ionicons key={i} name="star-outline" size={20} color="#BBB" style={{marginRight: 4}} />)}
                    </View>
                    <TouchableOpacity><Text style={styles.writeReview}>Write Review</Text></TouchableOpacity>
                 </View>
               )}
            </TouchableOpacity>
          ))
        )}

        {trials?.length && trials.length > 0 && (
          <View style={styles.reviewPrompt}>
             <Text style={styles.reviewPromptText}>Rate and review to earn <Text style={{fontWeight:'700', textDecorationLine: 'underline'}}>IGM points!</Text></Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF' },
  backBtn: { width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  searchRow: { flexDirection: 'row', padding: 16, backgroundColor: '#FFF', gap: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 25, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#EEE' },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterText: { fontSize: 12, fontWeight: '700' },
  scroll: { paddingBottom: 60 },
  card: { backgroundColor: '#FFF', margin: 16, marginTop: 8, borderRadius: 12, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statusLabelRow: { flexDirection: 'row', alignItems: 'center' },
  statusIconBox: { width: 40, height: 40, backgroundColor: '#F5F5F5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  meta: { flex: 1 },
  statusTitle: { fontSize: 15, fontWeight: '700' },
  requestId: { fontSize: 11, color: '#888', marginTop: 2 },
  itemsPreview: { flexDirection: 'row', gap: 8, marginBottom: 16, position: 'relative' },
  itemThumb: { width: 60, height: 70, backgroundColor: '#F9F9F9', borderRadius: 4 },
  moreOverlay: { position: 'absolute', right: 0, width: 60, height: 70, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  moreText: { color: '#FFF', fontWeight: '700' },
  brandInfo: { fontSize: 12, color: '#444', marginBottom: 16 },
  progressContainer: { height: 3, backgroundColor: '#F0F0F0', width: '100%', marginBottom: 16, position: 'relative' },
  progressBar: { height: 3, backgroundColor: '#000', borderRadius: 2 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dateLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  dateVal: { fontSize: 13, fontWeight: '700' },
  ratingSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F5F5F5', marginTop: 16, paddingTop: 16 },
  stars: { flexDirection: 'row' },
  writeReview: { fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },
  reviewPrompt: { padding: 16, alignItems: 'center' },
  reviewPromptText: { fontSize: 12, color: '#444' },
  loading: { textAlign: 'center', marginTop: 40 },
});
