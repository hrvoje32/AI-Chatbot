// ErrorModal.tsx
// Import necessary React and React Native components
import React from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../utils/styles'; // Import custom styles

// TypeScript interface to type-check the component props
interface ErrorModalProps {
  isVisible: boolean; // Boolean to control the visibility of the modal
  message: string; // Text message to be displayed in the modal
  onClose: () => void; // Function to be called when the modal is closed
}

// Functional component for displaying an error modal
const ErrorModal: React.FC<ErrorModalProps> = ({
  isVisible,
  message,
  onClose,
}) => {
  return (
    // Modal component from React Native with controlled visibility and fade animation
    <Modal visible={isVisible} transparent animationType="fade">
      <View>
        <View style={styles.modalViewAlert}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={[styles.buttonAlertModal]}>
            <Text style={styles.buttonTextError}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal; // Export the ErrorModal component
