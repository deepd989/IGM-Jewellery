import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_SPACING } from "@/constants/theme";
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

const GAP = 12;
const BANNER_RADIUS = 24;
/** Banner width ÷ height. */
const BANNER_ASPECT_RATIO = 1.72;

export type LuxuryBanner = {
  id: string;
  image: string;
};

/** Artwork is placeholder — point these at the final URLs when they're hosted. */
const BANNERS: LuxuryBanner[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop",
  },
];

type LuxuryNewProductsProps = {
  title?: string;
  banners?: LuxuryBanner[];
  /** Overrides navigation to the product list. */
  onPressBanner?: (banner: LuxuryBanner) => void;
  /** Overrides navigation to the product list. */
  onViewAll?: () => void;
  style?: ViewStyle;
};

export default function LuxuryNewProducts({
  title = "New In For You [Banner]",
  banners = BANNERS,
  onPressBanner,
  onViewAll,
  style,
}: LuxuryNewProductsProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  // Measured so the banner fits the space this component is actually given
  // (parents may add padding), rather than assuming the full screen width.
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  const bannerWidth = containerWidth;
  const bannerHeight = Math.round(bannerWidth / BANNER_ASPECT_RATIO);
  const snapInterval = bannerWidth + GAP;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
    if (index !== activeIndex && index >= 0 && index < banners.length) {
      setActiveIndex(index);
    }
  };

  const goToProductList = () => {
    router.navigate("/product-list");
  };

  const handlePressBanner = (banner: LuxuryBanner) => {
    if (onPressBanner) {
      onPressBanner(banner);
      return;
    }
    goToProductList();
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
      return;
    }
    goToProductList();
  };

  const renderBanner = ({ item }: { item: LuxuryBanner }) => (
    <HapticButton
      style={[styles.banner, { width: bannerWidth, height: bannerHeight }]}
      activeOpacity={0.9}
      onPress={() => handlePressBanner(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </HapticButton>
  );

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>

      <FlatList
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        extraData={bannerWidth}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        disableIntervalMomentum // Never fling past a single banner
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

      {banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((banner, index) => (
            <View
              key={banner.id}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}

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
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: LUXURY_SPACING,
  },
  listContent: {
    gap: GAP,
  },
  banner: {
    borderRadius: BANNER_RADIUS,
    overflow: "hidden",
    backgroundColor: "#E2EAEE",
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
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
