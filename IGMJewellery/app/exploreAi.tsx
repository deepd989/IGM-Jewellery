import BottomNavBar from "@/components/bottomNavBar";
import { COLORS, SPACING } from "@/constants/theme";
import { clearChatHistory, loadChatHistory } from "@/store/apis/chatStorage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MessageSquare, Mic, Send } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth/authContext";
import { HapticButton } from "../components/basic components/hapticButton";
import AiChatComponent from "../components/exploreAi/aiChat";

export default function ExploreAi() {
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

  // Check for persisted chat history on mount
  useEffect(() => {
    (async () => {
      const history = await loadChatHistory(userId);
      setHasHistory(history.length > 0);
    })();
  }, [userId]);

  const suggestions = [
    "Our New collection",
    "Our New Offers",
    "Our New collection",
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

  // Show chat component if user sent a message
  if (showChat) {
    return <AiChatComponent initialMessage={userMessage} userId={userId} />;
  }

  if (searchQuery && searchQuery != "") {
    return <AiChatComponent initialMessage={searchQuery} userId={userId} />;
  }

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
        {/* <Text style={styles.greetingLight}>What sparkle</Text> */}
        <Text style={styles.greetingLight}>
          Tell us what you are looking for today?
        </Text>

        <ScrollView
          style={styles.suggestionsContainer}
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

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tell me what are you looking for |"
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <HapticButton
            style={styles.iconButton}
            onPress={() => {
              setShowVoiceVideoInterface("voice");
            }}
          >
            <Mic size={20} color="#333" />
          </HapticButton>
          {/* <HapticButton
            style={styles.iconButton}
            onPress={() => {
              setShowVoiceVideoInterface("video");
            }}
          >
            <AudioLines />
          </HapticButton> */}
          {inputText.trim().length > 0 && (
            <HapticButton style={styles.sendButton} onPress={handleSend}>
              <Send size={18} color="#fff" />
            </HapticButton>
          )}
        </View>

        {/* Continue / Clear Chat */}
        {hasHistory && (
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
      <BottomNavBar activeTab="AiDiscover"></BottomNavBar>
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
    paddingVertical: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: "#333",
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
    marginTop: 30,
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5, // Negative margin to offset chip margins
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 5,
  },
  suggestionText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "400",
  },
  historyActions: {
    marginBottom: 16,
    alignItems: "center",
    gap: 10,
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
