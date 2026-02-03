import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown"; // New Import
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth/authContext";
import { COLORS } from "../constants/theme";
import { generateJewelleryImage } from "../helpers/generateJewelleryImage";
import { Product } from "../interfaces/product.interface";
import { useGetProductsQuery } from "../store/apis/product";

const TryOnScreen = () => {
  const { apiUrl, imageGlobal, setImageGlobalUsage } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string | undefined;

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery({});

  const [useImageGloballyFlag, setUseImageGloballyFlag] = useState(imageGlobal);
  const toggleSwitch = () =>
    setUseImageGloballyFlag((previousState) => {
      setImageGlobalUsage(!previousState);
      return !previousState;
    });

  const [userImage, setUserImage] = useState("");
  const [outputImageState, setOutputImageState] = useState("");
  const [showOutputImage, setShowOutputImage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [outputLoading, setOutputLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  // Updated state for selections to work with dropdown
  const [outfit, setOutfit] = useState("Casual wear");
  const [color, setColor] = useState("#000000");

  // Dropdown formatted data
  const outfitTypes = [
    { label: "Casual wear", value: "Casual wear" },
    { label: "Formal", value: "Formal" },
    { label: "Party Wear", value: "Party Wear" },
    { label: "Ethnic", value: "Ethnic" },
    { label: "Rajasthani Wear", value: "Rajasthani Wear" },
    { label: "Punjabi Suit", value: "Punjabi Suit" },
    { label: "Saree", value: "Saree" },
  ];

  const colorOptions = [
    { label: "Black", value: "#000000" },
    { label: "White", value: "#FFFFFF" },
    { label: "Grey", value: "#808080" },
    { label: "Blue", value: "#0000FF" },
    { label: "Navy Blue", value: "#000080" },
    { label: "Brown", value: "#8B4513" },
    { label: "Beige", value: "#F5F5DC" },
    { label: "Green", value: "#008000" },
    { label: "Red", value: "#FF0000" },
  ];

  useEffect(() => {
    const fetchUserImage = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const url = `${apiUrl}/getImage/dp_${userId}`;
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setUserImage(base64data);
            setIsImageUploaded(true);
          };
          reader.readAsDataURL(blob);
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
    // @ts-ignore
    formData.append("userFace", {
      uri,
      name: "user_face.png",
      type: "image/png",
    });
    formData.append("userId", userId || "GUEST");

    try {
      const response = await fetch(`${apiUrl}/uploadDp`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.ok) {
        setUserImage(uri);
        setIsImageUploaded(true);
        Alert.alert("Success", "Face uploaded successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to server.");
    } finally {
      setUploading(false);
    }
  };

  const handleViewTryOn = async () => {
    setShowOutputImage(true);
    if (!selectedProduct || !userId) {
      Alert.alert(
        "Selection Required",
        "Please select a product and upload a user photo."
      );
      return;
    }
    setOutputLoading(true);
    await generateJewelleryImage(
      apiUrl,
      userId,
      selectedProduct,
      outfit,
      color,
      setOutputImageState
    );
    setOutputLoading(false);
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const isSelected = selectedProduct?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.productCard, isSelected && styles.productCardSelected]}
        onPress={() => handleProductSelect(item)}
      >
        <Image
          source={{ uri: item.thumbnailUrls[0] }}
          style={styles.productImage}
        />
        <Text numberOfLines={1} style={styles.productName}>
          {item.name}
        </Text>
        {isSelected && (
          <View style={styles.checkBadge}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.primary || "#000"}
            />
          </View>
        )}
      </TouchableOpacity>
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
          Upload a clear photo to see the results.
        </Text>

        <TouchableOpacity
          style={styles.uploadBox}
          onPress={pickImage}
          disabled={uploading || loading}
        >
          {!showOutputImage &&
            (loading ? (
              <ActivityIndicator color="#000" size="large" />
            ) : userImage ? (
              <Image source={{ uri: userImage }} style={styles.previewImg} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.plusIcon}>+</Text>
                <Text style={styles.uploadText}>Upload your face</Text>
              </View>
            ))}

          {showOutputImage &&
            (outputLoading ? (
              <View>
                <ActivityIndicator color="#000" size="large" />
                <Text>Generating your look...</Text>
              </View>
            ) : (
              <Image
                source={{ uri: outputImageState }}
                style={[styles.previewImg]}
              />
            ))}
        </TouchableOpacity>

        <Text style={styles.label}>Select Jewelry</Text>
        <FlatList
          horizontal
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        />

        {/* Outfit Dropdown */}
        <Text style={styles.label}>Outfit Type</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={outfitTypes}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Outfit"
          value={outfit}
          onChange={(item) => setOutfit(item.value)}
        />

        {/* Color Dropdown */}
        <Text style={styles.label}>Metal Color</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={colorOptions}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Color"
          value={color}
          onChange={(item) => setColor(item.value)}
          renderLeftIcon={() => (
            <View
              style={[
                styles.colorCircle,
                { backgroundColor: color, marginRight: 10 },
              ]}
            />
          )}
        />
        <View style={styles.toggleContainer}>
          <View style={styles.toggleTextContent}>
            <Text style={styles.toggleLabel}>
              Use images for product preview
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#D1D1D1", true: COLORS.primary || "#000" }}
            thumbColor={useImageGloballyFlag ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#D1D1D1"
            onValueChange={toggleSwitch}
            value={useImageGloballyFlag}
          />
        </View>
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
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 25 },
  uploadBox: {
    height: 350,
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
  uploadText: { color: "#888", marginTop: 10 },
  previewImg: { width: "100%", height: "100%", resizeMode: "cover" },
  label: { fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 12 },

  // Dropdown Styles
  dropdown: {
    height: 55,
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fafafa",
  },
  placeholderStyle: { fontSize: 16, color: "#888" },
  selectedTextStyle: { fontSize: 16, color: "#000" },

  colorCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  primaryBtn: {
    backgroundColor: "#000",
    padding: 18,
    borderRadius: 12,
    marginTop: 40,
    alignItems: "center",
  },
  carouselContainer: {
    paddingVertical: 10,
    gap: 15, // Note: gap works in recent RN versions, otherwise use marginRight on cards
  },
  productCard: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    position: "relative",
    marginRight: 12,
  },
  productCardSelected: {
    borderColor: "#000",
    borderWidth: 2,
    backgroundColor: "#f0f0f0",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "contain",
  },
  productName: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  checkBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  btnDisabled: { backgroundColor: "#ccc" },
  primaryBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginTop: 25,
  },
  toggleTextContent: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  toggleSubLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});

export default TryOnScreen;
