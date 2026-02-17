import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth/authContext";
import { WRAPPER_API } from "../store/newApis/apiUrl.const";

const { width } = Dimensions.get("window");

export default function JewelleryTryOn() {
  const { userId } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New loading state
  const cameraRef = useRef(null);
  const router = useRouter();

  const handleUpload = async (uri: string) => {
    setIsUploading(true);
    const formData = new FormData();
    // @ts-ignore
    formData.append("userFace", {
      uri,
      name: "user_face.png",
      type: "image/png",
    });
    formData.append("userId", userId || "GUEST");

    try {
      const response = await fetch(`${WRAPPER_API}/uploadDp`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.ok) {
        // SUCCESS: Move to Step 2
        setIsImageUploaded(true);
      } else {
        Alert.alert("Upload Failed", "Server encountered an error.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to server.");
      console.error(error);
    } finally {
      // We stop the loading spinner, but we DON'T reset isImageUploaded here.
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (photo) {
      handleUpload(photo);
    }
  }, [photo]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <TouchableOpacity onPress={requestPermission} style={styles.confirmBtn}>
          <Text style={styles.confirmBtnText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      // @ts-ignore
      const data = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setPhoto(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const Header = ({ dark }: { dark: boolean }) => (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: dark ? "#111" : "#FFF" },
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (!photo) {
            router.back();
          } else {
            setPhoto(null);
            setIsImageUploaded(false);
          }
        }}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color={dark ? "#FFF" : "#000"}
        />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: dark ? "#FFF" : "#000" }]}>
        Replace Model
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isImageUploaded ? "#FFF" : "#111" }}
    >
      <Header dark={!isImageUploaded} />

      {/* Loading Overlay */}
      {isUploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={{ color: "#FFF", marginTop: 10 }}>
            Processing Face...
          </Text>
        </View>
      )}

      {!isImageUploaded ? (
        // --- STEP 1: CAPTURE/SELECTION ---
        <View style={styles.content}>
          <View style={styles.textGroup}>
            <Text style={styles.titleLight}>Take Your Photo</Text>
            <Text style={styles.subtitleLight}>
              Or Upload your photo to continue
            </Text>
          </View>

          <View style={styles.cameraWrapper}>
            <CameraView style={styles.camera} ref={cameraRef} facing="front">
              <View style={styles.overlayFrame}>
                <TouchableOpacity style={styles.pillBtn} onPress={pickImage}>
                  <Ionicons name="image-outline" size={18} color="#333" />
                  <Text style={styles.pillText}>Upload from Gallery</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>

          <View style={styles.footer}>
            <Text style={styles.titleLight}>Place Your Face In The Frame</Text>
            <Text style={styles.subtitleLight}>
              Make sure your face is fully visible.
            </Text>
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
              <Ionicons name="camera-outline" size={20} color="#333" />
              <Text style={styles.captureBtnText}>Capture</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // --- STEP 2: PREVIEW ---
        <View style={styles.content}>
          <View style={styles.textGroup}>
            <Text style={styles.titleDark}>Your Photo Preview</Text>
            <Text style={styles.subtitleDark}>
              Confirm your photo and proceed
            </Text>
          </View>

          <View style={styles.cameraWrapper}>
            <View style={[styles.camera, { borderWidth: 0 }]}>
              {photo && (
                <Image source={{ uri: photo }} style={styles.fullImage} />
              )}
              <TouchableOpacity
                style={styles.pillBtnAbsolute}
                onPress={() => {
                  setPhoto(null);
                  setIsImageUploaded(false);
                }}
              >
                <Ionicons name="refresh-outline" size={18} color="#333" />
                <Text style={styles.pillText}>Retake</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.ctaTitle}>
              Become The Model To See How Your Favourite Jewellery Looks On You
            </Text>
            <Text style={styles.ctaSubtitle}>
              The product images in your 'Wishlist' will be revamped with your
              image
            </Text>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => setShowSuccessModal(true)}
            >
              <Text style={styles.confirmBtnText}>Confirm & Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* --- STEP 3: SUCCESS MODAL --- */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSuccessModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <View style={styles.modalImageContainer}>
              {photo && (
                <Image source={{ uri: photo }} style={styles.modalThumb} />
              )}
              <View style={styles.sparkleBadge}>
                <Ionicons name="sparkles" size={20} color="#003D45" />
              </View>
            </View>

            <Text style={styles.modalTitle}>Zeywar Ai is at Work!</Text>
            <Text style={styles.modalSubtitle}>
              We will replace the model's images in your wishlisted items with
              your image. You can check the progress in your wishlist
            </Text>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/wishlist");
              }}
            >
              <Text style={styles.confirmBtnText}>Go to Wishlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.textBtn}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/product-list");
              }}
            >
              <Text style={styles.textBtnText}>Explore Products</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  headerContainer: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  headerTitle: { fontSize: 16, fontWeight: "600", marginLeft: 10 },
  backButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
  },
  content: { flex: 1, alignItems: "center" },
  textGroup: { alignItems: "center", marginVertical: 20 },
  titleLight: { color: "#FFF", fontSize: 18, fontWeight: "600" },
  subtitleLight: { color: "#AAA", fontSize: 13, marginTop: 4 },
  titleDark: { color: "#003D45", fontSize: 18, fontWeight: "600" },
  subtitleDark: { color: "#666", fontSize: 13, marginTop: 4 },
  cameraWrapper: { flex: 1, justifyContent: "center" },
  camera: {
    width: width * 0.75,
    height: width * 0.9,
    borderRadius: 120,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#FFF",
  },
  fullImage: { width: "100%", height: "100%" },
  overlayFrame: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  pillBtn: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    alignItems: "center",
  },
  pillBtnAbsolute: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    alignItems: "center",
  },
  pillText: { marginLeft: 8, fontWeight: "600", fontSize: 12 },
  footer: { width: "100%", padding: 25, alignItems: "center" },
  ctaTitle: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },
  ctaSubtitle: {
    textAlign: "center",
    fontSize: 13,
    color: "#777",
    marginVertical: 12,
  },
  captureBtn: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  captureBtnText: { marginLeft: 10, fontSize: 15, fontWeight: "600" },
  confirmBtn: {
    backgroundColor: "#003D45",
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBtnText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  modalImageContainer: { marginBottom: 20 },
  modalThumb: { width: 120, height: 140, borderRadius: 20 },
  sparkleBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#E6F0F1",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#003D45",
    marginBottom: 10,
  },
  modalSubtitle: {
    textAlign: "center",
    color: "#555",
    lineHeight: 20,
    marginBottom: 25,
  },
  textBtn: { marginTop: 15 },
  textBtnText: { color: "#003D45", fontWeight: "600" },
});
