import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Region, REGION_LIST, getRegionRoute } from "@/store/data/regionsData";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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
const TILE_RADIUS = 24;
/** Slide width ÷ height. 1 keeps each region's collage square. */
const SLIDE_ASPECT_RATIO = 1;
/** The section never shows more than this many regions. */
const MAX_REGIONS = 6;

type LuxuryRegionalFavoritesProps = {
  title?: string;
  /** Defaults to every region, in display order. */
  regions?: Region[];
  /** Overrides navigation to the region's product list. */
  onPressRegion?: (region: Region) => void;
  style?: ViewStyle;
};

export default function LuxuryRegionalFavorites({
  title = "Regional Favorites",
  regions,
  onPressRegion,
  style,
}: LuxuryRegionalFavoritesProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  // Measured so the collage fits the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);

  const slides = (regions ?? REGION_LIST).slice(0, MAX_REGIONS);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  const slideWidth = containerWidth;
  const slideHeight = Math.round(slideWidth / SLIDE_ASPECT_RATIO);
  const snapInterval = slideWidth + GAP;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
    if (index !== activeIndex && index >= 0 && index < slides.length) {
      setActiveIndex(index);
    }
  };

  const handlePressRegion = (region: Region) => {
    if (onPressRegion) {
      onPressRegion(region);
      return;
    }
    router.navigate(getRegionRoute(region));
  };

  const renderSlide = ({ item }: { item: Region }) => (
    <View style={[styles.slide, { width: slideWidth, height: slideHeight }]}>
      {/* Left: the region's editorial portrait */}
      <HapticButton
        style={styles.portraitTile}
        activeOpacity={0.9}
        onPress={() => handlePressRegion(item)}
      >
        <Image
          source={{ uri: item.portraitImageUrl ?? item.sellerBannerImgUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.craftPillWrapper}>
          <BlurView intensity={35} tint="light" style={styles.craftPill}>
            <Text style={styles.craftPillText} numberOfLines={1}>
              {item.craftName}
            </Text>
          </BlurView>
        </View>
      </HapticButton>

      <View style={styles.rightColumn}>
        {/* Top right: the story behind the craft */}
        <View style={styles.storyTile}>
          <Text style={styles.storyTitle} numberOfLines={1}>
            {item.craftName}
          </Text>
          <Text style={styles.storyText}>{item.description}</Text>
        </View>

        {/* Bottom right: the way into the region's products */}
        <HapticButton
          style={styles.shopTile}
          activeOpacity={0.9}
          onPress={() => handlePressRegion(item)}
        >
          <Image
            source={{ uri: item.productImageUrl ?? item.sellerBannerImgUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Keeps the white label readable over pale product shots */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.55)"]}
            style={styles.shopScrim}
          />
          <View style={styles.shopRow}>
            <Text style={styles.shopText}>Shop All</Text>
            <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
          </View>
        </HapticButton>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>

      <FlatList
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        extraData={slideWidth}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        disableIntervalMomentum // Never fling past a single region
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        getItemLayout={(_, index) => ({
          length: snapInterval,
          offset: snapInterval * index,
          index,
        })}
      />

      {slides.length > 1 && (
        <View style={styles.pagination}>
          {slides.map((region, index) => (
            <View
              key={region.id}
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
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: LUXURY_SPACING,
  },
  listContent: {
    gap: GAP,
  },
  slide: {
    flexDirection: "row",
    gap: GAP,
  },
  portraitTile: {
    flex: 1,
    borderRadius: TILE_RADIUS,
    overflow: "hidden",
    backgroundColor: "#E2EAEE",
  },
  rightColumn: {
    flex: 1,
    gap: GAP,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  craftPillWrapper: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 14,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  craftPill: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  craftPillText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  storyTile: {
    flex: 1,
    borderRadius: TILE_RADIUS,
    overflow: "hidden",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "#E8D69B",
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2412",
    marginBottom: 10,
  },
  storyText: {
    fontSize: 15,
    lineHeight: 21,
    color: "#3A3421",
  },
  shopTile: {
    flex: 1,
    borderRadius: TILE_RADIUS,
    overflow: "hidden",
    backgroundColor: "#E2EAEE",
  },
  shopScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "45%",
  },
  shopRow: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  shopText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
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
