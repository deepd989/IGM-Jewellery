import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OccasiomEnum } from "../constants/occasions";
import { SectionHeader } from "./section";

const { width } = Dimensions.get("window");

const OCCASIONS = [
  {
    id: "1",
    title: OccasiomEnum.Wedding,
    image: require("../assets/images/collectionImages/wedding.png"),
  },
  {
    id: "2",
    title: OccasiomEnum.Anniversary,
    image: require("../assets/images/collectionImages/anniversary.png"),
  },
  {
    id: "3",
    title: OccasiomEnum.Birthday,
    image: require("../assets/images/collectionImages/birthday.png"),
  },
  {
    id: "4",
    title: OccasiomEnum.Engagement,
    image: require("../assets/images/collectionImages/engagement.png"),
  },
];

const CategoryCard = ({ title, image }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.cardContainer}
      onPress={() =>
        router.push({
          pathname: "/product-list",
          params: { occasion: title.toLowerCase() },
        })
      }
    >
      <ImageBackground
        source={image}
        style={styles.image}
        imageStyle={{ borderRadius: 15 }} // Smooth corners like the reference
      >
        <View style={styles.overlay}>
          <Text style={styles.text}>{title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default function OccasionCardList() {
  return (
    <>
      <SectionHeader value="Celebrate Important Moments" />
      <View style={styles.container}>
        <FlatList
          data={OCCASIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryCard title={item.title.toUpperCase()} image={item.image} />
          )}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  listPadding: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  cardContainer: {
    height: 120, // Fixed height for each banner
    width: "100%",
    marginBottom: 15,
    // Optional shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)", // Darkens the image slightly to make text pop
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "300", // Modern thin look
    letterSpacing: 8, // Crucial for the "Luxury" feel in your image
    textAlign: "center",
  },
});
