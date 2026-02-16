/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Dimensions, Platform } from "react-native";
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

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const COLORS = {
  primary: "#053844", // Deep Teal Green
  primaryLight: "#E5F1F4", // Light Teal Green
  secondary: "#D8C391", // Gold
  background: "#FFFFFF",
  surface: "#F9F9F9",
  text: "#1C1C1E",
  textSecondary: "#8E8E93",
  border: "#E5E5EA",
  error: "#FF3B30",
  success: "#34C759",
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const SIZES = {
  width,
  cardBorderRadius: 12,
  iconSize: 24,
};

export const FONTS = {
  header: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: COLORS.text,
  },
  subheader: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: COLORS.text,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: COLORS.textSecondary,
  },
  price: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: COLORS.primary,
  },
};
