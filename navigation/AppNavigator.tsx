//AppNavigator.tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
// Import screens to be used in navigation
import HomeScreen from '../screens/HomeScreen';
import AuthChoiceScreen from '../screens/AuthChoiceScreen';
import AuthScreen from '../screens/AuthScreen';
import ChatScreen from '../screens/ChatScreen';

// Define the navigation stack parameters with expected props for each screen
export type RootStackParamList = {
  HomeScreen: undefined; // No parameters expected for HomeScreen
  AuthChoice: undefined; // No parameters expected for AuthChoiceScreen
  Auth: undefined; // No parameters expected for AuthScreen
  ChatScreen: {userId: string}; // ChatScreen expects a parameter: userId
  LogInScreen: undefined; // No parameters expected for LogInScreen
  SignUpScreen: undefined; // No parameters expected for SignUpScreen
};

// Create a stack navigator using the defined parameter list
const Stack = createStackNavigator<RootStackParamList>();

// Define the AppNavigator component
const AppNavigator: React.FC = () => {
  return (
    // Stack.Navigator to manage the navigation between different screens
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen" // Define a screen with the name "HomeScreeen"
        component={HomeScreen} // Set HomeScreen as the component to render for this screen
        options={{headerShown: false}} // Set the options
      />
      <Stack.Screen
        name="AuthChoice" // Define a screen with the name "AuthChoice"
        component={AuthChoiceScreen} // Set AuthChoiceScreen as the component for this screen
        options={{title: 'Choose an Option'}} // Set the title for the navigation bar
      />
      <Stack.Screen
        name="Auth" // Define a screen with the name "Auth"
        component={AuthScreen} // Set AuthScreen as the component for this screen
        options={{title: 'Authenticate'}} // Set the title for the navigation bar
      />
      <Stack.Screen
        name="ChatScreen" // Define a screen with the name "ChatScreen"
        component={ChatScreen} // Set ChatScreen as the component for this screen
        options={{title: 'UniRelax'}} // Set the title for the navigation bar
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; // Export the AppNavigator component
