import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TrialConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const requestId = params.requestId || '#12345';
  const bookingDate = params.date || 'Sunday, November 30, 2025';
  const bookingTime = params.time || '12:00 PM';
  const location = params.location || 'Andheri West, Mumbai';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/categories')} style={styles.closeBtn}>
           <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Ionicons name="call-outline" size={24} color="#000" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={40} color="#FFF" />
        </View>

        <Text style={styles.title}>Try at home request received!</Text>
        <Text style={styles.subtitle}>Hey! Your booking will be confirmed shortly.</Text>

        <View style={styles.idBox}>
           <Text style={styles.idText}>Request No. {requestId}</Text>
           <Ionicons name="copy-outline" size={16} color="#000" />
        </View>

        <View style={styles.infoCard}>
           <Text style={styles.cardHeader}>Booking Details</Text>
           
           <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} />
              <Text style={styles.infoText}>{bookingDate}</Text>
           </View>

           <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} />
              <Text style={styles.infoText}>{bookingTime}</Text>
           </View>

           <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} />
              <Text style={styles.infoText}>{location}</Text>
           </View>

           <View style={styles.infoRow}>
              <Ionicons name="storefront-outline" size={20} />
              <View>
                 <Text style={styles.label}>Nearest Store</Text>
                 <Text style={styles.val}>Kalyan Jewellers, 400 066, Mumbai</Text>
              </View>
           </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
         <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Check Order Status</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(tabs)/categories')}>
            <Text style={styles.primaryText}>Continue Shopping</Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  closeBtn: { width: 44, height: 44, backgroundColor: '#F9F9F9', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', padding: 24 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 24, marginTop: 20 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#8E8E93', marginBottom: 24 },
  idBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 40 },
  idText: { fontSize: 14, fontWeight: '700', marginRight: 8 },
  infoCard: { width: '100%', padding: 20, backgroundColor: '#FAFAFA', borderRadius: 12 },
  cardHeader: { fontSize: 16, fontWeight: '700', marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  infoText: { marginLeft: 12, fontSize: 14, fontWeight: '500' },
  label: { marginLeft: 12, fontSize: 11, color: '#999' },
  val: { marginLeft: 12, fontSize: 13, fontWeight: '600' },
  footer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0', gap: 12, paddingBottom: Platform.OS === 'ios' ? 30 : 16 },
  secondaryBtn: { flex: 1, height: 54, justifyContent: 'center', alignItems: 'center' },
  secondaryText: { fontWeight: '600', color: '#666' },
  primaryBtn: { flex: 1.5, height: 54, backgroundColor: '#000', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  primaryText: { color: '#FFF', fontWeight: '700' }
});