import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_COLORS } from "@/constants/theme";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Sparkles } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

const { height } = Dimensions.get("window");

/** Tall enough to carry the artwork, short enough to promise more below it. */
const HERO_HEIGHT = Math.min(height * 0.78, 760);

type MicrositeHeroProps = {
  brandName: string;
  coverPhotoUrl: string;
  /** The brand's mark for the white card. Falls back to its name set in type. */
  logoUrl?: string;
  /** Standing to show in the pill, e.g. "India's #1 Jewellery". */
  rank?: string;
  /** ISO date the brand was founded; drives the "EST." line. */
  establishedDate?: string;
  title: string;
  description: string;
  /** The brand's own accent, used for the eyebrow and the second action. */
  accentColor?: string;
  onViewAllProducts?: () => void;
  /**
   * What a correct password opens. Nothing calls it yet — the gate turns every
   * attempt away — but it is where the collection is reached from once there is
   * a password to check against.
   */
  onPrivateCollection?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * "EST. 1956 · 68 YEARS OF TRUST" — the second half is dropped for a brand
 * founded this year, which would otherwise boast of nothing.
 */
const buildEstablishedLine = (establishedDate?: string) => {
  if (!establishedDate) return "";

  const founded = new Date(establishedDate);
  if (Number.isNaN(founded.getTime())) return "";

  const foundedYear = founded.getFullYear();
  const years = new Date().getFullYear() - foundedYear;

  return years > 0
    ? `EST. ${foundedYear} · ${years} YEARS OF TRUST`
    : `EST. ${foundedYear}`;
};

/**
 * The first thing a microsite shows: the brand's own artwork, who they are,
 * and the two ways into their catalogue.
 */
export default function MicrositeHero({
  brandName,
  coverPhotoUrl,
  logoUrl,
  rank,
  establishedDate,
  title,
  description,
  accentColor = LUXURY_COLORS.accent,
  onViewAllProducts,
  onPrivateCollection,
  style,
}: MicrositeHeroProps) {
  const establishedLine = buildEstablishedLine(establishedDate);

  const [isGateOpen, setIsGateOpen] = useState(false);
  const [password, setPassword] = useState("");
  /** iOS only — see handleSubmitPassword. */
  const [isFailurePending, setIsFailurePending] = useState(false);

  const openGate = () => {
    setPassword("");
    setIsGateOpen(true);
  };

  const closeGate = () => {
    setIsGateOpen(false);
    setPassword("");
  };

  const announceFailure = useCallback(() => {
    Alert.alert(
      "Wrong password",
      "That password does not open this collection."
    );
  }, []);

  /**
   * There is no password that works yet, so every attempt is turned away.
   *
   * iOS drops an alert raised while a modal is still dismissing, so there the
   * alert waits for the gate to be gone and is fired from onDismiss. Android
   * has no such step.
   */
  const handleSubmitPassword = () => {
    if (!password.trim()) return;

    closeGate();

    if (Platform.OS === "ios") {
      setIsFailurePending(true);
      return;
    }
    announceFailure();
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: coverPhotoUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
      />

      {/* Holds the artwork back so the type over it stays readable. */}
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.45)",
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0.75)",
          "rgba(0,0,0,0.95)",
        ]}
        locations={[0, 0.28, 0.72, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.topRow}>

      </View>

      <View style={styles.copy}>
        {!!establishedLine && (
          <Text style={[styles.established, { color: accentColor }]}>
            {establishedLine}
          </Text>
        )}

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.actions}>
          <HapticButton
            style={[styles.action, styles.actionGlass]}
            activeOpacity={0.85}
            onPress={onViewAllProducts}
          >
            <Text style={styles.actionText}>View All Products</Text>
          </HapticButton>

          <HapticButton
            style={[styles.action, { backgroundColor: accentColor }]}
            activeOpacity={0.85}
            onPress={openGate}
          >
            <Text style={[styles.actionText, styles.actionTextOnAccent]}>
              Private Collection
            </Text>
            <Sparkles
              size={18}
              color={LUXURY_COLORS.primary}
              strokeWidth={2}
              fill={LUXURY_COLORS.primary}
            />
          </HapticButton>
        </View>
      </View>

      <Modal
        visible={isGateOpen}
        animationType="fade"
        transparent
        onRequestClose={closeGate}
        onDismiss={() => {
          if (!isFailurePending) return;
          setIsFailurePending(false);
          announceFailure();
        }}
      >
        <View style={styles.gateOverlay}>
          {/* Tappable backdrop, the same way out as Cancel. */}
          <HapticButton
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeGate}
          >
            <View />
          </HapticButton>

          <View style={styles.gateCard}>
            <Text style={styles.gateTitle}>Private Collection</Text>
            <Text style={styles.gateSubtitle}>
              Enter the password {brandName} gave you.
            </Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.45)"
              style={styles.gateInput}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              returnKeyType="go"
              onSubmitEditing={handleSubmitPassword}
            />

            <View style={styles.gateActions}>
              <HapticButton
                style={[styles.gateButton, styles.gateButtonGhost]}
                activeOpacity={0.85}
                onPress={closeGate}
              >
                <Text style={styles.gateButtonText}>Cancel</Text>
              </HapticButton>

              <HapticButton
                style={[
                  styles.gateButton,
                  { backgroundColor: accentColor },
                  !password.trim() && styles.gateButtonDisabled,
                ]}
                activeOpacity={0.85}
                disabled={!password.trim()}
                onPress={handleSubmitPassword}
              >
                <Text
                  style={[styles.gateButtonText, styles.actionTextOnAccent]}
                >
                  Unlock
                </Text>
              </HapticButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HERO_HEIGHT,
    justifyContent: "space-between",
    overflow: "hidden",
    backgroundColor: "#000000",
  },

  // ── Badges over the artwork ──
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 28,
    paddingHorizontal: 16,
  },
  logoCard: {
    minWidth: 130,
    height: 78,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.65)",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 110,
    height: 54,
  },
  logoText: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    color: LUXURY_COLORS.primary,
  },
  rankPill: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  rankDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rankText: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: "#FFFFFF",
  },

  // ── The pitch ──
  copy: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  established: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2.5,
    textAlign: "center",
  },
  title: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    color: "#FFFFFF",
  },
  description: {
    marginTop: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "rgba(255,255,255,0.85)",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  action: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 56,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  actionGlass: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: "rgba(30,30,30,0.75)",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  // The accent action is light, so its label grounds to the storefront.
  actionTextOnAccent: {
    color: LUXURY_COLORS.primary,
  },

  // ── Password gate ──
  gateOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(6, 18, 22, 0.6)",
  },
  gateCard: {
    alignSelf: "stretch",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: LUXURY_COLORS.surface,
  },
  gateTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#FFFFFF",
  },
  gateSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
  },
  gateInput: {
    marginTop: 20,
    height: 50,
    paddingHorizontal: 18,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    fontSize: 16,
    color: "#FFFFFF",
    // Android pads its inputs by default, which pushes the text off-centre.
    paddingVertical: 0,
  },
  gateActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  gateButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  gateButtonGhost: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  gateButtonDisabled: {
    opacity: 0.45,
  },
  gateButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
