/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

/**
 * Manrope font family mapping.
 * Use these constants for fontFamily in styles.
 * The keys match the font weight names from @expo-google-fonts/manrope.
 */
export const ManropeFonts = {
  extraLight: "Manrope_200ExtraLight",
  light: "Manrope_300Light",
  regular: "Manrope_400Regular",
  medium: "Manrope_500Medium",
  semiBold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
  extraBold: "Manrope_800ExtraBold",
} as const;

/** Default font family used throughout the app */
export const DEFAULT_FONT_FAMILY = ManropeFonts.regular;

export const COLORS = {
  primary: "#053844", // Deep Teal Green
  primaryLight: "#E5F1F4", // Light Teal Green
  secondary: "#D8C391", // Gold
  background: "#FFFFFF",
  surface: "#F9F9F9",
  text: "#053844",
  textSecondary: "#8E8E93",
  border: "#E5E5EA",
  error: "#FF3B30",
  success: "#34C759",
  luxuryBg: "#F0F6F8", // Dark background for luxury mode
};

/**
 * The luxury storefront's own palette. It runs dark, so it cannot borrow
 * COLORS.primary — everything on those screens grounds on these.
 */
export const LUXURY_COLORS = {
  /** The ground the whole storefront sits on. */
  primary: "#0E2E2D",
  /** Cards and bars raised off that ground. */
  surface: "#123C3A",
  /** Top bar sweep: deep on the left, lifting to the right. */
  gradient: ["#123F3B", "#1C5A54"] as readonly [string, string],
  /** Icons and accents. */
  accent: "#D8C391",
  text: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.7)",
  /** Hairlines and glass edges. */
  border: "rgba(255,255,255,0.18)",
};

/**
 * The grounds the storefront alternates between as the page is scrolled. Held
 * apart from LUXURY_COLORS because a section is assigned one of these by the
 * design, rather than deriving it from the page's own palette.
 */
export const LUXURY_SECTION_BACKGROUNDS = {
  green: "#0C4552",
  darkGreen: "#002F33",
  /** The off-white the page opens up to between the darker bands. */
  offWhite: "#f0f6f8",
  /** Sits under the full-bleed artwork sections, and shows while it loads. */
  imagePlaceholder: "#0A1518",
};

/**
 * Type and icons for the off-white sections. LUXURY_COLORS.text is white, so
 * anything grounded on offWhite has to reach for these instead.
 */
export const LUXURY_INK = {
  text: "#002F33",
  textMuted: "rgba(0,47,51,0.66)",
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

/**
 * The single knob for vertical rhythm on the luxury screens: the gap a
 * <LuxurySeparator /> puts between sections, and the gap between blocks of
 * content inside a section. Change this one value to retune the whole page.
 */
export const LUXURY_SPACING = 50;

export const SIZES = {
  width,
  cardBorderRadius: 12,
  iconSize: 24,
};

export const FONTS = {
  header: {
    fontSize: 24,
    fontFamily: ManropeFonts.bold,
    color: COLORS.text,
  },
  subheader: {
    fontSize: 18,
    fontFamily: ManropeFonts.semiBold,
    color: COLORS.text,
  },
  body: {
    fontSize: 14,
    fontFamily: ManropeFonts.regular,
    color: COLORS.textSecondary,
  },
  price: {
    fontSize: 16,
    fontFamily: ManropeFonts.bold,
    color: COLORS.primary,
  },
};
