import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const cardWidth = Math.max(92,(width - 50) / 3); 

export default function GiftExplore() {
  const categories = [
    // Row 1 (partially hidden at top)
    { id: 1, title: 'Premium Gifts', size: 'large' },
    { id: 2, title: 'Luxury Items', size: 'medium' },
    { id: 3, title: 'Special', size: 'large' },
    
    // Row 2
    { id: 4, title: 'Shop e-gifts', size: 'large' },
    { id: 5, title: "Men's gifting", size: 'medium' },
    { id: 6, title: 'Under 30k', size: 'large' },
    
    // Row 3
    { id: 7, title: 'Gifts for Wife', size: 'large' },
    { id: 8, title: 'Quick delivery', size: 'medium' },
    { id: 9, title: 'Personalised', size: 'large' },
    
    // Row 4 (partially hidden at bottom)
    { id: 10, title: 'Trending', size: 'large' },
    { id: 11, title: 'Best Sellers', size: 'medium' },
    { id: 12, title: 'New Arrivals', size: 'large' },
  ];

  const renderCard = (item) => {
    const isLarge = item.size === 'large';
    const cardStyle = isLarge ? styles.largeCard : styles.mediumCard;
    
    return (
      <TouchableOpacity 
        key={item.id} 
        style={[styles.card, cardStyle]}
        activeOpacity={0.7}
      >
        <Text style={styles.cardText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderRow = (startIndex) => {
    return (
      <View style={styles.row}>
        <View style={styles.column}>
          {renderCard(categories[startIndex])}
        </View>
        <View style={styles.column}>
          {renderCard(categories[startIndex + 1])}
        </View>
        <View style={styles.column}>
          {renderCard(categories[startIndex + 2])}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Gifts wrapped with love</Text>
        <Text style={styles.subtitle}>
          Personalised realtime{'\n'}recommendations with Style AI
        </Text>
      </View>

      {/* Grid with Gradients */}
      <View style={styles.gridContainer}>
        {/* Top Gradient - fades from invisible at top to visible at bottom */}
        <LinearGradient
          colors={['#FAFAFA', 'rgba(250, 250, 250, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.topGradient}
          pointerEvents="none"
        />
        
        <View style={styles.cardsWrapper}>
          {renderRow(0)}
          {renderRow(3)}
          {renderRow(6)}
          {renderRow(9)}
        </View>

        {/* Bottom Gradient - fades from visible at top to invisible at bottom */}
        <LinearGradient
          colors={['rgba(250, 250, 250, 0)', '#FAFAFA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.bottomGradient}
          pointerEvents="none"
        />
      </View>

      {/* Explore All Button */}
      <TouchableOpacity style={styles.exploreButton} activeOpacity={0.8}>
        <Text style={styles.exploreText}>Explore all</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  gridContainer: {
    height: 500, // Fixed height for the grid area
    position: 'relative',
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardsWrapper: {
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: -90, // Shift content up so top row is half hidden
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  column: {
    width: cardWidth,
  },
  card: {
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'flex-end',
  },
  largeCard: {
    height: 140,
  },
  mediumCard: {
    height: 120,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 10,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    zIndex: 10,
  },
  exploreButton: {
    backgroundColor: '#000000',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  exploreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});