import { COLORS } from "@/constants/theme";
import { useSearchJewelryMutation } from "@/store/apis/textSearchApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../basic components/hapticButton";
import VoiceVideoInterface from "./aiVoice";

interface IMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AiChatComponent({
  initialMessage = "",
  mode,
}: {
  initialMessage: string;
  mode?: "voice" | "video";
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showVoiceVideoInterface, setShowVoiceVideoInterface] = useState(
    !!mode
  );
  const [interfaceMode, setInterfaceMode] = useState<"voice" | "video">(
    mode || "voice"
  );
  const flatListRef = useRef<FlatList>(null);

  // RTK Query Hook
  const [searchJewelry, { isLoading: replyLoading }] =
    useSearchJewelryMutation();

  /**
   * Core Logic: Sends message to Gemini and handles the JSON response
   */
  const handleAiLogic = async (
    userText: string,
    currentHistory: IMessage[]
  ) => {
    try {
      // Get previous AI messages to provide context to Gemini
      const previousBotMessages = currentHistory
        .filter((m) => m.sender === "ai")
        .map((m) => m.text);

      const response = await searchJewelry({
        userMessage: userText,
        previousBotMessages,
      }).unwrap();

      if (response.isReply) {
        // Option A: AI is replying or asking a follow-up question
        const aiResponse: IMessage = {
          id: Math.random().toString(36).substring(2, 11),
          text: response.message,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        // TODO: redirect to product listing page with filters applied based on response.searchQuery
        console.log("Filters found:", response.searchQuery);
        // router.push({
        //   pathname: "/product-list",
        //   query: { filters: JSON.stringify(response.searchQuery) },
        // });
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      // Fallback message
      const errorMsg: IMessage = {
        id: Math.random().toString(36).substring(2, 11),
        text: "Sorry, I'm having trouble connecting. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  // Handle Initial Message mount
  useEffect(() => {
    if (initialMessage.trim()) {
      const startMsg: IMessage = {
        id: Math.random().toString(36).substring(2, 11),
        text: initialMessage.trim(),
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([startMsg]);
      handleAiLogic(initialMessage.trim(), []);
    }
  }, [initialMessage]);

  const onSendPress = () => {
    if (inputText.trim() && !replyLoading) {
      const userText = inputText.trim();
      const userMsg: IMessage = {
        id: Math.random().toString(36).substring(2, 11),
        text: userText,
        sender: "user",
        timestamp: new Date(),
      };

      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      setInputText("");
    }
  };

  const handleVoiceRecord = async () => {
    setInterfaceMode("voice");
    setShowVoiceVideoInterface(true);
  };

  const handleVideoCapture = async () => {
    setInterfaceMode("video");
    setShowVoiceVideoInterface(true);
  };

  const handleTranscript = (text: string) => {
    setShowVoiceVideoInterface(false);
    if (text.trim()) {
      const userMsg: IMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        sender: "user",
        timestamp: new Date(),
      };
      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      handleAiLogic(text.trim(), newHistory);
    }
  };

  const renderMessage = ({ item }: { item: IMessage }) => {
    const isUser = item.sender === "user";
    return (
      <View style={styles.messageContainer}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={14} color="#fff" />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.aiText,
            ]}
          >
            {item.text}
          </Text>
        </View>
        {isUser && <View style={styles.userAvatar} />}
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={styles.messageContainer}>
      <View style={styles.aiAvatar}>
        <Ionicons name="sparkles" size={14} color="#fff" />
      </View>
      <View style={[styles.messageBubble, styles.aiBubble]}>
        <View style={styles.typingIndicator}>
          <View style={[styles.typingDot, { animationDelay: "0ms" }]} />
          <View style={[styles.typingDot, { animationDelay: "150ms" }]} />
          <View style={[styles.typingDot, { animationDelay: "300ms" }]} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <HapticButton onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={COLORS.text || "#000"} />
      </HapticButton>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          // Automatically moves content when keyboard appears
          automaticallyAdjustKeyboardInsets={true}
          // Allows dismissing keyboard by dragging down
          keyboardDismissMode="on-drag"
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() =>
            replyLoading ? renderTypingIndicator() : null
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tell me what you're looking for"
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={!replyLoading}
          />
          <HapticButton
            style={[styles.iconButton, isRecording && styles.recordingButton]}
            onPress={handleVoiceRecord}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isRecording ? "stop-circle" : "mic"}
              size={24}
              color={isRecording ? "#FF0000" : "#666"}
            />
          </HapticButton>
          <HapticButton
            style={styles.iconButton}
            onPress={handleVideoCapture}
            activeOpacity={0.7}
          >
            <Ionicons name="videocam" size={24} color="#666" />
          </HapticButton>

          {inputText.trim().length > 0 && (
            <HapticButton
              style={[styles.sendButton, replyLoading && { opacity: 0.5 }]}
              onPress={onSendPress}
              disabled={replyLoading}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </HapticButton>
          )}
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showVoiceVideoInterface}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowVoiceVideoInterface(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <HapticButton
            style={styles.closeButton}
            onPress={() => setShowVoiceVideoInterface(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color="#000" />
          </HapticButton>
          <VoiceVideoInterface
            mode={interfaceMode}
            onTranscript={handleTranscript}
            onClose={() => setShowVoiceVideoInterface(false)}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  messagesList: { padding: 16, paddingBottom: 20 },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 16,
  },
  userBubble: {
    backgroundColor: "#000",
    marginLeft: "auto",
    borderBottomRightRadius: 4,
  },
  aiBubble: { backgroundColor: "#F0F0F0", borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: "#fff" },
  aiText: { color: "#000" },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#000",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E0E0E0",
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 100,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  recordingButton: {
    backgroundColor: "#FFE0E0",
    borderRadius: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#666",
    opacity: 0.4,
  },
  backButton: { padding: 10 },
});
