import { HapticButton } from "@/components/basic components/hapticButton";
import { CartBadge } from "@/components/cart/CardBadge";
import { COLORS } from "@/constants/theme";
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
import { useGetWishlistQuery } from "@/store/apis/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

const SIDE_PADDING = 16;

/** The department in focus stands taller than the two beside it. */
const ACTIVE_DEPARTMENT_SIZE = 110;
const DEPARTMENT_SIZE = 82;

/** Breathing room between the search pill and the floating nav bar. */
const SEARCH_BAR_GAP = 14;

const PANEL_BG = "#EDF3F5";
const SIDEBAR_ACTIVE_BG = "#E7F0F2";

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
      <Image source={item.imageUrl} style={styles.departmentImage} />

      {/* Holds the artwork back so the label stays readable. */}
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.55)"]}
        style={styles.departmentScrim}
        pointerEvents="none"
      />

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

  const { data: wishlistData } = useGetWishlistQuery();
  const wishlistCount = wishlistData?.items.length || 0;

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
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Categories</Text>

        <View style={styles.headerActions}>
          <HapticButton
            style={styles.headerIcon}
            onPress={() => router.navigate("/wishlist")}
          >
            <Ionicons
              name={wishlistCount > 0 ? "heart" : "heart-outline"}
              size={26}
              color={COLORS.secondary}
            />
          </HapticButton>

          <View style={styles.headerIcon}>
            <CartBadge iconSize={26} iconColor={COLORS.secondary} />
          </View>
        </View>
      </View>

      {loadingDepts ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
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
                <ActivityIndicator color={COLORS.primary} />
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

      <HapticButton
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
      </HapticButton>

      <LuxuryNavBar activeKey="categories" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#123B47",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
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
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8,
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
  departmentImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  departmentScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },
  departmentLabel: {
    fontSize: 13,
    color: "#FFFFFF",
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
    color: COLORS.primary,
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
    color: COLORS.primary,
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
