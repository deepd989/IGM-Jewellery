import { COLORS } from "@/constants/theme";
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

  // Send initial message when component mounts
  useEffect(() => {
    if (initialMessage.trim()) {
      const newMessage: IMessage = {
        id: Date.now().toString(),
        text: initialMessage.trim(),
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([newMessage]);

      setTimeout(() => {
        const aiResponse: IMessage = {
          id: (Date.now() + 1).toString(),
          text: "Let me help you find what you want.\nAre you looking for something for yourself?",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  }, [initialMessage]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: IMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputText("");

      setTimeout(() => {
        const aiResponse: IMessage = {
          id: (Date.now() + 2).toString(),
          text: "Let me help you find what you want.\nAre you looking for something for yourself?",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
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
      const newMessage: IMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);

      setTimeout(() => {
        const aiResponse: IMessage = {
          id: (Date.now() + 3).toString(),
          text: "Let me help you find what you want.\nAre you looking for something for yourself?",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const renderMessage = ({ item }: { item: IMessage }) => {
    const isUser = item.sender === "user";
    return (
      <View style={styles.messageContainer}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="musical-notes" size={16} color="#fff" />
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <HapticButton onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={COLORS.text || "#053844"} />
      </HapticButton>

      <KeyboardAvoidingView
        style={styles.container}
        // "padding" is better for iOS, "height" or undefined works better for Android
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // This offset accounts for the header/safe area height
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
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tell me what you're looking for"
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
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
              style={styles.sendButton}
              onPress={handleSend}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={20} color="#fff" />
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
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
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
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  aiText: {
    color: "#053844",
  },
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D0D0D0",
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    paddingBottom: 12, // More padding for iOS home indicator
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
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
    backgroundColor: "#053844",
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
    alignItems: "center",
    elevation: 3,
  },
  backButton: {
    padding: 10,
  },
});
