import { Product } from '@/interfaces/product.interface';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';


// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  product: Product;
}

const AccordionItem = ({ title, children, isOpen, onToggle }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
  <View style={styles.itemContainer}>
    <TouchableOpacity style={styles.header} onPress={onToggle} activeOpacity={0.8}>
      <Text style={styles.headerText}>{title}</Text>
      <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={COLORS.text} />
    </TouchableOpacity>
    {isOpen && (
      <View style={styles.content}>
        {children}
      </View>
    )}
  </View>
);

export const ProductAccordion: React.FC<AccordionProps> = ({ product }) => {
  const [openSection, setOpenSection] = useState<string | null>('PRODUCT DETAIL');

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <View style={styles.container}>
      {/* Visual Menu Bar - purely illustrative based on screenshot */}
      <View style={styles.menuBar}>
         <View style={styles.menuItem}>
           <Ionicons name="diamond-outline" size={24} color={COLORS.primary} style={styles.menuIcon} />
           <Text style={styles.menuText}>Product Detail</Text>
           <View style={styles.activeDot} />
         </View>
         <View style={[styles.menuItem, { opacity: 0.3 }]}>
           <Ionicons name="cash-outline" size={24} color={COLORS.primary} style={styles.menuIcon} />
           <Text style={styles.menuText}>Price Breakdown</Text>
         </View>
      </View>

      <AccordionItem 
        title="PRODUCT DETAIL" 
        isOpen={openSection === 'PRODUCT DETAIL'}
        onToggle={() => toggleSection('PRODUCT DETAIL')}
      >
        <Text style={styles.sku}>SKU {product.sku || 'UE399-G0000'}</Text>
        <View style={styles.detailGrid}>
            <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>MATERIAL</Text>
                <View style={styles.tagRow}>
                    <Text style={styles.tag}>14 KT</Text>
                    <Text style={styles.tag}>Yellow Gold</Text>
                </View>
                <View style={styles.tagRow}>
                    <Text style={styles.tag}>0.00 g</Text>
                    <Text style={styles.tag}>0.880 g</Text>
                </View>
                <View style={styles.tagRow}>
                    <Text style={styles.tag}>0.024 C</Text>
                    <Text style={styles.tag}>FG SI</Text>
                </View>
            </View>
            
            <View style={styles.verticalDivider} />

            <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>DIMENSIONS</Text>
                <Text style={styles.tag}>3 mm (Width)</Text>
                <Text style={styles.tag}>3 mm (Height)</Text>
                <Text style={styles.tag}>0.610 g (Gross wt)</Text>
            </View>
        </View>
      </AccordionItem>

      <AccordionItem 
        title="GENERAL DETAIL" 
        isOpen={openSection === 'GENERAL DETAIL'}
        onToggle={() => toggleSection('GENERAL DETAIL')}
      >
        <Text style={styles.descriptionTitle}>Gold Unisex ring 24k, Kalyan Jewellers</Text>
        <Text style={styles.descriptionText}>
          {product.description || "Celebrate every day in style with the subtle grace of these drop earrings crafted in 22 Karat Yellow Gold in a leaf design."}
        </Text>
      </AccordionItem>

      <AccordionItem 
        title="OUR STORY" 
        isOpen={openSection === 'OUR STORY'}
        onToggle={() => toggleSection('OUR STORY')}
      >
        <View style={styles.storyContent}>
            <View style={styles.storyFeatures}>
                <Text style={styles.storyText}>100% Certified | 15 Days return | 1 year Warranty</Text>
            </View>
            <View style={styles.storyBrandBox}>
                <View style={styles.placeholderLogo} />
                <Text style={styles.storyTitle}>ABOUT {product.brand.toUpperCase()}</Text>
                <Text style={styles.storyDesc}>
                    Celebrate every day in style with the subtle grace of these drop earrings crafted in 22 Karat Yellow Gold in a leaf design.
                </Text>
                <TouchableOpacity style={styles.exploreBtn}>
                    <Text style={styles.exploreBtnText}>Explore Brand</Text>
                    <Ionicons name="chevron-forward" size={14} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
      </AccordionItem>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 8,
    borderTopColor: '#F9F9F9',
  },
  menuBar: {
    flexDirection: 'row',
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  menuIcon: {
    marginBottom: 8,
  },
  menuText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },
  activeDot: {
    position: 'absolute',
    bottom: -SPACING.s - 1, // To sit on the border
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: '#FFF',
    transform: [{ rotate: '45deg' }],
    zIndex: 10,
  },

  // Accordion Item
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    textTransform: 'uppercase',
  },
  content: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
  },
  
  // Product Detail Content
  sku: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  detailGrid: {
    flexDirection: 'row',
  },
  detailCol: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: SPACING.m,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
    letterSpacing: 0.5,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: COLORS.text,
    overflow: 'hidden',
    marginBottom: 8,
  },

  // General Detail Content
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // Story Content
  storyContent: {
    alignItems: 'center',
  },
  storyFeatures: {
    backgroundColor: '#F9F9F9',
    width: '100%',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  storyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  storyBrandBox: {
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
  },
  placeholderLogo: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    marginBottom: SPACING.m,
  },
  storyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SPACING.s,
    textTransform: 'uppercase',
  },
  storyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.m,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  exploreBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
});