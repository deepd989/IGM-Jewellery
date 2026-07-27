import { Camera, CameraView } from "expo-camera";
// import {
//   ExpoSpeechRecognitionModule,
//   useSpeechRecognitionEvent,
// } from "expo-speech-recognition";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { HapticButton } from "../basic components/hapticButton";

interface VoiceVideoInterfaceProps {
  mode?: "voice" | "video";
  onTranscript?: (text: string) => void;
  onClose?: () => void;
}

export default function VoiceVideoInterface({
  mode: initialMode = "voice",
  onTranscript,
  onClose,
}: VoiceVideoInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [mode, setMode] = useState(initialMode);
  const [transcript, setTranscript] = useState("");
  const [pulseAnim] = useState(new Animated.Value(1));
  const [bar1] = useState(new Animated.Value(0.3));
  const [bar2] = useState(new Animated.Value(0.5));
  const [bar3] = useState(new Animated.Value(0.8));
  const [bar4] = useState(new Animated.Value(0.6));
  const [bar5] = useState(new Animated.Value(0.4));

  // Speech recognition event listeners
  // useSpeechRecognitionEvent("start", () => {
  //   setIsListening(true);
  // });

  // useSpeechRecognitionEvent("end", () => {
  //   setIsListening(false);
  //   // When speech recognition ends, send the transcript if available
  //   if (transcript && onTranscript) {
  //     onTranscript(transcript);
  //   }
  // });

  // useSpeechRecognitionEvent("result", (event) => {
  //   const recognizedText = event.results[0]?.transcript || "";
  //   setTranscript(recognizedText);
  // });

  // useSpeechRecognitionEvent("error", (event) => {
  //   console.log("Speech recognition error:", event.error, event.message);
  //   setIsListening(false);
  //   if (event.error === "not-allowed") {
  //     Alert.alert(
  //       "Permission Required",
  //       "Please grant microphone and speech recognition permissions to use voice search.",
  //       [{ text: "OK" }]
  //     );
  //   }
  // });

  useEffect(() => {
    // Request camera permission for video mode
    if (mode === "video") {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    }
  }, [mode]);

  useEffect(() => {
    // Pulse animation for the glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Animated bars for voice mode
    if (isListening && mode === "voice") {
      const bars = [bar1, bar2, bar3, bar4, bar5];
      bars.forEach((bar, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(bar, {
              toValue: Math.random() * 0.7 + 0.3,
              duration: 300 + index * 100,
              useNativeDriver: true,
            }),
            Animated.timing(bar, {
              toValue: Math.random() * 0.7 + 0.3,
              duration: 300 + index * 100,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }
  }, [isListening, mode]);

  // Auto-start voice recognition when component mounts in voice mode
  useEffect(() => {
    if (mode === "voice") {
      startListening();
    }

    return () => {
      // Cleanup: stop recognition when component unmounts
      if (isListening) {
        // ExpoSpeechRecognitionModule.stop();
      }
    };
  }, []);

  const startListening = async () => {
    try {
      // Request permissions
      // const result = true as any
      //   // await ExpoSpeechRecognitionModule.requestPermissionsAsync();

      // if (!result.granted) {
      //   Alert.alert(
      //     "Permission Required",
      //     "Please grant microphone and speech recognition permissions to use voice search.",
      //     [{ text: "OK" }]
      //   );
      //   return;
      // }

      // Start speech recognition
      // ExpoSpeechRecognitionModule.start({
      //   lang: "en-IN", // Indian English for better recognition
      //   interimResults: true,
      //   continuous: false,
      // });
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      Alert.alert(
        "Error",
        "Failed to start speech recognition. Please try again."
      );
    }
  };

  const stopListening = () => {
    // ExpoSpeechRecognitionModule.stop();
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSendTranscript = () => {
    if (transcript && onTranscript) {
      onTranscript(transcript);
      if (onClose) {
        onClose();
      }
    }
  };

  const renderVisualizer = () => {
    if (mode === "video") {
      if (hasPermission === null) {
        return (
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.cameraText}>
              Requesting camera permission...
            </Text>
          </View>
        );
      }
      if (hasPermission === false) {
        return (
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.cameraText}>No access to camera</Text>
          </View>
        );
      }
      return (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing="back" />
        </View>
      );
    }

    // Voice mode - render animated bars
    return (
      <HapticButton onPress={toggleListening} activeOpacity={0.8}>
        <View style={styles.visualizerInner}>
          <Animated.View
            style={[styles.bar, { height: 20, transform: [{ scaleY: bar1 }] }]}
          />
          <Animated.View
            style={[styles.bar, { height: 40, transform: [{ scaleY: bar2 }] }]}
          />
          <Animated.View
            style={[styles.bar, { height: 60, transform: [{ scaleY: bar3 }] }]}
          />
          <Animated.View
            style={[styles.bar, { height: 40, transform: [{ scaleY: bar4 }] }]}
          />
          <Animated.View
            style={[styles.bar, { height: 25, transform: [{ scaleY: bar5 }] }]}
          />
          <View style={styles.sparkle}>
            <View style={styles.sparkleVertical} />
            <View style={styles.sparkleHorizontal} />
          </View>
        </View>
      </HapticButton>
    );
  };

  const toggleMode = (newMode: "voice" | "video") => {
    if (isListening) {
      stopListening();
    }
    setMode(newMode);
    if (newMode === "voice") {
      // Small delay before starting in new mode
      setTimeout(() => startListening(), 300);
    }
  };

  return (
    <View style={styles.container}>
      {/* Glowing Visualizer or Camera Feed */}
      <View style={styles.visualizerContainer}>
        <Animated.View
          style={[
            styles.glowOuter,
            {
              transform: [{ scale: pulseAnim }],
              backgroundColor: isListening
                ? "rgba(99, 102, 241, 0.25)"
                : "rgba(139, 92, 246, 0.15)",
            },
          ]}
        />

        {renderVisualizer()}
      </View>

      {/* Status Text */}
      <Text style={styles.statusText}>
        {mode === "video"
          ? "Video call.."
          : isListening
          ? "Listening..."
          : "Tap to speak"}
      </Text>

      {/* Transcript Display */}
      {transcript ? (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptText}>{transcript}</Text>
          {!isListening && (
            <HapticButton
              style={styles.sendTranscriptBtn}
              onPress={handleSendTranscript}
            >
              <Text style={styles.sendTranscriptText}>Send</Text>
            </HapticButton>
          )}
        </View>
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            <Text style={styles.messageBold}>Hey there! </Text>How can I help
            you today?
          </Text>
        </View>
      )}

      {/* Control Buttons */}
      <View style={styles.controls}>
        <HapticButton
          style={[
            styles.controlButton,
            mode === "voice" && styles.activeButton,
          ]}
          onPress={() => toggleMode("voice")}
        >
          <View style={styles.micIcon}>
            <View
              style={[styles.micBody, mode === "voice" && styles.activeIcon]}
            />
            <View
              style={[styles.micStand, mode === "voice" && styles.activeIcon]}
            />
          </View>
        </HapticButton>

        <HapticButton
          style={[
            styles.controlButton,
            mode === "video" && styles.activeButton,
          ]}
          onPress={() => toggleMode("video")}
        >
          <View style={styles.videoOffIcon}>
            <View
              style={[styles.videoRect, mode === "video" && styles.activeIcon]}
            />
            {mode !== "video" && <View style={styles.videoSlash} />}
          </View>
        </HapticButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  visualizerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    position: "relative",
    height: 300,
  },
  glowOuter: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
  },
  glowMid: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(139, 92, 246, 0.25)",
  },
  visualizerInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(99, 102, 241, 0.8)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    position: "relative",
    overflow: "hidden",
  },
  cameraContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: "hidden",
    backgroundColor: "#053844",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  cameraPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(99, 102, 241, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  cameraText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  bar: {
    width: 8,
    backgroundColor: "white",
    borderRadius: 4,
  },
  sparkle: {
    position: "absolute",
    top: 15,
    right: 20,
    width: 20,
    height: 20,
  },
  sparkleVertical: {
    position: "absolute",
    width: 3,
    height: 20,
    backgroundColor: "white",
    left: 8.5,
    borderRadius: 2,
  },
  sparkleHorizontal: {
    position: "absolute",
    width: 20,
    height: 3,
    backgroundColor: "white",
    top: 8.5,
    borderRadius: 2,
  },
  avatar: {
    position: "absolute",
    right: -80,
    top: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1e40af",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#1f2937",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  avatarText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 16,
    color: "#9ca3af",
    marginBottom: 20,
  },
  messageContainer: {
    maxWidth: 400,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  messageText: {
    fontSize: 24,
    color: "#1f2937",
    textAlign: "center",
    lineHeight: 32,
  },
  messageBold: {
    fontWeight: Platform.select({
      ios: "700",
      android: "bold",
    }),
  },
  transcriptContainer: {
    maxWidth: 400,
    marginBottom: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  transcriptText: {
    fontSize: 20,
    color: "#1f2937",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 16,
  },
  sendTranscriptBtn: {
    backgroundColor: "#053844",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  sendTranscriptText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  controls: {
    flexDirection: "row",
    gap: 200,
    position: "absolute",
    bottom: Platform.select({
      ios: 60,
      android: 40,
    }),
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  micIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  micBody: {
    width: 16,
    height: 24,
    backgroundColor: "#1f2937",
    borderRadius: 8,
    marginBottom: 2,
  },
  micStand: {
    width: 24,
    height: 3,
    backgroundColor: "#1f2937",
    borderRadius: 2,
  },
  videoOffIcon: {
    width: 32,
    height: 20,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  videoRect: {
    width: 28,
    height: 18,
    backgroundColor: "#1f2937",
    borderRadius: 4,
  },
  videoSlash: {
    position: "absolute",
    width: 40,
    height: 3,
    backgroundColor: "#1f2937",
    transform: [{ rotate: "-45deg" }],
    borderRadius: 2,
  },
  activeButton: {
    backgroundColor: "#6366f1",
  },
  activeIcon: {
    backgroundColor: "white",
  },
});
