import React, { useMemo } from "react"; // Added useMemo
import { ActivityIndicator, FlatList, Text } from "react-native";
import { ImmersiveProductCard } from "../components/immersiveProductCard";
import { useGetProductsQuery } from "../store/apis/product";

const ImmersiveProductList = () => {
  const { data: products = [], isLoading, isError } = useGetProductsQuery({});

  // Memoize the filtered list so it only re-calculates when products change
  const immersiveProducts = useMemo(() => {
    return products.filter((product) => product.isImmersiveProduct === true);
  }, [products]);

  if (isLoading) return <ActivityIndicator size="large" />;
  if (isError) return <Text>Error loading products</Text>;

  return (
    <FlatList
      data={immersiveProducts} // Pass the filtered list here
      renderItem={({ item }) => <ImmersiveProductCard item={item} />}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      snapToAlignment="start"
      decelerationRate="fast"
    />
  );
};

export default ImmersiveProductList;
