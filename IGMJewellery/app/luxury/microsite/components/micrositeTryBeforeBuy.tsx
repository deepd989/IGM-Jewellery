import { HapticButton } from "@/components/basic components/hapticButton";
import { Image } from "expo-image";
import { ArrowRight, Sparkles } from "lucide-react-native";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  MICROSITE_MUTED,
  MICROSITE_PRIMARY,
  MICROSITE_SECONDARY,
  withAlpha,
} from "./micrositeTheme";

type MicrositeTryBeforeBuyProps = {
  imageUrl: string;
  title?: string;
  description?: string;
  /** Short claims under the action, e.g. "Face Scan AI". */
  highlights?: string[];
  primaryColor?: string;
  secondaryColor?: string;
  onTryNow?: () => void;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_HIGHLIGHTS = ["Face Scan AI", "Real-Time Fit", "True to Scale"];

/**
 * The invitation to try a piece on before buying it — the brand's own model
 * shot beside the pitch, on a panel tinted with their colour.
 */
export default function MicrositeTryBeforeBuy({
  imageUrl,
  title = "Try Before\nYou Buy",
  description = "See any piece on yourself using our AI-powered try-on, before you decide.",
  highlights = DEFAULT_HIGHLIGHTS,
  primaryColor = MICROSITE_PRIMARY,
  secondaryColor = MICROSITE_SECONDARY,
  onTryNow,
  style,
}: MicrositeTryBeforeBuyProps) {
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.panel,
          { backgroundColor: withAlpha(secondaryColor, 0.3) },
        ]}
      >
        <View style={styles.copy}>
          <View
            style={[styles.aiPill, { backgroundColor: withAlpha(primaryColor, 0.12) }]}
          >
            <Sparkles size={11} color={primaryColor} fill={primaryColor} />
            <Text style={[styles.aiLabel, { color: primaryColor }]}>
              AI POWERED
            </Text>
          </View>

          <Text style={[styles.title, { color: primaryColor }]}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <HapticButton
            style={[styles.action, { backgroundColor: primaryColor }]}
            activeOpacity={0.85}
            onPress={onTryNow}
          >
            <Text style={styles.actionLabel}>Try Now</Text>
            <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />
          </HapticButton>
        </View>

        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>

      {highlights.length > 0 && (
        <View style={styles.highlights}>
          {highlights.map((highlight) => (
            <View
              key={highlight}
              style={[
                styles.highlight,
                { borderColor: withAlpha(primaryColor, 0.2) },
              ]}
            >
              <Text style={[styles.highlightLabel, { color: primaryColor }]}>
                {highlight}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  panel: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: 20,
    overflow: "hidden",
  },
  copy: {
    flex: 1,
    padding: 16,
  },
  aiPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  aiLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 27,
  },
  description: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 17,
    color: MICROSITE_MUTED,
  },
  action: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 19,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  image: {
    width: 130,
  },
  highlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  highlight: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  highlightLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
});
