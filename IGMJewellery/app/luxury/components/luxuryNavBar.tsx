import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import {
  AudioLines,
  CircleUserRound,
  Gift,
  House,
  LayoutGrid,
  Sparkle,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LUXURY_COLORS } from "../../../constants/theme";
import { HapticButton } from "../../../components/basic components/hapticButton";

const ICON_SIZE = 24;
const ICON_STROKE = 1.8;
/** The active pill is white, so its glyph grounds to the storefront. */
const ACTIVE_ICON = LUXURY_COLORS.primary;
const INACTIVE_ICON = "#FFFFFF";

/** Height of the pill itself, excluding the safe-area gap below it. */
export const LUXURY_NAV_BAR_HEIGHT = 68;

export type LuxuryNavItem = {
  key: string;
  route: string;
  /** Receives the resolved icon colour for the item's current state. */
  icon: (color: string) => React.ReactNode;
};

/** Waveform + sparkle glyph — lucide has no single icon for this. */
const AiGlyph = (color: string) => (
  <View>
    <AudioLines size={ICON_SIZE} color={color} strokeWidth={ICON_STROKE} />
    <Sparkle size={11} color={color} fill={color} style={styles.aiSparkle} />
  </View>
);

const DEFAULT_ITEMS: LuxuryNavItem[] = [
  {
    key: "home",
    route: "/luxury",
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
    key: "categories",
    route: "/luxury/categories",
    icon: (color) => (
      <LayoutGrid size={ICON_SIZE} color={color} strokeWidth={ICON_STROKE} />
    ),
  },
  { key: "ai", route: "/exploreAi", icon: AiGlyph },
  {
    key: "gifting",
    route: "/gift",
    icon: (color) => (
      <Gift size={ICON_SIZE} color={color} strokeWidth={ICON_STROKE} />
    ),
  },
  {
    key: "profile",
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

type LuxuryNavBarProps = {
  /** Key of the highlighted item. Falls back to matching the current route. */
  activeKey?: string;
  items?: LuxuryNavItem[];
  /** Pinned to the bottom of the screen by default; false renders it inline. */
  floating?: boolean;
  style?: ViewStyle;
};

export default function LuxuryNavBar({
  activeKey,
  items = DEFAULT_ITEMS,
  floating = true,
  style,
}: LuxuryNavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const resolvedActiveKey =
    activeKey ??
    items.find((item) => item.route === pathname)?.key ??
    items.find((item) => item.route !== "/" && pathname.startsWith(item.route))
      ?.key;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        floating && styles.floating,
        // Sit above the home indicator without leaving a large gap on
        // devices that have none.
        { paddingBottom: Math.max(insets.bottom, 12) },
        style,
      ]}
    >
      <View style={styles.bar}>
        {/* Glossy stack: frosted base, teal body, then a top sheen */}
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={["rgba(24, 74, 70, 0.92)", "rgba(12, 44, 42, 0.95)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.sheen}
          pointerEvents="none"
        />

        {items.map((item) => {
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
                <View style={styles.activePill}>
                  {item.icon(ACTIVE_ICON)}
                </View>
              ) : (
                item.icon(INACTIVE_ICON)
              )}
            </HapticButton>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
  },
  floating: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    height: LUXURY_NAV_BAR_HEIGHT,
    paddingHorizontal: 10,
    borderRadius: LUXURY_NAV_BAR_HEIGHT / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    // Lifts the pill off the page behind it
    shadowColor: "#052A33",
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
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#04333E",
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
