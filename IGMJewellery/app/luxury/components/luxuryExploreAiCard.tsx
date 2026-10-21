import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Sparkle } from "lucide-react-native";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

/** Card width ÷ height. */
const CARD_ASPECT_RATIO = 1.74;
const CARD_RADIUS = 24;

type LuxuryExploreAiCardProps = {
  title?: string;
  caption?: string;
  ctaLabel?: string;
  /** Artwork behind the card. */
  imageUri?: string;
  /** Set to white when the card sits on a dark screen. */
  titleColor?: string;
  /** Overrides navigation to the AI screen. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The hand-off to the AI assistant, shown where a listing runs out: a prompt
 * over the artwork with one way through to the chat.
 */
export default function LuxuryExploreAiCard({
  title = "Not Sure What To Buy?",
  caption = "Let Elanzia Ai\nhelp you",
  ctaLabel = "Explore Ai",
  imageUri,
  titleColor = COLORS.primary,
  onPress,
  style,
}: LuxuryExploreAiCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.navigate("/exploreAi");
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>

      <View style={styles.card}>
        {!!imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {/* Holds the artwork back so the white type stays readable. */}
        <LinearGradient
          colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.55)"]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={styles.sparkles} pointerEvents="none">
          <Sparkle size={34} color="#FFFFFF" fill="#FFFFFF" />
          <Sparkle
            size={20}
            color="#FFFFFF"
            fill="#FFFFFF"
            style={styles.smallSparkle}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.caption}>{caption}</Text>

          <HapticButton
            style={styles.ctaWrapper}
            activeOpacity={0.85}
            onPress={handlePress}
          >
            <BlurView intensity={26} tint="light" style={styles.cta}>
              <Text style={styles.ctaText}>{ctaLabel}</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </BlurView>
          </HapticButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    paddingVertical: LUXURY_SPACING / 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: LUXURY_SPACING / 2,
  },
  card: {
    width: "100%",
    aspectRatio: CARD_ASPECT_RATIO,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: "#0A1A1F",
  },
  image: StyleSheet.absoluteFillObject,
  sparkles: {
    position: "absolute",
    top: 18,
    left: 18,
    alignItems: "flex-start",
  },
  smallSparkle: {
    marginTop: -4,
    marginLeft: -2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    padding: 18,
  },
  caption: {
    flexShrink: 1,
    fontSize: 20,
    lineHeight: 27,
    color: "#FFFFFF",
  },
  ctaWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    // Opaque enough to keep the white label readable over pale artwork.
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  ctaText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
});
