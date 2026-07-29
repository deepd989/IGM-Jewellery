import { HapticButton } from "@/components/basic components/hapticButton";
import AiChatComponent from "@/components/exploreAi/aiChat";
import { LUXURY_COLORS, LUXURY_SPACING } from "@/constants/theme";
import { clearChatHistory, loadChatHistory } from "@/store/apis/chatStorage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../auth/authContext";
import LuxuryNavBar, {
  LUXURY_NAV_BAR_HEIGHT,
} from "./components/luxuryNavBar";
import LuxuryScreenHeader from "./components/luxuryScreenHeader";

/** The openers the assistant offers before the shopper types anything. */
const SUGGESTIONS = [
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

/**
 * The luxury storefront's way into Elanzia Ai. Same chat handoff, history and
 * voice mode as app/exploreAi.tsx — only the surface differs, so the two can
 * never disagree about what a suggestion does.
 */
export default function LuxuryExploreAi() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const searchQuery = (params.value as string) || "";

  const [showVoiceVideoInterface, setShowVoiceVideoInterface] = useState(
    params.mode
  );
  const [inputText, setInputText] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [hasHistory, setHasHistory] = useState(false);
  // The nav bar gives up its space to the keyboard.
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const history = await loadChatHistory(userId);
      setHasHistory(history.length > 0);
    })();

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
    return (
      <AiChatComponent initialMessage={userMessage} userId={userId} isLuxury />
    );
  if (searchQuery && searchQuery !== "")
    return (
      <AiChatComponent
        initialMessage={searchQuery}
        userId={userId}
        isLuxury
      />
    );
  if (showVoiceVideoInterface) {
    return (
      <AiChatComponent
        initialMessage={""}
        mode={showVoiceVideoInterface as "voice" | "video"}
        userId={userId}
        isLuxury
      />
    );
  }

  return (
    <View style={styles.screen}>
      <LuxuryScreenHeader title="Elanzia Ai" showBack variant="glass" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={[
              styles.container,
              // Clears the floating nav bar, which applies its own bottom
              // inset. With the keyboard up the bar is gone, so is the gap.
              {
                paddingBottom: isKeyboardVisible
                  ? 16
                  : LUXURY_NAV_BAR_HEIGHT + Math.max(insets.bottom, 12) + 8,
              },
            ]}
          >
            <View style={styles.mark}>
              <Image
                source={require("../../assets/images/elanziaNav.png")}
                style={styles.markImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.greeting}>Hey there!</Text>
            <Text style={styles.greetingSub}>
              Tell us what you are looking for today?
            </Text>

            <ScrollView
              style={styles.suggestions}
              contentContainerStyle={styles.suggestionsContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {SUGGESTIONS.map((suggestion) => (
                <HapticButton
                  key={suggestion}
                  style={styles.chip}
                  activeOpacity={0.8}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text style={styles.chipText}>{suggestion}</Text>
                </HapticButton>
              ))}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Tell me what are you looking for"
                placeholderTextColor={LUXURY_COLORS.textMuted}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />

              <HapticButton
                style={styles.micButton}
                activeOpacity={0.7}
                onPress={() => setShowVoiceVideoInterface("voice")}
              >
                <Mic size={20} color={LUXURY_COLORS.text} />
              </HapticButton>

              {inputText.trim().length > 0 && (
                <HapticButton
                  style={styles.sendWrapper}
                  activeOpacity={0.85}
                  onPress={handleSend}
                >
                  <LinearGradient
                    colors={LUXURY_COLORS.gradient}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.sendButton}
                  >
                    <Send size={18} color="#FFFFFF" />
                  </LinearGradient>
                </HapticButton>
              )}
            </View>

            {hasHistory && !isKeyboardVisible && (
              <View style={styles.historyActions}>
                <HapticButton
                  style={styles.continueWrapper}
                  activeOpacity={0.85}
                  onPress={() => {
                    setUserMessage("");
                    setShowChat(true);
                  }}
                >
                  <LinearGradient
                    colors={LUXURY_COLORS.gradient}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.continueButton}
                  >
                    <MessageSquare size={16} color="#FFFFFF" />
                    <Text style={styles.continueText}>
                      Continue Previous Chat
                    </Text>
                  </LinearGradient>
                </HapticButton>

                <HapticButton
                  style={styles.clearButton}
                  activeOpacity={0.7}
                  onPress={async () => {
                    await clearChatHistory(userId);
                    setHasHistory(false);
                  }}
                >
                  <Text style={styles.clearText}>Clear Chat</Text>
                </HapticButton>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {!isKeyboardVisible && <LuxuryNavBar activeKey="ai" />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: LUXURY_COLORS.primary,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // ── Greeting ──
  mark: {
    alignSelf: "center",
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LUXURY_COLORS.surface,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
  },
  markImage: {
    width: 64,
    height: 64,
  },
  greeting: {
    marginTop: LUXURY_SPACING / 2,
    fontSize: 22,
    fontWeight: "700",
    color: LUXURY_COLORS.text,
    textAlign: "center",
  },
  greetingSub: {
    marginTop: 8,
    fontSize: 16,
    color: LUXURY_COLORS.textMuted,
    textAlign: "center",
  },

  // ── Suggestions ──
  suggestions: {
    flex: 1,
    marginTop: LUXURY_SPACING / 2,
  },
  suggestionsContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    paddingBottom: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.surface,
  },
  chipText: {
    fontSize: 14,
    color: LUXURY_COLORS.text,
  },

  // ── Input ──
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 58,
    paddingLeft: 18,
    paddingRight: 8,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.surface,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: LUXURY_COLORS.text,
    // Android pads its inputs by default, which pushes the text off-centre.
    paddingVertical: 0,
  },
  micButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  sendWrapper: {
    borderRadius: 21,
    overflow: "hidden",
  },
  sendButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── History ──
  historyActions: {
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  continueWrapper: {
    alignSelf: "stretch",
    borderRadius: 26,
    overflow: "hidden",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
  },
  continueText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  clearText: {
    fontSize: 13,
    color: LUXURY_COLORS.textMuted,
  },
});
