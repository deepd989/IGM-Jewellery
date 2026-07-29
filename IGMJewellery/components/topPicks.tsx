import { Product } from "@/interfaces/product.interface";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import ViewAllButton from "./basic components/viewAllButton";
import { ProductCard } from "./products/ProductCard";
import { SectionHeader } from "./section";

type TopPicksProps = {
  products: Product[];
};

export function TopPicks({ products }: TopPicksProps) {
  const router = useRouter();
  const topPicksProducts = useMemo(() => products.slice(5, 9), [products]);

  const handleProductPress = useCallback(
    (product: Product) => {
      router.navigate({
        pathname: "/product/[id]",
        params: { id: product.id },
      });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        viewMode="grid"
        onPress={handleProductPress}
      />
    ),
    [handleProductPress],
  );

  return (
    <>
      <SectionHeader value="Handpicked for You" />
      <FlatList
        data={topPicksProducts}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", padding: 10 }}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        // The grid sits inside the page's own scroll, so it lays its cards out
        // in place rather than running a second scroller over the top of it.
        scrollEnabled={false}
      />
      <ViewAllButton
        onPress={() => {
          router.navigate("/product-list");
        }}
      ></ViewAllButton>
    </>
  );
}
