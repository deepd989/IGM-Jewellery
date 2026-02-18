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
  const [redirection, setRedirection] = useState(false);
  const [showVoiceVideoInterface, setShowVoiceVideoInterface] = useState(
    !!mode
  );
  const [interfaceMode, setInterfaceMode] = useState<"voice" | "video">(
    mode || "voice"
  );
  const flatListRef = useRef<FlatList>(null);

  const [searchJewelry, { isLoading: replyLoading }] =
    useSearchJewelryMutation();

  /**
   * API Logic: We reverse the messages back to chronological order
   * so Gemini understands the flow of conversation.
   */
  const handleAiLogic = async (currentHistory: IMessage[]) => {
    try {
      if (redirection) return;

      // Gemini needs [Oldest -> Newest].
      // Our state is [Newest -> Oldest], so we .reverse() a copy.
      const chronologicalHistory = [...currentHistory].reverse();
      const lastUserMsg =
        chronologicalHistory[chronologicalHistory.length - 1].text;

      const response = await searchJewelry({
        userMessage: lastUserMsg,
        previousBotMessages: chronologicalHistory.slice(0, -1), // everything except the last message
      }).unwrap();

      console.log("response", response);

      if (response.isReply) {
        const aiResponse: IMessage = {
          id: Math.random().toString(36).substring(2, 11),
          text: response.message,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [aiResponse, ...prev]);
      } else {
        setRedirection(true);
        const redirectMsg: IMessage = {
          id: "redirect",
          text: "Found your style! Redirecting...",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [redirectMsg, ...prev]);

        const query = response.searchQuery || {};

        // Map relationship-based whoFor to gender filter values
        const whoForToGender: Record<string, string> = {
          mother: "Female",
          sister: "Female",
          father: "Male",
          brother: "Male",
          partner: "",     // could be either, skip gender filter
          sibling: "",     // could be either, skip gender filter
          male: "Male",
          female: "Female",
        };
        const mappedGender = query.whoFor
          ? whoForToGender[query.whoFor.toLowerCase()] ?? query.whoFor
          : undefined;

        setTimeout(() => {
          router.push({
            pathname: "/product-list",
            params: {
              occasion: query.occasion,
              gender: mappedGender || undefined,
              productType: query.productType,
              categoryName: query.categoryName,
              subCategoryName: query.subCategoryName,
              minPrice: query.priceRange?.min,
              maxPrice: query.priceRange?.max,
            },
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMsg: IMessage = {
        id: "error",
        text: "Sorry, I'm having trouble connecting.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [errorMsg, ...prev]);
    }
  };

  // Watch for new user messages to trigger AI
  useEffect(() => {
    const lastMessage = messages[0]; // Newest is at index 0
    if (lastMessage?.sender === "user" && !replyLoading && !redirection) {
      handleAiLogic(messages);
    }
  }, [messages]);

  // Initial Message mount
  useEffect(() => {
    if (initialMessage.trim()) {
      const startMsg: IMessage = {
        id: Date.now().toString(),
        text: initialMessage.trim(),
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([startMsg]);
    }
  }, [initialMessage]);

  const onSendPress = () => {
    if (!inputText.trim() || replyLoading) return;

    const userMsg: IMessage = {
      id: Math.random().toString(36).substring(2, 11),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [userMsg, ...prev]);
    setInputText("");
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
      setMessages((prev) => [userMsg, ...prev]);
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
    <View style={[styles.messageContainer, { marginBottom: 20 }]}>
      <View style={styles.aiAvatar}>
        <Ionicons name="sparkles" size={14} color="#fff" />
      </View>
      <View style={[styles.messageBubble, styles.aiBubble]}>
        <View style={styles.typingIndicator}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <HapticButton onPress={() => router.back()} style={styles.backButton}>
        <Ionicons
          name="chevron-back"
          size={24}
          color={COLORS.text || "#053844"}
        />
      </HapticButton>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted={true} // The magic prop
          contentContainerStyle={styles.messagesList}
          automaticallyAdjustKeyboardInsets={true}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          // In an inverted list, Header is at the bottom (above input)
          ListHeaderComponent={() =>
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
            onPress={() => {
              setInterfaceMode("voice");
              setShowVoiceVideoInterface(true);
            }}
          >
            <Ionicons
              name="mic"
              size={24}
              color={isRecording ? "#FF0000" : "#666"}
            />
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

      <Modal visible={showVoiceVideoInterface} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <HapticButton
            style={styles.closeButton}
            onPress={() => setShowVoiceVideoInterface(false)}
          >
            <Ionicons name="close" size={28} color="#053844" />
          </HapticButton>
          {/* Voice interface logic here */}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  messagesList: { padding: 16 },
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
    backgroundColor: "#053844",
    marginLeft: "auto",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#F5F5F5",
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: "#fff" },
  aiText: { color: "#053844" },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#053844",
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
    backgroundColor: "#fff",
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
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#053844",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  backButton: { padding: 10 },
  typingIndicator: { flexDirection: "row", gap: 4, paddingVertical: 4 },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#666",
    opacity: 0.4,
  },
  modalContainer: { flex: 1, backgroundColor: "#f5f5f5" },
  closeButton: { position: "absolute", top: 50, right: 20, zIndex: 10 },
  recordingButton: { backgroundColor: "#FFE0E0", borderRadius: 20 },
});
