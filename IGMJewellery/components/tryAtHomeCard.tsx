import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EarringIcon from "./ui/earingsComponentSvg";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function TryAtHomeCard() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Try at home</Text>
      <Text style={styles.subtitle}>
        Shopping with comfort & convenience
      </Text>

      {/* Card */}
      <View style={styles.card}>
        {/* Top content */}
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>
              Upto 5 products{"\n"}at your doorstep
            </Text>
            <Text style={styles.cardSubtitle}>
              At your time and convinience
            </Text>
          </View>

          <Pressable style={styles.arrowButton} onPress={() => {router.push({pathname:'/underDev',params:{featureName:'Try at Home Feature'}});}}>
            <Ionicons name="arrow-forward" size={22} color="#053844" />
          </Pressable>
        </View>

        {/* Category icons */}
        {/* <View style={styles.iconRow}>
          {[
            "ellipse-outline",
            "diamond-outline",
            "pricetag-outline",
            "cube-outline",
            "gift-outline",
          ].map((icon, index) => (
            <React.Fragment key={icon}>
              <Ionicons name={icon as any} size={22} color="#cfcfcf" />
              {index < 4 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View> */}

         <View style={styles.iconRow}>
                    <MaterialCommunityIcons name="necklace" size={32} color="#053844" />
                    <MaterialCommunityIcons name="ring" size={32} color="#053844" />
                    <MaterialCommunityIcons name="diamond-stone" size={32} color="#053844" />
                    <MaterialCommunityIcons name="gold" size={32} color="#053844" />
                    <MaterialCommunityIcons name="gift" size={32} color="#053844" />
                    <EarringIcon width={40} height={40} />
                  </View>

        {/* Video placeholder */}
        <View style={styles.videoBox}>
          <Text style={styles.videoText}>video demo</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#9e9e9e",
    textAlign: "center",
  },
  card: {
    marginTop: 24,
    backgroundColor: "#fafafa",
    borderRadius: 32,
    padding: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 26,
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  iconRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 12,
  },
  videoBox: {
    marginTop: 20,
    height: width * 0.5,
    backgroundColor: "#ededed",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  videoText: {
    fontSize: 16,
    color: "#9e9e9e",
  },
  marker: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#053844",
    alignItems: "center",
    justifyContent: "center",
  },
  markerText: {
    color: "#3b82f6",
    fontWeight: "700",
  },
});
