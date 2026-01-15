import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

export default function EventCard() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>We have put together looks for you!</Text>
      <Text style={styles.caption}>
        Here’s what we have based on your search and taste
      </Text>

      {/* Image Section */}
      <ImageBackground
        source={{
          uri: "https://drive.google.com/uc?export=download&id=1dQk3phA6_k6IyxSxfXP9lWpZuIBtelAT", 
        }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        {/* Overlay Button */}
        <TouchableOpacity style={styles.button} onPress={() => {
          router.push({pathname:'/product-list'});
        }}>
          <Text style={styles.buttonText}>Shop products</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
  
    header: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      color: "#111",
    },
  
    caption: {
      fontSize: 14,
      color: "#777",
      textAlign: "center",
      marginTop: 6,
      marginBottom: 16,
    },
  
    image: {
      width: "100%",
      height: 420,
      justifyContent: "flex-end",
      alignItems: "center",
      paddingBottom: 20,
    },
  
    imageRadius: {
      borderRadius: 16,
    },
  
    button: {
      backgroundColor: "#fff",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      elevation: 4, // Android shadow
      shadowColor: "#000", // iOS shadow
      shadowOpacity: 0.15,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },
  
    buttonText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#111",
    },
  });
  
