import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { COLORS, SPACING } from "../../constants/theme";
import { HapticButton } from "../basic components/hapticButton";

interface TryOnModalProps {
  visible: boolean;
  onClose: () => void;
  tryOnUrl: string;
  productTitle: string;
}

export const TryOnModal: React.FC<TryOnModalProps> = ({
  visible,
  onClose,
  tryOnUrl,
  productTitle,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      setError(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!isLoading) return;

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 10000); // 10 sec failsafe

    return () => clearTimeout(timeout);
  }, [isLoading]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <HapticButton onPress={onClose} style={styles.backBtn}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </HapticButton>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Try On - {productTitle}
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
            <HapticButton style={styles.retryButton} onPress={onClose}>
              <Text style={styles.retryButtonText}>Close</Text>
            </HapticButton>
          </View>
        )}

        {/* WebView */}
        {visible && tryOnUrl ? (
          <WebView
            source={{ uri: tryOnUrl }}
            style={styles.webview}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setError(true);
              setIsLoading(false);
            }}
            onHttpError={() => {
              setError(true);
              setIsLoading(false);
            }}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            mixedContentMode="always"
          />
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 30 : 0,
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  loadingText: {
    marginTop: SPACING.m,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
