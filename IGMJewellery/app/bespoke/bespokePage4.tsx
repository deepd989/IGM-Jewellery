import { useRouter } from "expo-router";
import {
  CheckCircle2,
  Copy,
  Diamond,
  Home,
  ShoppingBag,
  UserCircle2,
} from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../../components/basic components/hapticButton";
import { COLORS } from "../../constants/theme";

const BespokePage4 = () => {
  const router = useRouter();
  const requestNumber = "#12345";

  const steps = [
    {
      icon: <Home size={24} color={COLORS.primary} />,
      title: "We will assign a Designer",
      description: "Select you convenient date, time, and place",
    },
    {
      icon: <UserCircle2 size={24} color={COLORS.primary} />,
      title: "Get on a call to discuss",
      description: "Our consultant will get you your chosen designs",
    },
    {
      icon: <ShoppingBag size={24} color={COLORS.primary} />,
      title: "Complete the partial payment",
      description: "Our consultant will get you your chosen designs",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Diamond size={60} color={COLORS.primary} strokeWidth={1.5} />
            <View style={styles.checkBadge}>
              <CheckCircle2 size={24} color={COLORS.primary} fill="white" />
            </View>
          </View>
          <Text style={styles.title}>Received your Request</Text>
          <Text style={styles.subtitle}>
            We will review your customisation request and assign our consultant
            to you shortly
          </Text>
        </View>

        {/* Request ID Tag */}
        <HapticButton style={styles.requestIdContainer}>
          <Text style={styles.requestIdText}>Request No. {requestNumber}</Text>
          <Copy size={16} color="#666" style={{ marginLeft: 8 }} />
        </HapticButton>

        <Text style={styles.expectTitle}>Here's what you can expect next</Text>

        {/* Timeline Section */}
        <View style={styles.timelineContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.leftColumn}>
                <View style={styles.iconCircle}>{step.icon}</View>
                {index !== steps.length - 1 && (
                  <View style={styles.verticalLineContainer}>
                    <View style={styles.diamondConnector} />
                    <View style={styles.line} />
                    <View style={styles.diamondConnector} />
                  </View>
                )}
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.footer}>
        {/* <HapticButton style={styles.statusButton}>
          <Text style={styles.statusButtonText}>Check Order Status</Text>
        </HapticButton> */}
        <HapticButton
          style={styles.continueButton}
          onPress={() => router.push("/product-list")}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </HapticButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 20,
    position: "relative",
  },
  checkBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "white",
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: "center",
    lineHeight: 20,
  },
  requestIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 30,
  },
  requestIdText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
  expectTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 30,
  },
  timelineContainer: {
    width: "100%",
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  leftColumn: {
    alignItems: "center",
    width: 50,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  verticalLineContainer: {
    alignItems: "center",
    height: 60,
    justifyContent: "center",
  },
  line: {
    width: 1.5,
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  diamondConnector: {
    width: 8,
    height: 8,
    borderWidth: 1.5,
    borderColor: "#333",
    transform: [{ rotate: "45deg" }],
    backgroundColor: COLORS.primary,
    position: "absolute",
    zIndex: 3,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 5,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: COLORS.primary,
    lineHeight: 18,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusButton: {
    flex: 1,
  },
  statusButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.primary,
  },
  continueButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default BespokePage4;
