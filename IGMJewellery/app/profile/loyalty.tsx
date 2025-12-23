
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/store';

export default function LoyaltyScreen() {
  const router = useRouter();
  const profile = useSelector((state: RootState) => state.user.profile);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loyalty Points</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroSection}>
          <View style={styles.pointsCircle}>
             <Ionicons name="trophy-outline" size={24} color="#000" />
             <Text style={styles.bigPoints}>{profile.points}</Text>
          </View>
          <Text style={styles.thankYou}>Thank you for being our loyal customer</Text>
          <Text style={styles.since}>Customer since {profile.memberSince}</Text>
          <View style={styles.tierBadge}>
             <Ionicons name="diamond" size={12} color="#000" />
             <Text style={styles.tierText}>{profile.tier}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
           <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '40%' }]} />
              <Ionicons name="star" size={20} color="#000" style={styles.starCursor} />
           </View>
           <View style={styles.milestones}>
              <View style={styles.milestone}>
                 <Text style={styles.milePrice}>₹5,000</Text>
                 <Text style={styles.mileLabel}>New Shopper</Text>
              </View>
              <View style={styles.milestone}>
                 <Text style={styles.milePrice}>₹50,000</Text>
                 <View style={styles.activeMile}>
                    <Ionicons name="diamond" size={10} />
                    <Text style={styles.activeMileText}>Elite Shopper</Text>
                 </View>
              </View>
              <View style={styles.milestone}>
                 <Text style={styles.milePrice}>₹1,50,000</Text>
                 <Text style={styles.mileLabel}>IGM Star</Text>
              </View>
           </View>
        </View>

        <View style={styles.pointsSummaryBox}>
           <View style={styles.summaryLeft}>
              <View style={styles.summaryIcon} />
              <View>
                 <Text style={styles.summaryPoints}>{profile.points}</Text>
                 <Text style={styles.summaryLabel}>Loyalty Points</Text>
              </View>
           </View>
           <View style={styles.summaryRight}>
              <Text style={styles.valueText}>= ₹500</Text>
              <TouchableOpacity><Text style={styles.redeemBtn}>Redeem Now</Text></TouchableOpacity>
           </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points Collected</Text>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={styles.pointRow}>
              <View style={styles.checkIcon}><Ionicons name="checkmark" size={16} color="#000" /></View>
              <View style={styles.pointInfo}>
                 <Text style={styles.pointValue}>+200</Text>
                 <Text style={styles.pointDesc}>First Purchase</Text>
              </View>
              <Text style={styles.pointEquivalent}>= ₹{i === 3 ? '500' : '50'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collect More Points</Text>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={styles.pointRow}>
              <View style={styles.infoIcon}><Ionicons name="alert-circle-outline" size={18} /></View>
              <View style={styles.pointInfo}>
                 <Text style={styles.pointValue}>200</Text>
                 <Text style={styles.pointDesc}>{i === 4 ? 'Post on instagram' : 'Write a Review'}</Text>
              </View>
              <View style={styles.collectAction}>
                 <Text style={styles.collectText}>Collect Now</Text>
                 <Text style={styles.pointEquivalent}>= ₹50</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.moreActivity}>
           <Text style={styles.moreTitle}>More activity → More Points</Text>
           <Text style={styles.moreSub}>Here’s how you can earn more rewards.</Text>
           {[
             { label: 'First App Login', val: '+20' },
             { label: 'First Review', val: '+100' },
             { label: 'Purchase over Rs 5,00', val: '+200' },
             { label: 'First App Login', val: '+2000' },
           ].map((item, idx) => (
             <View key={idx} style={styles.tableRow}>
                <Text style={styles.tableLabel}>{item.label}</Text>
                <Text style={styles.tableVal}>{item.val}</Text>
             </View>
           ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { paddingBottom: 60 },
  heroSection: { alignItems: 'center', padding: 24 },
  pointsCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EBEBEB', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  bigPoints: { fontSize: 20, fontWeight: '700' },
  thankYou: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  since: { fontSize: 12, color: '#888', marginBottom: 12 },
  tierBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  tierText: { fontSize: 11, fontWeight: '600', marginLeft: 4 },
  progressContainer: { padding: 24 },
  progressBar: { height: 2, backgroundColor: '#F0F0F0', position: 'relative', marginTop: 10 },
  progressFill: { height: 2, backgroundColor: '#000', position: 'absolute', left: 0 },
  starCursor: { position: 'absolute', top: -10, left: '40%' },
  milestones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  milestone: { alignItems: 'center' },
  milePrice: { fontSize: 10, color: '#888', marginBottom: 4 },
  mileLabel: { fontSize: 10, color: '#888' },
  activeMile: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  activeMileText: { fontSize: 10, fontWeight: '700', marginLeft: 4 },
  pointsSummaryBox: { flexDirection: 'row', backgroundColor: '#F5F5F5', margin: 16, borderRadius: 12, padding: 16, justifyContent: 'space-between', alignItems: 'center' },
  summaryLeft: { flexDirection: 'row', alignItems: 'center' },
  summaryIcon: { width: 48, height: 48, backgroundColor: '#CCC', borderRadius: 24, marginRight: 12 },
  summaryPoints: { fontSize: 18, fontWeight: '700' },
  summaryLabel: { fontSize: 12, color: '#666' },
  summaryRight: { alignItems: 'flex-end' },
  valueText: { fontSize: 18, fontWeight: '600' },
  redeemBtn: { fontSize: 12, color: '#000', fontWeight: '700', textDecorationLine: 'underline', marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 16 },
  pointRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkIcon: { width: 28, height: 28, backgroundColor: '#EBEBEB', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  infoIcon: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  pointInfo: { flex: 1 },
  pointValue: { fontSize: 14, fontWeight: '700' },
  pointDesc: { fontSize: 12, color: '#888' },
  pointEquivalent: { fontSize: 11, color: '#666' },
  collectAction: { alignItems: 'flex-end' },
  collectText: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  moreActivity: { padding: 16, marginTop: 24 },
  moreTitle: { fontSize: 15, fontWeight: '700' },
  moreSub: { fontSize: 12, color: '#888', marginTop: 4, marginBottom: 16 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tableLabel: { fontSize: 13, color: '#444' },
  tableVal: { fontSize: 14, fontWeight: '700' },
});
