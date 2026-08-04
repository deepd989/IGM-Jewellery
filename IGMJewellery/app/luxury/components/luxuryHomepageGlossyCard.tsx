import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HapticButton } from "@/components/basic components/hapticButton";
import { assetUrl } from "@/constants/assets";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// The card sizes itself to the box this component is given, so it always fits
// the screen without scrolling. This floor only applies when the parent gives
// no definite height of its own.
const MIN_CARD_HEIGHT = Math.round(SCREEN_HEIGHT * 0.35) + 30;
const MAX_CARD_HEIGHT = Math.round(SCREEN_HEIGHT * 0.50) + 30;

/** Diameter of the glass arrow in the slide's corner. */
const ARROW_SIZE = 44;

/**
 * The hero reel. Each slide is a clip and the piece it shows: the whole slide
 * is the tap target, and it opens that product.
 *
 * `title` is not drawn anywhere — the slide carries no caption. It is kept as
 * a note to whoever maintains this list, so a row can be matched to its clip
 * without opening the video.
 */
const CAROUSEL_DATA = [
  {
    id: '1',
    title: 'Timeless Diamond Collection',
    video: assetUrl("luxury.glossyCard.slide1.video"),
    productId: '118',
  },
  {
    id: '2',
    title: 'Royal Heritage Gold',
    video: assetUrl("luxury.glossyCard.slide2.video"),
    productId: '40',
  },
  {
    id: '3',
    title: 'Modern Solitaire Series',
    video: assetUrl("luxury.glossyCard.slide3.video"),
    productId: '128',
  },
  {
    id: '4',
    title: 'Modern Solitaire Series',
    video: assetUrl("luxury.glossyCard.slide4.video"),
    productId: '41',
  },
];

type CarouselItem = (typeof CAROUSEL_DATA)[number];

type GlassCarouselProps = {
  /** Fixed card height. Omit to fill the height the parent leaves available. */
  height?: number;
  /** Overrides navigation to the slide's product screen. */
  onPressSlide?: (item: CarouselItem) => void;
};

export default function GlassCarousel({
  height,
  onPressSlide,
}: GlassCarouselProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  // Clips keep decoding while the shopper is off on another screen unless the
  // carousel stops them — the storefront's other video rows want the decoders.
  const isFocused = useIsFocused();
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

  const handlePressSlide = (item: CarouselItem) => {
    if (onPressSlide) {
      onPressSlide(item);
      return;
    }
    router.navigate({
      pathname: "/luxury/product/[id]",
      params: { id: item.productId },
    });
  };

  const renderItem = ({ item, index }: { item: CarouselItem; index: number }) => {
    // Only the slide actually in view runs; the rest hold a player but stay
    // paused on their first frame.
    const isPlaying = isFocused && index === activeIndex;

    return (
      <HapticButton
        style={[styles.cardContainer, { width: cardWidth, height: cardHeight }]}
        activeOpacity={0.95}
        onPress={() => handlePressSlide(item)}
      >
        {/* The clip paints the slide on its own — no still stands in for it,
            neither as a poster nor for the slides out of view. Every mounted
            slide therefore holds a video decoder, which is affordable at three
            slides; a longer carousel would want that budget back. */}
        <Video
          source={{ uri: item.video }}
          style={styles.cardMedia}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isPlaying}
          isLooping
          isMuted
        />

        {/* Glass arrow, on its own in the corner. It only marks the slide as a
            way in — the whole clip is the tap target, so the arrow takes no
            touches of its own. The radius and the clip live on the wrapper: a
            BlurView does not round its own blur. */}
        <View style={styles.arrowWrapper} pointerEvents="none">
          <BlurView intensity={40} tint="dark" style={styles.arrowGlass}>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </BlurView>
        </View>
      </HapticButton>
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
        // The active index decides which slides hold a player, so a row has to
        // re-render when it moves — without this the clips never hand off.
        extraData={`${cardWidth}-${activeIndex}`}
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
  cardMedia: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  arrowWrapper: {
    position: 'absolute',
    right: 20,
    // Clears the pagination dots, which sit on the same edge of the card.
    bottom: 44,
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    borderRadius: ARROW_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  arrowGlass: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // The lit face over the blur, so the glass reads as raised off the clip.
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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