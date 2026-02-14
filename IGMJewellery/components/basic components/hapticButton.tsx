import * as Haptics from "expo-haptics";
import React from "react";
import { TouchableOpacity } from "react-native";

// This becomes your "Standard" button
export const HapticButton = ({
  onPress = (event: any) => {},
  children,
  style = {},
  type = "light",
  activeOpacity = 1,
  disabled = false,
}) => {
  const handlePress = (event) => {
    // Trigger haptic based on the 'type' prop
    if (type === "light") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (type === "heavy") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    // Call the original onPress function if it exists
    if (onPress) onPress(event);
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={style}
      onPress={handlePress}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
};
