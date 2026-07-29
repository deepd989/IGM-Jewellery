import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";
import { HapticButton } from "../basic components/hapticButton";

interface TryOnSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectVR: () => void;
  onSelectAI: () => void;
}

export const TryOnSelectorModal: React.FC<TryOnSelectorModalProps> = ({
  visible,
  onClose,
  onSelectVR,
  onSelectAI,
}) => {
  // No wrapper around the Modal: it renders in its own native host, so any
  // element around it only takes up space wherever the modal is mounted. A
  // SafeAreaView here left its inset padding behind as a blank gap in the
  // screen below.
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Tappable backdrop */}
        <HapticButton
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        >
          <View />
        </HapticButton>

        <View style={styles.sheet}>
          {/* Close button */}
          <HapticButton style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </HapticButton>

          {/* Face icon with sparkle */}
          <View style={styles.iconWrap}>
            <View style={styles.faceCircle}>
              <Ionicons name="happy-outline" size={32} color={COLORS.text} />
            </View>
            <Ionicons
              name="sparkles"
              size={12}
              color={COLORS.text}
              style={styles.sparkleIcon}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Select your Try-On{"\n"}experience</Text>

          {/* VR Try-On */}
          <HapticButton
            style={[styles.card, styles.cardVR]}
            onPress={() => {
              onClose();
              onSelectVR();
            }}
          >
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>VR Try-On</Text>
              <Text style={styles.cardDesc}>
                Open your camera & visualise how jewellery looks on you in real
                time
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={22} color={COLORS.text} />
          </HapticButton>

          {/* AI Style Try-On */}
          <HapticButton
            style={[styles.card, styles.cardAI]}
            onPress={() => {
              onClose();
              onSelectAI();
            }}
          >
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Ai Style Try-On</Text>
              <Text style={styles.cardDesc}>
                Upload your photo to style & visualise jewellery on you, using
                Ai
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={22} color={COLORS.text} />
          </HapticButton>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingVertical: 30,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sheet: {
    backgroundColor: COLORS.primaryLight, // light teal green background
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 36,
    alignItems: "center",
  },

  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },

  iconWrap: {
    marginBottom: 12,
  },

  faceCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: COLORS.text,
    justifyContent: "center",
    alignItems: "center",
  },

  sparkleIcon: {
    position: "absolute",
    top: -3,
    right: -8,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 24,
  },

  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D0E8ED",
    paddingVertical: 22,
    paddingHorizontal: 22,
    marginBottom: 14,
  },

  cardVR: {
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },

  cardAI: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 0,
  },

  cardText: {
    flex: 1,
    marginRight: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },

  cardDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontWeight: "400",
  },
});
