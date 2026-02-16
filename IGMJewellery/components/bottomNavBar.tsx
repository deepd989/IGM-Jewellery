import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";
import { HapticButton } from "./basic components/hapticButton";

interface BottomNavBarProps {
  activeTab?: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab }) => {
  if (!activeTab) {
    activeTab = "Home";
  }
  const router = useRouter();

  interface NavItemProps {
    iconName: string;
    label: string;
    isCenter?: boolean;
    route: string;
  }

  const NavItem: React.FC<NavItemProps> = ({
    iconName,
    label,
    isCenter,
    route,
  }) => {
    const isActive = activeTab === label;
    const iconStyle = isActive ? iconName : iconName + "-outline";
    console.log(iconName, isActive, iconStyle);

    const handlePress = () => {
      router.push(route as any);
    };

    if (isCenter) {
      return (
        <HapticButton style={[styles.centerButton]} onPress={handlePress}>
          <View
            style={[
              styles.centerIconContainer,
              { backgroundColor: COLORS.primary },
            ]}
          >
            <Ionicons name={iconStyle} size={28} color={"white"} />
          </View>
        </HapticButton>
      );
    }

    return (
      <HapticButton style={styles.navItem} onPress={handlePress}>
        <Ionicons name={iconStyle} size={24} color={COLORS.primary} />
        <Text style={[styles.label, isActive && styles.activeLabel]}>
          {label}
        </Text>
      </HapticButton>
    );
  };

  return (
    <View style={styles.navBar}>
      <NavItem iconName="home" label="Home" route="/home" />
      <NavItem iconName="grid" label="Categories" route="/categories" />
      <NavItem
        iconName="sparkles"
        label="AiDiscover"
        isCenter
        route="/exploreAi"
      />
      <NavItem iconName="gift" label="Gifting" route="/gift" />
      <NavItem iconName="person" label="Profile" route="/profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  centerButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  centerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#c0c0c0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: "300",
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});

export default BottomNavBar;
