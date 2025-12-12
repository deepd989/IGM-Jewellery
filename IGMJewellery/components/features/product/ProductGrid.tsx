import { Product } from '@/interfaces/category.interface';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '../../../constants/theme';


interface ProductGridProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const ProductCard = ({ product, onPress }: { product: Product; onPress: (p: Product) => void }) => (
  <TouchableOpacity 
    style={styles.card} 
    onPress={() => onPress(product)}
    accessibilityRole="button"
    accessibilityLabel={`View details for ${product.name}`}
  >
    <View style={styles.imageWrapper}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
      {product.isNew && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NEW</Text>
        </View>
      )}
    </View>
    <View style={styles.details}>
      <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
      <Text style={styles.price}>{product.currency}{product.price.toLocaleString()}</Text>
    </View>
  </TouchableOpacity>
);

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onProductPress,
  ListHeaderComponent 
}) => {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => <ProductCard product={item} onPress={onProductPress} />}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      // Performance Props
      removeClippedSubviews={true}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: (SIZES.width - SPACING.m * 3) / 2, // (Screen - Padding) / 2
    marginBottom: SPACING.m,
    backgroundColor: COLORS.background,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 0.8, // Tall images for jewelry
    borderRadius: SIZES.cardBorderRadius,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.s,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  details: {
    paddingHorizontal: 4,
  },
  name: {
    ...FONTS.body,
    color: COLORS.text,
    fontSize: 13,
  },
  price: {
    ...FONTS.price,
    fontSize: 14,
    marginTop: 2,
  },
});
