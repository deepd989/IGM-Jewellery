import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import {
  AudioLines,
  CircleUserRound,
  Diamond,
  House,
  LayoutGrid,
  Sparkle,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { COLORS } from "../constants/theme";
import { HapticButton } from "./basic components/hapticButton";

const ICON_SIZE = 24;
const ICON_STROKE = 1.8;
const ACTIVE_ICON = "#FFFFFF";
const INACTIVE_ICON = COLORS.primary;

/** Height of the pill itself. */
export const BOTTOM_NAV_BAR_HEIGHT = 68;

/** Waveform + sparkle glyph — lucide has no single icon for this. */
const AiGlyph = (color: string) => (
  <View>
    <AudioLines size={ICON_SIZE} color={color} strokeWidth={ICON_STROKE} />
    <Sparkle size={11} color={color} fill={color} style={styles.aiSparkle} />
  </View>
);

type NavItem = {
  /** Also the value callers pass as activeTab. */
  key: string;
  route: string;
  /** Receives the resolved icon colour for the item's current state. */
  icon: (color: string) => React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "Home",
    route: "/home",
    icon: (color) => (
      <House
        size={ICON_SIZE}
        color={color}
        fill={color === ACTIVE_ICON ? color : "none"}
        strokeWidth={ICON_STROKE}
      />
    ),
  },
  {
    key: "Categories",
    route: "/categories",
    icon: (color) => (
      <LayoutGrid size={ICON_SIZE} color={color} strokeWidth={ICON_STROKE} />
    ),
  },
  { key: "AiDiscover", route: "/exploreAi", icon: AiGlyph },
  {
    key: "Bespoke",
    route: "/bespoke",
    icon: (color) => (
      <Diamond size={ICON_SIZE} color={color} strokeWidth={ICON_STROKE} />
    ),
  },
  {
    key: "Profile",
    route: "/profile",
    icon: (color) => (
      <CircleUserRound
        size={ICON_SIZE}
        color={color}
        strokeWidth={ICON_STROKE}
      />
    ),
  },
];

interface BottomNavBarProps {
  /** Key of the highlighted item. Falls back to matching the current route. */
  activeTab?: string;
  style?: ViewStyle;
}

/**
 * The classic storefront's navigation: a glossy pill carrying the five places
 * a shopper moves between. Kept separate from the luxury bar so the two
 * storefronts can be restyled without disturbing each other.
 */
const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, style }) => {
  const router = useRouter();
  const pathname = usePathname();

  const resolvedActiveKey =
    activeTab ??
    NAV_ITEMS.find((item) => item.route === pathname)?.key ??
    NAV_ITEMS.find(
      (item) => item.route !== "/" && pathname.startsWith(item.route)
    )?.key;

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.bar}>
        {/* Glossy stack: frosted base, silver body, then a top sheen */}
        <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={["rgba(255,255,255,0.97)", "rgba(226,235,239,0.88)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.sheen}
          pointerEvents="none"
        />

        {NAV_ITEMS.map((item) => {
          const isActive = item.key === resolvedActiveKey;

          return (
            <HapticButton
              key={item.key}
              style={styles.navItem}
              onPress={() => {
                // Navigating to the screen already showing only makes it
                // flicker through a transition and back.
                if (isActive) return;
                router.navigate(item.route as any);
              }}
            >
              {isActive ? (
                <LinearGradient
                  colors={["#1C7A72", COLORS.primary]}
                  start={{ x: 0.1, y: 0 }}
                  end={{ x: 0.9, y: 1 }}
                  style={styles.activePill}
                >
                  {item.icon(ACTIVE_ICON)}
                </LinearGradient>
              ) : (
                item.icon(INACTIVE_ICON)
              )}
            </HapticButton>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    height: BOTTOM_NAV_BAR_HEIGHT,
    paddingHorizontal: 10,
    borderRadius: BOTTOM_NAV_BAR_HEIGHT / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    // Lifts the pill off the page behind it
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 12,
  },
  sheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "55%",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  aiSparkle: {
    position: "absolute",
    top: -3,
    right: -5,
  },
});

export default BottomNavBar;
