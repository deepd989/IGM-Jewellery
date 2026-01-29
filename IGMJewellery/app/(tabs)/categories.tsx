import {
  Department,
  SidebarCategory,
  SubCategory,
} from "@/interfaces/category.interface";

import BottomNavBar from "@/components/bottomNavBar";
import { CartBadge } from "@/components/cart/CardBadge";
import {
  useGetCategoriesByDepartmentQuery,
  useGetDepartmentsQuery,
  useGetSubCategoriesQuery,
} from "@/store/apis/categories";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SPACING } from "../../constants/theme";

const { width } = Dimensions.get("window");

/* ---------------- TOP DEPARTMENT TAB ---------------- */

const DepartmentTab = ({
  item,
  isActive,
  onPress,
}: {
  item: Department;
  isActive: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.deptTab} onPress={onPress}>
    <View style={styles.deptImageContainer}>
      <Image
        source={item.imageUrl}
        style={[styles.deptImage, { opacity: isActive ? 1 : 0.5 }]}
        resizeMode="contain"
      />
    </View>

    <Text style={[styles.deptText, isActive && styles.deptTextActive]}>
      {item.name}
    </Text>

    {isActive && (
      <View style={styles.activeIndicatorContainer}>
        <View style={styles.activeLine} />
        <View style={styles.activeDiamond} />
        <View style={styles.activeLine} />
      </View>
    )}
  </TouchableOpacity>
);

/* ---------------- SIDEBAR ITEM ---------------- */

const SidebarItem = ({
  item,
  isActive,
  onPress,
}: {
  item: SidebarCategory;
  isActive: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
    onPress={onPress}
  >
    {isActive && (
      <View style={styles.sidebarIndicator}>
        <View style={styles.diamondDot} />
      </View>
    )}

    <Text style={[styles.sidebarText, isActive && styles.sidebarTextActive]}>
      {item.name}
    </Text>
  </TouchableOpacity>
);

/* ---------------- GRID ITEM ---------------- */

const GridItem = ({
  item,
  onPress,
}: {
  item: SubCategory;
  onPress: (item: SubCategory) => void;
}) => (
  <TouchableOpacity
    style={styles.gridItemContainer}
    onPress={() => onPress(item)}
  >
    <View style={styles.gridItemBox}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
      ) : (
        <View style={styles.placeholderBox} />
      )}
    </View>
    <Text style={styles.gridItemText}>{item.name}</Text>
  </TouchableOpacity>
);

/* ================= SCREEN ================= */

export default function CategoriesScreen() {
  const router = useRouter();
  const [activeDepartmentId, setActiveDepartmentId] = useState("womens");
  const [activeCategoryId, setActiveCategoryId] = useState("");

  const { data: departments = [], isLoading: loadingDepts } =
    useGetDepartmentsQuery();

  const { data: categories = [] } =
    useGetCategoriesByDepartmentQuery(activeDepartmentId);

  const { data: subCategories = [], isLoading: loadingSubs } =
    useGetSubCategoriesQuery({
      departmentId: activeDepartmentId,
      categoryId: activeCategoryId,
    });

  useEffect(() => {
    if (categories.length && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories]);

  if (loadingDepts) {
    return (
      <SafeAreaView style={styles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <CartBadge iconSize={24} iconColor={COLORS.primary} />
      </View>

      {/* TOP TABS */}
      <View style={styles.tabsContainer}>
        {departments.map((dept) => (
          <DepartmentTab
            key={dept.id}
            item={dept}
            isActive={dept.id === activeDepartmentId}
            onPress={() => {
              setActiveDepartmentId(dept.id);
              setActiveCategoryId("");
            }}
          />
        ))}
      </View>

      <View style={styles.divider} />

      {/* CONTENT */}
      <View style={styles.contentContainer}>
        {/* SIDEBAR */}
        <View style={styles.sidebar}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: SPACING.s,
              paddingBottom: 100,
            }}
            renderItem={({ item }) => (
              <SidebarItem
                item={item}
                isActive={item.id === activeCategoryId}
                onPress={() => setActiveCategoryId(item.id)}
              />
            )}
          />
        </View>

        {/* GRID */}
        <View style={styles.mainContent}>
          {loadingSubs ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={subCategories}
              keyExtractor={(item) => item.id}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={styles.gridContainer}
              renderItem={({ item }) => (
                <GridItem item={item} onPress={() => {}} />
              )}
            />
          )}
        </View>
      </View>

      <BottomNavBar activeTab="Categories" />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  /* Tabs */
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: SPACING.s,
  },
  deptTab: {
    alignItems: "center",
    width: width / 3,
  },
  deptImageContainer: {
    height: 50,
    justifyContent: "center",
  },
  deptImage: {
    width: 60,
    height: 40,
  },
  deptText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  deptTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  activeIndicatorContainer: {
    flexDirection: "row",
    width: "60%",
    marginTop: 6,
  },
  activeLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.primary,
  },
  activeDiamond: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    transform: [{ rotate: "45deg" }],
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
  },

  /* Layout */
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },

  /* Sidebar (FIXED SPACING) */
  sidebar: {
    width: "32%",
    backgroundColor: "#FFF",
    borderRightWidth: 1,
    borderRightColor: "#F0F0F0",
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.m,
    paddingLeft: SPACING.l,
    paddingRight: SPACING.m,
  },
  sidebarItemActive: {
    backgroundColor: "#FAFAFA",
  },
  sidebarIndicator: {
    marginRight: 10,
    justifyContent: "center",
  },
  diamondDot: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.primary,
    transform: [{ rotate: "45deg" }],
  },
  sidebarText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sidebarTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  /* Grid */
  mainContent: {
    width: "68%",
    paddingHorizontal: SPACING.s,
  },
  gridContainer: {
    paddingTop: SPACING.m,
    paddingBottom: 100,
  },
  gridRow: {
    marginBottom: SPACING.m,
  },
  gridItemContainer: {
    width: "33.33%",
    alignItems: "center",
  },
  gridItemBox: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginBottom: SPACING.xs,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  placeholderBox: {
    flex: 1,
    backgroundColor: "#E0E0E0",
  },
  gridItemText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
