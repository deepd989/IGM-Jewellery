import { Brand, useGetBrandsQuery } from "@/store/apis/brandsApi";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../basic components/hapticButton";

// --- Dynamic Responsiveness Logic ---
const { width } = Dimensions.get("window");
const SPACING = 16;
const GRID_GAP = 12;

const NUM_COLUMNS = width < 380 ? 2 : 3;
const TOTAL_GAP_SPACE = (NUM_COLUMNS - 1) * GRID_GAP;
const AVAILABLE_WIDTH = width - SPACING * 2 - TOTAL_GAP_SPACE;
const ITEM_WIDTH = AVAILABLE_WIDTH / NUM_COLUMNS;

const BrandCard = ({ brand }: { brand: Brand }) => {
  const router = useRouter();
  return (
    <HapticButton
      style={styles.cardContainer}
      onPress={() => {
        router.push(`/brandProfile/${brand.businessNameKey}`);
      }}
    >
      <Image
        source={{ uri: brand?.profileImageUri }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      {/* Optional: Add business name text under image if desired */}
      {/* <Text numberOfLines={1} style={styles.brandNameText}>{brand.businessName}</Text> */}
    </HapticButton>
  );
};

export const BrandGrid = ({ data }: { data: Brand[] }) => {
  return (
    <View style={styles.gridContainer}>
      {data.map((item) => (
        <BrandCard key={item.id || item.businessName} brand={item} />
      ))}
    </View>
  );
};

export const BrandSection = ({
  title,
  data,
}: {
  title: string;
  data: Brand[];
}) => {
  if (data.length === 0) return null; // Hide section if no results match

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <HapticButton style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#053844" />
        </HapticButton>
      </View>
      <BrandGrid data={data} />
    </View>
  );
};

export default function BrandList() {
  const router = useRouter();
  const { data: brandsData = [], isLoading } = useGetBrandsQuery({});

  // State for search
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered Data based on businessName
  const filteredBrands = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return brandsData;

    return brandsData.filter((brand) =>
      brand.businessName?.toLowerCase().includes(query)
    );
  }, [searchQuery, brandsData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <HapticButton style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft color="#053844" size={24} />
        </HapticButton>
        <Text style={styles.headerTitle}>Brands</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color="#053844"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search by business name"
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <HapticButton onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#ccc" />
              </HapticButton>
            )}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredBrands.length > 0 ? (
            <>
              <BrandSection title="Top Brands" data={filteredBrands} />
              <BrandSection
                title="Ethnic Jewellery Brands"
                data={filteredBrands}
              />
              <BrandSection
                title="Modern Jewellery Brands"
                data={filteredBrands}
              />
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={50} color="#eee" />
              <Text style={styles.emptyText}>
                No brands found matching "{searchQuery}"
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 60,
  },
  backButton: {
    padding: 8,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  searchContainer: {
    paddingHorizontal: SPACING,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#053844",
  },
  sectionContainer: {
    marginBottom: 25,
    paddingHorizontal: SPACING,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#053844",
    marginRight: 2,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  cardContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.85,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
    fontSize: 14,
  },
});
