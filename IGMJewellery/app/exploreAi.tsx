import BottomNavBar from "@/components/bottomNavBar";
import { COLORS, SPACING } from "@/constants/theme";
import { clearChatHistory, loadChatHistory } from "@/store/apis/chatStorage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MessageSquare, Mic, Send } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth/authContext";
import { HapticButton } from "../components/basic components/hapticButton";
import AiChatComponent from "../components/exploreAi/aiChat";
import { useLuxury } from "../context/luxuryContext";
import LuxuryExploreAi from "./luxury/exploreAi";

/**
 * Both storefronts share this route, so every existing link to the assistant
 * lands on the presentation the shopper is currently browsing in. The luxury
 * screen also keeps its own route for direct links.
 */
export default function ExploreAi() {
  const { isLuxury } = useLuxury();

  return isLuxury ? <LuxuryExploreAi /> : <ClassicExploreAi />;
}

function ClassicExploreAi() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { userId } = useAuth();
  const searchQuery = (params.value as string) || "";

  const [showVoiceVideoInterface, setShowVoiceVideoInterface] = useState(
    params.mode
  );
  const [inputText, setInputText] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [hasHistory, setHasHistory] = useState(false);

  // State to track keyboard visibility to hide BottomNavBar
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Check for persisted chat history
    (async () => {
      const history = await loadChatHistory(userId);
      setHasHistory(history.length > 0);
    })();

    // Keyboard listeners to toggle BottomNavBar visibility
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [userId]);

  const suggestions = [
    "Our New collection",
    "Our New Offers",
    "Gifting Options",
    "I'm not sure what to buy",
    "Latest TBZ Collection",
    "Search for Product",
    "Product Refund",
    "Delivery timeline",
    "Talk to an Expert",
    "More",
  ];

  const handleSend = () => {
    if (inputText.trim()) {
      setUserMessage(inputText.trim());
      setShowChat(true);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setUserMessage(suggestion);
    setShowChat(true);
  };

  if (showChat)
    return <AiChatComponent initialMessage={userMessage} userId={userId} />;
  if (searchQuery && searchQuery !== "")
    return <AiChatComponent initialMessage={searchQuery} userId={userId} />;
  if (showVoiceVideoInterface) {
    return (
      <AiChatComponent
        initialMessage={""}
        mode={showVoiceVideoInterface as "voice" | "video"}
        userId={userId}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        // keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Adjust if status bar causes offset
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <HapticButton onPress={() => router.back()} style={styles.iconBtn}>
              <Ionicons name="chevron-back" size={24} color={COLORS.text} />
            </HapticButton>

            <View style={styles.container}>
              {/* Sparkle Icon */}
              <View style={styles.iconContainer}>
                <Image
                  source={require("../assets/images/elanziaNav.png")}
                  style={styles.aiImage}
                />
              </View>

              {/* Greeting Text */}
              <Text style={styles.greetingBold}>Hey there!</Text>
              <Text style={styles.greetingLight}>
                Tell us what you are looking for today?
              </Text>

              {/* Suggestions Grid */}
              <ScrollView
                style={styles.suggestionsContainer}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.suggestionsGrid}>
                  {suggestions.map((suggestion, index) => (
                    <HapticButton
                      key={index}
                      style={styles.suggestionChip}
                      onPress={() => handleSuggestionPress(suggestion)}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </HapticButton>
                  ))}
                </View>
              </ScrollView>

              {/* Input Field Section */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Tell me what are you looking for |"
                  placeholderTextColor="#999"
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={handleSend}
                  returnKeyType="send"
                  multiline={false}
                />
                <HapticButton
                  style={styles.iconButton}
                  onPress={() => setShowVoiceVideoInterface("voice")}
                >
                  <Mic size={20} color="#333" />
                </HapticButton>
                {inputText.trim().length > 0 && (
                  <HapticButton style={styles.sendButton} onPress={handleSend}>
                    <Send size={18} color="#fff" />
                  </HapticButton>
                )}
              </View>

              {/* History Actions */}
              {hasHistory && !isKeyboardVisible && (
                <View style={styles.historyActions}>
                  <HapticButton
                    style={styles.continueChatButton}
                    onPress={() => {
                      setUserMessage("");
                      setShowChat(true);
                    }}
                  >
                    <MessageSquare
                      size={16}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.continueChatText}>
                      Continue Previous Chat
                    </Text>
                  </HapticButton>
                  <HapticButton
                    style={styles.clearChatButton}
                    onPress={async () => {
                      await clearChatHistory(userId);
                      setHasHistory(false);
                    }}
                  >
                    <Text style={styles.clearChatText}>Clear Chat</Text>
                  </HapticButton>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Hide Bottom Nav when typing to maximize space */}
      {!isKeyboardVisible && <BottomNavBar activeTab="AiDiscover" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  iconContainer: {
    alignSelf: "center",
    marginBottom: 20,
    height: 80,
    borderRadius: 40,
    width: 80,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  aiImage: {
    height: 80,
    width: 80,
  },
  iconBtn: {
    marginLeft: SPACING.l,
    marginTop: SPACING.m,
  },
  greetingBold: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  greetingLight: {
    fontSize: 16,
    fontWeight: "300",
    color: "#666",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 5, // Taller for iOS touch area
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    minHeight: 40,
  },
  iconButton: {
    marginLeft: 12,
    padding: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#053844",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  suggestionsContainer: {
    flex: 1,
    marginTop: 20,
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    margin: 5,
  },
  suggestionText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "400",
  },
  historyActions: {
    marginBottom: 10,
    alignItems: "center",
    gap: 8,
  },
  continueChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#053844",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    width: "100%",
  },
  continueChatText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  clearChatButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  clearChatText: {
    color: "#999",
    fontSize: 12,
    fontWeight: "400",
  },
});
