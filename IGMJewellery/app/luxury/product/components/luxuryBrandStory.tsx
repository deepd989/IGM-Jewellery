import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Product } from "@/interfaces/product.interface";
import { useGetBrandByNameQuery } from "@/store/apis/brandsApi";
import { getBrandKey } from "@/utils/brandKeyMap";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const SIDE_PADDING = 16;
const LOGO_SIZE = 100;

const FALLBACK_DESCRIPTION =
  "Celebrate every day in style with the subtle grace of these drop earrings crafted in 22 Karat Yellow Gold in a leaf design.";

type LuxuryBrandStoryProps = {
  product: Product;
  /** Blurred backdrop; defaults to the product's own artwork. */
  imageUri?: string;
  /** Overrides navigation to the brand's profile. */
  onExploreBrand?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * The maker behind the piece: logo, story and a way through to the brand's
 * profile, on a frosted card over the blurred artwork.
 */
export default function LuxuryBrandStory({
  product,
  imageUri,
  onExploreBrand,
  style,
}: LuxuryBrandStoryProps) {
  const router = useRouter();
  const { data: brandData } = useGetBrandByNameQuery(product.brand);

  // The brand's own copy leads; the product's stands in until it arrives.
  const brandParagraphs = (brandData?.aboutSections || [])
    .flatMap((section) => section.paragraphs)
    .filter(Boolean);

  const description =
    brandParagraphs.join("\n\n") || product.description || FALLBACK_DESCRIPTION;

  const handleExploreBrand = () => {
    if (onExploreBrand) {
      onExploreBrand();
      return;
    }
    router.navigate({
      pathname: "/brandProfile/[brandName]",
      params: { brandName: getBrandKey(product.brand) },
    });
  };

  return (
    <View style={[styles.container, style]}>
      {!!imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.backdrop}
          resizeMode="cover"
          blurRadius={14}
        />
      )}
      <View style={styles.backdropScrim} pointerEvents="none" />

      <View style={styles.card}>
        <BlurView
          intensity={22}
          tint="dark"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {/* Keeps the white type readable over whatever the artwork is doing. */}
        <View style={styles.cardFill} pointerEvents="none" />

        {!!brandData?.profileImageUri && (
          <View style={styles.logoTile}>
            <Image
              source={{ uri: brandData.profileImageUri }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        )}

        <Text style={styles.title}>ABOUT {product.brand.toUpperCase()}</Text>

        <Text style={styles.description}>{description}</Text>

        <HapticButton
          style={styles.exploreButton}
          activeOpacity={0.85}
          onPress={handleExploreBrand}
        >
          <Text style={styles.exploreText}>Explore Brand</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </HapticButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    paddingHorizontal: SIDE_PADDING,
    paddingVertical: LUXURY_SPACING,
    backgroundColor: "#0A1A1F",
  },
  backdrop: StyleSheet.absoluteFillObject,
  backdropScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 22, 26, 0.3)",
  },
  card: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    paddingVertical: LUXURY_SPACING / 2,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  cardFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(28, 44, 48, 0.32)",
  },
  logoTile: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  title: {
    marginTop: LUXURY_SPACING / 2,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#FFFFFF",
    textAlign: "center",
  },
  description: {
    marginTop: LUXURY_SPACING / 2,
    alignSelf: "stretch",
    fontSize: 15,
    lineHeight: 23,
    color: "#FFFFFF",
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: LUXURY_SPACING / 2,
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
  },
  exploreText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
