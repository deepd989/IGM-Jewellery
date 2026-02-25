import { ResizeMode, Video } from "expo-av";
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
import { useGetProductsQuery } from "../store/apis/product";

const { width } = Dimensions.get("window");

// Carousel Constants
const CAROUSEL_ITEM_WIDTH = width * 0.85;
const SPACING = 10;
const SNAP_INTERVAL = CAROUSEL_ITEM_WIDTH + SPACING * 2;
const COLORS = { primary: "#053844" };

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
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const { isLoading, isError } = useGetProductsQuery({});

  // Auto-scroll Effect for Carousel
  useEffect(() => {
    if (!isVideoFinished || isLoading) return; // Don't start timer until landing is visible

    const timer = setInterval(() => {
      let nextIndex = (currentIndex + 1) % BANNER_IMAGES.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3500);

    return () => clearInterval(timer);
  }, [currentIndex, isVideoFinished, isLoading]);

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsVideoFinished(true);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  // --- LOADING / VIDEO STATE ---
  // We stay in this block until the video finishes AND the API is done.
  if (!isVideoFinished || isLoading) {
    return (
      <View style={[styles.container, { flex: 1, backgroundColor: "#000" }]}>
        {!isVideoFinished ? (
          <Video
            source={require("../assets/splash.mp4")}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            rate={2.0}
            isLooping={false} // Play only once
            isMuted={false}
            volume={1.0}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
        ) : (
          /* Fallback UI: If video ends but data is still fetching */
          <SafeAreaView style={[styles.safeArea, styles.centered]}>
            <View style={styles.logoCircleLarge}>
              <Image
                source={require("../assets/images/icon.png")}
                style={styles.logoImage}
              />
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: COLORS.primary },
                ]}
              />
            </View>
          </SafeAreaView>
        )}
      </View>
    );
  }

  // --- MAIN LANDING UI ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.textContainer}>
          <HapticButton
            onLongPress={() => setShowModal(true)}
            delayLongPress={800}
          >
            <Image
              source={require("../assets/images/elanziaIndex.png")}
              style={{ height: 60, width: 200 }}
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
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / SNAP_INTERVAL
              );
              setCurrentIndex(newIndex);
            }}
          />
        </View>

        {/* Action Buttons */}
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
            <Text style={[styles.buttonText, { color: COLORS.primary }]}>
              Explore as Guest
            </Text>
          </HapticButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    // paddingTop: 10,
    paddingHorizontal: 30,
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
    // paddingBottom: 20,
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
  logoCircleLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  logoImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  progressBarContainer: {
    width: width * 0.4,
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    marginTop: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    width: "60%",
  },
});
