import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { HapticButton } from "../components/basic components/hapticButton";
import { COLORS, SPACING } from "../constants/theme";

export default function TryOnScreen() {
  const navigation = useNavigation();

  // Accept params from the route
  const { tryOnUrl, productTitle } = useLocalSearchParams<{
    tryOnUrl: string;
    productTitle: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) setIsLoading(false);
    }, 15000); // Increased failsafe for webviews

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const handleClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <HapticButton onPress={handleClose} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </HapticButton>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Try On - {productTitle || "Product"}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading Try-On Experience...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={COLORS.error}
          />
          <Text style={styles.errorText}>Failed to Load</Text>
          <Text style={styles.errorSubtext}>
            Please check your connection and try again
          </Text>
          <HapticButton style={styles.retryButton} onPress={handleClose}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </HapticButton>
        </View>
      )}

      {/* WebView */}
      {tryOnUrl ? (
        <WebView
          source={{ uri: tryOnUrl }}
          style={styles.webview}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="always"
          // Important for camera-based Try-On:
          originWhitelist={["*"]}
          allowsFullscreenVideo
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text>No Try-On URL provided.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // Ensures content stays below notch on iOS and status bar on Android
    paddingTop: Platform.OS === "android" ? 40 : 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    padding: 4,
    width: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    paddingHorizontal: SPACING.s,
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    zIndex: 10,
    top: 100, // Show below the header
  },
  loadingText: {
    marginTop: SPACING.m,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: SPACING.xl,
    zIndex: 10,
  },
  errorText: {
    marginTop: SPACING.m,
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  errorSubtext: {
    marginTop: SPACING.s,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    marginTop: SPACING.l,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  webview: {
    flex: 1,
  },
});
