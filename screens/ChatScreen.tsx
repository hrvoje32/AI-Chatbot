//ChatScreen.tsx
// Import necessary React hooks and components and custom modals
import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, Animated, Modal} from 'react-native';
import {styles} from '../utils/styles';
import chatApi from '../api/chatApi';
import FeedbackModal from '../components/FeedbackModal';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

// Define route and navigation types
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

interface ChatScreenProps {
  route: ChatScreenRouteProp;
}

const ChatScreen: React.FC<ChatScreenProps> = ({route}) => {
  const userId = route.params?.userId;
  // State definitions for UI and data management
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [starRating, setStarRating] = useState<number>(0);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<any>>([]);
  const [feedbackButtonPressed, setFeedbackButtonPressed] =
    useState<boolean>(false);
  const [historyButtonPressed, setHistoryButtonPressed] =
    useState<boolean>(false);
  const [chatButtonPressed, setChatButtonPressed] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [isChatInputFocused, setIsChatInputFocused] = useState<boolean>(false);
  const [chatSessions, setChatSessions] = useState<Array<any>>([]); // Update the any type to your session object type
  const [selectedSession, setSelectedSession] = useState<any>(null); // Update the any type to your session object type
  const [showConsentPrompt, setShowConsentPrompt] = useState<boolean>(false);
  const [unhandledMessage, setUnhandledMessage] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Fetch sessions on component mount or userId change
  useEffect(() => {
    fetchChatSessions();
  }, [userId]);

  // Function to handle the loading of a session
  const handleLoadSession = session => {
    if (!session || !session.messages) {
      return;
    }

    // Directly using session.messages
    setChatMessages(
      session.messages.map(msg => ({
        type: msg.is_bot ? 'bot' : 'user',
        text: msg.message,
      })),
    );
    setSelectedSession(session);
    setModalMessage(`Loaded session: \n${session.name}`);
    setShowSuccessModal(true);
    setShowSidebar(false);
  };

  // Function to handle the deletion of a session
  const handleDeleteSession = async sessionName => {
    try {
      await chatApi.deleteSession(userId, sessionName);
      setModalMessage('Session deleted successfully');
      setShowSuccessModal(true);
      fetchChatSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  // Function to save the current chat session
  const handleSaveCurrentSession = async (sessionName) => {
    try {
      await chatApi.saveSession(userId, sessionName, chatMessages);
      // After saving, fetch sessions again to refresh the list
      fetchChatSessions();
    } catch (error) {
      console.error("Error saving session: ", error);
    }
  };

  // Function to handle renaming a session
  const handleRenameSession = async (oldSessionName, newSessionName) => {
    if (!newSessionName.trim()) {
      setModalMessage('New session name cannot be empty');
      setShowErrorModal(true);
      return;
    }
    try {
      await chatApi.renameSession(userId, oldSessionName, newSessionName);
      setModalMessage('Session renamed successfully');
      setShowSuccessModal(true);
      fetchChatSessions(); // Refresh the list of chat sessions
    } catch (error) {
      console.error('Error renaming session:', error);
    }
  };

  // Function to handle fetching sessions from the server
  const fetchChatSessions = async () => {
    try {
      const response = await chatApi.getConversationHistory(userId);
      console.log('Fetched sessions:', response.data.sessions);
      if (response && response.data) {
        setChatSessions(response.data.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      setModalMessage(`Failed fetching the session: ${error.message}`);
      setShowErrorModal(true);
    }
  };

  // Function to open the sidebar
  const openSidebar = () => {
    setShowSidebar(true);
    Animated.timing(sidebarAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Message handling function
  const handleSendMessage = async () => {
    if (currentMessage.trim()) {
      setChatMessages(prevMessages => [...prevMessages, { type: 'user', text: currentMessage }]);
      try {
        const response = await chatApi.sendMessage(currentMessage);
        if (response.data && response.data.message === 'unhandled') {
          // Bot cannot handle the message, show consent prompt
          setShowConsentPrompt(true);
          setUnhandledMessage(currentMessage);
        } else if (response.data && response.data.message) {
          // Handle normal bot response
          setChatMessages(prevMessages => [
            ...prevMessages,
            {type: 'bot', text: response.data.message},
          ]);
        }
        setCurrentMessage('');
      } catch (error) {
        console.error('Error sending message: ', error);
        setModalMessage(`Failed to save your message: ${error.message}`);
        setShowErrorModal(true);
      }
    }
  };

  // Function to handle unhandled message saving
  const handleSaveUnhandledMessage = async () => {
    try {
      await chatApi.saveUnhandledMessage(unhandledMessage, userId);
      setModalMessage('Your message has been saved for improvement.');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving unhandled message: ', error);
    }
  };

  // Function to handle user feedback submission
  async function handleFeedbackSubmit() {
    if (!feedbackText.trim() || starRating === 0) {
      setModalMessage('Please provide feedback and a star rating.');
      setShowErrorModal(true);
      setShowFeedbackModal(false);
      return;
    }
    try {
      const feedbackResponse = await chatApi.submitFeedback({
        feedback: feedbackText,
        stars: starRating,
        userId,
      });
      if (feedbackResponse.status === 200) {
        setModalMessage('Feedback submitted successfully.');
        setShowSuccessModal(true);
        setFeedbackText('');
        setStarRating(0);
        setShowFeedbackModal(false);
      } else {
        console.error('Feedback submission failed:', feedbackResponse);
        setModalMessage('Error submitting feedback.');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setModalMessage(`Error submitting feedback: ${error.message}`);
      setShowErrorModal(true);
    }
  }

  // UI button press handlers
  const handleFeedbackPress = () => {
    setShowFeedbackModal(true);
    setFeedbackButtonPressed(true);
    setChatButtonPressed(false);
    setHistoryButtonPressed(false);
    setShowSidebar(false);
  };

  // Opens sidebar to show chat history
  const handleHistoryPress = () => {
    openSidebar(true);
    setHistoryButtonPressed(true);
    setFeedbackButtonPressed(false);
    setChatButtonPressed(false);
  };

  // Resets chat to start a new conversation
  const handleNewChat = () => {
    setChatMessages([]);
    setCurrentMessage('');
    setChatButtonPressed(true);
    setFeedbackButtonPressed(false);
    setHistoryButtonPressed(false);
    setShowSidebar(false);
  };

  // Function to reset button states when starting a new chat
  const makeNewChatPressed = () => {
    setFeedbackButtonPressed(false);
    setHistoryButtonPressed(false);
    setChatButtonPressed(true);
  };

  // Main UI rendering of ChatScreen
  return (
    <View style={styles.content}>
      <View style={styles.header}>
        {/* Feedback button setup with conditional styling for active state */}
        <TouchableOpacity
          onPress={handleFeedbackPress}
          style={[
            styles.button,
            feedbackButtonPressed ? styles.pressedButton : {},
          ]}>
          <Text style={styles.menuButtonsColour}>Give Feedback</Text>
        </TouchableOpacity>
        <Text style={styles.line}>|</Text>
        {/* History button setup with conditional styling for active state */}
        <TouchableOpacity
          onPress={handleHistoryPress}
          style={[
            styles.button,
            historyButtonPressed ? styles.pressedButton : {},
          ]}>
          <Text style={styles.menuButtonsColour}>Show History</Text>
        </TouchableOpacity>
        <Text style={styles.line}>|</Text>
        {/* New Chat button to reset and start a new chat session */}
        <TouchableOpacity
          onPress={handleNewChat}
          style={[
            styles.button,
            chatButtonPressed ? styles.pressedButton : {},
          ]}>
          <Text style={styles.menuButtonsColour}>New Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Chat window component for displaying and sending messages */}
      <ChatWindow
        chatMessages={chatMessages}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        handleSendMessage={handleSendMessage}
        isChatInputFocused={isChatInputFocused}
        setIsChatInputFocused={setIsChatInputFocused}
      />

      {/* Sidebar for additional chat session management */}
      <Sidebar
        showSidebar={showSidebar}
        currentMessages={chatMessages}
        chatSessions={chatSessions}
        handleLoadSession={handleLoadSession}
        handleSaveCurrentSession={handleSaveCurrentSession}
        handleDeleteSession={handleDeleteSession}
        handleRenameSession={handleRenameSession}
        sidebarAnimation={sidebarAnimation}
        closeSidebar={() => setShowSidebar(false)}
        makeNewChatPressed={makeNewChatPressed}
      />
      <>
        {/* Success Modal component */}
        <SuccessModal
          isVisible={showSuccessModal}
          message={modalMessage}
          onClose={() => setShowSuccessModal(false)}
        />

        {/* Error Modal component */}
        <ErrorModal
          isVisible={showErrorModal}
          message={modalMessage}
          onClose={() => setShowErrorModal(false)}
        />
      </>

      {/* Consent modal asking to save unhandled message for improvement */}
      {showConsentPrompt && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showConsentPrompt}
          onRequestClose={() => setShowConsentPrompt(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              The bot couldn't understand your message. Can we save it to
              improve our service?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowConsentPrompt(false);
                  setModalMessage('Your message will not be saved');
                  setShowSuccessModal(true);
                }}
                style={styles.submitButtonFeedbackCLose}>
                <Text style={styles.greyColourButton}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleSaveUnhandledMessage();
                  setShowConsentPrompt(false);
                }}
                style={styles.submitButtonFeedback}>
                <Text style={styles.greenColourButton}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Feedback modal for user feedback submission */}
      <FeedbackModal
        showFeedbackModal={showFeedbackModal}
        setShowFeedbackModal={setShowFeedbackModal}
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
        starRating={starRating}
        setStarRating={setStarRating}
        handleFeedbackSubmit={handleFeedbackSubmit}
        makeNewChatPressed={makeNewChatPressed}
      />
    </View>
  );
};

export default ChatScreen; // Export ChatScreen component
