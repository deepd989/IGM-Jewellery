import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";
import { Product } from "../interfaces/product.interface";
import { useGetProductByIdQuery } from "../store/apis/product";

const TryOnScreen = () => {
  const router = useRouter();
  const API_URL = "http://localhost:3000"; // Ensure this matches your server IP
  const params = useLocalSearchParams();
  const userId = params.userId as string | undefined;
  const productId = params.productId as string;
  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(productId as string);
  const [userImage, setUserImage] = useState("");
  const [outputImageState, setOutputImageState] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for selections
  const [outfit, setOutfit] = useState("Casual");
  const [color, setColor] = useState("#FFD700");

  const outfitTypes = ["Casual", "Formal", "Party Wear", "Ethnic"];
  const colorOptions = [
    { name: "Gold", code: "#FFD700" },
    { name: "Silver", code: "#C0C0C0" },
    { name: "Rose Gold", code: "#B76E79" },
  ];

  useEffect(() => {
    const fetchUserImage = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const url = `${API_URL}/getImage/dp_${userId}`;
        console.log("Fetching image from", url);

        const response = await fetch(url);

        if (response.ok) {
          // 1. Get the binary blob from the response
          const blob = await response.blob();

          // 2. Convert Blob to Base64 so React Native <Image> can read it
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setUserImage(base64data);
            setIsImageUploaded(true);
          };
          reader.readAsDataURL(blob);
        } else {
          console.log("No existing image found on server.");
        }
      } catch (error) {
        console.log("Could not fetch user image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserImage();
  }, [userId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      handleUpload(result.assets[0].uri);
    }
  };

  const handleUpload = async (uri: string) => {
    setUploading(true);
    const formData = new FormData();

    // @ts-ignore - Required for React Native FormData file objects
    formData.append("userFace", {
      uri,
      name: "user_face.png",
      type: "image/png",
    });
    formData.append("userId", userId || "GUEST");

    try {
      const response = await fetch(`${API_URL}/uploadDp`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        setUserImage(uri); // Update UI with the local URI immediately
        setIsImageUploaded(true);
        Alert.alert("Success", "Face uploaded successfully!");
      } else {
        Alert.alert("Upload Failed", "Server rejected the image.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not connect to server. Check your connection."
      );
    } finally {
      setUploading(false);
    }
  };

  async function generateJewelleryImage(
    userId: string,
    product: Product,
    outfitType: string,
    outfitColor: string
  ) {
    const formData = new FormData();

    // Note: Ensure 'productId' is available in your scope (e.g., product.id)
    formData.append("userId", userId);
    formData.append("productId", product.id);
    formData.append("outfitType", outfitType || "suit");
    formData.append("outfitColor", outfitColor || "black");

    const type = product.productType.toLowerCase();
    const jewelleryUrls = {
      [type]: product.thumbnailUrls[0],
    };

    formData.append("jewelleryUrls", JSON.stringify(jewelleryUrls));

    try {
      const response = await fetch(`${API_URL}/generateImageByUrl`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Network response was not ok");

      // 1. Get the response as a Blob (Binary Large Object)
      const blob = await response.blob();

      // 2. Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        const base64data = reader.result as string;

        setOutputImageState(base64data);
      };
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  const handleViewTryOn = async () => {
    await generateJewelleryImage(
      userId as string,
      productData as Product,
      outfit,
      color
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Virtual Try-On</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Try On Your Masterpiece</Text>
        <Text style={styles.subtitle}>
          Upload a clear photo of your face to see how the jewelry looks on you.
        </Text>

        {/* Image Upload Area */}
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={pickImage}
          disabled={uploading || loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" size="large" />
          ) : userImage ? (
            <Image source={{ uri: userImage }} style={styles.previewImg} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              {uploading ? (
                <ActivityIndicator color="#000" size="large" />
              ) : (
                <>
                  <Text style={styles.plusIcon}>+</Text>
                  <Text style={styles.uploadText}>Upload your face</Text>
                </>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* Outfit Selection */}
        <Text style={styles.label}>Outfit Type</Text>
        <View style={styles.chipContainer}>
          {outfitTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.chip, outfit === type && styles.chipActive]}
              onPress={() => setOutfit(type)}
            >
              <Text
                style={outfit === type ? styles.textWhite : styles.textBlack}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Color Selection */}
        <Text style={styles.label}>Metal Color</Text>
        <View style={styles.chipContainer}>
          {colorOptions.map((item) => (
            <TouchableOpacity
              key={item.code}
              style={[styles.chip, color === item.code && styles.chipActive]}
              onPress={() => setColor(item.code)}
            >
              <View
                style={[styles.colorCircle, { backgroundColor: item.code }]}
              />
              <Text
                style={
                  color === item.code ? styles.textWhite : styles.textBlack
                }
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {outputImageState ? (
          <>
            <Text style={[styles.label, { marginTop: 30 }]}>
              Your Try-On Result
            </Text>
            <Image
              source={{ uri: outputImageState }}
              style={[styles.previewImg, { height: 300, borderRadius: 16 }]}
            />
          </>
        ) : null}

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.primaryBtn, !isImageUploaded && styles.btnDisabled]}
          onPress={handleViewTryOn}
          disabled={!isImageUploaded}
        >
          <Text style={styles.primaryBtnText}>View Try-On</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  backBtn: { padding: 5 },
  backIcon: { fontSize: 24, fontWeight: "300" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 25, lineHeight: 20 },
  uploadBox: {
    height: 250,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
    marginBottom: 25,
    overflow: "hidden",
  },
  uploadPlaceholder: { alignItems: "center" },
  plusIcon: { fontSize: 40, color: "#aaa" },
  uploadText: { color: "#888", marginTop: 10, fontWeight: "500" },
  previewImg: { width: "100%", height: "100%", resizeMode: "cover" },
  label: { fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 12 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: "#000", borderColor: "#000" },
  colorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  textWhite: { color: "#fff", fontWeight: "500" },
  textBlack: { color: "#000", fontWeight: "500" },
  primaryBtn: {
    backgroundColor: "#000",
    padding: 18,
    borderRadius: 12,
    marginTop: 40,
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "#ccc" },
  primaryBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default TryOnScreen;
