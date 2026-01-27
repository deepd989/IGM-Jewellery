import { ScrollingColumn } from "@/components/scrollingColumn";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 40) / 4; // 4 columns layout

export default function JewelryLanding() {
  const router = useRouter();

  // Helper to render a tile (Brand or Product)
  const Tile = ({ children, style, isLogo }) => (
    <View style={[styles.tile, style]}>
      {isLogo ? <View style={styles.logoCircle}>{children}</View> : children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.scrollContent}>
        {/* The Masonry Background Grid */}
        <View style={styles.gridContainer}>
          {/* Column 1 */}
          <View style={styles.column}>
            <ScrollingColumn duration={10000}>
              <View style={{ height: 60 }} />
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

          {/* Top Gradient Overlay for Fade-in effect */}
          <LinearGradient
            colors={["#FFFFFF", "transparent"]}
            style={styles.topGradient}
            pointerEvents="none"
          />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.mainRingContainer}>
            {/* Placeholder for the large central rings */}
            <View style={styles.mainRingPlaceholder}>
              <Text style={{ fontSize: 80 }}>💍</Text>
            </View>
          </View>

          <Text style={styles.title}>IGM Jewellery</Text>
          <Text style={styles.subtitle}>
            India's first AI-powered jewellery marketplace, where heritage meets
            high tech
          </Text>

          {/* Auth Links */}
          <View style={styles.authContainer}>
            <TouchableOpacity
              style={styles.fullButton}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fullButton}
              onPress={() => router.push("/home")}
            >
              <Text style={styles.buttonText}>Explore as guest</Text>
            </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 60,
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    height: 520, // Slightly reduced height
    overflow: "hidden",
    marginTop: -40, // Pulls the entire grid up
  },
  column: {
    width: COLUMN_WIDTH,
    flexDirection: "column",
  },
  tile: {
    width: COLUMN_WIDTH - 10,
    height: COLUMN_WIDTH + 20,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyTile: {
    backgroundColor: "#FDFDFD",
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    color: "#999",
    fontWeight: "300",
  },
  logoTextSmall: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
    letterSpacing: 1,
  },
  placeholderImg: {
    fontSize: 30,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Reduced height of gradient to show more content
    zIndex: 2,
  },
  heroSection: {
    marginTop: -150, // Pulled hero section up further to meet the grid
    alignItems: "center",
    paddingHorizontal: 40,
  },
  mainRingContainer: {
    width: 240,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  mainRingPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    bottom: 5,
    backgroundColor: "#385A54",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
    zIndex: 5,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 32, // Slightly smaller to match the compact feel
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "400",
  },
  linkButton: {
    alignItems: "center",
  },
  skip: {
    marginTop: 15,
  },
  linkText: {
    fontSize: 16,
    color: "black",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  linkUnderline: {
    height: 2,
    width: "100%",
    backgroundColor: "#385A54",
    marginTop: 4,
    borderRadius: 1,
  },
  linkSeparator: {
    width: 1,
    height: 20,
    backgroundColor: "#E0E0E0",
  },
  authContainer: {
    width: "100%",
    marginTop: 10,
    gap: 12, // Space between the buttons
  },
  fullButton: {
    backgroundColor: "#000",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 5, // Rounded corners
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
