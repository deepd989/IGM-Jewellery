import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { ProductCard } from '../products/ProductCard';
import { useSelector } from 'react-redux';
import { selectProducts } from '@/store/productSlice';

type ProfileHeaderProps = {
  profileImageUri: string;
  businessName: string;
  tagline: string;
  ratingText: string;
  storeButtonLabel: string;
  onEnterStore: () => void;
};

// Profile Header Component
const ProfileHeader = ({
  profileImageUri,
  businessName,
  tagline,
  ratingText,
  storeButtonLabel,
  onEnterStore,
}: ProfileHeaderProps) => (
  <View style={styles.headerContainer}>
    <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
    <Text style={styles.businessName}>{businessName}</Text>
    <Text style={styles.tagline}>{tagline}</Text>
    <View style={styles.actionRow}>
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>{ratingText}</Text>
      </View>
      <TouchableOpacity style={styles.storeButton} onPress={onEnterStore}>
        <Text style={styles.storeButtonText}>{storeButtonLabel}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

type TabNavigationProps = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

// Tab Navigation Component
const TabNavigation = ({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab} style={styles.tab} onPress={() => onTabChange(tab)}>
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          {activeTab === tab && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

type StatsCardProps = {
  label: string;
  value: string;
};

// Stats Card Component
const StatsCard = ({ label, value }: StatsCardProps) => (
  <View style={styles.statsCard}>
    <View style={styles.statsIcon} />
    <Text style={styles.statsLabel}>{label}</Text>
    <Text style={styles.statsValue}>{value}</Text>
  </View>
);

type HeritageSectionProps = {
  title: string;
  paragraphs: string[];
};

// Heritage Section Component
const HeritageSection = ({ title, paragraphs }: HeritageSectionProps) => (
  <View style={styles.heritageSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {paragraphs.map((p, idx) => (
      <Text key={idx} style={styles.sectionText}>
        {p}
      </Text>
    ))}
  </View>
);

type StatsRowProps = {
  stats: StatsCardProps[];
};

// Stats Row Component
const StatsRow = ({ stats }: StatsRowProps) => (
  <View style={styles.statsRow}>
    {stats.map((s, idx) => (
      <StatsCard key={`${s.label}-${idx}`} label={s.label} value={s.value} />
    ))}
  </View>
);

type BrandProfileProps = {
  header: ProfileHeaderProps;
  tabs: string[];
  initialActiveTab: string;
  heroImageUri: string;
  aboutSections: HeritageSectionProps[];
  stats: StatsCardProps[];
};

// Main Component
export default function BrandProfile({
  header,
  tabs,
  initialActiveTab,
  heroImageUri,
  aboutSections,
  stats,
}: BrandProfileProps) {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const products = useSelector(selectProducts);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ProfileHeader {...header} />
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'About' && (
        <View style={styles.contentContainer}>
          <Image source={{ uri: heroImageUri }} style={styles.imagePlaceholder} />
          {aboutSections.map((section, idx) => (
            <HeritageSection key={`${section.title}-${idx}`} title={section.title} paragraphs={section.paragraphs} />
          ))}
          <StatsRow stats={stats} />
        </View>
      )}

      {activeTab === 'Products' && (
        <View style={styles.productsContainer}>
              <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                  <ProductCard 
                    product={item} 
                    viewMode={'grid'} 
                    onPress={() => console.log('Product', item.id)} 
                  />
                )}
                showsVerticalScrollIndicator={false}
              />
              </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#d3d3d3',
    marginTop: 20,
    marginBottom: 20,
  },
  businessName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  ratingBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  storeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  storeButtonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 20,
  },
  heritageSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statsIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  productsContainer:{
    margin:10,
    alignItems:'center',
  }
});