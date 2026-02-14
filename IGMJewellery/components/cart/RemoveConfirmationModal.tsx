import { Product } from "@/interfaces/product.interface";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { HapticButton } from "../basic components/hapticButton";

interface RemoveConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product | null;
  onRemove: () => void;
  onWishlist: () => void;
}

export const RemoveConfirmationModal: React.FC<
  RemoveConfirmationModalProps
> = ({ visible, onClose, product, onRemove, onWishlist }) => {
  if (!product) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <HapticButton style={styles.closeHandle} onPress={onClose}>
            <View style={styles.closeCircle}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </View>
          </HapticButton>

          <View style={styles.content}>
            <View style={styles.productRow}>
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: product.thumbnailUrls[0] }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.title}>Move Design From Bag</Text>
                <Text style={styles.subtitle}>
                  Are you sure you want to move this design from your bag?
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <HapticButton style={styles.removeBtn} onPress={onRemove}>
                <Text style={styles.removeText}>Remove</Text>
              </HapticButton>
              <HapticButton style={styles.wishlistBtn} onPress={onWishlist}>
                <Text style={styles.wishlistText}>Move to Wishlist</Text>
              </HapticButton>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  closeHandle: {
    alignSelf: "center",
    marginTop: -20,
    marginBottom: 20,
  },
  closeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  content: {
    paddingHorizontal: SPACING.m,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  imageBox: {
    width: 80,
    height: 80,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    marginRight: SPACING.m,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  removeBtn: {
    flex: 1,
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  wishlistBtn: {
    flex: 1,
    height: 52,
    backgroundColor: "#000000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  wishlistText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
