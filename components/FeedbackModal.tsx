// FeedbackModal.tsx
// Import necessary React and React Native components
import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {styles} from '../utils/styles'; // Import custom styles
import StarRating from './StarRating'; // Import a custom component for star rating

// TypeScript interface to type-check the component props
interface FeedbackModalProps {
  showFeedbackModal: boolean; // Boolean to control the visibility of the modal
  setShowFeedbackModal: (show: boolean) => void; // Function to update visibility state
  feedbackText: string; // Text content of the feedback
  setFeedbackText: (text: string) => void; // Function to update the feedback text
  starRating: number; // Current star rating
  setStarRating: (rating: number) => void; // Function to update the star rating
  handleFeedbackSubmit: () => void; // Function to handle the feedback submission
  makeNewChatPressed: () => void; // Function to handle a new chat initiation
}

// Functional component for displaying a feedback modal
const FeedbackModal: React.FC<FeedbackModalProps> = ({
  showFeedbackModal,
  setShowFeedbackModal,
  feedbackText,
  setFeedbackText,
  starRating,
  setStarRating,
  handleFeedbackSubmit,
  makeNewChatPressed,
}) => {
  return (
    <Modal
      visible={showFeedbackModal} // Control modal visibility
      onRequestClose={() => setShowFeedbackModal(false)} // Handle request to close the modal
      transparent={true} // Make background transparent
      animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust keyboard behavior based on OS
        keyboardVerticalOffset={120}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Please Provide Feedback</Text>
          <TextInput
            style={styles.feedbackInput}
            onChangeText={setFeedbackText} // Bind text change to state update function
            value={feedbackText} // Display the current feedback text
            placeholder="Your feedback" // Placeholder text for feedback input
            multiline // Allow multiline input
          />
          <StarRating starRating={starRating} setStarRating={setStarRating} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setShowFeedbackModal(false); // Close the modal on press
                makeNewChatPressed(); // Initiate new chat action
              }}
              style={styles.submitButtonFeedbackCLose}>
              <Text style={styles.greyColourButton}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleFeedbackSubmit(); // Submit feedback on press
                makeNewChatPressed(); // Initiate new chat action
              }}
              style={styles.submitButtonFeedback}>
              <Text style={styles.greenColourButton}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default FeedbackModal; // Export the FeedbackModal component
