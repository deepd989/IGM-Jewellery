import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { OccasionEnum } from "../constants/occasions";
import { SectionHeader } from "./section";

const { width } = Dimensions.get("window");

const OCCASIONS = [
  {
    id: "1",
    title: OccasionEnum.Wedding,
    image:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Shop%20by%20Occassions%2FOccasion%20_Wedding%20with%20text.webp?alt=media&token=70ca4103-9084-4fe1-bcb2-0d048e3a5152",
  },
  {
    id: "2",
    title: OccasionEnum.Anniversary,
    image:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Shop%20by%20Occassions%2Focasssion%20banner_Anniversary%20with%20text.webp?alt=media&token=4040cf38-94d8-4054-a5dd-ee8cfc1fdb17",
  },
  {
    id: "3",
    title: OccasionEnum.Birthday,
    image:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Shop%20by%20Occassions%2FOccasion%20_Birthday%20with%20text.webp?alt=media&token=896dc501-4df7-4366-b829-b16f3a43972b",
  },
  {
    id: "4",
    title: OccasionEnum.Engagement,
    image:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Shop%20by%20Occassions%2Focasssion%20banner_Engagement%20with%20text.webp?alt=media&token=5466465d-eb33-4733-a668-d0afade15567",
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
          params: {
            occasion: title.toLowerCase(),
            bannerImageUrl: encodeURIComponent(image),
          },
        })
      }
    >
      <ImageBackground
        source={{ uri: image }}
        style={styles.image}
        imageStyle={{ borderRadius: 15 }} // Smooth corners like the reference
      >
        {/* <View style={styles.overlay}>
          <Text style={styles.text}>{title}</Text>
        </View> */}
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
