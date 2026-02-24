import { Diamond } from "lucide-react-native";
import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { HapticButton } from "../../components/basic components/hapticButton";
import { COLORS } from "../../constants/theme";

const categories = [
  {
    id: "1",
    title: "N E C K L A C E",
    hasIcon: false,
    imgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Bespoke%20Banners%2Fcategories_Artistian%20Neckalce.webp?alt=media&token=70497e37-d2a8-4ba1-a61e-da46c7b56fd0",
  },
  {
    id: "2",
    title: "R I N G S",
    hasIcon: false,
    imgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Bespoke%20Banners%2Fcategories_Artistian%20Rings.webp?alt=media&token=551980e1-5ec1-471c-8095-a3905e6461bb",
  },
  {
    id: "3",
    title: "B A N G L E S",
    hasIcon: false,
    imgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Bespoke%20Banners%2Fcategories_Artistian%20Bangels.webp?alt=media&token=ef0a6cc6-6461-4cbc-b1b4-3d5de603c764",
  },
  {
    id: "4",
    title: "M A G A L S U T R A",
    hasIcon: false,
    imgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Bespoke%20Banners%2Fcategories_Artistian%20Mangalshutra.webp?alt=media&token=5f75ef1d-06af-4128-a42f-5b0b4464fc12",
  },
  {
    id: "5",
    title: "B R A C E L E T S",
    hasIcon: false,
    imgUrl:
      "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Bespoke%20Banners%2Fcategories_Artistian%20Bracelets.webp?alt=media&token=c1e9186d-d990-4fca-b680-8a2576d5f2b9",
  },
];

export default function BespokePage2({
  nextStepFn,
}: {
  nextStepFn: () => void;
}) {
  const [selected, setSelected] = useState("1");

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>What do you wish to customize?</Text>
      </View>

      {/* Options List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((item) => {
          const isSelected = selected === item.id;
          return (
            <HapticButton
              key={item.id}
              activeOpacity={0.8}
              onPress={() => setSelected(item.id)}
              style={[styles.optionCard, isSelected && styles.selectedCard]}
            >
              <ImageBackground
                source={{ uri: item.imgUrl }}
                style={styles.backgroundImage}
                resizeMode="cover"
              >
                {/* Overlay to ensure text legibility */}
                {/* <View
                  style={[styles.overlay, isSelected && styles.selectedOverlay]}
                /> */}

                {/* <Text style={styles.optionText}>{item.title}</Text> */}

                {item.hasIcon && (
                  <View style={styles.iconContainer}>
                    <Diamond size={20} color="white" strokeWidth={1.5} />
                  </View>
                )}
              </ImageBackground>
            </HapticButton>
          );
        })}
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <HapticButton style={styles.nextButton} onPress={nextStepFn}>
          <Text style={styles.nextButtonText}>Next</Text>
        </HapticButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#053844",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  optionCard: {
    height: 120,
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden", // Clips the image to the border radius
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: COLORS.secondary,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    borderWidth: 4,
    shadowRadius: 4,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)", // Soft dark tint
  },
  selectedOverlay: {
    backgroundColor: "rgba(5, 56, 68, 0.3)", // Thematic tint when selected
  },
  optionText: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 5,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  iconContainer: {
    position: "absolute",
    right: 20,
    top: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 100,
    padding: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  nextButton: {
    backgroundColor: "#053844",
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
