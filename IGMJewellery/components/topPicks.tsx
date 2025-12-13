import { FlatList } from "react-native";
import ProductCard from "./productCard";
import { Product } from "@/interfaces/product.interface";

type TopPicksProps = {
  products: Product[];
};

export function TopPicks({ products }: TopPicksProps) {
  return (
    <FlatList
      horizontal
      data={products}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          width={180}
          deliveryDate={"Delivery by Sep 25"}
        />
      )}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
    />
  );
}