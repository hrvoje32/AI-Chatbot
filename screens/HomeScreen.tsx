//HomeScreen.tsx
// Import necessary React and React Native modules
import React from 'react';
import {View, Text, TouchableOpacity, ImageBackground} from 'react-native';
import {styles} from '../utils/styles'; // Custom styles
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator'; // Navigation stack configuration

// Define the type for navigation props specific to this screen
type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;

// Interface for props expected by HomeScreen
interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

// Functional component definition for HomeScreen
const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
    <ImageBackground
      source={require('../background.webp')} // Background image for the home screen
      style={styles.backgroundImage}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome to the Stress Management App
        </Text>
        <Text style={styles.welcomeTitle}>UniRelax</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AuthChoice')} // Button to navigate to the authentication choice screen
          style={styles.chatbotButton}>
          <Text style={styles.whiteColour}>Enter Chatbot</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen; // Export HomeScreen
