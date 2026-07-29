import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { assetUrl } from "@/constants/assets";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// The card sizes itself to the box this component is given, so it always fits
// the screen without scrolling. This floor only applies when the parent gives
// no definite height of its own.
const MIN_CARD_HEIGHT = Math.round(SCREEN_HEIGHT * 0.35);
const MAX_CARD_HEIGHT = Math.round(SCREEN_HEIGHT * 0.50);


// Sample Carousel Data
const CAROUSEL_DATA = [
  {
    id: '1',
    title: 'Timeless Diamond Collection',
    subtitle: 'TBZ Jewellers',
    image: assetUrl("luxury.glossyCard.slide1.image"),
    logo: assetUrl("luxury.glossyCard.slide1.brandLogo"),
  },
  {
    id: '2',
    title: 'Royal Heritage Gold',
    subtitle: 'TBZ Jewellers',
    image: assetUrl("luxury.glossyCard.slide2.image"),
    logo: assetUrl("luxury.glossyCard.slide2.brandLogo"),
  },
  {
    id: '3',
    title: 'Modern Solitaire Series',
    subtitle: 'TBZ Jewellers',
    image: assetUrl("luxury.glossyCard.slide3.image"),
    logo: assetUrl("luxury.glossyCard.slide3.brandLogo"),
  },
];

type CarouselItem = (typeof CAROUSEL_DATA)[number];

type GlassCarouselProps = {
  /** Fixed card height. Omit to fill the height the parent leaves available. */
  height?: number;
};

export default function GlassCarousel({ height }: GlassCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Box actually available to the carousel, measured on layout.
  const [size, setSize] = useState({
    width: SCREEN_WIDTH,
    height: height ?? MIN_CARD_HEIGHT,
  });
  const cardWidth = size.width;
  const cardHeight = height ?? size.height;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height: measuredHeight } = event.nativeEvent.layout;
    const next = { width: Math.round(width), height: Math.round(measuredHeight) };
    if (next.width <= 0 || next.height <= 0) return;
    if (next.width !== size.width || next.height !== size.height) {
      setSize(next);
    }
  };

  // Track active slide index on scroll
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / cardWidth
    );
    if (slideIndex !== activeIndex && slideIndex >= 0 && slideIndex < CAROUSEL_DATA.length) {
      setActiveIndex(slideIndex);
    }
  };

  const renderItem = ({ item }: { item: CarouselItem }) => {
    return (
      <View style={[styles.cardContainer, { width: cardWidth, height: cardHeight }]}>
        {/* Main Background Image - Full Card Size */}
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        {/* Top Right Brand Logo */}
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>tbz</Text>
        </View>

        {/* Bottom Glassmorphic Button Overlay */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => console.log(`Pressed: ${item.title}`)}
          style={styles.glassButtonWrapper}
        >
          <BlurView intensity={45} tint="dark" style={styles.glassButtonContent}>
            <View style={styles.textContainer}>
              <Text style={styles.titleText} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.subtitleText}>{item.subtitle}</Text>
            </View>

            {/* Circular Arrow Button */}
            <View style={styles.arrowButton}>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </View>
          </BlurView>
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <View
      style={[styles.container, height ? { flex: 0, height } : null]}
      onLayout={handleLayout}
    >
      <FlatList
        data={CAROUSEL_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={cardWidth}
        horizontal
        pagingEnabled // One card per page: card width === list width
        disableIntervalMomentum // Never fling past a single card
        showsHorizontalScrollIndicator={false}
        // Only the cards near the viewport are mounted, so an off-screen
        // card holds no decoded artwork.
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        bounces={false}
        getItemLayout={(_, index) => ({
          length: cardWidth,
          offset: cardWidth * index,
          index,
        })}
      />

      {/* Sits over the list rather than inside a card, so it holds still. */}
      <View style={styles.paginationContainer} pointerEvents="none">
        {CAROUSEL_DATA.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1, // Fills the space left over by the parent...
    minHeight: MIN_CARD_HEIGHT, // ...or this, if the parent has no fixed height
    backgroundColor: '#0F1217',
    maxHeight: MAX_CARD_HEIGHT,
    borderRadius: 32,
    overflow: 'hidden',
  },
  cardContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  logoBadge: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(58, 45, 40, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoText: {
    color: '#D4AF37',
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  glassButtonWrapper: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  glassButtonContent: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 30, 30, 0.35)',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 14,
    fontWeight: '400',
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#FFFFFF',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});