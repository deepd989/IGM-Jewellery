import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { HapticButton } from "./basic components/hapticButton";

const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = 16;
const IMAGE_WIDTH = width - HORIZONTAL_PADDING * 2;
// Images are 3125x1042 → aspect ratio ~3:1
const IMAGE_HEIGHT = IMAGE_WIDTH / 3;

const SwipeAndShopComponent = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Swipe & Shop Button */}
      <HapticButton
        activeOpacity={0.9}
        onPress={() => router.navigate("/immersiveProductList")}
        style={styles.buttonWrapper}
      >
        <Image
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Feature%20Buttons%2FSwipe%26Shop_5.webp?alt=media&token=c0ca8e88-3abe-4c21-96b2-5054dd6e4b50",
          }}
          style={styles.buttonImage}
          contentFit="cover"
          transition={200}
        />
      </HapticButton>

      {/* Become Model Button */}
      <HapticButton
        activeOpacity={0.9}
        onPress={() => router.navigate("/tryOn")}
        style={styles.buttonWrapper}
      >
        <Image
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/igmjewellery.firebasestorage.app/o/Feature%20Buttons%2FBecome_Model_4.webp?alt=media&token=5e3fddfc-e39b-4aac-bf2d-c328a80d6fb1",
          }}
          style={styles.buttonImage}
          contentFit="cover"
          transition={200}
        />
      </HapticButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: HORIZONTAL_PADDING,
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 12,
  },
  buttonWrapper: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default SwipeAndShopComponent;
