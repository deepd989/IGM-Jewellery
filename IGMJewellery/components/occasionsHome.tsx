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
import { assetUrl } from "@/constants/assets";

const { width } = Dimensions.get("window");

const OCCASIONS = [
  {
    id: "1",
    title: OccasionEnum.Wedding,
    image: assetUrl("occasion.wedding"),
  },
  {
    id: "2",
    title: OccasionEnum.Anniversary,
    image: assetUrl("occasion.anniversary"),
  },
  {
    id: "3",
    title: OccasionEnum.Birthday,
    image: assetUrl("occasion.birthday"),
  },
  {
    id: "4",
    title: OccasionEnum.Engagement,
    image: assetUrl("occasion.engagement"),
  },
];

const CategoryCard = React.memo(function CategoryCard({ title, image }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.cardContainer}
      onPress={() =>
        router.navigate({
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
});

const renderOccasion = ({ item }: { item: (typeof OCCASIONS)[0] }) => (
  <CategoryCard title={item.title.toUpperCase()} image={item.image} />
);

export default function OccasionCardList() {
  return (
    <>
      <SectionHeader value="Celebrate Important Moments" />
      <View style={styles.container}>
        <FlatList
          data={OCCASIONS}
          keyExtractor={(item) => item.id}
          renderItem={renderOccasion}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          // Four banners down the page's own scroll — a second vertical
          // scroller here only competes with it for the gesture.
          scrollEnabled={false}
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
