import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { Category } from '@/interfaces/category.interface';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  variant?: 'grid' | 'list';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onPress,
  variant = 'grid' 
}) => {
  const isGrid = variant === 'grid';

  return (
    <TouchableOpacity 
      style={[styles.container, isGrid ? styles.gridContainer : styles.listContainer]} 
      onPress={() => onPress(category)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Browse ${category.name} category`}
    >
      <View style={[styles.imageContainer, isGrid ? styles.gridImage : styles.listImage]}>
        <Image 
          source={{ uri: category.imageUrl }} 
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        {/* Overlay for Grid View */}
        {isGrid && <View style={styles.overlay} />}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, isGrid && styles.gridTitle]} numberOfLines={1}>
          {category.name}
        </Text>
        <Text style={[styles.subtitle, isGrid && styles.gridSubtitle]}>
          {category.productCount} Items
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.cardBorderRadius,
    overflow: 'hidden',
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gridContainer: {
    flex: 1,
    marginHorizontal: SPACING.s / 2,
    maxWidth: '48%', // Rough calc for 2 columns
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.s,
  },
  imageContainer: {
    backgroundColor: '#E1E1E1',
  },
  gridImage: {
    width: '100%',
    height: 140,
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.cardBorderRadius / 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  content: {
    padding: SPACING.s,
    flex: 1,
  },
  title: {
    ...FONTS.subheader,
    fontSize: 16,
    marginBottom: 2,
  },
  gridTitle: {
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body,
    fontSize: 12,
  },
  gridSubtitle: {
    textAlign: 'center',
  },
});
