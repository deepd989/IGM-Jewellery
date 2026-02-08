import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../auth/authContext";

export default function HealthCheckModal({
  setModalVisible,
}: {
  setModalVisible: (visible: boolean) => void;
}) {
  const [url, setUrl] = useState("");

  const [status, setStatus] = useState(""); // 'loading', 'connected', or 'error'
  const { apiUrl, setApiUrl } = useAuth();
  const checkHealth = async () => {
    if (!url) return;

    setStatus("loading");
    try {
      // Clean the URL and append /health
      const formattedUrl = url.endsWith("/") ? `${url}health` : `${url}/health`;

      const response = await fetch(formattedUrl);

      if (response.ok) {
        setApiUrl(url);
        setStatus("connected");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Server URL</Text>

            <TextInput
              style={styles.input}
              placeholder="https://api.example.com"
              value={url}
              onChangeText={(text) => {
                setUrl(text);
                setStatus(null); // Reset status when typing
              }}
              autoCapitalize="none"
              keyboardType="url"
            />

            <TouchableOpacity style={styles.goButton} onPress={checkHealth}>
              {status === "loading" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textStyle}>Go</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.goButton,
                { backgroundColor: "#ccc", marginTop: 10 },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#333" }}>Close</Text>
            </TouchableOpacity>

            {status === "connected" && (
              <Text style={styles.connectedText}>● Connected</Text>
            )}

            {status === "error" && (
              <Text style={styles.errorText}>Connection Failed</Text>
            )}
            <Text>Your connection url is: {apiUrl} </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Dim background
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  openButton: { backgroundColor: "#2196F3", padding: 15, borderRadius: 10 },
  goButton: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  textStyle: { color: "white", fontWeight: "bold" },
  modalText: { marginBottom: 15, textAlign: "center", fontWeight: "bold" },
  connectedText: { color: "#28a745", marginTop: 15, fontWeight: "bold" },
  errorText: { color: "#dc3545", marginTop: 15 },
});
