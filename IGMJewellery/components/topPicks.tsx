import { Product } from "@/interfaces/product.interface";
import { useRouter } from "expo-router";
import { FlatList } from "react-native";
import ProductCard2 from "./productCard";
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
          <ProductCard2
            product={item}
            width={180}
            deliveryDate={"Delivery by Sep 25"}
            onPress={() => handleProductPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </>
  );
}
