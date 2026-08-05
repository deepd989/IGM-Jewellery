import { HapticButton } from "@/components/basic components/hapticButton";
import { CartBadge } from "@/components/cart/CardBadge";
import { COLORS } from "@/constants/theme";
import { Product } from "@/interfaces/product.interface";
import {
  useClearCompareMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useToggleCompareMutation,
} from "@/store/apis/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LuxuryProductCard from "./components/luxuryProductCard";
import LuxuryScreenHeader from "./components/luxuryScreenHeader";

const SIDE_PADDING = 16;
const CARD_GAP = 12;

/** Backdrop behind the grid, blurred so the cards stay legible over it. */
const BACKDROP_BLUR = 22;

/** Room the compare bar needs above the last row of cards. */
const COMPARE_BAR_CLEARANCE = 84;

/**
 * How much of the grid is mounted at once.
 *
 * Every card here carries an AI preview, so a mounted card is a generation
 * round trip and an image held in memory. FlatList's default of ten opened the
 * screen on ten of them at once; two rows is enough to fill the viewport.
 */
const INITIAL_CARDS = 4;
const CARDS_PER_BATCH = 4;

/** Magnifier with a sparkle — the app's mark for AI-assisted search. */
const SearchGlyph = () => (
  <View>
    <Ionicons name="search" size={21} color={COLORS.primary} />
    <Ionicons
      name="sparkles"
      size={9}
      color={COLORS.primary}
      style={styles.searchSparkle}
    />
  </View>
);

type WishlistCardProps = {
  product: Product;
  isInCompare: boolean;
  onPress: (product: Product) => void;
  onRemove: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
};

/**
 * One saved piece.
 *
 * Its own memoised component so the card's handlers can be built from the
 * screen's stable ones rather than inline in renderItem. Closures made in
 * renderItem are new on every render, which would hand every card fresh props
 * and undo the memo on the card itself — and with an AI preview behind each
 * tile, a needless re-render of the grid is not cheap.
 */
const WishlistCard = memo(function WishlistCard({
  product,
  isInCompare,
  onPress,
  onRemove,
  onToggleCompare,
}: WishlistCardProps) {
  const handleRemove = useCallback(() => onRemove(product), [onRemove, product]);
  const handleToggleCompare = useCallback(
    () => onToggleCompare(product),
    [onToggleCompare, product]
  );

  return (
    <LuxuryProductCard
      product={product}
      style={styles.card}
      onPress={onPress}
      isInWishlist
      onRemoveFromWishlist={handleRemove}
      isInCompare={isInCompare}
      onToggleCompare={handleToggleCompare}
      loadAiPreview
    />
  );
});

/**
 * The luxury storefront's wishlist. Same data and the same remove / compare
 * behaviour as app/wishlist.tsx — both read the one wishlist API — presented
 * the way the luxury listing is: the saved pieces' own artwork blurred behind
 * a dark ground, with the grid on glass tiles over it.
 */
export default function LuxuryWishlistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: wishlistData, isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [toggleCompare] = useToggleCompareMutation();
  const [clearCompare] = useClearCompareMutation();

  // Memoised: this is the list's `data`, and a fresh array on every render
  // re-renders the whole grid — every card of which holds an AI preview.
  const wishlistItems = useMemo(
    () => wishlistData?.items?.map((item) => item.product) || [],
    [wishlistData?.items]
  );
  const compareList = useMemo(
    () => wishlistData?.compareList || [],
    [wishlistData?.compareList]
  );
  /** Membership by id, so a row is a lookup rather than a scan per card. */
  const compareIds = useMemo(
    () => new Set(compareList.map((product) => product.id)),
    [compareList]
  );

  /** The first saved piece stands in for the category banner the listing has. */
  const backdropUri = wishlistItems[0]?.thumbnailUrls?.[0];

  const handleProductPress = useCallback(
    (product: Product) => {
      router.navigate({
        pathname: "/luxury/product/[id]",
        params: { id: product.id },
      });
    },
    [router]
  );

  const handleRemoveFromWishlist = useCallback(
    async (product: Product) => {
      try {
        await removeFromWishlist(product.id).unwrap();
      } catch {
        Alert.alert("Error", "Failed to remove item from wishlist");
      }
    },
    [removeFromWishlist]
  );

  const handleToggleCompare = useCallback(
    async (product: Product) => {
      try {
        await toggleCompare(product).unwrap();
      } catch (error: any) {
        if (error?.data === "You can only compare 2 products at a time") {
          Alert.alert("Compare Limit", error.data);
        } else {
          Alert.alert("Error", "Failed to update compare list");
        }
      }
    },
    [toggleCompare]
  );

  const handleClearCompare = async () => {
    try {
      await clearCompare().unwrap();
    } catch {
      Alert.alert("Error", "Failed to clear compare list");
    }
  };

  const handleStartComparing = () => {
    if (compareList.length < 2) {
      Alert.alert("Select Products", "Please select 2 products to compare them.");
      return;
    }

    Alert.alert(
      "Compare Products",
      `Comparing: ${compareList.map((p) => p.title).join(" vs ")}`
    );
  };

  const headerActions = (
    <View style={styles.actionPill}>
      <HapticButton
        style={styles.actionIcon}
        activeOpacity={0.6}
        onPress={() => router.navigate("/searchPage")}
      >
        <SearchGlyph />
      </HapticButton>

      <View style={styles.actionIcon}>
        <CartBadge iconSize={22} iconColor={COLORS.primary} />
      </View>
    </View>
  );

  const renderCard = useCallback(
    ({ item }: { item: Product }) => (
      <WishlistCard
        product={item}
        isInCompare={compareIds.has(item.id)}
        onPress={handleProductPress}
        onRemove={handleRemoveFromWishlist}
        onToggleCompare={handleToggleCompare}
      />
    ),
    [compareIds, handleProductPress, handleRemoveFromWishlist, handleToggleCompare]
  );

  const renderBody = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.stateText}>Loading wishlist…</Text>
        </View>
      );
    }

    if (wishlistItems.length === 0) {
      return (
        <View style={styles.centerContent}>
          <Ionicons name="heart-outline" size={56} color="#FFFFFF" />
          <Text style={styles.stateText}>Your Wishlist is Empty</Text>
          <Text style={styles.stateSubtext}>
            Start adding pieces you love to your wishlist
          </Text>
          <HapticButton
            style={styles.stateButton}
            onPress={() => router.navigate("/product-list")}
          >
            <Text style={styles.stateButtonText}>Start Shopping</Text>
          </HapticButton>
        </View>
      );
    }

    return (
      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={[
          styles.gridContent,
          {
            // Clears the compare bar only while it is up, and the home
            // indicator whether it is or not.
            paddingBottom:
              insets.bottom +
              (compareList.length > 0 ? COMPARE_BAR_CLEARANCE : 16),
          },
        ]}
        renderItem={renderCard}
        // Every card generates and holds an AI preview, so only the rows near
        // the viewport are mounted.
        initialNumToRender={INITIAL_CARDS}
        maxToRenderPerBatch={CARDS_PER_BATCH}
        windowSize={5}
        // Detaches rows scrolled out of the window. Android only: on iOS this
        // is known to blank out content.
        removeClippedSubviews={Platform.OS === "android"}
      />
    );
  };

  return (
    <View style={styles.container}>
      {!!backdropUri && (
        <Image
          source={{ uri: backdropUri }}
          style={styles.backdrop}
          resizeMode="cover"
          blurRadius={BACKDROP_BLUR}
        />
      )}
      <View style={styles.backdropScrim} pointerEvents="none" />

      <LuxuryScreenHeader
        title="Wishlist"
        showBack
        variant="glass"
        right={headerActions}
      />

      <View style={styles.body}>{renderBody()}</View>

      {compareList.length > 0 && (
        <View
          style={[
            styles.compareBar,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <HapticButton
            style={styles.compareClear}
            onPress={handleClearCompare}
          >
            <Text style={styles.compareClearText}>
              Clear ({compareList.length})
            </Text>
          </HapticButton>

          <HapticButton
            style={styles.compareButton}
            onPress={handleStartComparing}
          >
            <Text style={styles.compareButtonText}>START COMPARING</Text>
          </HapticButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1A1F",
  },
  backdrop: StyleSheet.absoluteFillObject,
  backdropScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 22, 26, 0.45)",
  },

  // ── Header actions ──
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    shadowColor: "#052A33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  actionIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  searchSparkle: {
    position: "absolute",
    top: -2,
    right: -4,
  },

  // ── Grid ──
  body: {
    flex: 1,
  },
  gridContent: {
    paddingHorizontal: SIDE_PADDING,
  },
  gridRow: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  card: {
    flex: 1,
    padding: 10,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.92)",
  },

  // ── States ──
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  stateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  stateSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
  },
  stateButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
  },
  stateButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // ── Compare bar ──
  // No fixed height: RN counts padding inside a height, so the safe-area inset
  // would eat into the row and crop it.
  compareBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 12,
    paddingHorizontal: SIDE_PADDING,
    backgroundColor: "#08222A",
  },
  compareClear: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  compareClearText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
  },
  compareButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8C391",
  },
  compareButtonText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#04333E",
  },
});
