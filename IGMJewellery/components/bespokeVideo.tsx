import { useIsFocused } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

const videoSource = require("../assets/bespokeVideo.mp4");

const BespokeVideoComponent = () => {
  // Stops decoding while the shopper is off on another screen.
  const isFocused = useIsFocused();

  return (
    <View style={styles.container}>
      <View style={styles.videoWrapper}>
        <Video
          source={videoSource}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isFocused}
          isLooping
          isMuted
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  videoWrapper: {
    width: width * 0.85,
    height: 500,
    backgroundColor: "#f0f0f0",
    // The "Leaf" Shape logic:
    borderTopRightRadius: 120, // High curve top-right
    borderBottomLeftRadius: 120, // High curve bottom-left
    borderTopLeftRadius: 20, // Subtle curve
    borderBottomRightRadius: 20, // Subtle curve
    overflow: "hidden", // Clips the video to these bounds
    elevation: 10, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default BespokeVideoComponent;
