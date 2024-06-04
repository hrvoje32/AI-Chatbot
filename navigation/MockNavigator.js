//MockNavigator.js
// Import necessary React component and React Navigation functions
import React from 'react';
import {NavigationContainer} from '@react-navigation/native'; // Manages the navigation tree and contains the navigation state
import {createStackNavigator} from '@react-navigation/stack'; // Function to create a stack navigator
// Import screens used within the navigator
import HomeScreen from '../screens/HomeScreen'; // Screen component for the home page
import AuthScreen from '../screens/AuthScreen'; // Screen component for authentication
import ChatScreen from '../screens/ChatScreen'; // Screen component for chat functionality
import LoginScreen from '../screens/LoginScreen'; // Screen component for login
import SignUpScreen from '../screens/SignUpScreen'; // Screen component for sign-up process
import AuthChoiceScreen from '../screens/AuthChoiceScreen'; // Screen component to choose auth method

// Create a stack navigator object
const Stack = createStackNavigator();

// Define the MockNavigator functional component with 'initialRouteName' as a prop
const MockNavigator = ({initialRouteName}) => {
  return (
    // NavigationContainer wraps the whole navigation structure
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Choice" component={AuthChoiceScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="Sign" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MockNavigator; // Export the component
