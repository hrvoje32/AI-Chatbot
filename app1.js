/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useRef, useEffect} from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import axios from 'axios';
interface Message {
  message: any;
  is_bot: any;
  type: 'user' | 'bot';
  text: string;
}

interface ChatSession {
  name: string;
  messages: Message[];
}

const App = () => {
  const [showChat, setShowChat] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [showConsent, setShowConsent] = useState<boolean>(false);
  const [unhandledMessage, setUnhandledMessage] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [sessionName, setSessionName] = useState<string>('');
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [starRating, setStarRating] = useState<number>(0);
  const sidebarAnimation = useRef(new Animated.Value(0)).current;
  const [chatSessionSave, setChatSessionSave] = useState<string>('');
  const scrollViewRef = useRef<any>(null);
  const [isChatInputFocused, setIsChatInputFocused] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthScreen, setShowAuthScreen] = useState<boolean>(false);
  const [showSignIn, setShowSignIn] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userId, setUserId] = useState(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [feedbackButtonPressed, setFeedbackButtonPressed] = useState(false);
  const [chatButtonPressed, setChatButtonPressed] = useState(true);
  const [historyButtonPressed, setHistoryButtonPressed] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://127.0.0.1:5000';

  const handleFeedbackPress = () => {
    setFeedbackButtonPressed(true);
    setChatButtonPressed(false);
    setHistoryButtonPressed(false);
    setShowFeedbackModal(true); // Trigger modal for feedback
  };

  const handleChatPress = () => {
    setChatButtonPressed(true);
    setFeedbackButtonPressed(false);
    setHistoryButtonPressed(false);
    handleNewChat();
  };

  const handleHistoryPress = () => {
    setHistoryButtonPressed(true);
    setFeedbackButtonPressed(false);
    setChatButtonPressed(false);
    openSidebar(); // Assume this shows the history
  };
  const handleClosePress = () => {
    // Close the feedback modal
    setShowFeedbackModal(false);
    setFeedbackButtonPressed(false);
    setChatButtonPressed(true);
    handleNewChat();
    // handleNewChatPress(); // Uncomment if you have this function and wish to use it here
  };
// Function to handle user registration
const handleRegister = async () => {
  try {
    const response = await axios.post(`${baseURL}/sign-in`, {
      username: nickname,
      password: password,
    });

    if (response.data.message === 'User registered successfully') {
      alert('Registration successful');
      setShowLogin(true);
      setShowSignIn(false);
    } else {
      alert('Registration failed: ' + response.data.message);
    }
  } catch (error) {
    // It's helpful to log or display more detailed error information for troubleshooting
    console.error('Registration failed with error: ', error);
    alert('Registration failed: ' + error.message);
  }
};


  // Function to authenticate the user
const authenticateUser = async () => {
  try {
    const response = await axios.post(`${baseURL}/login`, {
      username: nickname,
      password: password,
    });

    if (response.data.message === 'Login successful') {
      // Fetch user ID here
      const userIdResponse = await axios.post(`${baseURL}/get-user-id`, {
        username: nickname,
        password: password,
      });

      if (userIdResponse.data.userId) {
        setIsAuthenticated(true);
        setUserId(userIdResponse.data.userId);
        setShowChat(true);
        setShowLogin(false);
        handleNewChat();
      }
    } else {
      alert('Invalid credentials');
    }
  } catch (error) {
    alert('Authentication failed');
  }
};


  // Function to handle back button in auth options
  const handleBackToAuthOptions = () => {
    setShowSignIn(false);
    setShowLogin(false);
    setShowAuthScreen(true);
  };

  // Function to enter the chat
  const handleEnterChat = () => {
    setShowChat(false);
    setShowAuthScreen(true);
  };

  // Function to open the sidebar
  function openSidebar() {
    console.log('Opening sidebar');
    setShowSidebar(true);
    Animated.timing(sidebarAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true, // Ensure this is used with supported properties
    }).start();
  }

  // Function to close the sidebar
  const closeSidebar = () => {
    console.log('Closing sidebar');
    Animated.timing(sidebarAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSidebar(false);
      console.log('Sidebar closed');
    });
    setChatButtonPressed(true);
    setHistoryButtonPressed(false);
  };
  const sidebarStyle = {
    transform: [
      {
        translateX: sidebarAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0], // Adjust for your sidebar's off-screen width
        }),
      },
    ],
  };
  const handleFeedbackSubmit = async () => {  
    const feedbackData = {
      feedback: feedbackText,
      stars: starRating,
      user_id: userId,
    };
  
    try {
      const response = await axios.post(`${baseURL}/submit-feedback`, feedbackData);
      console.log('Server Response:', response.data);
  
      // Reset the feedback form states and close the modal
      setFeedbackText('');
      setStarRating(0);
      setShowFeedbackModal(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
    setFeedbackButtonPressed(false);
    setChatButtonPressed(true);
    handleNewChat();
  };
  

  const handleNewChat = () => {
    setChatMessages([]);
    setCurrentMessage('');
    setShowSidebar(false);
    setShowFeedbackModal(false);
    setSessionName('');
    setSelectedSession(null);
  };

  function handleLoadSession(session: ChatSession) {
    console.log('Selected session:', session);
    console.log('Messages to load:', session.messages);

    // Correctly format messages for rendering
    const formattedMessages = session.messages.map(msg => ({
      type: msg.is_bot ? 'bot' : 'user',
      text: msg.message, // Changing 'message' to 'text'
    }));

    setSelectedSession(session); // Set the selected session
        setChatMessages(formattedMessages); // Update the chat messages to display the session's conversation
  }

  const handleSendMessage = async () => {
    if (currentMessage.trim() !== '') {
      const newMessage = {type: 'user', text: currentMessage.trim()};
  
      // Update the chat interface
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
  
      // If a session is selected, update it with the new message
      if (selectedSession) {
        setSelectedSession(prevSession => ({
          ...prevSession,
          messages: [...prevSession.messages, newMessage],
        }));
  
        setChatSessions(prevSessions =>
          prevSessions.map(session =>
            session.name === selectedSession.name
              ? {...session, messages: [...session.messages, newMessage]}
              : session,
          ),
        );
      }
  
      setCurrentMessage('');
      try {
        const response = await axios.post(`${baseURL}/get-response`, {message: newMessage.text});
        if (response.data && response.data.message === 'unhandled') {
          setUnhandledMessage(newMessage.text);
          setShowConsent(true);
        } else if (response.data && response.data.message) {
          const botResponse = {
            type: 'bot',
            text: response.data.message,
            is_bot: true, // Include is_bot attribute
          };
          setChatMessages(prevMessages => [...prevMessages, botResponse]);
  
          if (selectedSession) {
            setSelectedSession(prevSession => ({
              ...prevSession,
              messages: [...prevSession.messages, botResponse],
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching the bot response', error);
      }
    }
  };
  

  async function handleConsentResponse(consent: boolean) {
        setShowConsent(false);
        if (consent) {
            await saveUnhandledMessage(unhandledMessage, userId); // Pass userId to the function
            setChatMessages(prevMessages => [
        ...prevMessages,
        {
                    type: 'bot',
                    text: 'Thank you! Your message will be used for improvement.',
                },
      ]);
        } else {
            setChatMessages(prevMessages => [...prevMessages, { type: 'bot', text: "Understood! Your message won't be saved." }]);
        }
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }

    async function saveUnhandledMessage(message: string, userId: number) {
    
      try {
        await axios.post(`${baseURL}/save-unhandled-message`, {
          message: message,
          user_id: userId, // Include userId in the POST request data
        });
        console.log('Unhandled message saved successfully');
      } catch (error) {
        console.error('Error saving the unhandled message', error);
      }
    }
    

    const saveChatHistory = async (userId, messages) => {
      try {
        const formattedMessages = messages.map((message) => ({
          text: message.text,
          is_bot: message.is_bot || false,
          session_name: sessionName,
        }));
    
        const response = await axios.post(`${baseURL}/save-conversation`, {
          user_id: userId,
          messages: formattedMessages,
        });
    
        if (response.data.status === 'success') {
          console.log('Conversation saved successfully');
        } else {
          console.error('Error saving conversation:', response.data.error);
        }
      } catch (error) {
        console.error('Error saving conversation:', error.message);
        throw error;
      }
    };
    


// Example usage with a custom session name:
// saveChatHistory(userId, messages, 'CustomSessionName');



const handleExit = async () => {
  if (chatMessages.length === 0) {
    setChatSessionSave('No messages to save.');

    // Wait for 3 seconds and then hide the message
    setTimeout(() => {
      setChatSessionSave(''); // Clear the message
    }, 3000);

    return;
  }

  if (!userId) {
    console.error('User ID not available.');
    setChatSessionSave('Error saving chat session.');
    return;
  }

  let updatedSessions = [...chatSessions];

  // Update existing session or create a new one
  if (selectedSession) {
    updatedSessions = updatedSessions.map(session => 
      session.name === selectedSession.name ? { ...session, messages: chatMessages } : session
    );
  } else {
    const newChatSession = {
      name: sessionName || `Session ${chatSessions.length + 1}`,
      messages: chatMessages,
    };
    updatedSessions.push(newChatSession);
  }

  try {
    await saveChatHistory(userId, chatMessages);
    setChatSessionSave('Conversation saved successfully');
     // Wait for 3 seconds and then hide the message
     setTimeout(() => {
      setChatSessionSave(''); // Clear the message
    }, 3000);
  } catch (error) {
    console.error('Error saving conversation:', error);
    setChatSessionSave('Error saving chat session.');
  }

  setChatSessions(updatedSessions);
  setChatMessages([]);
  setCurrentMessage('');
  setSessionName('');
  setSelectedSession(null);
  closeSidebar();
};



const fetchConversationHistory = async () => {
  try {
    if (!userId) {
      return;
    }
   

    const response = await axios.get(`${baseURL}/get-conversation-history`, {
      params: {
        user_id: userId, // Use the user's actual ID
      },
    });

    if (response.data.status === 'success') {
      setChatMessages(response.data.history);
      setChatSessions(response.data.sessions);
    } else {
      console.error('Failed to fetch data:', response.data.error);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Function to rename a session
const handleRenameSession = async (userId, oldSessionName, newSessionName) => {
  console.log('userId:', userId);
  console.log('oldSessionName:', oldSessionName);
  console.log('newSessionName:', newSessionName);
  try {
    const response = await axios.put(`${baseURL}/rename-session`, {
      userId,
      oldSessionName,
      newSessionName
    });

    if (response.data.status === 'success') {
      // Session renamed successfully on the server, now update it in the app
      setChatSessions((prevSessions) =>
        prevSessions.map((session) => 
          session.name === oldSessionName ? { ...session, name: newSessionName } : session
        )
      );
    } else {
      console.error('Failed to rename session:', response.data.message);
    }
  } catch (error) {
    console.error('Error renaming session:', error);
  }
};


// Function to delete a session
const handleDeleteSession = async (userId, sessionName) => {
  console.log('userId:', userId);
  console.log('sessionName:', sessionName);
  try {
    const encodedSessionName = encodeURIComponent(sessionName); // Encode sessionName
    const response = await axios.delete(`${baseURL}/delete-session?userId=${userId}&sessionName=${encodedSessionName}`);

    if (response.data.status === 'success') {
      // Session deleted successfully on the server, now remove it from the app
      setChatSessions((prevSessions) =>
        prevSessions.filter((session) => session.name !== sessionName)
      );
    } else {
      console.error('Failed to delete session:', response.data.message);
    }
  } catch (error) {
    console.error('Error deleting session:', error);
  }
};


// Call the fetchUserId function after successful authentication
useEffect(() => {
  if (isAuthenticated) {
    const fetchUserId = async () => {
      try {
        const userIdResponse = await axios.post(`${baseURL}/get-user-id`, {
          username: nickname,
          password: password,
        });

        if (userIdResponse.data.userId) {
          setIsAuthenticated(true);
          setUserId(userIdResponse.data.userId);
          setShowChat(true);
          setShowLogin(false);
          handleNewChat(); 
        } else {
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        alert('Authentication failed');
      }
    };
    fetchUserId(); // Call the function to fetch the user ID
  }
}, [isAuthenticated]);



useEffect(() => {
  if (isAuthenticated && userId) {
    fetchConversationHistory();
  }
}, [isAuthenticated, userId]);

  useEffect(() => {
    if (showConsent && scrollViewRef.current) {
      // Delay the scroll a bit to ensure UI has updated
      setTimeout(() => scrollViewRef.current.scrollToEnd({ animated: true }), 100);
    }
  }, [showConsent]);
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  function renderChatMessage(message: Message, index: number) {
        return (
            <View key={index} style={[styles.chatMessage, message.type === 'user' ? styles.userMessage : styles.botMessage]}>
                {message.type === 'user' && <View style={styles.userMessageTail} />}
                {message.type === 'bot' && <View style={styles.botMessageTail} />}
                <Text style={message.type === 'user' ? { color: 'white' } : {}}>{message.text}</Text>
            </View>
        );
    }
    
  // Function to render stars
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(i => (
        <TouchableOpacity key={i} onPress={() => setStarRating(i)} style={styles.starTouchable}>
            <Text style={i <= starRating ? styles.filledStar : styles.emptyStar}>★</Text>
        </TouchableOpacity>
    ));
};

return (
  <View style={styles.app}>
    <Modal
animationType="slide"
transparent={true}
visible={isRenameModalVisible}
onRequestClose={() => {
  setIsRenameModalVisible(!isRenameModalVisible);
}}
>
<View style={styles.modalView}>
  <TextInput
    style={styles.feedbackInput} // Using feedbackInput style for consistency
    onChangeText={setNewSessionName}
    value={newSessionName}
    placeholder="Enter new session name"
  />

  <View style={styles.buttonContainer}>

  {/* Cancel Button */}
  <TouchableOpacity
    onPress={() => setIsRenameModalVisible(false)}
    style={styles.sessionButtonDeleteModul} // Using submitButton style for consistency
  >
    <Text style={styles.greyColourButton}>Cancel</Text>
  </TouchableOpacity>

{/* Rename Button */}
  <TouchableOpacity
    onPress={() => {
      if (selectedSession) {
        handleRenameSession(userId, selectedSession.name, newSessionName);
        setIsRenameModalVisible(false);
      } else {
        console.error('No session selected for renaming');
      }
    }}
    style={styles.sessionButtonRenameModul} // Using submitButton style for consistency
  >
    <Text style={styles.greenColourButton}>Rename</Text>
  </TouchableOpacity>
  </View>
</View>
</Modal>
    {isAuthenticated && showChat && (
        <View style={styles.header}>
         <TouchableOpacity 
           onPress={handleFeedbackPress}
           style={[styles.button, feedbackButtonPressed ? styles.pressedButton : {}]}>
<Text style={[styles.menuButtonsColour, feedbackButtonPressed ? styles.pressedText : {}]}>Give Feedback</Text>
</TouchableOpacity>
       <Text style={styles.line}>|</Text>
            <TouchableOpacity 
            onPress={handleHistoryPress} 
            style={[styles.button, historyButtonPressed ? styles.pressedButton : {}]}>
          <Text style={[styles.menuButtonsColour, historyButtonPressed ? styles.pressedText : {}]}>Show History</Text>
        </TouchableOpacity>
        <Text style={styles.line}>|</Text>
  <TouchableOpacity 
  onPress={handleChatPress}
  style={[styles.button, chatButtonPressed ? styles.pressedButton : {}]}>
    <Text style={[styles.menuButtonsColour, chatButtonPressed ? styles.pressedText : {}]}>New Chat</Text>
  </TouchableOpacity>
<Modal
visible={showFeedbackModal}
onRequestClose={() => setShowFeedbackModal(false)}
transparent={true}
animationType="slide"
>
<KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={50}
    >
<View style={styles.modalView}>
    <TextInput
        style={styles.feedbackInput}
        onChangeText={setFeedbackText}
        value={feedbackText}
        placeholder="Your feedback"
        multiline
    />
    <View style={styles.starRatingContainer}>
        {renderStars()}
    </View>
    <View style={styles.buttonContainer}>
  

    <TouchableOpacity onPress={handleClosePress} style={styles.submitButtonFeedbackCLose}>
        <Text style={styles.greyColourButton}>Close</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={handleFeedbackSubmit} style={styles.submitButtonFeedback}>
        <Text style={styles.greenColourButton}>Submit</Text>
    </TouchableOpacity>
    </View>
</View>
</KeyboardAvoidingView>
</Modal>

   </View>
   )}

      {isAuthenticated && showChat &&  (
      <View style={styles.chatWindow}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatMessages}
        >
          {!showSidebar && chatMessages && chatMessages.map(renderChatMessage)}
          {showConsent && (
            <View style={styles.consent}>
              <Text>Can we save your question to improve our service?</Text>
              <TouchableOpacity onPress={() => handleConsentResponse(true)} style={styles.button}>
                <Text>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleConsentResponse(false)} style={styles.button}>
                <Text>No</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
     
        <KeyboardAvoidingView
       behavior={Platform.OS === "ios" ? "padding" : "height"}
       keyboardVerticalOffset={50}
       enabled={isChatInputFocused}
     >

        <View style={styles.chatControls} >
        <TextInput
            style={[styles.input]}
            onFocus={() => setIsChatInputFocused(true)}
            onBlur={() => setIsChatInputFocused(false)}
            value={currentMessage}
            onChangeText={setCurrentMessage}
            placeholder="Type your message..."
          />
      
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700', }}>Send</Text>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
        </View>
    )}
    {showSidebar && (
       <Animated.View style={[styles.sidebar, sidebarStyle]}>
<ScrollView style={styles.historyMessagesContainer}>
  {chatSessionSave !== '' && (
    <Text style={styles.saveSessionMessage}>{chatSessionSave}</Text>
  )}
  <Text style={styles.sidebarHeader}>Chat History</Text>
  {selectedSession ? (
    selectedSession.messages.map((message, messageIndex) => (
      <View
        key={messageIndex}
        style={[
          styles.chatMessage,
          message.is_bot ? styles.botMessage : styles.userMessage,
        ]}
      >
        {message.is_bot ? (
          <View style={styles.botMessageTail} />
        ) : (
          <View style={styles.userMessageTail} />
        )}
        <Text
          style={[
            styles.messageText,
            message.is_bot ? styles.botMessageText : { color: 'white' },
          ]}
        >
          {message.message}
        </Text>
      </View>
    ))
  ) : (
    chatMessages.map((message, messageIndex) => (
      <View
        key={messageIndex}
        style={[
          styles.chatMessage,
          message.is_bot ? styles.botMessage : styles.userMessage,
        ]}
      >
        {message.is_bot ? (
          <View style={styles.botMessageTail} />
        ) : (
          <View style={styles.userMessageTail} />
        )}
        <Text
          style={[
            styles.messageText,
            message.is_bot ? styles.botMessageText : { color: 'white' },
          ]}
        >
          {message.text}
        </Text>
      </View>
    ))
  )}
</ScrollView>

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={50}>
            <View style={styles.newChatSection}>
              <TextInput
                style={styles.inputHistory}
                value={sessionName}
                onChangeText={setSessionName}
                placeholder="Session Name"
              />
              <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={closeSidebar}
                style={styles.closeButton}>
                <Text style={styles.greyColourButton}>Close History</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
                <Text style={styles.greenColourButton}>Save History</Text>
              </TouchableOpacity>
            </View>
            </View>

            <ScrollView
            ref={scrollViewRef}
  style={styles.sessions}
  contentContainerStyle={styles.sessionsContent}
>
  <Text style={styles.sessionsHeader}>Chat Sessions</Text>
  {chatSessions.map((session, sessionIndex) => (
    <View key={sessionIndex} style={styles.sessionStyle}>
      <TouchableOpacity
        style={styles.session}
        onPress={() => handleLoadSession(session)}
      >
        <Text style={styles.sessionName}>{session.name}</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
                      onPress={() => handleDeleteSession(userId, session.name)}
                      style={styles.sessionButtonDelete}>
  <Text style={styles.greyColourButton}>Delete</Text>
</TouchableOpacity>

     
<TouchableOpacity
  onPress={() => {
    if (selectedSession) {
      setIsRenameModalVisible(true);
    } else {
      // Optionally, display an error or a message indicating that no session is selected
      console.error('No session selected for renaming');
    }
  }}
  style={styles.sessionButtonRename}
>
  <Text style={styles.greenColourButton}>Rename</Text>
</TouchableOpacity>


      </View>
    </View>
  ))}
</ScrollView>

          </KeyboardAvoidingView>
        </Animated.View>
      )}
      {!isAuthenticated && showAuthScreen && !showSignIn && !showLogin && (
        <View style={styles.authContainer}>
          <TouchableOpacity
            onPress={() => setShowSignIn(true)}
            style={styles.authButton}>
            <Text style={styles.whiteColour}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowLogin(true)}
            style={styles.authButton}>
            <Text style={styles.whiteColour}>Log In</Text>
          </TouchableOpacity>
        </View>
      )}

      {(showSignIn || showLogin) && (
        <View style={styles.authContainer}>
          <TextInput
            style={styles.inputSign}
            placeholder="Nickname"
            value={nickname}
            onChangeText={setNickname}
          />
  <TextInput
    style={styles.inputSign}
    placeholder="Password"
    secureTextEntry
    value={password}
    onChangeText={setPassword}
  />
  {showSignIn && (
    <TouchableOpacity onPress={handleRegister} style={styles.authButton}>
      <Text style={styles.whiteColour}>Sign Up</Text>
    </TouchableOpacity>
  )}
  {showLogin && (
    <TouchableOpacity onPress={authenticateUser} style={styles.authButton}>
      <Text style={styles.whiteColour}>Log In</Text>
    </TouchableOpacity>
  )}
  <TouchableOpacity onPress={handleBackToAuthOptions} style={styles.backButton}>
    <Text>Back</Text>
  </TouchableOpacity>
</View>

)
}

{!showChat && !showAuthScreen && (
  <ImageBackground 
    source={require('./background.webp')} 
    style={styles.backgroundImage}
  >
    <View style={styles.content}>
      <Text style={styles.welcomeText}>Welcome to the Stress Management App</Text>
      <Text style={styles.welcomeTitle}>UniRelax</Text>
      <TouchableOpacity onPress={handleEnterChat} style={styles.chatbotButton}>
        <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Enter Chatbot</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
)
}

</View>
);
};
const styles = StyleSheet.create({
  app: {
    fontFamily: 'Arial, sans-serif',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#E7E6E6',
  },
  whiteColour:{
    color: 'white',
    fontWeight: '700',
  },
  authContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginTop: -50,
  },
  inputSign: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  authButton: {
    backgroundColor: '#2F3E6C',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  historyMessagesContainer: {
    flex: 1,
    minHeight: '30%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start', // Aligns children to the top
    alignItems: 'center', // Centers children horizontally
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    marginTop: '15%',
    marginBottom: 'auto',
    fontWeight: '600',
    fontSize: 16,
  },
  welcomeTitle: {
    textAlign: 'center',
    marginTop: '-45%',
    marginBottom: 'auto',
    fontWeight: '700',
    fontSize: 26,
  },
  backButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  chatbotButton: {
    marginBottom: '15%',
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#2F3E6C',
    borderRadius: 5,
  },
  chatWindow: {
    width: '100%',
    height: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    flexDirection: 'column',
    flex: 1,
  },
  chatMessages: {
    flex: 1,
    paddingLeft: 2,
    backgroundColor: '#E7E6E6',
    marginBottom: 'auto',
  },
  chatMessage: {
    marginBottom: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  sidebarHeader: {
    paddingBottom: '2%',
    paddingTop: '2%',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: '#2C3E50',
    color: 'white',
  },
  userMessage: {
    backgroundColor: '#2F3E6C',
    alignSelf: 'flex-end',
    borderRadius: 5,
    padding: 8,
    margin: 4,
    borderBottomRightRadius: 0,
  },
  userMessageTail: {
    position: 'absolute',
    right: -2,
    bottom: -12,
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 10,
    borderTopWidth: 8,
    borderRightColor: 'transparent',
    borderTopColor: '#2F3E6C',
    transform: [{rotate: '45deg'}],
  },
  botMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start', // Align to start for differentiation
    borderRadius: 5,
    padding: 8,
    margin: 4,
    borderBottomLeftRadius: 0,
  },
  botMessageTail: {
    position: 'absolute',
    left: -10, // Adjust as necessary
    bottom: -1,
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 10,
    borderTopWidth: 8,
    borderRightColor: 'transparent',
    borderTopColor: 'white',
    transform: [{rotate: '160deg'}],
  },
  container: {
    display: 'flex',
    height: 'auto',
  },
  chatControls: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    marginBottom: 35,
    borderWidth: 1,
    borderRadius: 5,
    color: 'black',
    backgroundColor: 'white',
  },
  inputHistory: {
    padding: 10,
    borderColor: '#ccc',
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    color: 'black',
    backgroundColor: 'white',
  },
  line: {
    color: '#2F3E6C',
    fontWeight: '500',
    marginTop: '2%',
    fontSize: 24,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonsColour: {
    color: '#2F3E6C',
    fontWeight: '700',
  },
  pressedButton: {
    transform: [{ scale: 0.98 }],
    elevation: 4,
    shadowOpacity: 0.5,
  },
  pressedText: {
    color: '#2F3E6C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 5,
    backgroundColor: 'white',
    marginTop: 42,
    top: '0%',
    width: '100%',
    borderRadius: 5,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveSessionMessage: {
    color: 'green', // Use a color that stands out
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: '13%',
    bottom: '0%',
    width: '100%',
    backgroundColor: '#E7E6E6',
    borderColor: '#ddd',
    borderLeftWidth: 1,
    padding: 10,
    
  },
  exitButton: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: '-5%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1ABC9C',
    borderRadius: 5,
    width: '45%',
  },
  closeButton: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: '-5%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#CCCCCC',
    borderRadius: 5,
    width: '45%',
  },
  sessionsContent: {
    paddingBottom: 10,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
  
  },
  sessionsHeader: {
    paddingTop: '2%',
    paddingBottom: '2%',
    marginBottom: '5%',
    marginTop: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    backgroundColor: '#2C3E50',
    color: 'white',
  },
  newChatSection: {
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: '#2F3E6C',
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    borderRadius: 5,
    marginLeft: 4,
    marginBottom: 35,
  },
  sessionStyle:{
    borderWidth: 1,
    marginBottom: '5%',
    borderRadius: 5,
    width: '90%',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

  },
  session: {
    backgroundColor: 'white',
    alignContent: 'center',
    paddingBottom: 10,
    justifyContent: 'center', // Aligns children vertically in the center
    alignItems: 'center', // Aligns children horizontally in the center
    flexWrap: 'wrap',
    borderColor: 'black',
    borderWidth: 1,
    width: '90%',
    alignSelf: 'center',
    marginVertical: 5,
    paddingTop: 10, // Add padding at the top for better vertical alignment
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  // Modal view for feedback
  modalView: {
    marginTop: '35%',
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Input field for feedback text
  feedbackInput: {
    width: '90%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  // Star rating container
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  // Button to submit feedback
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginBottom: '5%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
},
  submitButtonFeedback:{
    marginRight: 0,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#1ABC9C',

  },
  submitButtonFeedbackCLose: {
    marginRight: 10,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#CCCCCC',

  },
  sessionButtonRename:{
    marginRight: 0,
    borderRadius: 5,
    padding: 5,
    elevation: 2,
    width: '40%',
    alignItems: 'center',
    backgroundColor: '#4472C4',

  },
  sessionButtonDelete:{
    marginLeft: 0,
    marginRight: 10,
    borderRadius: 5,
    padding: 5,
    elevation: 2,
    width: '40%',
    alignItems: 'center',
    backgroundColor: '#CCCCCC',

  },
  sessionButtonRenameModul:{
    marginRight: 0,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#4472C4',

  },
  sessionButtonDeleteModul:{
    marginLeft: 0,
    marginRight: 10,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#CCCCCC',

  },
  greenColourButton: {
    color: 'white',
    fontWeight: '700',
  },
  greyColourButton: {
    color: 'black',
    fontWeight: '500',
  },
  filledStar: {
    fontSize: 30,
    color: 'gold',
  },
  emptyStar: {
    fontSize: 30,
    color: 'grey',
  },
  sessionNameInput: {
    color: 'black', // Set the text color to black
  },
  sessionName: {
    color: 'black',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default App;
