import { COLORS, SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { HapticButton } from "./basic components/hapticButton";

const { width, height } = Dimensions.get("window");

export interface PopUpOption {
  id: number;
  icon: string;
  label: string;
  route: string;
}

interface BottomRightButtonProps {
  options: PopUpOption[];
}

export default function BottomRightButton({
  options: propOptions,
}: BottomRightButtonProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Default options if none provided
  //   const defaultOptions: PopUpOption[] = [
  //     { id: 1, icon: 'home-outline', label: 'Home', route: "/home" },
  //     { id: 2, icon: 'grid-outline', label: 'Products', route: "/product-list" },
  //   ];

  const options = propOptions;

  const handleOptionClick = (option: PopUpOption) => {
    console.log("Option clicked:", option);
    setIsMenuOpen(false);
    router.navigate(option.route as any);
  };

  return (
    <>
      {!isMenuOpen ? (
        <HapticButton
          style={styles.closeFab}
          onPress={() => setIsMenuOpen(true)}
        >
          <Ionicons name="add-circle-outline" size={36} />
        </HapticButton>
      ) : (
        <HapticButton
          style={styles.closeFab}
          onPress={() => setIsMenuOpen(false)}
        >
          <Ionicons name="close" size={24} color="#053844" />
        </HapticButton>
      )}

      {/* Menu Popup */}
      {isMenuOpen && (
        <View style={styles.menuPopup}>
          {options.map((item, index) => (
            <HapticButton
              key={index}
              style={styles.menuItem}
              onPress={() => {
                handleOptionClick(item);
              }}
            >
              <Text style={styles.menuItemText}>{item.label}</Text>
            </HapticButton>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  closeFab: {
    position: "absolute",
    bottom: 140,
    right: SPACING.m,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
  menuPopup: {
    position: "absolute",
    bottom: 200,
    right: 20,
    width: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: SPACING.s,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 20,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.m,
  },
  menuItemText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
    textAlign: "right",
  },
});
