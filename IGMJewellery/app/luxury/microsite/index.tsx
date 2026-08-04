import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { useGetBrandMicrositeQuery } from "@/store/apis/brandMicrositeApi";
import { BrandCollection, useGetCollectionsQuery } from "@/store/apis/collectionApi";
import { useGetProductsQuery } from "@/store/apis/product";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LuxurySeparator from "../components/luxurySeparator";
import MicrositeCatalogue from "./components/micrositeCatalogue";
import MicrositeCollections from "./components/micrositeCollections";
import MicrositeFindStore from "./components/micrositeFindStore";
import MicrositeHero from "./components/micrositeHero";
import MicrositeIntro from "./components/micrositeIntro";
import MicrositeOurStory from "./components/micrositeOurStory";
import MicrositeReviews from "./components/micrositeReviews";
import MicrositeSpecialProducts from "./components/micrositeSpecialProducts";
import MicrositeStats from "./components/micrositeStats";
import MicrositeTopNav, { MicrositeNavItem } from "./components/micrositeTopNav";
import MicrositeTryBeforeBuy from "./components/micrositeTryBeforeBuy";
import MicrositeValues from "./components/micrositeValues";
import MicrositeWhyBrand from "./components/micrositeWhyBrand";

/** Gutter the page keeps around its sections, as on the luxury storefront. */
const PAGE_PADDING = 8;

type MicrositeSection = { key: string; render: () => React.ReactNode };

const renderSection = ({ item }: { item: MicrositeSection }) => (
  <>{item.render()}</>
);

type MicrositeScreenProps = {
  /**
   * Whose microsite to show. Falls back to the route's own param, so the
   * screen works both as a destination of its own and embedded in another —
   * the brand page, which resolves the id from the brand's name.
   */
  brandId?: string;
};

/**
 * A brand's microsite: their own storefront page, built from what
 * /brand-microsite/:brandId returns.
 *
 * The sections are held as data rather than one block of JSX, so the page
 * mounts each as the shopper reaches it and the spacing between them comes
 * from one <LuxurySeparator /> instead of margins scattered across components.
 */
export default function MicrositeScreen({ brandId: brandIdProp }: MicrositeScreenProps) {
  const router = useRouter();
  const listRef = useRef<FlatList<MicrositeSection>>(null);
  /** The sections currently on the page, for jumping between them by key. */
  const sectionsRef = useRef<MicrositeSection[]>([]);
  const params = useLocalSearchParams<{ brandId?: string }>();
  const brandId = brandIdProp ?? params.brandId;

  const {
    data: microsite,
    isLoading,
    isError,
  } = useGetBrandMicrositeQuery(brandId ?? skipToken);

  // Collections are keyed by brand, and the catalogue is already loaded for
  // the storefront, so neither costs the page a fetch of its own.
  const { data: collectionsByBrand } = useGetCollectionsQuery();
  const { data: catalogue = [] } = useGetProductsQuery({});

  const collections = useMemo(
    () => (brandId ? collectionsByBrand?.[brandId]?.collections ?? [] : []),
    [brandId, collectionsByBrand]
  );

  const brandProducts = useMemo(() => {
    if (!microsite) return [];

    const name = microsite.brandName.toLowerCase();
    return catalogue.filter(
      (product) => product.brand?.toLowerCase() === name
    );
  }, [catalogue, microsite]);

  /** Opens the brand's catalogue, with its cover carried through as the banner. */
  const openBrandProducts = useCallback(() => {
    if (!microsite) return;

    router.navigate({
      pathname: "/product-list",
      params: {
        brand: microsite.brandName.toLowerCase(),
        bannerImageUrl: encodeURIComponent(microsite.brandMicrositeCoverPhotoUrl),
      },
    });
  }, [microsite, router]);

  const openCollection = useCallback(
    (collection: BrandCollection) => {
      if (!microsite) return;

      router.navigate({
        pathname: "/product-list",
        params: {
          brand: microsite.brandName.toLowerCase(),
          collection: collection.title.toLowerCase().replace(/\s+/g, "-"),
          bannerImageUrl: encodeURIComponent(collection.collectionBannerImgUrl),
        },
      });
    },
    [microsite, router]
  );

  const openMapLocation = useCallback(() => {
    if (microsite?.mapLocationLink) {
      Linking.openURL(microsite.mapLocationLink);
    }
  }, [microsite]);

  /**
   * Moves the page to a section by key. A key with no section — one whose
   * screen is not built yet — is left alone rather than scrolling somewhere
   * arbitrary. Reads the sections through a ref so the sections themselves can
   * hand this to their own actions without the two depending on each other.
   */
  const scrollToSection = useCallback((key: string) => {
    const index = sectionsRef.current.findIndex(
      (section) => section.key === key
    );
    if (index < 0) return;

    listRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const sections = useMemo<MicrositeSection[]>(() => {
    if (!microsite) return [];

    const primaryColor = microsite.colorCode.primaryColor;
    const secondaryColor = microsite.colorCode.secondaryColor;
    const { ourStory, brandInfoAttributes } = microsite;

    const founded = new Date(brandInfoAttributes.establishedDate);
    const years = Number.isNaN(founded.getTime())
      ? 0
      : new Date().getFullYear() - founded.getFullYear();

    // Every section is dropped when the brand gives it nothing to show, so a
    // sparse microsite reads as a shorter page rather than an empty one.
    const built: (MicrositeSection | null)[] = [
      {
        key: "hero",
        render: () => (
          <MicrositeHero
            style={styles.fullBleedSection}
            brandName={microsite.brandName}
            coverPhotoUrl={microsite.brandMicrositeCoverPhotoUrl}
            rank={brandInfoAttributes.rank}
            establishedDate={brandInfoAttributes.establishedDate}
            title={microsite.brandDescription.title}
            description={microsite.brandDescription.description}
            accentColor={secondaryColor}
            onViewAllProducts={openBrandProducts}
            onPrivateCollection={() => scrollToSection("collection")}
          />
        ),
      },
      {
        key: "stats",
        render: () => (
          <MicrositeStats
            attributes={brandInfoAttributes}
            primaryColor={primaryColor}
          />
        ),
      },
      microsite.specialProducts.length
        ? {
            key: "specialProducts",
            render: () => (
              <MicrositeSpecialProducts
                products={microsite.specialProducts}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
            ),
          }
        : null,
      {
        key: "about",
        render: () => (
          <MicrositeIntro
            description={microsite.brandDescription}
            primaryColor={primaryColor}
          />
        ),
      },
      // collections.length
      //   ? {
      //       key: "collection",
      //       render: () => (
      //         <MicrositeCollections
      //           collections={collections}
      //           primaryColor={primaryColor}
      //           onSelect={openCollection}
      //           onViewAll={openBrandProducts}
      //         />
      //       ),
      //     }
      //   : null,
      {
        key: "why",
        render: () => (
          <MicrositeWhyBrand
            brandName={microsite.brandName}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        ),
      },
      ourStory?.milestones?.length
        ? {
            key: "story",
            render: () => (
              <MicrositeOurStory
                style={styles.fullBleedSection}
                wallpaperUrl={ourStory.wallpaperUrl}
                milestones={ourStory.milestones}
                heritageLabel={years > 0 ? `${years} Years of Heritage` : undefined}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
            ),
          }
        : null,
      ourStory?.values?.length
        ? {
            key: "values",
            render: () => (
              <MicrositeValues
                values={ourStory.values}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
            ),
          }
        : null,
      ourStory?.tryBeforeBuyImgUrl
        ? {
            key: "tryOn",
            render: () => (
              <MicrositeTryBeforeBuy
                imageUrl={ourStory.tryBeforeBuyImgUrl}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                onTryNow={() => router.navigate("/tryOn")}
              />
            ),
          }
        : null,
      microsite.mapLocationLink
        ? {
            key: "stores",
            render: () => (
              <MicrositeFindStore
                storeCount={brandInfoAttributes.numberOfStores}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                onLocate={openMapLocation}
              />
            ),
          }
        : null,
      brandProducts.length
        ? {
            key: "products",
            render: () => (
              <MicrositeCatalogue
                products={brandProducts}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                onViewAll={openBrandProducts}
              />
            ),
          }
        : null,
      ourStory?.brandReviews?.length
        ? {
            key: "reviews",
            render: () => (
              <MicrositeReviews
                reviews={ourStory.brandReviews}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
            ),
          }
        : null,
    ];

    return built.filter((section): section is MicrositeSection => !!section);
  }, [
    microsite,
    collections,
    brandProducts,
    openBrandProducts,
    openCollection,
    openMapLocation,
    router,
    scrollToSection,
  ]);

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  // Every tab names a section, so the band moves the page rather than leaving
  // the microsite the shopper came to read.
  const handleNavSelect = useCallback(
    (item: MicrositeNavItem) => scrollToSection(item.key),
    [scrollToSection]
  );

  return (
    <SafeAreaView
      // The nav band paints under the status bar and applies that inset
      // itself, so the top edge is not padded here.
      edges={["left", "right"]}
      style={styles.screen}
    >
      <MicrositeTopNav
        brandName={microsite?.brandName}
        onSelect={handleNavSelect}
      />

      {isLoading ? (
        <View style={styles.centerContent}>
          {/* The brand's own colour has not arrived yet, so the storefront's
              stands in against the white ground. */}
          <ActivityIndicator size="large" color={LUXURY_COLORS.primary} />
        </View>
      ) : isError || !microsite ? (
        <View style={styles.centerContent}>
          <Text style={styles.message}>This brand has no microsite yet.</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          data={sections}
          keyExtractor={(section) => section.key}
          renderItem={renderSection}
          ItemSeparatorComponent={LuxurySeparator}
          // Sections are not measured up front, so a jump to one that has not
          // been laid out yet lands on an estimate and settles from there.
          onScrollToIndexFailed={({ averageItemLength, index }) =>
            listRef.current?.scrollToOffset({
              offset: averageItemLength * index,
              animated: true,
            })
          }
          // Each section pulls its own artwork, so only the ones near the
          // viewport are mounted.
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // A microsite is the brand's own page: white ground, painted with their two
  // colours, rather than the storefront's dark teal.
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    padding: PAGE_PADDING,
    backgroundColor: "#FFFFFF",
  },
  // Cancels the page gutter so a section's artwork runs to the screen edges.
  fullBleedSection: {
    marginHorizontal: -PAGE_PADDING,
    marginTop: -PAGE_PADDING,
  },
  contentContainer: {
    paddingBottom: LUXURY_SPACING,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    color: LUXURY_COLORS.textMuted,
  },
});
