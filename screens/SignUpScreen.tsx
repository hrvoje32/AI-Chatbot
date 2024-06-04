//SignUpScreen.tsx
// Import necessary React hooks and components
import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text, Alert} from 'react-native';
import {styles} from '../utils/styles'; // Style imports
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator'; // Navigation stack configuration

// Define navigation type for this screen
type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignUpScreen'
>;

// Interface for component props
interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

// Functional component for SignUpScreen
const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  const [nickname, setNickname] = useState<string>(''); // State for nickname
  const [password, setPassword] = useState<string>(''); // State for password

  // Handler for sign-up action
  const handleSignUp = () => {
    Alert.alert('Sign Up', 'Sign up screen.');
  };

  // UI Rendering
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nickname"
        value={nickname} // Bind text input to state
        onChangeText={setNickname} // Update state on change
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry // Hide password input
        value={password} // Bind password input to state
        onChangeText={setPassword} // Update state on change
      />
      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <Text style={styles.whiteColour}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.goBack()} // Navigate back to the previous screen
        style={styles.button}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen; // Export the SignUpScreen
