import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Sparkles, Mic, AudioWaveform, Send } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AiChatComponent from '../components/exploreAi/aiChat';

export default function ChatInterface() {
  const [inputText, setInputText] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [userMessage, setUserMessage] = useState('');

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
    "More"
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
    return <AiChatComponent initialMessage={userMessage} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        {/* Sparkle Icon */}
        <View style={styles.iconContainer}>
          <Sparkles size={48} color="#d4d4d4" strokeWidth={1.5} />
        </View>

        {/* Greeting Text */}
        <Text style={styles.greetingBold}>Hey there!</Text>
        <Text style={styles.greetingLight}>What sparkle</Text>
        <Text style={styles.greetingLight}>are we looking for today?</Text>

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
          <TouchableOpacity style={styles.iconButton}>
            <Mic size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <AudioWaveform size={20} color="#333" />
          </TouchableOpacity>
          {inputText.trim().length > 0 && (
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSend}
            >
              <Send size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Suggestion Chips */}
        <ScrollView 
          style={styles.suggestionsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.suggestionsGrid}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingBold: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  greetingLight: {
    fontSize: 14,
    fontWeight: '300',
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 30,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  iconButton: {
    marginLeft: 12,
    padding: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  suggestionsContainer: {
    flex: 1,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5, // Negative margin to offset chip margins
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 5,
  },
  suggestionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '400',
  },
});