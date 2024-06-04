//SuccessModal.tsx
// Import necessary React and React Native components
import React from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../utils/styles'; // Import custom styles

// Interface defining the props expected by the SuccessModal component
interface SuccessModalProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

// Functional component for displaying a success message in a modal
const SuccessModal: React.FC<SuccessModalProps> = ({
  isVisible,
  message,
  onClose,
}) => {
  return (
    <Modal
      visible={isVisible} // Control modal visibility
      transparent // Make the background of the modal transparent
      animationType="fade">
      <View>
        <View style={styles.modalViewAlert}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity
            onPress={onClose} // Call onClose function when the button is pressed
            style={[styles.button, styles.buttonAlertModal]}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal; // Export the SuccessModal component
