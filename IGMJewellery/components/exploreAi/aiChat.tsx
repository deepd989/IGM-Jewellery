import { COLORS } from "@/constants/theme";
import {
  loadChatHistory,
  saveChatHistory,
  StoredMessage,
} from "@/store/apis/chatStorage";
import { useSearchJewelryMutation } from "@/store/apis/textSearchApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  searchParams?: {
    occasion?: string;
    gender?: string;
    productType?: string;
    categoryName?: string;
    subCategoryName?: string;
    minPrice?: string;
    maxPrice?: string;
    metal?: string;
    gemstone?: string;
    brand?: string;
    searchQuery?: string;
  };
}

/** Convert runtime IMessage → serialisable StoredMessage */
function toStored(msg: IMessage): StoredMessage {
  return {
    id: msg.id,
    text: msg.text,
    sender: msg.sender,
    timestamp:
      msg.timestamp instanceof Date
        ? msg.timestamp.toISOString()
        : String(msg.timestamp),
    searchParams: msg.searchParams,
  };
}

/** Convert stored JSON → runtime IMessage */
function fromStored(msg: StoredMessage): IMessage {
  return {
    ...msg,
    timestamp: new Date(msg.timestamp),
  };
}

export default function AiChatComponent({
  initialMessage = "",
  mode,
  userId = null,
}: {
  initialMessage: string;
  mode?: "voice" | "video";
  userId?: string | null;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [redirection, setRedirection] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [showVoiceVideoInterface, setShowVoiceVideoInterface] = useState(
    !!mode
  );
  const [interfaceMode, setInterfaceMode] = useState<"voice" | "video">(
    mode || "voice"
  );
  const flatListRef = useRef<FlatList>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        const query = response.searchQuery || {};

        // Map relationship-based whoFor to gender filter values
        const whoForToGender: Record<string, string> = {
          mother: "Female",
          sister: "Female",
          father: "Male",
          brother: "Male",
          partner: "",
          sibling: "",
          male: "Male",
          female: "Female",
        };
        const mappedGender = query.whoFor
          ? whoForToGender[query.whoFor.toLowerCase()] ?? query.whoFor
          : undefined;

        const searchParams = {
          occasion: query.occasion,
          gender: mappedGender || undefined,
          productType: query.productType,
          categoryName: query.categoryName,
          subCategoryName: query.subCategoryName,
          minPrice: query.priceRange?.min?.toString(),
          maxPrice: query.priceRange?.max?.toString(),
          metal: query.metalType || query.metal,
          gemstone:
            query.gemstone ||
            (query.studded === true
              ? "Natural Diamond"
              : query.studded === false
              ? undefined
              : undefined),
          brand: query.brand,
          searchQuery: query.name || query.searchQuery,
        };

        const redirectMsg: IMessage = {
          id: Math.random().toString(36).substring(2, 11),
          text: "Found your style! Redirecting...",
          sender: "ai",
          timestamp: new Date(),
          searchParams,
        };
        setMessages((prev) => [redirectMsg, ...prev]);

        setTimeout(() => {
          router.push({
            pathname: "/product-list",
            params: searchParams as Record<string, string>,
          });
        }, 5000);
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
    if (!historyLoaded) return; // skip until history is loaded
    const lastMessage = messages[0]; // Newest is at index 0
    if (lastMessage?.sender === "user" && !replyLoading && !redirection) {
      handleAiLogic(messages);
    }
  }, [messages, historyLoaded]);

  // Persist messages to storage (debounced 500ms)
  useEffect(() => {
    if (!historyLoaded) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveChatHistory(userId, messages.map(toStored));
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [messages, historyLoaded, userId]);

  // Load persisted history + seed initial message on mount
  useEffect(() => {
    (async () => {
      // Reset redirection so the user can search again in continued chats
      setRedirection(false);

      const stored = await loadChatHistory(userId);
      const history = stored.map(fromStored);

      if (initialMessage.trim()) {
        const startMsg: IMessage = {
          id: Date.now().toString(),
          text: initialMessage.trim(),
          sender: "user",
          timestamp: new Date(),
        };
        // Prepend new message to existing history (newest-first order)
        setMessages([startMsg, ...history]);
      } else {
        setMessages(history);
      }
      setHistoryLoaded(true);
    })();
  }, []);

  const onSendPress = () => {
    if (!inputText.trim() || replyLoading) return;
    setRedirection(false); // allow new searches after a previous redirect

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
    setRedirection(false); // allow new searches after a previous redirect
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

  /** Build a short label from searchParams, e.g. "Necklace • Female • Gold • ₹5K–₹20K" */
  const buildFilterLabel = useCallback(
    (params: NonNullable<IMessage["searchParams"]>) => {
      const parts: string[] = [];
      if (params.searchQuery) parts.push(`"${params.searchQuery}"`);
      if (params.productType) parts.push(params.productType);
      if (params.categoryName) parts.push(params.categoryName);
      if (params.gender) parts.push(params.gender);
      if (params.occasion) parts.push(params.occasion);
      if (params.metal) parts.push(params.metal);
      if (params.gemstone) parts.push(params.gemstone);
      if (params.brand) parts.push(params.brand);
      if (params.minPrice || params.maxPrice) {
        const fmt = (v?: string) =>
          v
            ? Number(v) >= 1000
              ? `₹${(Number(v) / 1000).toFixed(0)}K`
              : `₹${v}`
            : "";
        parts.push(
          `${fmt(params.minPrice)}–${fmt(params.maxPrice)}`
            .replace(/^–/, "")
            .replace(/–$/, "")
        );
      }
      return parts.join(" • ") || "View Results";
    },
    []
  );

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
          {!isUser && item.searchParams && (
            <HapticButton
              style={styles.visitSearchButton}
              onPress={() =>
                router.push({
                  pathname: "/product-list",
                  params: item.searchParams as Record<string, string>,
                })
              }
            >
              <Ionicons
                name="search"
                size={14}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.visitSearchText}>
                {buildFilterLabel(item.searchParams)}
              </Text>
            </HapticButton>
          )}
        </View>
        {isUser && (
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={14} color="#fff" />
          </View>
        )}
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
    backgroundColor: "black",
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
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
  visitSearchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#053844",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  visitSearchText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});
