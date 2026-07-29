import { LinearGradient } from "expo-linear-gradient";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";

/** Fade the cover in over the outgoing storefront. */
const FADE_IN_MS = 220;
/** Hold it while the incoming storefront mounts behind it. */
const HOLD_MS = 420;
/** Reveal the new storefront. */
const FADE_OUT_MS = 340;

/**
 * Which storefront the shopper is browsing. The two share their data and their
 * routes — only the presentation differs — so this is the single switch that
 * decides which one a screen renders.
 */
type LuxuryContextType = {
  isLuxury: boolean;
  setIsLuxury: (value: boolean) => void;
  /** Flips the mode without the caller having to know the current value. */
  toggleLuxury: () => void;
  /**
   * Covers the screen, flips the mode, runs `navigate`, then reveals the new
   * storefront. Use this rather than setIsLuxury for anything the shopper
   * triggers, so the swap never happens in plain sight.
   */
  switchMode: (value: boolean, navigate?: () => void) => void;
  isSwitching: boolean;
};

const LuxuryContext = createContext<LuxuryContextType | null>(null);

export function LuxuryProvider({ children }: { children: React.ReactNode }) {
  // Not persisted: the shopper starts in the Massy storefront each launch.
  const [isLuxury, setIsLuxury] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  /** Named while the cover is up, since isLuxury has not flipped yet. */
  const [pendingLabel, setPendingLabel] = useState("");

  const coverOpacity = useRef(new Animated.Value(0)).current;
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    },
    []
  );

  const toggleLuxury = useCallback(() => setIsLuxury((value) => !value), []);

  const switchMode = useCallback(
    (value: boolean, navigate?: () => void) => {
      // A second tap mid-switch would restart the sequence over a raised cover.
      if (isSwitching) return;

      setIsSwitching(true);
      setPendingLabel(value ? "Luxury" : "Massy");

      Animated.timing(coverOpacity, {
        toValue: 1,
        duration: FADE_IN_MS,
        useNativeDriver: true,
      }).start(() => {
        setIsLuxury(value);
        navigate?.();

        if (holdTimer.current) clearTimeout(holdTimer.current);
        holdTimer.current = setTimeout(() => {
          Animated.timing(coverOpacity, {
            toValue: 0,
            duration: FADE_OUT_MS,
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (finished) setIsSwitching(false);
          });
        }, HOLD_MS);
      });
    },
    [coverOpacity, isSwitching]
  );

  const value = useMemo(
    () => ({ isLuxury, setIsLuxury, toggleLuxury, switchMode, isSwitching }),
    [isLuxury, toggleLuxury, switchMode, isSwitching]
  );

  return (
    <LuxuryContext.Provider value={value}>
      <View style={styles.root}>
        {children}

        {/* Sits over the whole app; only interactive while a switch is running
            so a second tap cannot land on the screen underneath. */}
        <Animated.View
          pointerEvents={isSwitching ? "auto" : "none"}
          style={[styles.cover, { opacity: coverOpacity }]}
        >
          <LinearGradient
            colors={["#04333E", "#1C7A72"]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.coverFill}
          >
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.coverLabel}>{pendingLabel.toUpperCase()}</Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </LuxuryContext.Provider>
  );
}

export const useLuxury = () => {
  const ctx = useContext(LuxuryContext);
  if (!ctx) {
    throw new Error("useLuxury must be used inside LuxuryProvider");
  }
  return ctx;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    elevation: 100,
  },
  coverFill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  coverLabel: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 3,
    color: "rgba(255,255,255,0.9)",
  },
});
