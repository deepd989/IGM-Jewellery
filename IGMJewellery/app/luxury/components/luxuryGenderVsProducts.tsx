import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { BlurView } from "expo-blur";
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
const GRID_RADIUS = 28;
const SIDE_PADDING = 16;

export type LuxuryGenderTile = {
  id: string;
  label: string;
  image: string;
  /** Params handed to /product-list. */
  params: Record<string, string>;
};

/**
 * Artwork is placeholder — point these at the final URLs when they're hosted.
 * /product-list turns `departmentId` into a gender filter (mens → male,
 * womens → female, kids → kids). There's no unisex department, so that tile
 * uses the `gender` param, which the screen honours over the department map.
 */
const GENDER_TILES: LuxuryGenderTile[] = [
  {
    id: "mens",
    label: "For Men",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    params: { departmentId: "mens" },
  },
  {
    id: "womens",
    label: "For Women",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop",
    params: { departmentId: "womens" },
  },
  {
    id: "unisex",
    label: "Unisex Jewellery",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop",
    params: { gender: "unisex" },
  },
  {
    id: "kids",
    label: "For Kids",
    image:
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600&auto=format&fit=crop",
    params: { departmentId: "kids" },
  },
];

type LuxuryGenderVsProductsProps = {
  title?: string;
  tiles?: LuxuryGenderTile[];
  /** Overrides navigation to the filtered product list. */
  onPressTile?: (tile: LuxuryGenderTile) => void;
  style?: ViewStyle;
};

export default function LuxuryGenderVsProducts({
  title = "Find Something For All",
  tiles = GENDER_TILES,
  onPressTile,
  style,
}: LuxuryGenderVsProductsProps) {
  const router = useRouter();
  // Measured so the tiles fit the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [gridWidth, setGridWidth] = useState(SCREEN_WIDTH - SIDE_PADDING * 2);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== gridWidth) {
      setGridWidth(width);
    }
  };

  // Two square tiles per row, sized from the width so the grid keeps its
  // proportions on any screen.
  const tileWidth = Math.floor((gridWidth - GAP) / 2);

  const handlePress = (tile: LuxuryGenderTile) => {
    if (onPressTile) {
      onPressTile(tile);
      return;
    }
    router.navigate({
      pathname: "/product-list",
      params: tile.params,
    });
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>

      {/* Rounding lives on the grid, so only its outer corners curve and the
          seams between tiles stay square. */}
      <View style={styles.grid} onLayout={handleLayout}>
        {tiles.map((tile) => (
          <HapticButton
            key={tile.id}
            style={[styles.tile, { width: tileWidth, height: tileWidth }]}
            activeOpacity={0.85}
            onPress={() => handlePress(tile)}
          >
            <Image
              source={{ uri: tile.image }}
              style={styles.tileImage}
              resizeMode="cover"
            />

            <View style={styles.labelWrapper}>
              <BlurView intensity={35} tint="light" style={styles.label}>
                <Text style={styles.labelText} numberOfLines={1}>
                  {tile.label}
                </Text>
              </BlurView>
            </View>
          </HapticButton>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
    textAlign: "center",
    marginBottom: LUXURY_SPACING,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
    borderRadius: GRID_RADIUS,
    overflow: "hidden",
  },
  tile: {
    overflow: "hidden",
    backgroundColor: "#E2EAEE",
  },
  tileImage: {
    ...StyleSheet.absoluteFillObject,
  },
  labelWrapper: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 18,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  label: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  labelText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
