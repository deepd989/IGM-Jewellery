import {
  ArrowRight,
  Diamond,
  Home,
  ShoppingBag,
  User,
} from "lucide-react-native";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { HapticButton } from "../../components/basic components/hapticButton";

const { width } = Dimensions.get("window");

const BespokePage1 = ({ nextStepFn }: { nextStepFn: () => void }) => {
  const steps = [
    {
      title: "Send us your idea",
      description: "Make Sketches or attach images",
      icon: <Diamond size={24} color="black" />,
    },
    {
      title: "We will assign a Designer",
      description: "Select you convenient date, time, and place",
      icon: <Home size={24} color="black" />,
    },
    {
      title: "Get on a call to discuss",
      description: "Our consultant will get you your chosen designs",
      icon: <User size={24} color="black" />,
    },
    {
      title: "Complete the partial payment",
      description: "Our consultant will get you your chosen designs",
      icon: <ShoppingBag size={24} color="black" />,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Bespoke Jewellery,{"\n"}You Design We Deliver
          </Text>
          <Text style={styles.subtitle}>
            Customise your jewellery from scratch. You design we deliver
          </Text>
        </View>

        {/* Product Visual Area */}
        <View style={styles.heroContainer}>
          {/* Background Grid Pattern */}
          <View style={styles.gridContainer}>
            <View style={styles.bgGrid1}>
              <View style={[styles.gridBox]} />
              <View style={[styles.gridBox]} />
              <View style={[styles.gridBox]} />
            </View>
            <View style={styles.bgGrid2}>
              <View style={[styles.gridBox]} />
              <View style={[styles.gridBox]} />
              <View style={[styles.gridBox]} />
            </View>
            <View style={styles.bgGrid3}>
              <View style={[styles.gridBox]} />
              <View style={[styles.gridBox]} />
              <View style={[styles.gridBox]} />
            </View>
          </View>

          {/* Floating Badges */}
          <View style={styles.badgeTopLeft}>
            <Text style={styles.badgeText}>💍 Curated for you</Text>
          </View>
          <View style={styles.badgeTopRight}>
            <Text style={styles.badgeText}>❤️ Custom design</Text>
          </View>
          <View style={styles.badgeBottomLeft}>
            <Text style={styles.badgeText}>💍 Made with love</Text>
          </View>

          {/* Main Ring Image - Placeholder */}
          <View style={styles.mainRingContainer}>
            {/* Placeholder for the large central rings */}
            <View style={styles.mainRingPlaceholder}>
              <Text style={{ fontSize: 80 }}>💍</Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <HapticButton style={styles.ctaButton} onPress={nextStepFn}>
          <Text style={styles.ctaText}>Start Customisation</Text>
          <ArrowRight size={18} color="white" />
        </HapticButton>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <View style={styles.diamond} />
          <View style={styles.line} />
        </View>

        {/* Process Section */}
        <View style={styles.processSection}>
          <Text style={styles.processTitle}>Here’s How Bespoke Works</Text>
          <Text style={styles.processSubtitle}>
            Bespoke happens in 5 simple steps. Customise your jewellery from
            scratch.
          </Text>

          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.timelineContainer}>
                <View style={styles.iconCircle}>{step.icon}</View>
                {index !== steps.length - 1 && (
                  <>
                    <View style={styles.verticalLine} />
                    <View style={styles.smallDiamond} />

                    <View style={styles.verticalLine} />
                    <View style={styles.verticalLine} />
                  </>
                )}
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  mainRingContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  mainRingPlaceholder: {
    position: "absolute",
    top: -10,
    left: (width - 40) / 2 - 63,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { paddingBottom: 40 },
  header: { alignItems: "center", padding: 20, marginTop: 20 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 30,
  },

  heroContainer: {
    height: 350,
    width: "100%",
    marginVertical: 20,
  },
  gridContainer: {
    height: 150,
  },
  bgGrid1: {
    flexDirection: "row",
    flexWrap: "wrap",
    opacity: 0.3,
    width: "100%",
    height: "100%",
  },
  bgGrid2: {
    flexDirection: "row",
    flexWrap: "wrap",
    opacity: 0.3,
    width: "100%",
    height: "100%",
  },
  bgGrid3: {
    flexDirection: "row",
    flexWrap: "wrap",
    opacity: 0.3,
    width: "100%",
    height: "100%",
  },
  gridBox: {
    width: "33.3%",
    height: "100%",
    borderWidth: 2,
    borderColor: "#EEE",
    borderRadius: 10,
    backgroundColor: "#CCC",
  },
  ringImage: { width: width * 0.8, height: 200 },

  badgeTopLeft: {
    position: "absolute",
    top: 10,
    left: 40,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowOpacity: 0.1,
  },
  badgeTopRight: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowOpacity: 0.1,
  },
  badgeBottomLeft: {
    position: "absolute",
    bottom: 10,
    left: 20,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowOpacity: 0.1,
  },
  badgeText: { fontSize: 12, fontWeight: "500" },

  ctaButton: {
    backgroundColor: "black",
    flexDirection: "row",
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  ctaText: { color: "white", fontWeight: "600", marginRight: 10, fontSize: 16 },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  line: { height: 1, width: 60, backgroundColor: "#333" },
  diamond: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#333",
    transform: [{ rotate: "45deg" }],
    marginHorizontal: 5,
  },

  processSection: { paddingHorizontal: 25 },
  processTitle: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  processSubtitle: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginVertical: 10,
    lineHeight: 18,
  },

  stepRow: { flexDirection: "row", marginBottom: 0 },
  timelineContainer: { alignItems: "center", width: 50 },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  verticalLine: { width: 1.5, height: 30, backgroundColor: "#333" },
  smallDiamond: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: "#333",
    transform: [{ rotate: "45deg" }],
    marginVertical: 2,
  },

  stepContent: { flex: 1, marginLeft: 15, paddingTop: 5, paddingBottom: 35 },
  stepTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
  stepDescription: { fontSize: 14, color: "#666", marginTop: 4 },
});

export default BespokePage1;
