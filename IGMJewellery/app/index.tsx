import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../components/basic components/hapticButton";
import HealthCheckModal from "../components/connectionModal";

const { width } = Dimensions.get("window");

// Carousel Constants
const CAROUSEL_ITEM_WIDTH = width * 0.85;
const SPACING = 10;
const SNAP_INTERVAL = CAROUSEL_ITEM_WIDTH + SPACING * 2;

const BANNER_IMAGES = [
  {
    id: "1",
    url: "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Login%20Banner%2FLogin_Banner_1.webp?alt=media&token=41ad9077-7d17-49d2-b1bc-2cca962ad579",
  },
  {
    id: "2",
    url: "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Login%20Banner%2FLogin_Banner_2.webp?alt=media&token=1fefb9d8-429e-4733-99de-e3925ccedf89",
  },
  {
    id: "3",
    url: "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Login%20Banner%2FLogin_Banner_3.webp?alt=media&token=4f33cd4d-ee51-439e-b263-3476e065f44d",
  },
];

export default function JewelryLanding() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll Effect
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = (currentIndex + 1) % BANNER_IMAGES.length;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3500); // 3.5 seconds for a premium feel

    return () => clearInterval(timer);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {showModal && (
        <View style={StyleSheet.absoluteFillObject}>
          <HealthCheckModal setModalVisible={setShowModal} />
        </View>
      )}

      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.textContainer}>
          <HapticButton
            onLongPress={() => setShowModal(true)}
            delayLongPress={800}
          >
            <Image
              source={require("../assets/images/elanziaIndex.png")}
              style={{
                height: 60,
                width: 200,
              }}
            />
          </HapticButton>
          <Text style={styles.subtitle}>
            India's first AI-powered jewellery marketplace
          </Text>
        </View>

        {/* Auto-Scrolling Carousel */}
        <View style={styles.carouselSection}>
          <FlatList
            ref={flatListRef}
            data={BANNER_IMAGES}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            contentContainerStyle={styles.flatListPadding}
            getItemLayout={(_, index) => ({
              length: SNAP_INTERVAL,
              offset: SNAP_INTERVAL * index,
              index,
            })}
            // Update index if user manually swipes
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / SNAP_INTERVAL
              );
              setCurrentIndex(newIndex);
            }}
          />
        </View>

        {/* Buttons */}
        <View style={styles.authContainer}>
          <HapticButton
            style={styles.fullButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </HapticButton>

          <HapticButton
            style={[styles.fullButton, styles.secondaryButton]}
            onPress={() => router.push("/home")}
          >
            <Text style={[styles.buttonText, { color: "#053844" }]}>
              Explore as Guest
            </Text>
          </HapticButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "space-between",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "300",
    color: "#053844",
    letterSpacing: 6,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
    letterSpacing: 0.5,
    fontWeight: "400",
  },
  carouselSection: {
    height: 420,
    marginVertical: 20,
  },
  flatListPadding: {
    paddingHorizontal: (width - CAROUSEL_ITEM_WIDTH) / 2 - SPACING,
  },
  cardContainer: {
    width: CAROUSEL_ITEM_WIDTH,
    height: 400,
    marginHorizontal: SPACING,
    borderRadius: 24,
    backgroundColor: "#F9F9F9",
    overflow: "hidden",
    // Shadow/Elevation
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  authContainer: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    gap: 12,
  },
  fullButton: {
    backgroundColor: "#053844",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
