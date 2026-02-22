import { ScrollingColumn } from "@/components/scrollingColumn";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../components/basic components/hapticButton";
import HealthCheckModal from "../components/connectionModal";
import { COLORS } from "../constants/theme";
import { useGetProductsQuery } from "../store/apis/product";

const { width, height } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 40) / 4;
const TILE_HEIGHT = height * 0.12;

export default function JewelryLanding() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery({});

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <View style={styles.logoCircleLarge}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logoImage}
          />
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { backgroundColor: COLORS.primary }]}
          />
        </View>
      </SafeAreaView>
    );
  }

  const Tile = ({ children, style, isLogo }) => (
    <View style={[styles.tile, style]}>
      {isLogo ? <View style={styles.logoCircle}>{children}</View> : children}
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
        {/* The Masonry Background Grid */}
        <View style={styles.gridContainer}>
          {/* Column 1 */}
          <View style={styles.column}>
            <ScrollingColumn duration={10000}>
              <View style={{ height: 40 }} />
              <Tile style={styles.emptyTile} />
              <Tile isLogo>
                <Text style={styles.logoText}>M</Text>
              </Tile>
              <Tile>
                <Text style={styles.placeholderImg}>💍</Text>
              </Tile>
              <Tile style={styles.emptyTile} />
            </ScrollingColumn>
          </View>

          {/* Column 2 */}
          <ScrollingColumn duration={10000} reverse={true}>
            <View style={[styles.column, { marginTop: -40 }]}>
              <Tile style={styles.emptyTile} />
              <Tile style={styles.emptyTile} />
              <Tile>
                <Text style={styles.placeholderImg}>💎</Text>
              </Tile>
              <Tile isLogo>
                <Text style={styles.logoTextSmall}>tbz</Text>
              </Tile>
            </View>
          </ScrollingColumn>

          {/* Column 3 */}
          <ScrollingColumn duration={10000}>
            <View style={[styles.column, { marginTop: 20 }]}>
              <Tile style={styles.emptyTile} />
              <Tile isLogo>
                <Text style={styles.logoTextSmall}>PCJ</Text>
              </Tile>
              <Tile>
                <Text style={styles.placeholderImg}>💚</Text>
              </Tile>
              <Tile style={styles.emptyTile} />
            </View>
          </ScrollingColumn>

          {/* Column 4 */}
          <ScrollingColumn duration={10000} reverse={true}>
            <View style={[styles.column, { marginTop: -20 }]}>
              <Tile>
                <Text style={styles.placeholderImg}>💍</Text>
              </Tile>
              <Tile>
                <Text style={styles.placeholderImg}>🔶</Text>
              </Tile>
              <Tile isLogo>
                <Text style={styles.logoTextSmall}>TANISHQ</Text>
              </Tile>
              <Tile style={styles.emptyTile} />
            </View>
          </ScrollingColumn>

          {/* Top Fade Overlay */}
          <LinearGradient
            colors={["#FFFFFF", "transparent"]}
            style={styles.topGradient}
            pointerEvents="none"
          />

          {/* Bottom Fade Overlay */}
          <LinearGradient
            colors={["transparent", "#FFFFFF"]}
            style={styles.bottomGradient}
            pointerEvents="none"
          />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.mainRingContainer}>
            <View style={styles.mainRingPlaceholder}>
              <Text style={{ fontSize: 50 }}>💍</Text>
            </View>
          </View>

          <View style={styles.textContainer}>
            <HapticButton
              onLongPress={() => setShowModal(true)}
              delayLongPress={800}
            >
              <Text style={styles.title}>Zeywar</Text>
            </HapticButton>
            <Text style={styles.subtitle}>
              India's first AI-powered jewellery marketplace, where heritage
              meets high tech
            </Text>
          </View>

          <View style={styles.authContainer}>
            <HapticButton
              style={styles.fullButton}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.buttonText}>Login</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
  logoTextLarge: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#053844",
  },
  logoImage: {
    width: 80, // Adjust this based on your icon's aspect ratio
    height: 80,
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
    width: "60%", // Static visual for progress, can be animated if needed
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    height: height * 0.42,
    overflow: "hidden",
  },
  column: {
    width: COLUMN_WIDTH,
  },
  tile: {
    width: COLUMN_WIDTH - 10,
    height: TILE_HEIGHT,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    marginVertical: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  emptyTile: { backgroundColor: "#F9F9F9" },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { fontSize: 18, color: "#AAA" },
  logoTextSmall: { fontSize: 9, color: "#AAA", fontWeight: "600" },
  placeholderImg: { fontSize: 20 },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 2,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 2,
  },
  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    marginTop: -40,
  },
  mainRingContainer: {
    height: 120,
    justifyContent: "center",
  },
  mainRingPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  textContainer: {
    marginVertical: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#053844",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
  authContainer: {
    width: "100%",
    gap: 8,
  },
  fullButton: {
    backgroundColor: "#053844",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
