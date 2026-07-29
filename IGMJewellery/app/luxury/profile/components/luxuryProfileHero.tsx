import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS } from "@/constants/theme";
import React from "react";
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import LuxuryProfileCard from "./luxuryProfileCard";
import { assetUrl } from "@/constants/assets";

/** Stands in until the shopper has an avatar of their own. */
const AVATAR_FALLBACK = assetUrl("profile.avatarFallback");

const FLAG_INDIA = assetUrl("profile.flag.india");

type LuxuryProfileHeroProps = {
  name: string;
  /** Phone number the account is registered against. */
  phone?: string | null;
  avatarUri?: string;
  /** Short language code shown in the pill, e.g. "EN". */
  languageCode?: string;
  onPressLanguage?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Who the shopper is, on the card the rest of the screen hangs from: portrait,
 * name, the number they signed in with, and the language pill that opens the
 * preferences screen.
 */
export default function LuxuryProfileHero({
  name,
  phone,
  avatarUri = AVATAR_FALLBACK,
  languageCode = "EN",
  onPressLanguage,
  style,
}: LuxuryProfileHeroProps) {
  return (
    <LuxuryProfileCard style={[styles.card, style]}>
      <View style={styles.avatarRing}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {!!phone && (
          <Text style={styles.phone} numberOfLines={1}>
            {phone}
          </Text>
        )}
      </View>

      <HapticButton
        style={styles.languagePill}
        activeOpacity={0.8}
        onPress={onPressLanguage}
      >
        <Image source={{ uri: FLAG_INDIA }} style={styles.flag} />
        <Text style={styles.languageText}>{languageCode}</Text>
      </HapticButton>
    </LuxuryProfileCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  // The gold ring is what separates the portrait from the frosted panel it
  // sits on; without it the two grounds run together.
  avatarRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    padding: 2,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.accent,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 29,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  phone: {
    marginTop: 3,
    fontSize: 13,
    color: LUXURY_COLORS.textMuted,
  },
  languagePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  flag: {
    width: 22,
    height: 15,
    borderRadius: 2,
  },
  languageText: {
    fontSize: 13,
    fontWeight: "600",
    color: LUXURY_COLORS.text,
  },
});
