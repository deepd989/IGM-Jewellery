
import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';


export default function LanguageCurrencyScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const prefs = useSelector((state: RootState) => state.user.preferences);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language & Currency</Text>
        <TouchableOpacity style={styles.helpBadge}>
           <Text style={styles.helpText}>Help?</Text>
           <Ionicons name="call-outline" size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.group}>
          <Text style={styles.label}>Select Language</Text>
          <TouchableOpacity style={styles.picker}>
             <Text style={styles.pickerVal}>(EN) {prefs.language}</Text>
             <Ionicons name="chevron-down" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Choose Currency</Text>
          <TouchableOpacity style={styles.picker}>
             <Text style={styles.pickerVal}>(₹) {prefs.currency}</Text>
             <Ionicons name="chevron-down" size={20} />
          </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  helpBadge: { flexDirection: 'row', alignItems: 'center' },
  helpText: { fontSize: 13, marginRight: 8 },
  content: { padding: 24 },
  group: { marginBottom: 32 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  picker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9F9F9', height: 54, borderRadius: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#EEE' },
  pickerVal: { fontSize: 14, fontWeight: '500' },
  contactSection: { marginTop: 100, alignItems: 'center' },
  contactTitle: { fontSize: 13, color: '#333', marginBottom: 20 },
  contactRow: { flexDirection: 'row', gap: 12 },
  contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, minWidth: 150 },
  contactBtnText: { marginLeft: 8, fontWeight: '600' },
});
