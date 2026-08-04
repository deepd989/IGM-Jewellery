import { HapticButton } from "@/components/basic components/hapticButton";
import { AssetKey, assetUrl } from "@/constants/assets";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
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

export type BrandTileEntry = {
  /** Manifest key for this tile's cover artwork. */
  assetKey: AssetKey;
  /** The brand the tile opens — the key /brandProfile/[brandName] takes. */
  businessNameKey: string;
};

/**
 * The mosaic, slot by slot, in the order the tiles are laid out: the big tile
 * top left, then the two down its right, then the two stacked bottom left, then
 * the big tile bottom right.
 *
 * Each slot pairs its own artwork with whichever brand currently sits in it, so
 * the covers are curated rather than taken from the brand's own profile image —
 * a logo on a transparent canvas does not fill a tile the way these do. Rotating
 * a brand through a slot means changing its businessNameKey and re-pointing that
 * slot's manifest key; the layout does not move.
 */
const BRAND_TILES: BrandTileEntry[] = [
  { assetKey: "luxury.brandTile.cover1", businessNameKey: "roma_design" },
  { assetKey: "luxury.brandTile.cover2", businessNameKey: "belrosa_atelier" },
  { assetKey: "luxury.brandTile.cover3", businessNameKey: "zaiwarya" },
  { assetKey: "luxury.brandTile.cover4", businessNameKey: "rang_auraa" },
  { assetKey: "luxury.brandTile.cover5", businessNameKey: "kaamya_jewels" },
  {
    assetKey: "luxury.brandTile.cover6",
    businessNameKey: "shwaahish_diamond_jewellers",
  },
];

type BrandTileProps = {
  tile?: BrandTileEntry;
  height: number;
  flex?: number;
  onPress: (tile: BrandTileEntry) => void;
};

function BrandTile({ tile, height, flex, onPress }: BrandTileProps) {
  // Keeps the mosaic's shape intact when a slot has been left empty.
  if (!tile) {
    return <View style={[styles.tile, { height, flex }]} />;
  }

  return (
    <HapticButton
      style={[styles.tile, { height, flex }]}
      activeOpacity={0.85}
      onPress={() => onPress(tile)}
    >
      <Image
        source={{ uri: assetUrl(tile.assetKey) }}
        style={styles.tileImage}
        resizeMode="cover"
      />
    </HapticButton>
  );
}

type LuxuryBrandsCollectionProps = {
  title?: string;
  /** The six slots of the mosaic. Defaults to the curated set above. */
  tiles?: BrandTileEntry[];
  /** Overrides navigation to the brand's profile screen. */
  onPressBrand?: (tile: BrandTileEntry) => void;
  style?: ViewStyle;
};

export default function LuxuryBrandsCollection({
  title = "One-Stop-Shop For All Brands",
  tiles = BRAND_TILES,
  onPressBrand,
  style,
}: LuxuryBrandsCollectionProps) {
  const router = useRouter();
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

  const handlePressBrand = (tile: BrandTileEntry) => {
    if (onPressBrand) {
      onPressBrand(tile);
      return;
    }
    router.navigate(`/brandProfile/${tile.businessNameKey}` as any);
  };

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>

      {/* Top half: one large tile beside a wide tile stacked over a second */}
      <View style={styles.row}>
        <BrandTile
          tile={tiles[0]}
          height={topRowHeight}
          flex={50}
          onPress={handlePressBrand}
        />
        <View style={[styles.stack, { flex: 50 }]}>
          <BrandTile
            tile={tiles[1]}
            height={topWideHeight}
            onPress={handlePressBrand}
          />
          <BrandTile
            tile={tiles[2]}
            height={topSmallHeight}
            onPress={handlePressBrand}
          />
        </View>
      </View>

      {/* Bottom half: two stacked tiles beside one large tile */}
      <View style={[styles.row, { marginTop: GAP }]}>
        <View style={[styles.stack, { flex: 39 }]}>
          <BrandTile
            tile={tiles[3]}
            height={bottomTallHeight}
            onPress={handlePressBrand}
          />
          <BrandTile
            tile={tiles[4]}
            height={bottomShortHeight}
            onPress={handlePressBrand}
          />
        </View>
        <BrandTile
          tile={tiles[5]}
          height={bottomRowHeight}
          flex={61}
          onPress={handlePressBrand}
        />
      </View>
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
    color: LUXURY_COLORS.text,
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
    backgroundColor: LUXURY_COLORS.surface,
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
});
