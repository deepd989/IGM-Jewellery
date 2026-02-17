import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width*0.9;
const CARD_HEIGHT = 320;
const CARD_RADIUS = 16;

type RibbonGiftCardProps = {
  cardBackgroundColor?: string; // default: '#F7F7F7'
  ribbonColor?: string;   
  petalColor?:string;      // default: '#D9D9D9'
  heading?: string;
  caption?: string;
  amount?: string | number;
};

const RibbonGiftCard: React.FC<RibbonGiftCardProps> = ({
  cardBackgroundColor = '#F7F7F7',
  ribbonColor = '#D9D9D9',
  petalColor = '#053844',
  amount,
  heading,
  caption,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        {/* Vertical ribbon */}
        <View style={[styles.verticalRibbon, { backgroundColor: ribbonColor }]} />

        {/* Horizontal ribbon */}
        <View style={[styles.horizontalRibbon, { backgroundColor: ribbonColor }]} />

        {/* Ribbon knot */}
        <View style={styles.knot}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.knotPetal,
                {backgroundColor: petalColor},
                {
                  transform: [
                    { translateX: 28 }, // Move to center (56/2)
                    { translateY: 28 }, // Move to center (56/2)
                    { rotate: `${i * 45}deg` },
                    { translateY: -20 },
                  ],
                },
              ]}
            />
          ))}
        </View>

        {/* Centered heading and caption */}
        <View style={styles.textOverlay}>
          {heading ? <Text style={styles.heading}>{heading}</Text> : null}
          {caption ? <Text style={styles.caption}>{caption}</Text> : null}
          {amount ? <Text style={styles.amount}>{"₹"+amount}</Text> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    margin: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#F7F7F7',
    overflow: 'hidden',
    position: 'relative',
  },
  verticalRibbon: {
    position: 'absolute',
    left: 32,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: '#D9D9D9',
  },
  horizontalRibbon: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 56,
    height: 24,
    backgroundColor: '#D9D9D9',
  },
  knot: {
    position: 'absolute',
    // left: vertical ribbon left (32) + vertical ribbon width/2 (12) - knot width/2 (28)
    left: 8,
    // bottom: horizontal ribbon bottom (56) + horizontal ribbon height/2 (12) - knot height/2 (28)
    bottom: 56,
    width: 56,
    height: 56,
  },
  knotPetal: {
    position: 'absolute',
    width: 18,
    height: 28,
    borderRadius: 4,
    left: 0,
    top: 0,
  },
  textOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 2,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#053844',
    textAlign: 'center',
  },
  caption: {
    marginTop: 8,
    fontSize: 14,
    color: '#5A5A5A',
    textAlign: 'center',
  },
  amount: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: '800',
    color: '#053844',
    textAlign: 'center',
  },
});

export default RibbonGiftCard;