import { HapticButton } from "@/components/basic components/hapticButton";
import { SORT_OPTIONS } from "@/hooks/useProductListing";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LuxurySortModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedSort: string;
  onSelect: (sort: string) => void;
};

/**
 * The luxury listing's sort sheet. Offers the same orders as the classic sheet
 * — both read SORT_OPTIONS — on a frosted dark surface.
 */
export default function LuxurySortModal({
  visible,
  onClose,
  selectedSort,
  onSelect,
}: LuxurySortModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, 16) + 12 },
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          <BlurView
            intensity={30}
            tint="dark"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.sheetFill} pointerEvents="none" />

          <View style={styles.grabber} />
          <Text style={styles.title}>Sort Designs by</Text>

          {SORT_OPTIONS.map((option) => {
            const isSelected = selectedSort === option;

            return (
              <HapticButton
                key={option}
                style={styles.option}
                activeOpacity={0.7}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextActive,
                  ]}
                >
                  {option}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                )}
              </HapticButton>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(6, 18, 22, 0.55)",
  },
  sheet: {
    overflow: "hidden",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sheetFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16, 34, 38, 0.82)",
  },
  grabber: {
    alignSelf: "center",
    width: 44,
    height: 4,
    borderRadius: 2,
    marginBottom: 18,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.75)",
  },
  optionTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
