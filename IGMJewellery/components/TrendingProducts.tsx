import { Product } from "@/interfaces/product.interface";
import { useRouter } from "expo-router";
import { FlatList, View } from "react-native";
import ViewAllButton from "./basic components/viewAllButton";
import { ProductCard } from "./products/ProductCard";
import { SectionHeader } from "./section";

type TrendingProductsProps = {
  products: Product[];
};

export function TrendingProducts({ products }: TrendingProductsProps) {
  const router = useRouter();
  const trendingProducts = products.slice(8, 10); // Get the first 8 products for top picks
  const handleProductPress = (product: Product) => {
    router.navigate({
      pathname: "/product/[id]",
      params: { id: product.id },
    });
  };
  return (
    <>
      <SectionHeader value="This Season's Finest Finds" />
      <FlatList
        horizontal
        data={trendingProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            viewMode="grid"
            onPress={handleProductPress}
          />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />
      <ViewAllButton
        onPress={() => {
          router.navigate("/product-list");
        }}
      ></ViewAllButton>
    </>
  );
}
