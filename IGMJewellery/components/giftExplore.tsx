import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollingColumn } from './scrollingColumn';

const GRID_HEIGHT = 500;

export default function GiftExplore() {
  const categories = [
    { id: 1, title: '🎁 Premium Gifts', size: 'large' },
    { id: 2, title: '💎 Luxury Items', size: 'medium' },
    { id: 3, title: '✨ Special', size: 'large' },
    { id: 4, title: '📧 Shop e-gifts', size: 'large' },
    { id: 5, title: '🕴️ Men’s gifting', size: 'medium' },
    { id: 6, title: '💸 Under 30k', size: 'large' },
    { id: 7, title: '💖 Gifts for Wife', size: 'large' },
    { id: 8, title: '🚚 Quick delivery', size: 'medium' },
    { id: 9, title: '✍️ Personalised', size: 'large' },
    { id: 10, title: '🔥 Trending', size: 'large' },
    { id: 11, title: '🏆 Best Sellers', size: 'medium' },
    { id: 12, title: '🆕 New Arrivals', size: 'large' },
  ];

  // Helper to split data into 3 vertical columns
  const col1 = [categories[0], categories[3], categories[6], categories[9]];
  const col2 = [categories[1], categories[4], categories[7], categories[10]];
  const col3 = [categories[2], categories[5], categories[8], categories[11]];

  const renderCard = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={[styles.card, item.size === 'large' ? styles.largeCard : styles.mediumCard]}
      activeOpacity={0.7}
    >
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gifts wrapped with love</Text>
        <Text style={styles.subtitle}>
          Personalised realtime{'\n'}recommendations with Style AI
        </Text>
      </View>

      <View style={styles.gridContainer}>
        <LinearGradient
          colors={['#FAFAFA', 'transparent']}
          style={styles.topGradient}
          pointerEvents="none"
        />
        
        <View style={styles.scrollingWrapper} >
          {/* Column 1: Moves Up */}
          <ScrollingColumn duration={20000} numCols={3}>
            {col1.map(renderCard)}
          </ScrollingColumn>

          {/* Column 2: Moves Down (Reverse) */}
          <ScrollingColumn duration={25000} reverse={true} numCols={3}>
            {col2.map(renderCard)}
          </ScrollingColumn>

          {/* Column 3: Moves Up */}
          <ScrollingColumn duration={22000} numCols={3}>
            {col3.map(renderCard)}
          </ScrollingColumn>
        </View>

        <LinearGradient
          colors={['transparent', '#FAFAFA']}
          style={styles.bottomGradient}
          pointerEvents="none"
        />
      </View>

      <TouchableOpacity style={styles.exploreButton} activeOpacity={0.8}>
        <Text style={styles.exploreText}>Explore all</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FAFAFA' },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  gridContainer: {
    height: GRID_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  scrollingWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#EBEBEB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  largeCard: { height: 160 },
  mediumCard: { height: 130 },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 2,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 2,
  },
  exploreButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  exploreText: { color: '#FFF', fontWeight: '600' },
  arrow: { color: '#FFF', marginLeft: 8 }
});