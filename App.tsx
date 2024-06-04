//App.tsx
// Import React and navigation container module
import React from 'react';
import {NavigationContainer} from '@react-navigation/native'; // Component for managing navigation tree
import AppNavigator from './navigation/AppNavigator'; // Import the navigator that handles app routing

// Define the main App component as a functional component
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App; // Export App component
