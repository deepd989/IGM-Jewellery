import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import {
  MultiBrandCollection,
  useGetMultiBrandCollectionsQuery,
} from "@/store/apis/multibrandCollectionsApi";
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

const GAP = 10;
const COLUMNS = 2;
/** The grid has room for exactly this many collections. */
const TILE_COUNT = 4;
/** Tile width ÷ height. 1 keeps the tiles square. */
const TILE_ASPECT_RATIO = 1;
/** Corner radius as a share of the tile's width, so the curve scales with it. */
const CORNER_RATIO = 0.16;

type CollectionTileProps = {
  collection?: MultiBrandCollection;
  size: number;
  /**
   * Which diagonal's corners get curved: "main" rounds top-left and
   * bottom-right, "anti" rounds top-right and bottom-left.
   */
  diagonal: "main" | "anti";
  onPress: (collection: MultiBrandCollection) => void;
};

function CollectionTile({
  collection,
  size,
  diagonal,
  onPress,
}: CollectionTileProps) {
  const radius = Math.round(size * CORNER_RATIO);
  // Only two opposite corners curve; the other two stay square, so the four
  // tiles read as one interlocking block.
  const corners =
    diagonal === "main"
      ? { borderTopLeftRadius: radius, borderBottomRightRadius: radius }
      : { borderTopRightRadius: radius, borderBottomLeftRadius: radius };

  const tileStyle = [
    styles.tile,
    corners,
    { width: size, height: Math.round(size / TILE_ASPECT_RATIO) },
  ];

  // Keeps the grid's shape intact when fewer collections come back than slots.
  if (!collection) {
    return <View style={tileStyle} />;
  }

  return (
    <HapticButton
      style={tileStyle}
      activeOpacity={0.85}
      onPress={() => onPress(collection)}
    >
      {!!collection.collectionBannerUrl && (
        <Image
          source={{ uri: collection.collectionBannerUrl }}
          style={styles.tileImage}
          resizeMode="cover"
        />
      )}
    </HapticButton>
  );
}

type LuxuryCollectionsProps = {
  title?: string;
  /** Overrides navigation to the collection's product list. */
  onPressCollection?: (collection: MultiBrandCollection) => void;
  style?: ViewStyle;
};

export default function LuxuryCollections({
  title = "Collections You May Like",
  onPressCollection,
  style,
}: LuxuryCollectionsProps) {
  const router = useRouter();
  const { data: collections = [] } = useGetMultiBrandCollectionsQuery();
  // Measured so the grid fits the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  // Derived from the width, so the grid keeps its proportions on any screen.
  const tileSize = Math.round(
    (containerWidth - GAP * (COLUMNS - 1)) / COLUMNS
  );

  const tiles: (MultiBrandCollection | undefined)[] = Array.from(
    { length: TILE_COUNT },
    (_, index) => collections[index]
  );

  const rows = Array.from({ length: TILE_COUNT / COLUMNS }, (_, rowIndex) =>
    tiles.slice(rowIndex * COLUMNS, rowIndex * COLUMNS + COLUMNS)
  );

  const handlePressCollection = (collection: MultiBrandCollection) => {
    if (onPressCollection) {
      onPressCollection(collection);
      return;
    }
    router.navigate({
      pathname: "/product-list",
      params: {
        subCategoryId: String(collection.id),
        bannerImageUrl: encodeURIComponent(collection.collectionBannerUrl),
      },
    });
  };

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>

      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[styles.row, rowIndex > 0 && { marginTop: GAP }]}
        >
          {row.map((collection, columnIndex) => (
            <CollectionTile
              key={collection?.id ?? `empty-${rowIndex}-${columnIndex}`}
              collection={collection}
              size={tileSize}
              // Alternating like a checkerboard puts each tile's square
              // corners against its neighbours' curved ones.
              diagonal={(rowIndex + columnIndex) % 2 === 0 ? "main" : "anti"}
              onPress={handlePressCollection}
            />
          ))}
        </View>
      ))}
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
  tile: {
    // Corner radii are set per tile — see CollectionTile.
    overflow: "hidden",
    backgroundColor: "#E2EAEE",
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
});
