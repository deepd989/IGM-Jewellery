import { HapticButton } from "@/components/basic components/hapticButton";
import { CartBadge } from "@/components/cart/CardBadge";
import { COLORS, LUXURY_COLORS } from "@/constants/theme";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LuxuryWishlistButton from "./luxuryWishlistButton";

/** Quick-shop row: the department whose categories it offers. */
const QUICK_DEPARTMENT = "womens";

/**
 * The Elanzia mark, as the classic header's toggle sets it. It carries its own
 * teal ground rather than an alpha channel, so it is set as a rounded chip and
 * never tinted.
 */
const ELANZIA_LOGO = require("@/assets/images/Elanzia_logo1.png");

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
  /** Tapping "Elanzia" in the store toggle leaves the luxury storefront. */
  onExitLuxury?: () => void;
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
  onExitLuxury,
  style,
}: LuxuryTopSearchProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  /**
   * Gold over the dark band, teal over the white search card.
   *
   * The wishlist count rides on a badge filled with that same tint, so its ink
   * has to follow it: dark over the gold, white over the teal. Painting it dark
   * in both states left the count unreadable once the bar opened.
   */
  const renderActions = (tint: string, badgeTextColor: string) => (
    <View style={styles.actions}>
      <HapticButton
        style={styles.actionIcon}
        activeOpacity={0.6}
        onPress={() => router.navigate("/underDev")}
      >
        <Ionicons name="notifications-outline" size={24} color={tint} />
      </HapticButton>

      <LuxuryWishlistButton
        size={24}
        color={tint}
        badgeTextColor={badgeTextColor}
        style={styles.actionIcon}
      />

      <View style={styles.actionIcon}>
        <CartBadge iconSize={24} iconColor={tint} />
      </View>
    </View>
  );

  if (!isOpen) {
    return (
      <LinearGradient
        colors={LUXURY_COLORS.gradient}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[styles.resting, { paddingTop: insets.top + 8 }, style]}
      >
        <HapticButton
          style={styles.deliveryButton}
          activeOpacity={0.7}
          onPress={() => router.navigate("/underDev")}
        >
          <Text style={styles.deliveryText}>
            <Text style={styles.deliveryStrong}>Deliver</Text> to{" "}
            {pincode || "Fetching..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={LUXURY_COLORS.text}
          />
        </HapticButton>

        <View style={styles.brandRow}>
          {/* Which storefront is showing; tapping Elanzia leaves luxury. */}
          <View style={styles.storeToggle}>
            <HapticButton
              style={styles.storeOption}
              activeOpacity={0.85}
              onPress={onExitLuxury}
            >
              {/* The same mark, at the same size, that the classic header's
                  toggle sets Elanzia in — see components/storeToggle. */}
              <Image source={ELANZIA_LOGO} style={styles.storeLogo} />
              <Text style={styles.storeOptionText}>Elanzia</Text>
            </HapticButton>

            <View style={[styles.storeOption, styles.storeOptionActive]}>
              <Text style={styles.storeOptionTextActive}>LUXE</Text>
            </View>
          </View>

          {renderActions(LUXURY_COLORS.accent, LUXURY_COLORS.primary)}
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.open, style]}>
      {/* Glossy band behind the card: a sweep with the highlight off-centre,
          then a sheen along the top of the quick row. */}
      <LinearGradient
        colors={[LUXURY_COLORS.gradient[0], LUXURY_COLORS.gradient[1]]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
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

      {/* The bar paints under the status bar in both states, so the open one
          has to clear it too — without this the whole header jumps up behind
          the notch the moment the page scrolls. */}
      <View style={[styles.searchCard, { paddingTop: insets.top + 12 }]}>
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

        {renderActions(COLORS.primary, "#FFFFFF")}
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
    paddingBottom: 16,
    gap: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  deliveryButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deliveryText: {
    fontSize: 15,
    color: LUXURY_COLORS.text,
  },
  deliveryStrong: {
    fontWeight: "700",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  storeToggle: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
  },
  storeOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  storeOptionActive: {
    backgroundColor: LUXURY_COLORS.primary,
  },
  storeLogo: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  storeOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  storeOptionTextActive: {
    fontSize: 16,
    letterSpacing: 1.5,
    color: LUXURY_COLORS.text,
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
