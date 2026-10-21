import {
  Award,
  BadgeCheck,
  Eye,
  Gem,
  Heart,
  Leaf,
  Recycle,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react-native";
import React from "react";

/**
 * The glyphs a brand can name in `iconTag`. Held as an explicit map rather
 * than looked up across the whole icon set, so the bundle carries these twelve
 * and not the several hundred a brand will never ask for.
 */
const ICONS = {
  Award,
  BadgeCheck,
  Eye,
  Gem,
  Heart,
  Leaf,
  Recycle,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Zap,
} as const;

type MicrositeValueIconProps = {
  /** Name from the microsite payload, e.g. "Leaf" or "ShieldCheck". */
  tag?: string;
  size?: number;
  color: string;
};

/** Draws a brand's named glyph, falling back to a gem for anything unknown. */
export default function MicrositeValueIcon({
  tag,
  size = 18,
  color,
}: MicrositeValueIconProps) {
  const Icon = (tag && ICONS[tag as keyof typeof ICONS]) || Gem;

  return <Icon size={size} color={color} strokeWidth={2.2} />;
}
