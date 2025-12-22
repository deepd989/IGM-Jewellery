
import { useGetPrivacyPoliciesQuery } from '@/store/apis/profile';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const CATEGORIES = ['Payment', 'Brands', 'Orders', 'Try At Home', 'Ai Sonar'];

export default function PrivacyPoliciesScreen() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState('Payment');
  const { data: policy, isLoading } = useGetPrivacyPoliciesQuery(activeCat);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policies</Text>
        <TouchableOpacity>
           <View style={styles.helpBadge}>
              <Text style={styles.helpText}>Help?</Text>
              <Ionicons name="call-outline" size={18} color="#000" />
           </View>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveCat(cat)}
              style={[styles.tab, activeCat === cat && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeCat === cat && styles.activeTabText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.introTitle}>Below are our Privacy Policies for the company</Text>
        
        {isLoading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          <View style={styles.content}>
            <Text style={styles.bodyText}>{policy?.content}</Text>
            <Text style={styles.bodyText}>{policy?.content}</Text>
            <Text style={styles.bodyText}>{policy?.content}</Text>
          </View>
        )}

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
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  helpBadge: { flexDirection: 'row', alignItems: 'center' },
  helpText: { fontSize: 13, marginRight: 8 },
  tabContainer: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tab: { paddingHorizontal: 16, paddingVertical: 12, marginRight: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#000' },
  tabText: { color: '#888', fontWeight: '600' },
  activeTabText: { color: '#000' },
  scroll: { padding: 16, paddingBottom: 100 },
  introTitle: { fontSize: 15, fontWeight: '700', marginBottom: 20 },
  content: { gap: 16 },
  bodyText: { fontSize: 13, color: '#888', lineHeight: 22 },
  loading: { textAlign: 'center', marginTop: 40 },
  contactSection: { marginTop: 60, alignItems: 'center' },
  contactTitle: { fontSize: 13, color: '#333', marginBottom: 20 },
  contactRow: { flexDirection: 'row', gap: 12 },
  contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, minWidth: 150 },
  contactBtnText: { marginLeft: 8, fontWeight: '600' },
});
