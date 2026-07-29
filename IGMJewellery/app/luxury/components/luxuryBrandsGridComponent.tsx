import { HapticButton } from "@/components/basic components/hapticButton";
import { LUXURY_SPACING } from "@/constants/theme";
import { Brand, useGetBrandsQuery } from "@/store/apis/brandsApi";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/** Used when a brand has no brandPrimaryColor of its own. */
const DEFAULT_BACKGROUND = "#123C48";
const GRID_GAP = 4;
const GRID_RADIUS = 20;
const SIDE_PADDING = 16;

export type LuxuryBrandTile = "brand" | "newIn" | "collections";

/** Cover art used for any tile the brands API doesn't supply one for. */
const FALLBACK_COVERS: Record<LuxuryBrandTile, string> = {
  brand:
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
  newIn:
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
  collections:
    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
};

/** Where each tile's cover art comes from on the Brand model. */
const COVER_FIELDS: Record<
  LuxuryBrandTile,
  (brand: Brand) => string | undefined
> = {
  brand: (brand) => brand.mainCoverUri,
  newIn: (brand) => brand.newInCoverUri,
  collections: (brand) => brand.collectionsCoverUri,
};

type TileProps = {
  /** Artwork filling the tile. */
  imageUri?: string;
  /** Brand mark laid over the artwork. */
  logoUri?: string;
  logoVariant: "card" | "badge";
  label: string;
  labelSize: number;
  height: number;
  flex?: number;
  onPress: () => void;
};

function GridTile({
  imageUri,
  logoUri,
  logoVariant,
  label,
  labelSize,
  height,
  flex,
  onPress,
}: TileProps) {
  return (
    <HapticButton
      style={[styles.tile, { height, flex }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {!!imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.tileImage}
          resizeMode="cover"
        />
      )}

      {/* Keeps the label legible over whatever the artwork is doing */}
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]}
        style={styles.scrim}
        pointerEvents="none"
      />

      {!!logoUri && (
        <View
          style={
            logoVariant === "card" ? styles.logoCard : styles.logoBadge
          }
        >
          <Image
            source={{ uri: logoUri }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      )}

      <View style={styles.tileFooter}>
        <Text style={[styles.tileLabel, { fontSize: labelSize }]} numberOfLines={1}>
          {label}
        </Text>
        <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
      </View>
    </HapticButton>
  );
}

type LuxuryBrandsGridProps = {
  title?: string;
  newInLabel?: string;
  collectionsLabel?: string;
  /** Overrides navigation to the brand's profile screen. */
  onPressTile?: (brand: Brand, tile: LuxuryBrandTile) => void;
  /** Overrides navigation to the full brands list. */
  onViewAll?: () => void;
  style?: ViewStyle;
};

export default function LuxuryBrandsGrid({
  title = "Brands On Elanzia",
  newInLabel = "New In",
  collectionsLabel = "Collections",
  onPressTile,
  onViewAll,
  style,
}: LuxuryBrandsGridProps) {
  const router = useRouter();
  const { data: brands = [] } = useGetBrandsQuery({});
  const [activeIndex, setActiveIndex] = useState(0);
  // Measured so a page fits the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [pageWidth, setPageWidth] = useState(SCREEN_WIDTH - SIDE_PADDING * 2);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== pageWidth) {
      setPageWidth(width);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    if (index !== activeIndex && index >= 0 && index < brands.length) {
      setActiveIndex(index);
    }
  };

  // Tile heights derive from the page width, so the grid keeps its
  // proportions on any screen size.
  const gridHeight = pageWidth;
  const rightTopHeight = Math.round((gridHeight - GRID_GAP) * 0.49);
  const rightBottomHeight = gridHeight - GRID_GAP - rightTopHeight;

  const backgroundColor =
    brands[activeIndex]?.brandPrimaryColor || DEFAULT_BACKGROUND;

  const handlePressTile = (brand: Brand, tile: LuxuryBrandTile) => {
    if (onPressTile) {
      onPressTile(brand, tile);
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

  // A single blank page stands in while the brands are still loading.
  const pages: (Brand | undefined)[] = brands.length ? brands : [undefined];

  const tileImage = (brand: Brand | undefined, tile: LuxuryBrandTile) =>
    (brand && COVER_FIELDS[tile](brand)) || FALLBACK_COVERS[tile];

  const renderPage = ({ item }: { item?: Brand }) => (
    <View style={[styles.grid, { width: pageWidth, height: gridHeight }]}>
      <GridTile
        imageUri={tileImage(item, "brand")}
        logoUri={item?.profileImageUri}
        logoVariant="card"
        label={item?.businessName ?? ""}
        labelSize={20}
        height={gridHeight}
        flex={51}
        onPress={() => item && handlePressTile(item, "brand")}
      />

      <View style={styles.rightColumn}>
        <GridTile
          imageUri={tileImage(item, "newIn")}
          logoUri={item?.profileImageUri}
          logoVariant="badge"
          label={newInLabel}
          labelSize={16}
          height={rightTopHeight}
          onPress={() => item && handlePressTile(item, "newIn")}
        />
        <GridTile
          imageUri={tileImage(item, "collections")}
          logoUri={item?.profileImageUri}
          logoVariant="badge"
          label={collectionsLabel}
          labelSize={16}
          height={rightBottomHeight}
          onPress={() => item && handlePressTile(item, "collections")}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <Text style={styles.title}>{title}</Text>

      <View onLayout={handleLayout}>
        <FlatList
          data={pages}
          renderItem={renderPage}
          keyExtractor={(item, index) => item?.id ?? `placeholder-${index}`}
          extraData={pageWidth}
          horizontal
          pagingEnabled // One brand per page: page width === list width
          disableIntervalMomentum // Never fling past a single brand
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          bounces={false}
          getItemLayout={(_, index) => ({
            length: pageWidth,
            offset: pageWidth * index,
            index,
          })}
        />
      </View>

      <HapticButton style={styles.viewAllButton} onPress={handleViewAll}>
        <Text style={styles.viewAllText}>View All</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </HapticButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Deliberately no width: stretching to the parent lets a caller widen the
    // section with negative margins. A fixed 100% would only shift it.
    alignSelf: "stretch",
    paddingVertical: LUXURY_SPACING,
    paddingHorizontal: SIDE_PADDING,
    borderRadius: GRID_RADIUS,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: LUXURY_SPACING,
  },
  grid: {
    flexDirection: "row",
    gap: GRID_GAP,
    borderRadius: GRID_RADIUS,
    overflow: "hidden",
  },
  rightColumn: {
    flex: 49,
    gap: GRID_GAP,
  },
  tile: {
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  tileImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  scrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "45%",
  },
  /** Frosted plate holding the brand mark, centred on the feature tile. */
  logoCard: {
    position: "absolute",
    alignSelf: "center",
    top: "38%",
    width: "62%",
    aspectRatio: 1.25,
    padding: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  logoBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 58,
    height: 50,
    padding: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  tileFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  tileLabel: {
    flexShrink: 1,
    color: "#FFFFFF",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    alignSelf: "center",
    marginTop: LUXURY_SPACING,
    height: 52,
    paddingHorizontal: 60,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  viewAllText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
