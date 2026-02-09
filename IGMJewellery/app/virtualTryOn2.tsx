import React from "react";
import { StyleSheet, View } from "react-native"; // Added View
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import BottomNavBar from "../components/bottomNavBar";

export default function VirtualTryOn() {
  const tryOnUrl = "https://jeweltry.plushvie.in/igmindia/118305";

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Wrap the WebView in a View that takes all available top space */}
      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: tryOnUrl }}
          style={{ flex: 1 }}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={["*"]}
          androidLayerType="hardware"
          onPermissionRequest={(event) => {
            event.request.grant(event.request.resources);
          }}
        />
      </View>

      {/* 2. Nav bar stays at the bottom */}
      <BottomNavBar activeTab="AiDiscover" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Keep background consistent
  },
  webViewContainer: {
    flex: 1, // This pushes the BottomNavBar to the bottom
  },
});
