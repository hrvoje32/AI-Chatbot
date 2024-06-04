//AuthScreen.tsx
// Import necessary React hooks and components from React and React Native libraries
import React, {useState, useEffect} from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import {styles} from '../utils/styles'; // Import custom styling
// Import the API service for handling chat operations
import chatApi from '../api/chatApi';
// Import navigation and route types from React Navigation
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
// Import custom modal components for success and error messaging
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

// Define types for navigation and routing within the Auth stack
type AuthStackParamList = {
  ChatScreen: {
    isAuthenticated: boolean;
    userId: number | null;
  };
};

type AuthScreenRouteProp = RouteProp<AuthStackParamList, 'ChatScreen'>;

type AuthScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ChatScreen'
>;

// Interface defining the props for AuthScreen
interface AuthScreenProps {
  route: AuthScreenRouteProp; // Contains parameters passed from the previous screen
  navigation: AuthScreenNavigationProp; // Allows navigation to other screens
}

const AuthScreen: React.FC<AuthScreenProps> = ({route, navigation}) => {
  const [nickname, setNickname] = useState<string>(''); // State to store the nickname input
  const [password, setPassword] = useState<string>(''); // State to store the password input
  const [isSignUp, setIsSignUp] = useState<boolean>(false); // State to determine if the current mode is sign-up
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State to control visibility of the success modal
  const [showErrorModal, setShowErrorModal] = useState(false); // State to control visibility of the error modal
  const [modalMessage, setModalMessage] = useState(''); // State to store the message to be displayed in modals

  useEffect(() => {
    const action = route.params?.action; // Retrieve action parameter from the navigation route
    setIsSignUp(action === 'signUp'); // Set sign-up state based on the action parameter
  }, [route.params]);

  const handleRegister = async () => {
    try {
      const response = await chatApi.register(nickname, password); // Attempt to register user with API
      if (response.data.message === 'User registered successfully') {
        setModalMessage('Registration successful');
        setShowSuccessModal(true);
        const userId = response.data.userId;
        navigation.navigate('ChatScreen', {
          isAuthenticated: true,
          userId: userId,
        }); // Navigate to chat screen if successful registration
      } else {
        setModalMessage(response.data.message);
        setShowErrorModal(true);
      }
    } catch (error) {
      setModalMessage(
        'Registration failed\n\nPlease input a valid \nnickaname and password',
      );
      setShowErrorModal(true);
    }
  };

  const authenticateUser = async () => {
    try {
      const response = await chatApi.login(nickname, password); // Attempt to login user with API
      if (response.data.message === 'Login successful') {
        const userId = response.data.userId;
        if (userId) {
          navigation.navigate('ChatScreen', {
            isAuthenticated: true,
            userId: userId,
          }); // Navigate to chat screen if successful login
          setModalMessage('Login successful');
          setShowSuccessModal(true);
        } else {
          setModalMessage('Login was successful, but no user ID was received.');
          setShowErrorModal(true);
        }
      } else {
        setModalMessage(response.data.message);
        setShowErrorModal(true);
      }
    } catch (error) {
      setModalMessage('Login failed\n\nIncorrect\n Nickname or Password');
      setShowErrorModal(true);
    }
  };

  return (
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
      {isSignUp ? (
        <TouchableOpacity onPress={handleRegister} style={styles.authButton}>
          <Text style={styles.whiteColour}>Sign Up</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={authenticateUser} style={styles.authButton}>
          <Text style={styles.whiteColour}>Log In</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text>Back</Text>
      </TouchableOpacity>
      <SuccessModal
        isVisible={showSuccessModal}
        message={modalMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      <ErrorModal
        isVisible={showErrorModal}
        message={modalMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </View>
  );
};

export default AuthScreen; // Export AuthScreen component
