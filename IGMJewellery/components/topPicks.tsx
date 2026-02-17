import { Product } from "@/interfaces/product.interface";
import { useRouter } from "expo-router";
import { FlatList } from "react-native";
import ViewAllButton from "./basic components/viewAllButton";
import { ProductCard } from "./products/ProductCard";
import { SectionHeader } from "./section";

type TopPicksProps = {
  products: Product[];
};

export function TopPicks({ products }: TopPicksProps) {
  const router = useRouter();
  const topPicksProducts = products.slice(5, 9); // Get the first 8 products for top picks
  const handleProductPress = (product: Product) => {
    router.push({
      pathname: "/product/[id]",
      params: { id: product.id },
    });
  };
  return (
    <>
      <SectionHeader value="Top Picks" />
      <FlatList
        data={topPicksProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            viewMode="grid"
            onPress={handleProductPress}
          />
        )}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", padding: 10 }}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />
      <ViewAllButton
        onPress={() => {
          router.push("/product-list");
        }}
      ></ViewAllButton>
    </>
  );
}
