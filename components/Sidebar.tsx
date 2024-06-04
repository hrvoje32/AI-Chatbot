//Sidebar.tsx
// Import necessary React and React Native components
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
} from 'react-native';
import {styles} from '../utils/styles'; // Import custom styles
import ErrorModal from './ErrorModal'; // Component for displaying error modals
import SuccessModal from './SuccessModal'; // Component for displaying success modals

// Interfaces to define expected data types for props
interface Message {
  text: string;
}

interface ChatSession {
  name: string;
  messages: Message[];
}

interface SidebarProps {
  showSidebar: boolean;
  currentMessages: any[]; // Specify more detailed types if available
  chatSessions: any[]; // Specify more detailed types if available
  handleLoadSession: (session: any) => void; // Specify the type of session
  handleDeleteSession: (sessionName: string) => void;
  handleSaveCurrentSession: (sessionName: string) => void;
  handleNewChat: () => void;
  handleRenameSession: (oldSessionName: string, newSessionName: string) => void;
  sidebarAnimation: Animated.Value;
  closeSidebar: () => void;
  makeNewChatPressed: () => void;
}

// Functional component for the sidebar, handling session management and feedback
const Sidebar: React.FC<SidebarProps> = ({
  showSidebar,
  currentMessages,
  chatSessions,
  handleLoadSession,
  handleDeleteSession,
  handleSaveCurrentSession,
  handleRenameSession,
  sidebarAnimation,
  closeSidebar,
  makeNewChatPressed,
}) => {
  const [newSessionName, setNewSessionName] = useState('');
  const [renamingSession, setRenamingSession] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState('');

  // Apply transformation to the sidebar based on the animated value
  const sidebarStyle = {
    transform: [
      {
        translateX: sidebarAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0], // Sidebar enters from the right
        }),
      },
    ],
  };

  // Function to save the current chat session
  const onSaveSession = async () => {
    if (!newSessionName.trim()) {
      setErrorModalMessage('Please provide a name for the session.');
      setIsErrorModalVisible(true);
      return;
    }
    try {
      await handleSaveCurrentSession(newSessionName);
      setSuccessModalMessage('Session saved successfully.');
      setIsSuccessModalVisible(true);
      setNewSessionName('');
    } catch (error) {
      setErrorModalMessage('Failed to save the session. Please try again.');
      setIsErrorModalVisible(true);
    }
  };

  // Function to initiate renaming of a session
  function startRenamingSession(sessionName: string) {
    setRenamingSession(sessionName);
    setModalVisible(true);
  }

  // Function to confirm renaming of a session
  const onRenameSessionConfirm = async () => {
    if (!newSessionName.trim() || !renamingSession) {
      setErrorModalMessage('New session name cannot be empty.');
      setIsErrorModalVisible(true);
      return;
    }
    try {
      await handleRenameSession(renamingSession, newSessionName);
      setRenamingSession(null);
      setNewSessionName('');
      setModalVisible(false);
    } catch (error) {
      setErrorModalMessage('Failed to rename session. Please try again.');
      setIsErrorModalVisible(true);
    }
  };

  // Render the sidebar or return null if it should not be visible
  if (!showSidebar) return null;
  return (
    <Animated.View style={[styles.sidebar, sidebarStyle]}>
      <ScrollView style={styles.historyMessagesContainer}>
        <Text style={styles.sidebarHeader}>Chat History</Text>
        {currentMessages.slice(-4).map((message, index) => (
          <View
            key={index}
            style={
              message.type === 'user' ? styles.userMessage : styles.botMessage
            }>
            <Text
              style={
                message.type === 'user'
                  ? styles.userMessageText
                  : styles.botMessageText
              }>
              {message.text}
            </Text>
            <SuccessModal
              isVisible={isSuccessModalVisible}
              message={successModalMessage}
              onClose={() => setIsSuccessModalVisible(false)}
            />
          </View>
        ))}

        <TextInput
          style={styles.inputSession}
          placeholder="Name this session..."
          value={newSessionName}
          onChangeText={setNewSessionName}
        />
        <View style={styles.historyButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              closeSidebar();
              makeNewChatPressed();
            }}
            style={styles.closeButton}>
            <ErrorModal
              isVisible={isErrorModalVisible}
              message={errorModalMessage}
              onClose={() => setIsErrorModalVisible(false)}
            />
            <Text style={styles.greyColourButton}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSaveSession} style={styles.exitButton}>
            <Text style={styles.greenColourButton}>Save Session</Text>
          </TouchableOpacity>
        </View>

        {/* Saved Sessions List */}
        <Text style={styles.sidebarHeader}>Saved Sessions</Text>
        {chatSessions.map((session, index) => (
          <View key={index} style={styles.sessionStyle}>
            <TouchableOpacity
              onPress={() => {
                handleLoadSession(session);
                makeNewChatPressed();
              }}
              style={styles.session}>
              <Text>{session.name}</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => handleDeleteSession(session.name)}
                style={styles.sessionButtonDelete}>
                <Text>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => startRenamingSession(session.name)}
                style={styles.sessionButtonRename}>
                <Text style={styles.greenColourButton}>Rename</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Modal for renaming sessions */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View>
            <ErrorModal
              isVisible={isErrorModalVisible}
              message={errorModalMessage}
              onClose={() => setIsErrorModalVisible(false)}
            />
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Enter new session name</Text>
              <TextInput
                style={styles.modalInput}
                onChangeText={setNewSessionName}
                value={newSessionName}
                placeholder="New session name..."
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.submitButtonFeedbackCLose}>
                  <Text style={styles.greyColourButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onRenameSessionConfirm}
                  style={styles.submitButtonFeedback}>
                  <Text style={styles.greenColourButton}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </Animated.View>
  );
};

export default Sidebar; // Export the Sidebar component
