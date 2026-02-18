import React, { useMemo } from "react";
import { ActivityIndicator, Dimensions, FlatList, Text } from "react-native";
import { ImmersiveProductCard } from "../components/immersiveProductCard";
import { useGetProductsQuery } from "../store/apis/product";

const { height } = Dimensions.get("window");

const ImmersiveProductList = () => {
  const { data: products = [], isLoading, isError } = useGetProductsQuery({});

  const immersiveProducts = useMemo(() => {
    return products.filter((product) => product.isImmersiveProduct === true);
  }, [products]);

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (isError) return <Text>Error loading products</Text>;

  return (
    <FlatList
      data={immersiveProducts}
      renderItem={({ item }) => <ImmersiveProductCard item={item} />}
      keyExtractor={(item) => item.id.toString()}
      // --- Vertical Scrolling Props ---
      pagingEnabled={true}
      showsVerticalScrollIndicator={false}
      snapToInterval={height} // Optional: ensures it snaps exactly to screen height
      snapToAlignment="start"
      decelerationRate="fast"
    />
  );
};

export default ImmersiveProductList;
