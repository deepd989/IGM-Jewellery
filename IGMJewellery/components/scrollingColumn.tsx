import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width } = Dimensions.get('window');

export const ScrollingColumn = ({ 
  children, 
  duration, 
  delay = 0, 
  reverse = false, 
  numCols = 4 
}) => {
  // Calculate width dynamically based on input props
  const columnWidth = (width - 40) / numCols;

  // 1. Set initial position based on direction
  // If reverse, we start "up" at -SCREEN_HEIGHT and move to 0
  const translateY = useSharedValue(reverse ? -SCREEN_HEIGHT : 0);

  useEffect(() => {
    // 2. Determine the target destination
    // Normal: 0 -> -SCREEN_HEIGHT
    // Reverse: -SCREEN_HEIGHT -> 0
    const destination = reverse ? 0 : -SCREEN_HEIGHT;

    translateY.value = withRepeat(
      withTiming(destination, {
        duration,
        easing: Easing.linear,
      }),
      -1, 
      false 
    );
  }, [reverse, duration]); // Re-run if direction changes

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.column, { width: columnWidth }, animatedStyle]}>
      {children}
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  column: {
    // Width is now handled dynamically via inline styles
    flexDirection: 'column',
  }
});