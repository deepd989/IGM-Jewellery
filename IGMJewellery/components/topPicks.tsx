import { Product } from "@/interfaces/product.interface";
import { useRouter } from "expo-router";
import { FlatList } from "react-native";
import { ProductCard } from "./products/ProductCard";
import { SectionHeader } from "./section";

type TopPicksProps = {
  products: Product[];
};

export function TopPicks({ products }: TopPicksProps) {
  const router = useRouter();
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
        horizontal
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            viewMode="grid"
            onPress={handleProductPress}
          />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </>
  );
}
