import React from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SectionHeader } from "./section";

const DATA = [
  {
    id: "1",
    title: "Mountain View",
    image: "https://picsum.photos/id/10/400/300",
  },
  {
    id: "2",
    title: "Ocean Breeze",
    image: "https://picsum.photos/id/11/400/300",
  },
  {
    id: "3",
    title: "City Lights",
    image: "https://picsum.photos/id/12/400/300",
  },
  {
    id: "4",
    title: "Forest Path",
    image: "https://picsum.photos/id/13/400/300",
  },
];

const Card = ({ item, cardWidth }) => (
  <View style={[styles.card, { width: cardWidth }]}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.buttonContainer}
      onPress={() => console.log("Shop Now pressed for:", item.id)}
    >
      <Text style={styles.buttonText}>Shop Now</Text>
    </TouchableOpacity>
  </View>
);

export default function BrandCollectionCards() {
  const { width } = useWindowDimensions();

  // Calculate width: Show 1.2 cards on screen so users know there is more to scroll
  // On tablets, you might want to show 3.5 cards instead
  const numVisibleCards = width > 600 ? 3.5 : 1.2;
  const cardWidth =
    (width - styles.list.paddingHorizontal * 2) / numVisibleCards;

  return (
    <View style={styles.container}>
      <SectionHeader value="Shop by Collections" />
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Card item={item} cardWidth={cardWidth} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        // Snapping makes it feel high-quality on mobile
        snapToInterval={cardWidth + 16} // cardWidth + marginRight
        decelerationRate="fast"
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 20,
    backgroundColor: "white",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 15,
  },
  list: {
    paddingHorizontal: 16, // Padding at start and end of list
  },
  card: {
    height: 200,
    marginRight: 16,
    backgroundColor: "white",
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    position: "absolute",
  },

  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 12, // Distance from bottom
    right: 12, // Distance from right
    backgroundColor: "white", // Black button looks sharp
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "300",
  },
});
