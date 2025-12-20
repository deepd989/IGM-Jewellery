import { Product } from '@/interfaces/product.interface';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SPACING } from '../../constants/theme';
import { HowItWorks } from './HowItWorks';
import { TrialItemCard } from './TrailItemCard';


interface TrialTabContentProps {
  trialList: { product: Product }[];
  onRemove: (product: Product) => void;
}

export const TrialTabContent: React.FC<TrialTabContentProps> = ({ trialList, onRemove }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.trialBanner}>
        <Ionicons name="information-circle-outline" size={18} color="#000" />
        <Text style={styles.trialBannerText}>
          Home Trial available for <Text style={{fontWeight: '700'}}>maximum 3 designs from 1 brand only</Text>
        </Text>
      </View>

      {trialList.map((item, idx) => (
        <TrialItemCard 
          key={item.product.id}
          product={item.product}
          index={idx}
          total={trialList.length}
          onRemove={() => onRemove(item.product)}
        />
      ))}

      <HowItWorks />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: SPACING.m, paddingBottom: 100 },
  trialBanner: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', marginBottom: 16 },
  trialBannerText: { fontSize: 11, marginLeft: 8 },
});