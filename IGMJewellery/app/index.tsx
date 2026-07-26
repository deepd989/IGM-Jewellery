import { useAuth } from "@/auth/authContext";
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

const { width } = Dimensions.get("window");

// Carousel Constants
const CAROUSEL_ITEM_WIDTH = width * 0.85;
const SPACING = 10;
const SNAP_INTERVAL = CAROUSEL_ITEM_WIDTH + SPACING * 2;
const COLORS = { primary: "#053844" };

const BANNER_IMAGES = [
  {
    id: "1",
    url: require("../assets/images/loginPageImages/Login_Banner_1.webp"),
  },
  {
    id: "2",
    url: require("../assets/images/loginPageImages/Login_Banner_2.webp"),
  },
  {
    id: "3",
    url: require("../assets/images/loginPageImages/Login_Banner_3.webp"),
  },
  {
    id: "4",
    url: require("../assets/images/loginPageImages/Login_Banner_4.webp"),
  },
];

export default function JewelryLanding() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const flatListRef = useRef(null);

  // After video finishes, route based on auth state
  useEffect(() => {
    if (!isVideoFinished || authLoading) return;
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isVideoFinished, authLoading, isAuthenticated]);

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsVideoFinished(true);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image source={item.url} style={styles.image} resizeMode="cover" />
    </View>
  );

  // --- SPLASH VIDEO ---
  if (!isVideoFinished) {
    return (
      <View style={[styles.container, { flex: 1, backgroundColor: "#000" }]}>
        <Video
          source={require("../assets/splash.mp4")}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay = {true}
          rate={4.0}
          isLooping={false}
          isMuted={true}
          volume={1.0}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      </View>
    );
  }

  // --- REDIRECTING (authenticated user or still loading auth) ---
  if (authLoading || isAuthenticated) {
    return (
      <View style={[styles.container, { flex: 1, backgroundColor: "#000" }]} />
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
              style={{ height: 80, width: 260 }}
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
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.authContainer}>
          <HapticButton
            style={styles.fullButton}
            onPress={() => router.navigate("/login")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </HapticButton>

          <HapticButton
            style={[styles.fullButton, styles.secondaryButton]}
            onPress={() => router.navigate("/home")}
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
    justifyContent: "flex-start",
    paddingTop: 20,
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
    paddingVertical: 10,
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
