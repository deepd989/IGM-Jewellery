import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import LuxuryScreenHeader from "../components/luxuryScreenHeader";
import LuxuryProfileCard from "./components/luxuryProfileCard";

/** How far along the tier ladder the shopper is; not yet driven by the store. */
const PROGRESS = "40%" as const;

const MILESTONES = [
  { id: "new", price: "₹5,000", label: "New Shopper" },
  { id: "elite", price: "₹50,000", label: "Elite Shopper", active: true },
  { id: "star", price: "₹1,50,000", label: "IGM Star" },
];

const COLLECTED = [
  { id: "c1", value: "+200", label: "First Purchase", worth: "= ₹50" },
  { id: "c2", value: "+200", label: "First Purchase", worth: "= ₹50" },
  { id: "c3", value: "+200", label: "First Purchase", worth: "= ₹500" },
  { id: "c4", value: "+200", label: "First Purchase", worth: "= ₹50" },
];

const AVAILABLE = [
  { id: "a1", value: "200", label: "Write a Review", worth: "= ₹50" },
  { id: "a2", value: "200", label: "Write a Review", worth: "= ₹50" },
  { id: "a3", value: "200", label: "Write a Review", worth: "= ₹50" },
  { id: "a4", value: "200", label: "Post on instagram", worth: "= ₹50" },
];

const EARN_MORE = [
  { label: "First App Login", value: "+20" },
  { label: "First Review", value: "+100" },
  { label: "Purchase over Rs 5,00", value: "+200" },
  { label: "First App Login", value: "+2000" },
];

/**
 * The luxury storefront's rewards screen. Same points, tier and milestones as
 * app/profile/loyalty.tsx, with the balance carried in gold.
 */
export default function LuxuryLoyaltyScreen() {
  const profile = useSelector((state: RootState) => state.user.profile);

  return (
    <View style={styles.screen}>
      <LuxuryScreenHeader title="Loyalty Points" showBack variant="glass" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <View style={styles.pointsCircle}>
            <Ionicons
              name="trophy-outline"
              size={22}
              color={LUXURY_COLORS.accent}
            />
            <Text style={styles.bigPoints}>{profile.points}</Text>
          </View>

          <Text style={styles.thankYou}>
            Thank you for being our loyal customer
          </Text>
          <Text style={styles.since}>Customer since {profile.memberSince}</Text>

          <View style={styles.tierBadge}>
            <Ionicons name="diamond" size={12} color={LUXURY_COLORS.primary} />
            <Text style={styles.tierText}>{profile.tier}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: PROGRESS }]} />
            <Ionicons
              name="star"
              size={18}
              color={LUXURY_COLORS.accent}
              style={styles.progressCursor}
            />
          </View>

          <View style={styles.milestones}>
            {MILESTONES.map((milestone) => (
              <View key={milestone.id} style={styles.milestone}>
                <Text style={styles.milestonePrice}>{milestone.price}</Text>

                {milestone.active ? (
                  <View style={styles.milestoneActive}>
                    <Ionicons
                      name="diamond"
                      size={10}
                      color={LUXURY_COLORS.primary}
                    />
                    <Text style={styles.milestoneActiveText}>
                      {milestone.label}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.milestoneLabel}>{milestone.label}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <LuxuryProfileCard style={styles.summary}>
          <View style={styles.summaryLeft}>
            <View style={styles.summaryIcon}>
              <Ionicons
                name="ribbon-outline"
                size={22}
                color={LUXURY_COLORS.accent}
              />
            </View>
            <View>
              <Text style={styles.summaryPoints}>{profile.points}</Text>
              <Text style={styles.summaryLabel}>Loyalty Points</Text>
            </View>
          </View>

          <View style={styles.summaryRight}>
            <Text style={styles.summaryWorth}>= ₹500</Text>
            <HapticButton activeOpacity={0.7}>
              <Text style={styles.redeem}>Redeem Now</Text>
            </HapticButton>
          </View>
        </LuxuryProfileCard>

        <Text style={styles.sectionTitle}>Points Collected</Text>
        <LuxuryProfileCard>
          {COLLECTED.map((entry, index) => (
            <View
              key={entry.id}
              style={[styles.row, index > 0 && styles.divided]}
            >
              <View style={styles.checkIcon}>
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={LUXURY_COLORS.primary}
                />
              </View>

              <View style={styles.rowText}>
                <Text style={styles.rowValue}>{entry.value}</Text>
                <Text style={styles.rowLabel}>{entry.label}</Text>
              </View>

              <Text style={styles.rowWorth}>{entry.worth}</Text>
            </View>
          ))}
        </LuxuryProfileCard>

        <Text style={styles.sectionTitle}>Collect More Points</Text>
        <LuxuryProfileCard>
          {AVAILABLE.map((entry, index) => (
            <View
              key={entry.id}
              style={[styles.row, index > 0 && styles.divided]}
            >
              <View style={styles.infoIcon}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={LUXURY_COLORS.textMuted}
                />
              </View>

              <View style={styles.rowText}>
                <Text style={styles.rowValue}>{entry.value}</Text>
                <Text style={styles.rowLabel}>{entry.label}</Text>
              </View>

              <View style={styles.collectAction}>
                <HapticButton activeOpacity={0.7}>
                  <Text style={styles.collectText}>Collect Now</Text>
                </HapticButton>
                <Text style={styles.rowWorth}>{entry.worth}</Text>
              </View>
            </View>
          ))}
        </LuxuryProfileCard>

        <Text style={styles.sectionTitle}>More activity → More Points</Text>
        <Text style={styles.sectionSub}>
          Here’s how you can earn more rewards.
        </Text>

        <LuxuryProfileCard style={styles.table}>
          {EARN_MORE.map((entry, index) => (
            <View
              key={`${entry.label}-${index}`}
              style={[styles.tableRow, index > 0 && styles.divided]}
            >
              <Text style={styles.tableLabel}>{entry.label}</Text>
              <Text style={styles.tableValue}>{entry.value}</Text>
            </View>
          ))}
        </LuxuryProfileCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: LUXURY_COLORS.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 60,
  },

  // ── Hero ──
  hero: {
    alignItems: "center",
    paddingVertical: 8,
  },
  pointsCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.accent,
    backgroundColor: LUXURY_COLORS.surface,
  },
  bigPoints: {
    fontSize: 20,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  thankYou: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  since: {
    marginTop: 4,
    fontSize: 12,
    color: LUXURY_COLORS.textMuted,
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: LUXURY_COLORS.accent,
  },
  tierText: {
    fontSize: 11,
    fontWeight: "700",
    color: LUXURY_COLORS.primary,
  },

  // ── Progress ──
  progressSection: {
    marginTop: LUXURY_SPACING / 2,
  },
  progressTrack: {
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: LUXURY_COLORS.accent,
  },
  progressCursor: {
    position: "absolute",
    top: -9,
    left: PROGRESS,
  },
  milestones: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  milestone: {
    alignItems: "center",
  },
  milestonePrice: {
    fontSize: 10,
    color: LUXURY_COLORS.textMuted,
    marginBottom: 6,
  },
  milestoneLabel: {
    fontSize: 10,
    color: LUXURY_COLORS.textMuted,
  },
  milestoneActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: LUXURY_COLORS.accent,
  },
  milestoneActiveText: {
    fontSize: 10,
    fontWeight: "700",
    color: LUXURY_COLORS.primary,
  },

  // ── Balance ──
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: LUXURY_SPACING / 2,
    padding: 16,
  },
  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  summaryPoints: {
    fontSize: 18,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  summaryLabel: {
    marginTop: 2,
    fontSize: 12,
    color: LUXURY_COLORS.textMuted,
  },
  summaryRight: {
    alignItems: "flex-end",
  },
  summaryWorth: {
    fontSize: 18,
    fontWeight: "600",
    color: LUXURY_COLORS.accent,
  },
  redeem: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
    textDecorationLine: "underline",
  },

  // ── Point lists ──
  sectionTitle: {
    marginTop: LUXURY_SPACING / 2,
    marginBottom: 12,
    fontSize: 15,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  sectionSub: {
    marginTop: -6,
    marginBottom: 12,
    fontSize: 12,
    color: LUXURY_COLORS.textMuted,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  divided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LUXURY_COLORS.border,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LUXURY_COLORS.accent,
  },
  infoIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    flex: 1,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
  },
  rowLabel: {
    marginTop: 2,
    fontSize: 12,
    color: LUXURY_COLORS.textMuted,
  },
  rowWorth: {
    fontSize: 11,
    color: LUXURY_COLORS.textMuted,
  },
  collectAction: {
    alignItems: "flex-end",
    gap: 4,
  },
  collectText: {
    fontSize: 12,
    fontWeight: "700",
    color: LUXURY_COLORS.accent,
  },

  // ── Earn more ──
  table: {
    paddingHorizontal: 16,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  tableLabel: {
    fontSize: 13,
    color: LUXURY_COLORS.textMuted,
  },
  tableValue: {
    fontSize: 14,
    fontWeight: "700",
    color: LUXURY_COLORS.accent,
  },
});
