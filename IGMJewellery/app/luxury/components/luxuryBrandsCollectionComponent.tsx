import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_COLORS, LUXURY_INK, LUXURY_SPACING } from "@/constants/theme";
import { Brand, useGetBrandsQuery } from "@/store/apis/brandsApi";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GAP = 8;
const TILE_RADIUS = 18;
/** The mosaic has room for exactly this many brands. */
const TILE_COUNT = 7;

type BrandTileProps = {
  brand?: Brand;
  height: number;
  flex?: number;
  onPress: (brand: Brand) => void;
};

function BrandTile({ brand, height, flex, onPress }: BrandTileProps) {
  // Keeps the mosaic's shape intact when fewer brands come back than slots.
  if (!brand) {
    return <View style={[styles.tile, { height, flex }]} />;
  }

  return (
    <HapticButton
      style={[styles.tile, { height, flex }]}
      activeOpacity={0.85}
      onPress={() => onPress(brand)}
    >
      {!!brand.profileImageUri && (
        <Image
          source={{ uri: brand.profileImageUri }}
          style={styles.tileImage}
          resizeMode="cover"
        />
      )}
    </HapticButton>
  );
}

type LuxuryBrandsCollectionProps = {
  title?: string;
  /** Overrides navigation to the brand's profile screen. */
  onPressBrand?: (brand: Brand) => void;
  /** Overrides navigation to the full brands list. */
  onViewAll?: () => void;
  style?: ViewStyle;
};

export default function LuxuryBrandsCollection({
  title = "One-Stop-Shop For All Brands",
  onPressBrand,
  onViewAll,
  style,
}: LuxuryBrandsCollectionProps) {
  const router = useRouter();
  const { data: brands = [] } = useGetBrandsQuery({});
  // Measured so the mosaic fits the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  // Every tile height is derived from the width, so the mosaic keeps its
  // proportions on any screen size.
  const topRowHeight = Math.round(containerWidth * 0.5);
  const bottomRowHeight = Math.round(containerWidth * 0.59);
  // Each stack splits its row height around one gap, so the two columns of a
  // row always end flush with each other.
  const topWideHeight = Math.round((topRowHeight - GAP) * 0.55);
  const topSmallHeight = topRowHeight - GAP - topWideHeight;
  const bottomTallHeight = Math.round((bottomRowHeight - GAP) * 0.6);
  const bottomShortHeight = bottomRowHeight - GAP - bottomTallHeight;

  const tiles: (Brand | undefined)[] = Array.from(
    { length: TILE_COUNT },
    (_, index) => brands[index]
  );

  const handlePressBrand = (brand: Brand) => {
    if (onPressBrand) {
      onPressBrand(brand);
      return;
    }
    router.navigate(`/brandProfile/${brand.businessNameKey}` as any);
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
      return;
    }
    router.navigate("/brands");
  };

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>

      {/* Top half: one large tile beside a wide tile stacked over two squares */}
      <View style={styles.row}>
        <BrandTile
          brand={tiles[0]}
          height={topRowHeight}
          flex={50}
          onPress={handlePressBrand}
        />
        <View style={[styles.stack, { flex: 50 }]}>
          <BrandTile
            brand={tiles[1]}
            height={topWideHeight}
            onPress={handlePressBrand}
          />
          <View style={styles.row}>
            <BrandTile
              brand={tiles[2]}
              height={topSmallHeight}
              flex={1}
              onPress={handlePressBrand}
            />
            <BrandTile
              brand={tiles[3]}
              height={topSmallHeight}
              flex={1}
              onPress={handlePressBrand}
            />
          </View>
        </View>
      </View>

      {/* Bottom half: two stacked tiles beside one large tile */}
      <View style={[styles.row, { marginTop: GAP }]}>
        <View style={[styles.stack, { flex: 39 }]}>
          <BrandTile
            brand={tiles[4]}
            height={bottomTallHeight}
            onPress={handlePressBrand}
          />
          <BrandTile
            brand={tiles[5]}
            height={bottomShortHeight}
            onPress={handlePressBrand}
          />
        </View>
        <BrandTile
          brand={tiles[6]}
          height={bottomRowHeight}
          flex={61}
          onPress={handlePressBrand}
        />
      </View>

      <HapticButton style={styles.viewAllWrapper} onPress={handleViewAll}>
        <LinearGradient
          colors={["#175E63", "#053844"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </LinearGradient>
      </HapticButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: LUXURY_INK.text,
    textAlign: "center",
    marginBottom: LUXURY_SPACING,
  },
  row: {
    flexDirection: "row",
    gap: GAP,
  },
  stack: {
    gap: GAP,
  },
  tile: {
    borderRadius: TILE_RADIUS,
    overflow: "hidden",
    backgroundColor: "#E2EAEE",
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  viewAllWrapper: {
    alignSelf: "center",
    marginTop: LUXURY_SPACING,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#052A33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 48,
    paddingHorizontal: 56,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
