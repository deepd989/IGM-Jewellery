import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

const BespokeVideoComponent = () => {
  // Direct Google Drive link (UC format)
  const videoSource =
    "https://drive.google.com/uc?export=download&id=1LYb3FLuAQmoP4rktQBbFGxRPkM6fRy5c";

  const player = useVideoPlayer(videoSource, (playerInstance) => {
    playerInstance.loop = true;
    playerInstance.muted = true; // Required for most OS to allow autoplay
    playerInstance.play();
  });

  // Extra insurance: trigger play if the instance changes
  useEffect(() => {
    if (player) {
      player.play();
    }
  }, [player]);

  return (
    <View style={styles.container}>
      <View style={styles.videoWrapper}>
        <VideoView
          style={styles.video}
          player={player}
          nativeControls={false} // Hides play/pause/timeline icons
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          contentFit="cover"
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
