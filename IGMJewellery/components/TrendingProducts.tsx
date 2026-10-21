import { Product } from "@/interfaces/product.interface";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { FlatList, View } from "react-native";
import ViewAllButton from "./basic components/viewAllButton";
import { ProductCard } from "./products/ProductCard";
import { SectionHeader } from "./section";

type TrendingProductsProps = {
  products: Product[];
};

/** Stable component reference: an inline one remounts every separator. */
const Separator = () => <View style={{ width: 16 }} />;

export function TrendingProducts({ products }: TrendingProductsProps) {
  const router = useRouter();
  const trendingProducts = useMemo(() => products.slice(8, 10), [products]);

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
      <SectionHeader value="This Season's Finest Finds" />
      <FlatList
        horizontal
        data={trendingProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={Separator}
      />
      <ViewAllButton
        onPress={() => {
          router.navigate("/product-list");
        }}
      ></ViewAllButton>
    </>
  );
}
