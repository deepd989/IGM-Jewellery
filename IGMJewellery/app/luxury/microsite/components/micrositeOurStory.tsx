import {
  BrandMicrositeMilestone,
} from "@/interfaces/brandMicrosite.interface";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Gem } from "lucide-react-native";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  MICROSITE_MUTED,
  MICROSITE_PRIMARY,
  MICROSITE_SECONDARY,
  withAlpha,
} from "./micrositeTheme";

type MicrositeOurStoryProps = {
  wallpaperUrl: string;
  milestones: BrandMicrositeMilestone[];
  /** Shown in the pill over the artwork, e.g. "68 Years of Heritage". */
  heritageLabel?: string;
  primaryColor?: string;
  secondaryColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * How the brand got here: their artwork, then the years that made them, run
 * down a single thread so the sequence reads at a glance.
 */
export default function MicrositeOurStory({
  wallpaperUrl,
  milestones,
  heritageLabel,
  primaryColor = MICROSITE_PRIMARY,
  secondaryColor = MICROSITE_SECONDARY,
  style,
}: MicrositeOurStoryProps) {
  return (
    <View
      style={[
        styles.band,
        { backgroundColor: withAlpha(secondaryColor, 0.28) },
        style,
      ]}
    >
      <View style={styles.cover}>
        <Image
          source={{ uri: wallpaperUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />

        {/* Darkens only the foot of the artwork, where the type sits — a wash
            across the whole frame left the brand's photograph unreadable. */}
        <LinearGradient
          colors={[
            "rgba(0,0,0,0)",
            withAlpha(primaryColor, 0.55),
            withAlpha(primaryColor, 0.9),
          ]}
          locations={[0, 0.55, 1]}
          style={styles.coverScrim}
          pointerEvents="none"
        />

        <View style={styles.coverText}>
          {!!heritageLabel && (
            <View style={styles.heritagePill}>
              <Gem size={11} color={secondaryColor} strokeWidth={2.2} />
              <Text style={styles.heritageLabel}>
                {heritageLabel.toUpperCase()}
              </Text>
            </View>
          )}

          <Text style={styles.coverTitle}>Our Story</Text>
        </View>
      </View>

      <View style={styles.timelineCard}>
        {milestones.map((milestone, index) => {
          const isLast = index === milestones.length - 1;

          return (
            <View key={`${milestone.year}-${milestone.header}`} style={styles.milestone}>
              <View style={styles.thread}>
                <View
                  style={[styles.yearDot, { backgroundColor: primaryColor }]}
                >
                  <Text style={styles.yearText}>{milestone.year}</Text>
                </View>

                {/* The line only runs between entries, never past the last. */}
                {!isLast && (
                  <View
                    style={[
                      styles.connector,
                      { backgroundColor: withAlpha(primaryColor, 0.25) },
                    ]}
                  />
                )}
              </View>

              <View style={[styles.milestoneText, isLast && styles.lastText]}>
                <Text style={[styles.milestoneHeader, { color: primaryColor }]}>
                  {milestone.header}
                </Text>
                <Text style={styles.milestoneDescription}>
                  {milestone.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const DOT_SIZE = 42;

const styles = StyleSheet.create({
  band: {
    paddingVertical: 24,
  },
  // Tall enough that the pill and title sit in the lower third rather than
  // taking up half the artwork.
  cover: {
    height: 230,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: "#2A1414",
  },
  coverScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "62%",
  },
  coverText: {
    padding: 18,
  },
  heritagePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  heritageLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#FFFFFF",
  },
  coverTitle: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  // ── Timeline ──
  // Sits below the artwork rather than lapping over it, which cut the picture
  // short by its own height.
  timelineCard: {
    marginTop: 12,
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  milestone: {
    flexDirection: "row",
    gap: 14,
  },
  thread: {
    alignItems: "center",
  },
  yearDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  yearText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  connector: {
    flex: 1,
    width: 2,
    marginVertical: 4,
  },
  milestoneText: {
    flex: 1,
    paddingBottom: 22,
  },
  lastText: {
    paddingBottom: 0,
  },
  milestoneHeader: {
    fontSize: 14,
    fontWeight: "800",
  },
  milestoneDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: MICROSITE_MUTED,
  },
});
