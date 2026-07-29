import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import {
  SHOP_CATEGORIES,
  ShopCategory,
  getCategoryRoute,
} from "@/store/data/categoriesData";
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

const GAP = 8;
const TILE_RADIUS = 16;
/** One feature tile beside a column of three. */
const TILES_PER_PAGE = 4;

type CategoryTileProps = {
  category?: ShopCategory;
  /** Pill shown over the feature tile, e.g. "New Additions". */
  badgeLabel?: string;
  labelSize: number;
  height: number;
  flex?: number;
  onPress: () => void;
};

function CategoryTile({
  category,
  badgeLabel,
  labelSize,
  height,
  flex,
  onPress,
}: CategoryTileProps) {
  // Keeps the page's shape intact when a page isn't a full four categories.
  if (!category) {
    return <View style={[styles.tile, { height, flex }]} />;
  }

  return (
    <HapticButton
      style={[styles.tile, { height, flex }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image
        source={{ uri: category.coverImageUrl }}
        style={styles.tileImage}
        resizeMode="cover"
      />

      {/* Keeps the label legible over whatever the artwork is doing */}
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]}
        style={styles.scrim}
        pointerEvents="none"
      />

      {!!badgeLabel && (
        <View style={styles.badge}>
          <Ionicons name="star" size={14} color="#FFFFFF" />
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      )}

      <View style={styles.tileFooter}>
        <Text
          style={[styles.tileLabel, { fontSize: labelSize }]}
          numberOfLines={1}
        >
          {category.name}
        </Text>
        <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
      </View>
    </HapticButton>
  );
}

type LuxuryCategoriesProps = {
  title?: string;
  /** Pill shown on each page's feature tile. Pass "" to hide it. */
  featureBadgeLabel?: string;
  categories?: ShopCategory[];
  /** Overrides navigation to the category's product list. */
  onPressCategory?: (category: ShopCategory) => void;
  style?: ViewStyle;
};

export default function LuxuryCategories({
  title = "Shop by Categories",
  featureBadgeLabel = "New Additions",
  categories = SHOP_CATEGORIES,
  onPressCategory,
  style,
}: LuxuryCategoriesProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  // Measured so a page fits the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [pageWidth, setPageWidth] = useState(SCREEN_WIDTH);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== pageWidth) {
      setPageWidth(width);
    }
  };

  // Split into pages of four, padding the last one so its tiles keep their
  // positions instead of stretching to fill the gaps.
  const pages: (ShopCategory | undefined)[][] = [];
  for (let i = 0; i < categories.length; i += TILES_PER_PAGE) {
    const page = categories.slice(i, i + TILES_PER_PAGE);
    pages.push(
      Array.from({ length: TILES_PER_PAGE }, (_, slot) => page[slot])
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    if (index !== activeIndex && index >= 0 && index < pages.length) {
      setActiveIndex(index);
    }
  };

  // Tile heights derive from the page width, so the grid keeps its
  // proportions on any screen size.
  const gridHeight = pageWidth;
  const stackHeight = Math.round((gridHeight - GAP * 2) / 3);
  // The last tile absorbs the rounding so the column ends flush with the
  // feature tile beside it.
  const stackHeights = [
    stackHeight,
    stackHeight,
    gridHeight - GAP * 2 - stackHeight * 2,
  ];

  const handlePress = (category: ShopCategory) => {
    if (onPressCategory) {
      onPressCategory(category);
      return;
    }
    router.navigate(getCategoryRoute(category));
  };

  const renderPage = ({ item }: { item: (ShopCategory | undefined)[] }) => (
    <View style={[styles.page, { width: pageWidth, height: gridHeight }]}>
      <CategoryTile
        category={item[0]}
        badgeLabel={featureBadgeLabel || undefined}
        labelSize={18}
        height={gridHeight}
        flex={1}
        onPress={() => item[0] && handlePress(item[0])}
      />

      <View style={styles.rightColumn}>
        {stackHeights.map((height, slot) => {
          const category = item[slot + 1];
          return (
            <CategoryTile
              key={category?.id ?? `empty-${slot}`}
              category={category}
              labelSize={15}
              height={height}
              onPress={() => category && handlePress(category)}
            />
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>

      <FlatList
        data={pages}
        renderItem={renderPage}
        keyExtractor={(page, index) => page[0]?.id ?? `page-${index}`}
        extraData={pageWidth}
        horizontal
        pagingEnabled // Four categories per page: page width === list width
        disableIntervalMomentum // Never fling past a single page
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

      {pages.length > 1 && (
        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
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
  page: {
    flexDirection: "row",
    gap: GAP,
  },
  rightColumn: {
    flex: 1,
    gap: GAP,
  },
  tile: {
    borderRadius: TILE_RADIUS,
    overflow: "hidden",
    backgroundColor: "#E2EAEE",
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
  badge: {
    position: "absolute",
    top: 14,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
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
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: LUXURY_SPACING / 2,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#C3D0D5",
  },
});
