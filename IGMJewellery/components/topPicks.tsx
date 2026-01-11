import { FlatList } from "react-native";
import ProductCard from "./productCard";
import { Product } from "@/interfaces/product.interface";
import { SectionHeader } from "@/app/home";

type TopPicksProps = {
  products: Product[];
};

export function TopPicks({ products }: TopPicksProps) {
  return (
    <>
    <SectionHeader value="Top Picks"/>
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
    </>
  );
}