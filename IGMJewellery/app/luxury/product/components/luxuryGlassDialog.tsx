import { HapticButton } from "@/components/basic components/hapticButton";
import { Modal, StyleSheet, View } from "react-native";
import LuxuryGlassCard from "./luxuryGlassCard";

type LuxuryGlassDialogProps = {
  visible: boolean;
  title: string;
  ctaLabel?: string;
  /** Fired by the pill and by a tap on the backdrop. */
  onClose: () => void;
};

/**
 * The product screen's message popup: the same frosted card the size-guide
 * banner uses, centred over a dimmed page.
 */
export default function LuxuryGlassDialog({
  visible,
  title,
  ctaLabel = "That's Exciting",
  onClose,
}: LuxuryGlassDialogProps) {
  // No wrapper around the Modal: it renders in its own native host, so any
  // element around it only takes up space where the modal is mounted.
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Tappable backdrop */}
        <HapticButton
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        >
          <View />
        </HapticButton>

        <LuxuryGlassCard
          title={title}
          ctaLabel={ctaLabel}
          onPress={onClose}
          style={styles.card}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(6, 18, 22, 0.55)",
  },
  card: {
    alignSelf: "stretch",
  },
});
