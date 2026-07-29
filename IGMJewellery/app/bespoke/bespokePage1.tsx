import { useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  CheckCircle,
  Diamond,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { HapticButton } from "../../components/basic components/hapticButton";
import { COLORS, LUXURY_COLORS } from "../../constants/theme";

const { width } = Dimensions.get("window");

const BespokePage1 = ({
  nextStepFn,
  isLuxury = false,
}: {
  nextStepFn: () => void;
  /** Dresses the step for the luxury storefront. */
  isLuxury?: boolean;
}) => {
  const styles = useMemo(() => createStyles(isLuxury), [isLuxury]);

  const steps = [
    {
      title: "Inspire",
      description: "Send us your idea, sketches, or reference images",
      icon: <Diamond size={24} color={COLORS.primary} />,
    },
    {
      title: "Approve",
      description: "Finalize your choice of stones and design details",
      icon: <CheckCircle size={24} color={COLORS.primary} />, // Suggested: CheckCircle or Edit
    },
    {
      title: "Consult",
      description: "Meet your assigned designer at your convenient time",
      icon: <User size={24} color={COLORS.primary} />,
    },
    {
      title: "Secure",
      description: "Complete the partial payment to begin crafting",
      icon: <ShoppingBag size={24} color={COLORS.primary} />,
    },
    {
      title: "Receive",
      description: "Your masterpiece delivered with full certification",
      icon: <Truck size={24} color={COLORS.primary} />, // Suggested: Truck or Package
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{}}
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
        {/* <View style={styles.heroContainer}>
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
          <View style={styles.badgeTopLeft}>
            <Text style={styles.badgeText}>💍 Curated for you</Text>
          </View>
          <View style={styles.badgeTopRight}>
            <Text style={styles.badgeText}>❤️ Custom design</Text>
          </View>
          <View style={styles.badgeBottomLeft}>
            <Text style={styles.badgeText}>💍 Made with love</Text>
          </View>
          <View style={styles.mainRingContainer}>
            <View style={styles.mainRingPlaceholder}>
              <Text style={{ fontSize: 80 }}>💍</Text>
            </View>
          </View>
        </View> */}
        <View style={styles.imgcontainer}>
          <Image
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Bespoke%20Banners%2FExplore%20Bespoke%2Fbespoke-01.webp?alt=media&token=5cb0fb49-268e-4953-acc5-92abb0db0249",
            }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* The Gradient Overlay */}
          <LinearGradient
            // Colors: Solid background color at the top -> Transparent
            colors={["white", "transparent"]}
            style={styles.gradient}
          />
        </View>

        {/* CTA Button */}

        <View style={styles.dividerContainer}>
          {/* <View style={styles.line} />
          <View style={styles.diamond} />
          <View style={styles.line} /> */}
        </View>

        {/* Process Section */}
        <View style={styles.processSection}>
          <Text style={styles.processTitle}>Here’s How Bespoke Works</Text>
          <Text style={styles.processSubtitle}>
            Bespoke happens in 5 simple steps. Customise your jewellery from
            scratch.
          </Text>
          <View style={styles.dividerContainer}>
            {/* <View style={styles.line} />
          <View style={styles.diamond} />
          <View style={styles.line} /> */}
          </View>

          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.timelineContainer}>
                <View style={styles.iconCircle}>{step.icon}</View>
                {index !== steps.length - 1 && (
                  <>
                    <View style={styles.verticalLine} />
                    <View style={styles.smallDiamond} />
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

        <View style={(styles.imgcontainer, { paddingBottom: 80 })}>
          <Image
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Bespoke%20Banners%2FExplore%20Bespoke%2Fbespoke-02.webp?alt=media&token=9e40b901-d9eb-491c-ac15-5e419466639b",
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
      <HapticButton style={styles.ctaButton} onPress={nextStepFn}>
        <Text style={styles.ctaText}>Start Customisation</Text>
        <ArrowRight size={18} color="white" />
      </HapticButton>
    </View>
  );
};

/** One set of steps, two surfaces: the tone lives here, not in a copy. */
const createStyles = (isLuxury: boolean) =>
  StyleSheet.create({
  container: { flex: 1 },
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
    backgroundColor: isLuxury ? LUXURY_COLORS.surface : "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { paddingBottom: 40 },
  header: { alignItems: "center", padding: 20, marginTop: 0 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: isLuxury ? LUXURY_COLORS.text : COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: isLuxury ? LUXURY_COLORS.text : COLORS.primary,
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
    borderColor: isLuxury ? LUXURY_COLORS.border : "#EEE",
    borderRadius: 10,
    opacity: 0.2,
    backgroundColor: isLuxury ? LUXURY_COLORS.gradient[1] : COLORS.primary,
  },
  ringImage: { width: width * 0.8, height: 200 },

  badgeTopLeft: {
    position: "absolute",
    top: 10,
    left: 40,
    backgroundColor: isLuxury ? LUXURY_COLORS.surface : "white",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowOpacity: 0.1,
  },
  badgeTopRight: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: isLuxury ? LUXURY_COLORS.surface : "white",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowOpacity: 0.1,
  },
  badgeBottomLeft: {
    position: "absolute",
    bottom: 10,
    left: 20,
    backgroundColor: isLuxury ? LUXURY_COLORS.surface : "white",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowOpacity: 0.1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: isLuxury ? LUXURY_COLORS.text : COLORS.primary,
  },

  ctaButton: {
    position: "absolute",
    bottom: 35,
    backgroundColor: isLuxury ? LUXURY_COLORS.gradient[1] : COLORS.primary,
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
  line: {
    height: 1,
    width: 60,
    backgroundColor: isLuxury ? LUXURY_COLORS.accent : COLORS.primary,
  },
  diamond: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#333",
    transform: [{ rotate: "45deg" }],
    marginHorizontal: 5,
    backgroundColor: isLuxury ? LUXURY_COLORS.gradient[1] : COLORS.primary,
  },

  processSection: { paddingHorizontal: 25, marginTop: 10 },
  processTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: isLuxury ? LUXURY_COLORS.text : COLORS.primary,
  },
  processSubtitle: {
    fontSize: 13,
    color: isLuxury ? LUXURY_COLORS.text : COLORS.primary,
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
    color: isLuxury ? LUXURY_COLORS.text : COLORS.primary,
  },
  verticalLine: {
    width: 1.5,
    height: 25,
    backgroundColor: isLuxury ? LUXURY_COLORS.accent : COLORS.primary,
  },
  smallDiamond: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: "#333",
    transform: [{ rotate: "45deg" }],
    marginVertical: 3,
    backgroundColor: isLuxury ? LUXURY_COLORS.gradient[1] : COLORS.primary,
  },

  stepContent: { flex: 1, marginLeft: 15, paddingTop: 5, paddingBottom: 35 },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: isLuxury ? LUXURY_COLORS.text : COLORS.primary,
  },
  stepDescription: { fontSize: 14, color: isLuxury ? LUXURY_COLORS.text : COLORS.primary, marginTop: 4 },
  image: {
    height: 400,
    width: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%", // Adjust this to make the fade longer or shorter
  },
  imgcontainer: {
    height: 400,
    width: "100%",
  },
});

export default BespokePage1;
