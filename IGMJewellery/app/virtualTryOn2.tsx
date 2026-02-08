import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function VirtualTryOn() {
  const tryOnUrl = "https://jeweltry.plushvie.in/igmindia/118305";

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
