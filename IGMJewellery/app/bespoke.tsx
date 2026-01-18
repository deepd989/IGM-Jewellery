import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, RotateCcw, Gem, Home, Phone, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const BespokeScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={{padding: 8, borderRadius: 10 }} onPress={() => router.back()}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bespoke</Text>
        <View style={styles.iconButton}>
          {/* <RotateCcw color="#000" size={20} /> */}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Bespoke Jewellery,{"\n"}You Design We Deliver</Text>
          <Text style={styles.heroSubtitle}>
            Customise your jewellery from scratch. You design we deliver
          </Text>

          {/* Ring Image & Floating Badges */}
          <View style={styles.imageContainer}>
             {/* Placeholder for the main ring image */}
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1605100804763-247f67b3f413?q=80&w=500' }} 
              style={styles.mainRing}
              resizeMode="contain"
            />
            
            {/* Absolute Badges */}
            <View style={[styles.badge, { top: 20, right: 0 }]}>
              <Text style={styles.badgeText}>❤️ Custom design</Text>
            </View>
            <View style={[styles.badge, { bottom: 40, left: -20 }]}>
              <Text style={styles.badgeText}>💍 Made with love</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaText}>Start Customisation</Text>
            <ArrowRight color="#fff" size={18} />
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
           <View style={styles.line} />
           <View style={styles.diamond} />
           <View style={styles.line} />
        </View>

        {/* Timeline Section */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Here's How Bespoke Works</Text>
          <Text style={styles.sectionSubtitle}>
            Bespoke happens in 5 simple steps. Customise your jewellery from scratch.
          </Text>

          <TimelineItem 
            Icon={Gem} 
            title="Send us your idea" 
            desc="Make Sketches or attach images" 
            isLast={false} 
          />
          <TimelineItem 
            Icon={Home} 
            title="We will assign a Designer" 
            desc="Select you convenient date, time, and place" 
            isLast={false} 
          />
          <TimelineItem 
            Icon={Phone} 
            title="Get on a call to discuss" 
            desc="Our consultant will get you your chosen designs" 
            isLast={false} 
          />
          <TimelineItem 
            Icon={ShoppingBag} 
            title="Complete the partial payment" 
            desc="Our consultant will get you your chosen designs" 
            isLast={true} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const TimelineItem = ({ Icon, title, desc, isLast }) => (
  <View style={styles.timelineRow}>
    <View style={styles.timelineLeft}>
      <View style={styles.iconCircle}>
        <Icon color="#000" size={20} />
      </View>
      {!isLast && <View style={styles.verticalLine} />}
      {!isLast && <View style={styles.smallDiamond} />}
      {!isLast && <View style={styles.verticalLine} />}
    </View>
    <View style={styles.timelineRight}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemDesc}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  iconButton: { padding: 8, borderRadius: 10, },
  
  heroSection: { alignItems: 'center', padding: 20 },
  heroTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', color: '#333' },
  heroSubtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 10, paddingHorizontal: 20 },
  
  imageContainer: { width: '100%', height: 250, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  mainRing: { width: 250, height: 200 },
  badge: {
    position: 'absolute',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  badgeText: { fontSize: 12, color: '#666' },

  ctaButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  ctaText: { color: '#fff', fontWeight: 'bold', marginRight: 10 },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 30 },
  line: { height: 1, width: 60, backgroundColor: '#ccc' },
  diamond: { width: 8, height: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', transform: [{ rotate: '45deg' }], marginHorizontal: 5 },

  timelineSection: { paddingHorizontal: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  sectionSubtitle: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 30, marginTop: 5 },
  
  timelineRow: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { alignItems: 'center', marginRight: 20 },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  verticalLine: { width: 1, height: 20, backgroundColor: '#333' },
  smallDiamond: { width: 6, height: 6, borderWidth: 1, borderColor: '#333', transform: [{ rotate: '45deg' }] },
  
  timelineRight: { flex: 1, paddingTop: 5, paddingBottom: 30 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemDesc: { fontSize: 13, color: '#888', marginTop: 4 },
});

export default BespokeScreen;