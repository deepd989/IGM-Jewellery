import { HapticButton } from "@/components/basic components/hapticButton";
import { CartBadge } from "@/components/cart/CardBadge";
import { COLORS } from "@/constants/theme";
import { SidebarCategory } from "@/interfaces/category.interface";
import { useGetCategoriesByDepartmentQuery } from "@/store/apis/categories";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import LuxuryWishlistButton from "./luxuryWishlistButton";

/** Quick-shop row: the department whose categories it offers. */
const QUICK_DEPARTMENT = "womens";

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

type LuxuryTopSearchProps = {
  pincode?: string | null;
  /**
   * True once the page has scrolled past its threshold. Together with a tap on
   * the resting bar, this is what opens the search.
   */
  collapsed?: boolean;
  /** Sits at the end of the delivery line — the storefront toggle, say. */
  deliveryAccessory?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * The luxury storefront's top bar. It rests as the delivery line above a
 * brand-marked pill, and opens into a search field with a quick-shop row once
 * the shopper scrolls past the threshold or taps it. What they type goes to
 * the Elanzia AI search.
 */
export default function LuxuryTopSearch({
  pincode,
  collapsed = false,
  deliveryAccessory,
  style,
}: LuxuryTopSearchProps) {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  const isOpen = collapsed || isSearching;

  const { data: categories = [] } =
    useGetCategoriesByDepartmentQuery(QUICK_DEPARTMENT);

  // Focus only when the shopper opened it themselves; scrolling should not
  // raise the keyboard on them.
  useEffect(() => {
    if (isSearching) {
      inputRef.current?.focus();
    }
  }, [isSearching]);

  const handleSubmit = () => {
    const value = query.trim();
    router.navigate({
      pathname: "/exploreAi",
      params: value ? { value } : {},
    });
  };

  const handleCategoryPress = (category: SidebarCategory) => {
    router.navigate({
      pathname: "/product-list",
      params: {
        departmentId: QUICK_DEPARTMENT,
        categoryId: category.id,
        categoryName: category.name,
      },
    });
  };

  const actions = (
    <View style={styles.actions}>
      <HapticButton
        style={styles.actionIcon}
        activeOpacity={0.6}
        onPress={() => router.navigate("/underDev")}
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color={COLORS.primary}
        />
      </HapticButton>

      <LuxuryWishlistButton size={24} style={styles.actionIcon} />

      <View style={styles.actionIcon}>
        <CartBadge iconSize={24} iconColor={COLORS.primary} />
      </View>
    </View>
  );

  if (!isOpen) {
    return (
      <View style={[styles.resting, style]}>
        <View style={styles.deliveryRow}>
          <HapticButton
            style={styles.deliveryButton}
            activeOpacity={0.7}
            onPress={() => router.navigate("/underDev")}
          >
            <Text style={styles.deliveryText}>
              <Text style={styles.deliveryStrong}>Deliver</Text> to{" "}
              {pincode || "Fetching..."}
            </Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.primary} />
          </HapticButton>

          {deliveryAccessory}
        </View>

        <View style={styles.pillRow}>
          <HapticButton
            style={styles.pill}
            activeOpacity={0.9}
            onPress={() => setIsSearching(true)}
          >
            <View style={styles.pillFill} />
          </HapticButton>

          {actions}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.open, style]}>
      {/* Glossy band behind the card: a sweep with the highlight off-centre,
          then a sheen along the top of the quick row. */}
      <LinearGradient
        colors={["#4E767D", "#6E979E", "#3F686F"]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["rgba(255,255,255,0.22)", "rgba(255,255,255,0)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.sheen}
        pointerEvents="none"
      />

      <View style={styles.searchCard}>
        <HapticButton activeOpacity={0.7} onPress={handleSubmit}>
          <SearchGlyph />
        </HapticButton>

        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Search for ‘mom’s Gift’"
          placeholderTextColor="#7E959C"
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          onBlur={() => setIsSearching(false)}
          style={styles.input}
        />

        {actions}
      </View>

      {categories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          // A horizontal ScrollView is flexGrow: 1 by default, which would
          // stretch this row down the screen.
          style={styles.quickScroll}
          contentContainerStyle={styles.quickRow}
        >
          {categories.map((category) => (
            <HapticButton
              key={category.id}
              style={styles.quickItem}
              activeOpacity={0.85}
              onPress={() => handleCategoryPress(category)}
            >
              <View style={styles.quickThumb}>
                {!!category.subCategories?.[0]?.imageUrl && (
                  <Image
                    source={{ uri: category.subCategories[0].imageUrl }}
                    style={styles.quickImage}
                    resizeMode="cover"
                  />
                )}
              </View>
              <Text style={styles.quickLabel} numberOfLines={1}>
                {category.name}
              </Text>
            </HapticButton>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Resting ──
  resting: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 14,
    backgroundColor: "#FFFFFF",
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  deliveryButton: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deliveryText: {
    fontSize: 15,
    color: COLORS.primary,
  },
  deliveryStrong: {
    fontWeight: "700",
  },
  pillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  pill: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "#C6DBE0",
  },
  pillFill: {
    width: "56%",
    height: "100%",
    borderRadius: 22,
    backgroundColor: COLORS.primary,
  },

  // ── Open ──
  // The band behind the white card, so the quick row's labels have something
  // to read against once the search takes over the top of the page.
  open: {
    overflow: "hidden",
  },
  sheen: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "45%",
  },
  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: COLORS.primary,
    // Android pads its inputs by default, which pushes the text off-centre.
    paddingVertical: 0,
  },

  // ── Shared actions ──
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  searchSparkle: {
    position: "absolute",
    top: -2,
    right: -4,
  },

  // ── Quick shop ──
  quickScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  quickRow: {
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  quickItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quickThumb: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: "#E2EAEE",
  },
  quickImage: {
    width: "100%",
    height: "100%",
  },
  quickLabel: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});
