//AuthChoiceScreen.tsx
import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {styles} from '../utils/styles'; // Import custom styles

// Import StackNavigationProp from React Navigation for type-checking the navigation prop
import {StackNavigationProp} from '@react-navigation/stack';

// Define the type for navigation prop specifically for this screen
type AuthChoiceScreenNavigationProp = StackNavigationProp<any>;

// Interface for the component's props to ensure type safety
interface Props {
  navigation: AuthChoiceScreenNavigationProp; // Navigation prop passed from the navigator
}

// Define the functional component with destructured props
const AuthChoiceScreen: React.FC<Props> = ({navigation}) => {
  return (
    <View style={styles.authContainer}>
      <TouchableOpacity
        // On press, navigate to the Auth screen with action parameter for sign-up
        onPress={() => navigation.navigate('Auth', {action: 'signUp'})}
        style={styles.authButton}>
        <Text style={styles.whiteColour}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        // On press, navigate to the Auth screen with action parameter for log-in
        onPress={() => navigation.navigate('Auth', {action: 'logIn'})}
        style={styles.authButton}>
        <Text style={styles.whiteColour}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthChoiceScreen; // Export the AuthChoice component
