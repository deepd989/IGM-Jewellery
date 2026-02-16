import { ArrowRight } from "lucide-react-native"; // Or use Expo's MaterialCommunityIcons
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";

const ViewAllButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>View All</Text>

      <View style={styles.iconCircle}>
        <ArrowRight size={16} color="#00222E" strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 8,
    borderRadius: 50,
    alignSelf: "center",
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "500",
    marginRight: 6,
  },
  iconCircle: {
    backgroundColor: "#FFFFFF",
    width: 24,
    height: 24,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ViewAllButton;
