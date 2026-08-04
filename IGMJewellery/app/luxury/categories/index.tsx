import { HapticButton } from "@/components/basic components/hapticButton";
import { CartBadge } from "@/components/cart/CardBadge";
import { COLORS, LUXURY_COLORS } from "@/constants/theme";
import {
  Department,
  SidebarCategory,
  SubCategory,
} from "@/interfaces/category.interface";
import {
  useGetCategoriesByDepartmentQuery,
  useGetDepartmentsQuery,
  useGetSubCategoriesQuery,
} from "@/store/apis/categories";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LuxuryNavBar, {
  LUXURY_NAV_BAR_HEIGHT,
} from "../components/luxuryNavBar";
import LuxuryScreenHeader, {
  LUXURY_HEADER_BACKGROUND,
} from "../components/luxuryScreenHeader";
import LuxuryWishlistButton from "../components/luxuryWishlistButton";

const SIDE_PADDING = 16;

/** The department in focus stands taller than the two beside it. */
const ACTIVE_DEPARTMENT_SIZE = 110;
const DEPARTMENT_SIZE = 82;


/** Breathing room between the search pill and the floating nav bar. */
const SEARCH_BAR_GAP = 14;

/**
 * The screen runs on one ground — the header's teal — so the panel no longer
 * paints itself a lighter box. The selected sidebar row is picked out with a
 * wash of the accent instead of a colour of its own.
 */
const PANEL_BG = LUXURY_HEADER_BACKGROUND;
const SIDEBAR_ACTIVE_BG = "rgba(216,195,145,0.14)";

/** Magnifier with a sparkle — the app's mark for AI-assisted search. */
const SearchGlyph = () => (
  <View>
    <Ionicons name="search" size={22} color={COLORS.primary} />
    <Ionicons
      name="sparkles"
      size={9}
      color={COLORS.primary}
      style={styles.searchSparkle}
    />
  </View>
);

const DepartmentCard = ({
  item,
  isActive,
  onPress,
}: {
  item: Department;
  isActive: boolean;
  onPress: () => void;
}) => {
  const size = isActive ? ACTIVE_DEPARTMENT_SIZE : DEPARTMENT_SIZE;

  return (
    <HapticButton
      style={[
        styles.department,
        { width: size, height: size },
        isActive && styles.departmentActive,
      ]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/*
        Fitted rather than cropped: the artwork is wider than the card is, so
        filling the card cuts the piece off at both sides. "contain" sits the
        whole thing in the middle of the space above the label, on both axes.
      */}
      <View style={styles.departmentImageBox}>
        <Image
          source={item.imageUrl}
          style={styles.departmentImage}
          resizeMode="contain"
        />
      </View>

      <Text
        style={[
          styles.departmentLabel,
          isActive && styles.departmentLabelActive,
        ]}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </HapticButton>
  );
};

const SidebarItem = ({
  item,
  isActive,
  onPress,
}: {
  item: SidebarCategory;
  isActive: boolean;
  onPress: () => void;
}) => (
  <HapticButton
    style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <Text style={[styles.sidebarText, isActive && styles.sidebarTextActive]}>
      {item.name}
    </Text>
  </HapticButton>
);

const GridItem = ({
  item,
  onPress,
}: {
  item: SubCategory;
  onPress: () => void;
}) => (
  <HapticButton style={styles.gridItem} activeOpacity={0.85} onPress={onPress}>
    <View style={styles.gridTile}>
      {!!item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.gridImage}
          resizeMode="cover"
        />
      )}
    </View>
    <Text style={styles.gridLabel} numberOfLines={1}>
      {item.name}
    </Text>
  </HapticButton>
);

/**
 * The luxury storefront's category browser. Same departments, sidebar and
 * sub-category navigation as app/(tabs)/categories.tsx, presented with the
 * luxury header, panelled grid and floating nav bar.
 */
export default function LuxuryCategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeDepartmentId, setActiveDepartmentId] = useState("womens");
  /** What the shopper picked; "" means they have not picked in this department. */
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const { data: departments = [], isLoading: loadingDepts } =
    useGetDepartmentsQuery();

  const { data: categories = [] } =
    useGetCategoriesByDepartmentQuery(activeDepartmentId);

  /**
   * The category list can lag a render behind the department it belongs to, so
   * the selection is validated against it rather than trusted: anything not in
   * the list — a pick left over from the previous department, or none yet —
   * falls back to its first category.
   */
  const activeCategoryId =
    categories.find((category) => category.id === selectedCategoryId)?.id ||
    categories[0]?.id ||
    "";

  const { data: subCategories = [], isLoading: loadingSubs } =
    useGetSubCategoriesQuery({
      departmentId: activeDepartmentId,
      categoryId: activeCategoryId,
    });

  const handleSubCategoryPress = (subCategory: SubCategory) => {
    const currentCategory = categories.find((c) => c.id === activeCategoryId);

    router.navigate({
      pathname: "/product-list",
      params: {
        departmentId: activeDepartmentId,
        categoryId: activeCategoryId,
        subCategoryId: subCategory.id,
        categoryName: currentCategory?.name || "Products",
        subCategoryName: subCategory.name,
        bannerImageUrl: encodeURIComponent(subCategory.subCategoryBannerUrl),
      },
    });
  };

  return (
    <View style={styles.container}>
      <LuxuryScreenHeader
        title="Categories"
        right={
          <>
            <LuxuryWishlistButton
              size={26}
              color={COLORS.secondary}
              badgeTextColor="#04333E"
              style={styles.headerIcon}
            />

            <View style={styles.headerIcon}>
              <CartBadge iconSize={26} iconColor={COLORS.secondary} />
            </View>
          </>
        }
      />

      {loadingDepts ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={LUXURY_COLORS.accent} />
        </View>
      ) : (
        <>
          <View style={styles.departments}>
            {departments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                item={dept}
                isActive={dept.id === activeDepartmentId}
                onPress={() => {
                  setActiveDepartmentId(dept.id);
                  // Drops back to the new department's first category.
                  setSelectedCategoryId("");
                }}
              />
            ))}
          </View>

          <View style={styles.body}>
            <View style={styles.sidebar}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.sidebarContent}
                renderItem={({ item }) => (
                  <SidebarItem
                    item={item}
                    isActive={item.id === activeCategoryId}
                    onPress={() => setSelectedCategoryId(item.id)}
                  />
                )}
              />
            </View>

            <View style={styles.panel}>
              {loadingSubs ? (
                <ActivityIndicator color={LUXURY_COLORS.accent} />
              ) : (
                <FlatList
                  data={subCategories}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  showsVerticalScrollIndicator={false}
                  columnWrapperStyle={styles.gridRow}
                  contentContainerStyle={styles.gridContent}
                  renderItem={({ item }) => (
                    <GridItem
                      item={item}
                      onPress={() => handleSubCategoryPress(item)}
                    />
                  )}
                />
              )}
            </View>
          </View>
        </>
      )}

      {/* <HapticButton
        style={[
          styles.searchBar,
          // Clears the floating nav bar — which applies its own bottom inset —
          // and leaves a gap between the two so they do not read as one block.
          {
            marginBottom:
              LUXURY_NAV_BAR_HEIGHT + Math.max(insets.bottom, 12) + SEARCH_BAR_GAP,
          },
        ]}
        activeOpacity={0.9}
        onPress={() => router.navigate("/searchPage")}
      >
        <SearchGlyph />
        <Text style={styles.searchPlaceholder}>Search</Text>
      </HapticButton> */}

      <LuxuryNavBar activeKey="categories" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // One ground for the whole screen, shared with the header band above it.
    backgroundColor: LUXURY_HEADER_BACKGROUND,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Header ──
  headerIcon: {
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Departments ──
  departments: {
    flexDirection: "row",
    alignItems: "center",
    // Spreads the three cards across the row so the gaps scale with the
    // screen instead of a fixed value crowding them on narrow phones.
    justifyContent: "space-evenly",
    paddingHorizontal: SIDE_PADDING,
    paddingVertical: 16,
  },
  department: {
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    backgroundColor: "#E2EAEE",
  },
  departmentActive: {
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#052A33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  // A flow child rather than an absolute fill. The box takes the card's full
  // width and whatever height the label leaves, so the image is fitted into a
  // box the same layout pass measures — it cannot end up resolving against a
  // stale one when the card grows or shrinks between its two sizes.
  departmentImageBox: {
    flex: 1,
    alignSelf: "stretch",
  },
  departmentImage: {
    width: "100%",
    height: "100%",
  },
  departmentLabel: {
    fontSize: 13,
    paddingBottom: 8,
    // Black, not the page's gold: this label sits inside the tile, on the
    // card's light ground rather than on the teal page.
    color: "#000000",
  },
  departmentLabelActive: {
    fontSize: 15,
    fontWeight: "700",
  },

  // ── Body ──
  body: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: SIDE_PADDING,
  },
  sidebar: {
    width: "31%",
  },
  sidebarContent: {
    paddingBottom: 24,
  },
  sidebarItem: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  sidebarItemActive: {
    backgroundColor: SIDEBAR_ACTIVE_BG,
  },
  sidebarText: {
    fontSize: 16,
    color: LUXURY_COLORS.accent,
  },
  sidebarTextActive: {
    fontWeight: "700",
  },

  // ── Grid panel ──
  panel: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingTop: 16,
    backgroundColor: PANEL_BG,
  },
  gridContent: {
    paddingBottom: 24,
  },
  gridRow: {
    gap: 10,
    marginBottom: 18,
  },
  gridItem: {
    flex: 1,
    alignItems: "center",
  },
  gridTile: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridLabel: {
    marginTop: 10,
    fontSize: 13,
    color: LUXURY_COLORS.accent,
  },

  // ── Search ──
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 56,
    marginHorizontal: SIDE_PADDING,
    marginTop: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    shadowColor: "#052A33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  searchSparkle: {
    position: "absolute",
    top: -2,
    right: -4,
  },
  searchPlaceholder: {
    fontSize: 17,
    color: COLORS.textSecondary,
  },
});
