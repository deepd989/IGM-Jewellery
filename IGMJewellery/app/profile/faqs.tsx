
import { useGetFAQsQuery } from '@/store/apis/profile';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { LayoutAnimation, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const CATEGORIES = ['Payment', 'Brands', 'Orders', 'Try At Home', 'Ai Sonar'];

export default function FAQScreen() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState('Payment');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: faqs, isLoading } = useGetFAQsQuery(activeCat);

  const toggleAccordion = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQs</Text>
        <TouchableOpacity>
           <View style={styles.helpBadge}>
              <Text style={styles.helpText}>Help?</Text>
              <Ionicons name="call-outline" size={18} color="#000" />
           </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#888" />
          <TextInput placeholder="Search your queries" style={styles.searchInput} />
          <Ionicons name="mic-outline" size={20} color="#000" />
        </View>
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
        {isLoading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          faqs?.map(faq => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity 
                style={styles.faqHeader} 
                onPress={() => toggleAccordion(faq.id)}
              >
                <Text style={styles.question}>{faq.question}</Text>
                <Ionicons name={expandedId === faq.id ? "chevron-up" : "chevron-down"} size={20} color="#000" />
              </TouchableOpacity>
              {expandedId === faq.id && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))
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
  searchSection: { padding: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 25, paddingHorizontal: 16, height: 50 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
  tabContainer: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tab: { paddingHorizontal: 16, paddingVertical: 12, marginRight: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#000' },
  tabText: { color: '#888', fontWeight: '600' },
  activeTabText: { color: '#000' },
  scroll: { paddingBottom: 100 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#F9F9F9' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  question: { flex: 1, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  answerContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  answer: { fontSize: 13, color: '#888', lineHeight: 20 },
  loading: { textAlign: 'center', marginTop: 20 },
  contactSection: { marginTop: 40, alignItems: 'center', padding: 16 },
  contactTitle: { fontSize: 13, color: '#333', marginBottom: 20 },
  contactRow: { flexDirection: 'row', gap: 12 },
  contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, minWidth: 150 },
  contactBtnText: { marginLeft: 8, fontWeight: '600' },
});
