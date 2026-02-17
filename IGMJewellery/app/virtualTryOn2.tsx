import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import BottomNavBar from "../components/bottomNavBar";

export default function VirtualTryOn() {
  const tryOnUrl = "https://jeweltry.plushvie.in/igmindia/118305";

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: tryOnUrl }}
        style={{ flex: 1 }}
        // Essential for camera access in WebView
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={["*"]}
        // For Android: Specific permission request
        androidLayerType="hardware"
        onPermissionRequest={(event) => {
          event.request.grant(event.request.resources);
        }}
      />
      <BottomNavBar activeTab="AiDiscover"></BottomNavBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
