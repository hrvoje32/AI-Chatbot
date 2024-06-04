//LoginScreen.tsx
// Import necessary React hooks and navigation tools
import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text, Alert} from 'react-native';
import {styles} from '../utils/styles'; // Import styles
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator'; // Navigation stack configuration

// Define type for navigation prop specific to this screen
type LogInScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LogInScreen'
>;

// Interface for props expected by LogInScreen
interface LogInScreenProps {
  navigation: LogInScreenNavigationProp;
}

// Functional component for login screen
const LogInScreen: React.FC<LogInScreenProps> = ({navigation}) => {
  const [nickname, setNickname] = useState<string>(''); // State to hold nickname input
  const [password, setPassword] = useState<string>(''); // State to hold password input

  const handleLogIn = () => {
    Alert.alert('Log In', 'Log in screen');
  };

  return (
    <View style={styles.container}>
      <TextInput // Input for nickname
        style={styles.input}
        placeholder="Nickname"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput // Input for password
        style={styles.input}
        placeholder="Password"
        secureTextEntry // Hide password text
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleLogIn} style={styles.button}>
        <Text style={styles.whiteColour}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity // Button to navigate back
        onPress={() => navigation.goBack()}
        style={styles.button}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogInScreen; // Export the LogInScreen
