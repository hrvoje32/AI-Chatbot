// ChatWindow.tsx
import React, {useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import {styles} from '../utils/styles'; // Importing styles

// TypeScript interface for the props that ChatWindow expects
interface ChatWindowProps {
  chatMessages: {type: 'user' | 'bot'; text: string}[]; // Array of chat messages with type and text
  currentMessage: string; // Current message in the input field
  setCurrentMessage: React.Dispatch<React.SetStateAction<string>>; // Function to update the current message
  handleSendMessage: () => void; // Function to handle sending a message
  setIsChatInputFocused: React.Dispatch<React.SetStateAction<boolean>>; // Function to set input focus state
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatMessages,
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
  setIsChatInputFocused,
}) => {
  const scrollViewRef = useRef<ScrollView>(null); // Ref to hold the ScrollView component

  useEffect(() => {
    // Automatically scroll to the end of the messages when chatMessages array changes
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100); // Delay of 100ms

    return () => clearTimeout(timer); // Clean up the timer
  }, [chatMessages]);

  return (
    <View style={styles.chatWindow}>
      <ScrollView style={styles.chatMessages} ref={scrollViewRef}>
        {chatMessages.map((msg, index) => (
          <View
            key={index}
            style={
              msg.type === 'user' ? styles.userMessage : styles.botMessage
            }>
            <Text
              style={
                msg.type === 'user'
                  ? styles.userMessageText
                  : styles.botMessageText
              }>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust keyboard behavior based on OS
        keyboardVerticalOffset={120}>
        <View style={styles.chatControls}>
          <TextInput
            style={styles.input}
            onFocus={() => setIsChatInputFocused(true)} // Handle input focus state
            onBlur={() => setIsChatInputFocused(false)} // Handle input blur state
            value={currentMessage} // Display the current message in input
            onChangeText={setCurrentMessage} // Update state on input change
            placeholder="Type your message..." // Placeholder text for the input
          />
          <TouchableOpacity
            onPress={handleSendMessage} // Send message on press
            style={styles.sendButton}>
            <Text style={styles.whiteColour}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatWindow; // Export the ChatWindow component
